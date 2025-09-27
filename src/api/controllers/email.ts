import { FastifyRequest, FastifyReply } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../../db/client';
import { EmailQueueProducer } from '../../queue/producer';
import { verifyJWT, extractTokenFromRequest, requireScope } from '../../utils/auth';
import { computePayloadHash, checkIdempotency, storeIdempotencyKey } from '../../utils/idempotency';
import { logger, createTraceId } from '../../utils/logger';
import { emailsAcceptedTotal } from '../../utils/metrics';
import { SendEmailRequest, SendEmailResponse } from '../../types/email';
import { sendEmailRequestSchema } from '../schemas/email';

export class EmailController {
  private queueProducer: EmailQueueProducer;

  constructor() {
    this.queueProducer = new EmailQueueProducer();
  }

  async sendEmail(request: FastifyRequest<{ Body: SendEmailRequest }>, reply: FastifyReply): Promise<SendEmailResponse> {
    const traceId = createTraceId();
    const startTime = Date.now();

    try {
      // Extract and verify JWT
      const token = extractTokenFromRequest(request);
      const payload = verifyJWT(token);
      requireScope('emails:send')(payload);

      // Get idempotency key from headers
      const idempotencyKey = request.headers['idempotency-key'] as string;
      if (!idempotencyKey) {
        reply.code(400);
        return {
          error: {
            code: 'MISSING_IDEMPOTENCY_KEY',
            message: 'Idempotency-Key header is required',
            traceId
          }
        };
      }

      // Validate request body
      const validationResult = sendEmailRequestSchema.safeParse(request.body);
      if (!validationResult.success) {
        reply.code(400);
        return {
          error: {
            code: 'VALIDATION_ERROR',
            message: validationResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', '),
            traceId
          }
        };
      }

      const emailRequest = validationResult.data;

      // Compute payload hash for idempotency
      const payloadHash = computePayloadHash(emailRequest);

      // Check idempotency
      const idempotencyResult = await checkIdempotency(idempotencyKey, payloadHash);
      if (idempotencyResult.isDuplicate) {
        reply.code(409);
        return {
          error: {
            code: 'IDEMPOTENCY_CONFLICT',
            message: 'Request with different payload already processed',
            traceId
          }
        };
      }

      if (idempotencyResult.messageId) {
        // Same request, return existing result
        reply.code(202);
        return {
          messageId: idempotencyResult.messageId,
          status: 'queued'
        };
      }

      // Generate message ID
      const messageId = emailRequest.messageId || `msg_${uuidv4().replace(/-/g, '').substring(0, 8)}`;

      // Extract metadata
      const tenantId = emailRequest.metadata?.['tenantId'] as string;
      const eventId = emailRequest.metadata?.['eventId'] as string;

      // Store message in database
      await prisma.message.create({
        data: {
          messageId,
          tenantId,
          toJson: emailRequest.to,
          subject: emailRequest.subject,
          templateKey: emailRequest.template.key,
          locale: emailRequest.template.locale,
          variablesJson: emailRequest.variables || {} as any,
          status: 'QUEUED',
          webhookUrl: undefined,
          attempts: 0
        }
      });

      // Store idempotency key
      await storeIdempotencyKey(idempotencyKey, payloadHash, messageId, 'queued');

      // Queue email job
      await this.queueProducer.addEmailJob({
        messageId,
        templateKey: emailRequest.template.key,
        locale: emailRequest.template.locale,
        version: emailRequest.template.version,
        variables: emailRequest.variables || {},
        to: emailRequest.to,
        cc: emailRequest.cc,
        bcc: emailRequest.bcc,
        from: emailRequest.from,
        replyTo: emailRequest.replyTo,
        subject: emailRequest.subject,
        attachments: emailRequest.attachments,
        webhookUrl: process.env.WEBHOOK_BASE_URL ? `${process.env.WEBHOOK_BASE_URL}/webhooks/routee` : undefined,
        tenantId,
        attempts: 0
      });

      // Record metrics
      emailsAcceptedTotal.labels({
        tenant_id: tenantId || 'unknown',
        template_key: emailRequest.template.key
      }).inc();

      const processingTime = Date.now() - startTime;
      logger.info({
        traceId,
        messageId,
        templateKey: emailRequest.template.key,
        tenantId,
        eventId,
        to: emailRequest.to.map(r => r.email),
        processingTime
      }, 'Email request processed successfully');

      reply.code(202);
      return {
        messageId,
        status: 'queued'
      };
    } catch (error) {
      const processingTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      logger.error({
        traceId,
        error: errorMessage,
        processingTime
      }, 'Email request processing failed');

      if (errorMessage.includes('JWT') || errorMessage.includes('scope')) {
        reply.code(401);
        return {
          error: {
            code: 'UNAUTHORIZED',
            message: 'Invalid or insufficient permissions',
            traceId
          }
        };
      }

      reply.code(500);
      return {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error',
          traceId
        }
      };
    }
  }

  async getMessageStatus(request: FastifyRequest<{ Params: { messageId: string } }>, reply: FastifyReply) {
    const traceId = createTraceId();
    const { messageId } = request.params;

    try {
      // Extract and verify JWT
      const token = extractTokenFromRequest(request);
      const payload = verifyJWT(token);
      requireScope('emails:read')(payload);

      const message = await prisma.message.findUnique({
        where: { messageId }
      });

      if (!message) {
        reply.code(404);
        return {
          error: {
            code: 'MESSAGE_NOT_FOUND',
            message: 'Message not found',
            traceId
          }
        };
      }

      logger.info({
        traceId,
        messageId,
        status: message.status
      }, 'Message status retrieved');

      return {
        messageId: message.messageId,
        status: message.status.toLowerCase() as 'queued' | 'sent' | 'delivered' | 'bounced' | 'failed' | 'suppressed',
        attempts: message.attempts,
        lastError: message.lastError,
        createdAt: message.createdAt.toISOString(),
        updatedAt: message.updatedAt.toISOString()
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      logger.error({
        traceId,
        messageId,
        error: errorMessage
      }, 'Failed to get message status');

      if (errorMessage.includes('JWT') || errorMessage.includes('scope')) {
        reply.code(401);
        return {
          error: {
            code: 'UNAUTHORIZED',
            message: 'Invalid or insufficient permissions',
            traceId
          }
        };
      }

      reply.code(500);
      return {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error',
          traceId
        }
      };
    }
  }

  async close(): Promise<void> {
    await this.queueProducer.close();
  }
}
