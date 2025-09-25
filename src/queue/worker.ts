import { Worker, Job, QueueOptions } from 'bullmq';
import Redis from 'ioredis';
import { prisma } from '../db/client';
import { MessageStatus } from '@prisma/client';
import { TemplateEngine } from '../templates/engine';
import { ProviderManager } from '../providers/manager';
import { EmailJobData } from './producer';
import { logger, createTraceId } from '../utils/logger';
import { retryCount, emailsSentTotal, emailsFailedTotal } from '../utils/metrics';
import { createServer } from 'http';

export class EmailWorker {
  private worker: Worker<EmailJobData>;
  private templateEngine: TemplateEngine;
  private providerManager: ProviderManager;
  private redis: Redis;
  private healthServer: any;

  constructor() {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    this.redis = new Redis(redisUrl, {
      maxRetriesPerRequest: null,
      lazyConnect: true
    });

    this.templateEngine = new TemplateEngine();
    this.providerManager = new ProviderManager();

    this.worker = new Worker<EmailJobData>('email-send', this.processEmailJob.bind(this), {
      connection: this.redis,
      concurrency: parseInt(process.env.WORKER_CONCURRENCY || '5'),
    });

    // Start health check server only if not in Railway worker mode
    if (process.env.RAILWAY_SERVICE_NAME !== 'email-gateway-worker') {
      this.startHealthServer();
    }
    this.setupWorkerEvents();
  }

  private startHealthServer(): void {
    const port = parseInt(process.env.PORT || '3000');
    const host = process.env.HOST || '0.0.0.0';
    
    this.healthServer = createServer((req, res) => {
      if (req.url === '/healthz') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          status: 'healthy', 
          service: 'email-worker',
          timestamp: new Date().toISOString()
        }));
      } else {
        res.writeHead(404);
        res.end('Not Found');
      }
    });

    this.healthServer.listen(port, host, () => {
      logger.info(`Health check server listening at http://${host}:${port}`);
    });
  }

  private setupWorkerEvents(): void {
    this.worker.on('ready', () => {
      logger.info('Email worker is ready');
    });

    this.worker.on('error', (error) => {
      logger.error({ error }, 'Email worker error');
    });

    this.worker.on('failed', (job, error) => {
      logger.error({
        jobId: job?.id,
        messageId: job?.data.messageId,
        error: error.message,
        attempts: job?.attemptsMade
      }, 'Email job failed in worker');
    });

    this.worker.on('completed', (job) => {
      logger.info({
        jobId: job.id,
        messageId: job.data.messageId
      }, 'Email job completed in worker');
    });

    // Graceful shutdown
    process.on('SIGTERM', () => this.shutdown());
    process.on('SIGINT', () => this.shutdown());
  }

  async processEmailJob(job: Job<EmailJobData>): Promise<void> {
    const traceId = createTraceId();
    const { messageId, templateKey, locale, version, variables, to, cc, bcc, from, replyTo, subject, attachments, webhookUrl, tenantId, attempts } = job.data;

    logger.info({
      traceId,
      jobId: job.id,
      messageId,
      templateKey,
      locale,
      attempts
    }, 'Processing email job');

    try {
      // Update message status to processing
      await this.updateMessageStatus(messageId, MessageStatus.SENT, null, attempts);

      // Render template
      const renderedTemplate = await this.templateEngine.renderTemplate({
        key: templateKey,
        locale,
        version,
        variables
      });

      // Prepare attachments if any
      const processedAttachments = attachments?.map(att => ({
        filename: att.filename,
        content: Buffer.from(att.contentBase64, 'base64'),
        contentType: att.contentType
      }));

      // Send email via provider
      const providerRequest = {
        to,
        cc,
        bcc,
        from,
        replyTo,
        subject: renderedTemplate.subject || subject,
        html: renderedTemplate.html,
        text: renderedTemplate.text,
        attachments: processedAttachments,
        messageId,
        metadata: { tenantId, templateKey, locale }
      };

      const providerResult = await this.providerManager.sendEmail(providerRequest);

      // Update message status based on provider result
      if (providerResult.status === 'sent') {
        await this.updateMessageStatus(messageId, MessageStatus.SENT, null, attempts, {
          provider: providerResult.provider,
          providerMessageId: providerResult.providerMessageId,
          details: providerResult.details
        });

        logger.info({
          traceId,
          messageId,
          provider: providerResult.provider,
          providerMessageId: providerResult.providerMessageId
        }, 'Email sent successfully');
      } else {
        const errorMessage = providerResult.error || 'Unknown provider error';
        await this.updateMessageStatus(messageId, MessageStatus.FAILED, errorMessage, attempts, {
          provider: providerResult.provider,
          error: errorMessage
        });

        logger.error({
          traceId,
          messageId,
          provider: providerResult.provider,
          error: errorMessage
        }, 'Email sending failed');

        // Record retry metrics
        retryCount.labels({
          provider: providerResult.provider,
          attempt: attempts.toString()
        }).inc();

        throw new Error(errorMessage);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      logger.error({
        traceId,
        jobId: job.id,
        messageId,
        error: errorMessage,
        attempts: job.attemptsMade
      }, 'Email job processing failed');

      // Update message status to failed
      await this.updateMessageStatus(messageId, MessageStatus.FAILED, errorMessage, attempts);

      // Record failure metrics
      emailsFailedTotal.labels({
        provider: 'unknown',
        error_type: 'processing_error'
      }).inc();

      throw error;
    }
  }

  private async updateMessageStatus(
    messageId: string, 
    status: MessageStatus, 
    lastError: string | null, 
    attempts: number,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    try {
      await prisma.message.update({
        where: { messageId },
        data: {
          status,
          lastError,
          attempts,
          updatedAt: new Date(),
          ...(metadata && { 
            provider: metadata.provider as string,
            providerMessageId: metadata.providerMessageId as string
          })
        }
      });

      logger.debug({
        messageId,
        status,
        attempts,
        lastError
      }, 'Updated message status');
    } catch (error) {
      logger.error({
        error: error instanceof Error ? error.message : 'Unknown error',
        messageId,
        status
      }, 'Failed to update message status');
    }
  }

  async shutdown(): Promise<void> {
    logger.info('Shutting down email worker...');
    await this.worker.close();
    await this.redis.quit();
    
    // Close health server
    if (this.healthServer) {
      this.healthServer.close();
    }
    
    logger.info('Email worker shut down');
  }
}

// Start worker if this file is run directly
if (require.main === module) {
  const worker = new EmailWorker();
  logger.info('Email worker started');
}
