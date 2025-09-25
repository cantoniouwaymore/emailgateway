import { FastifyRequest, FastifyReply } from 'fastify';
import { ProviderManager } from '../../providers/manager';
import { logger, createTraceId } from '../../utils/logger';

interface AddSenderRequest {
  email: string;
  name?: string;
}

interface GetSendersResponse {
  senders: Array<{
    email: string;
    name?: string;
    verified: boolean;
    domain: string;
  }>;
}

export class SenderController {
  private providerManager: ProviderManager;

  constructor() {
    this.providerManager = new ProviderManager();
  }

  async addSender(request: FastifyRequest<{ Body: AddSenderRequest }>, reply: FastifyReply) {
    const traceId = createTraceId();
    
    try {
      const { email, name } = request.body;

      // Validate email format
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return reply.code(400).send({
          error: {
            code: 'INVALID_EMAIL',
            message: 'Invalid email address format',
            traceId
          }
        });
      }

      // Get the Routee provider
      const routeeProvider = this.providerManager.getProvider('routee');
      if (!routeeProvider) {
        return reply.code(503).send({
          error: {
            code: 'PROVIDER_UNAVAILABLE',
            message: 'Routee provider is not available',
            traceId
          }
        });
      }

      // Check if provider has addSender method (real implementation)
      if (typeof (routeeProvider as any).addSender !== 'function') {
        return reply.code(501).send({
          error: {
            code: 'NOT_IMPLEMENTED',
            message: 'Sender management is only available with real Routee API implementation',
            traceId
          }
        });
      }

      logger.info({ 
        traceId, 
        email, 
        name 
      }, 'Adding sender to Routee');

      const success = await (routeeProvider as any).addSender(email, name);
      
      if (!success) {
        return reply.code(400).send({
          error: {
            code: 'SENDER_ADD_FAILED',
            message: 'Failed to add sender to Routee. Please check the email address and try again.',
            traceId
          }
        });
      }

      logger.info({ 
        traceId, 
        email 
      }, 'Sender added successfully');

      return reply.code(201).send({
        success: true,
        message: 'Sender added successfully. Please check your email for verification instructions.',
        email,
        name,
        traceId
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      logger.error({ 
        traceId, 
        error: errorMessage 
      }, 'Failed to add sender');

      return reply.code(500).send({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to add sender',
          traceId
        }
      });
    }
  }

  async getSenders(request: FastifyRequest, reply: FastifyReply) {
    const traceId = createTraceId();
    
    try {
      // Get the Routee provider
      const routeeProvider = this.providerManager.getProvider('routee');
      if (!routeeProvider) {
        return reply.code(503).send({
          error: {
            code: 'PROVIDER_UNAVAILABLE',
            message: 'Routee provider is not available',
            traceId
          }
        });
      }

      // Check if provider has getVerifiedSenders method (real implementation)
      if (typeof (routeeProvider as any).getVerifiedSenders !== 'function') {
        return reply.code(501).send({
          error: {
            code: 'NOT_IMPLEMENTED',
            message: 'Sender management is only available with real Routee API implementation',
            traceId
          }
        });
      }

      logger.info({ traceId }, 'Getting verified senders from Routee');

      const senders = await (routeeProvider as any).getVerifiedSenders();
      
      const response: GetSendersResponse = {
        senders: senders.map((sender: any) => ({
          email: sender.email,
          name: sender.name,
          verified: sender.verified,
          domain: sender.domain
        }))
      };

      logger.info({ 
        traceId, 
        count: response.senders.length 
      }, 'Retrieved verified senders');

      return reply.send(response);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      logger.error({ 
        traceId, 
        error: errorMessage 
      }, 'Failed to get senders');

      return reply.code(500).send({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get senders',
          traceId
        }
      });
    }
  }

  async checkSenderVerification(request: FastifyRequest<{ Params: { email: string } }>, reply: FastifyReply) {
    const traceId = createTraceId();
    const { email } = request.params;
    
    try {
      // Validate email format
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return reply.code(400).send({
          error: {
            code: 'INVALID_EMAIL',
            message: 'Invalid email address format',
            traceId
          }
        });
      }

      // Get the Routee provider
      const routeeProvider = this.providerManager.getProvider('routee');
      if (!routeeProvider) {
        return reply.code(503).send({
          error: {
            code: 'PROVIDER_UNAVAILABLE',
            message: 'Routee provider is not available',
            traceId
          }
        });
      }

      logger.info({ 
        traceId, 
        email 
      }, 'Checking sender verification status');

      // Check verification status
      const isVerified = await (routeeProvider as any).checkSenderVerification(email);
      
      logger.info({ 
        traceId, 
        email, 
        verified: isVerified 
      }, 'Sender verification status checked');

      return reply.send({
        email,
        verified: isVerified,
        traceId
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      logger.error({ 
        traceId, 
        email,
        error: errorMessage 
      }, 'Failed to check sender verification');

      return reply.code(500).send({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to check sender verification',
          traceId
        }
      });
    }
  }

  async close() {
    // Cleanup if needed
  }
}
