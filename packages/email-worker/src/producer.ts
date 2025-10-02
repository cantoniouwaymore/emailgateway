import { Queue, QueueOptions } from 'bullmq';
import Redis from 'ioredis';
import { logger } from '../../api-server/src/utils/logger';
import { updateQueueDepth } from '../../api-server/src/utils/metrics';

export interface EmailJobData {
  messageId: string;
  templateKey: string;
  locale?: string;
  version?: string;
  variables: Record<string, unknown>;
  to: Array<{ email: string; name?: string }>;
  cc?: Array<{ email: string; name?: string }>;
  bcc?: Array<{ email: string; name?: string }>;
  from: { email: string; name?: string };
  replyTo?: { email: string; name?: string };
  subject: string;
  attachments?: Array<{
    filename: string;
    contentBase64: string;
    contentType: string;
  }>;
  webhookUrl?: string;
  tenantId?: string;
  attempts: number;
}

export class EmailQueueProducer {
  private queue: Queue<EmailJobData>;
  private redis: Redis;

  constructor() {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    this.redis = new Redis(redisUrl, {
      maxRetriesPerRequest: null,
      lazyConnect: true
    });

    const queueOptions: QueueOptions = {
      connection: this.redis,
      defaultJobOptions: {
        removeOnComplete: 100, // Keep last 100 completed jobs
        removeOnFail: 50,      // Keep last 50 failed jobs
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      }
    };

    this.queue = new Queue<EmailJobData>('email-send', queueOptions);
    this.setupQueueEvents();
  }

  private setupQueueEvents(): void {
    this.queue.on('error', (error) => {
      logger.error({ error }, 'Email queue error');
    });

    this.queue.on('waiting', (jobId) => {
      logger.debug({ jobId }, 'Email job waiting');
    });

    (this.queue as any).on('active', (job: any) => {
      logger.info({ 
        jobId: job.id, 
        messageId: job.data.messageId 
      }, 'Email job started processing');
    });

    (this.queue as any).on('completed', (job: any) => {
      logger.info({ 
        jobId: job.id, 
        messageId: job.data.messageId 
      }, 'Email job completed');
    });

    (this.queue as any).on('failed', (job: any, error: any) => {
      logger.error({ 
        jobId: job?.id, 
        messageId: job?.data.messageId,
        error: error.message,
        attempts: job?.attemptsMade
      }, 'Email job failed');
    });

    // Update queue depth metrics periodically
    setInterval(async () => {
      try {
        const waiting = await this.queue.getWaiting();
        const active = await this.queue.getActive();
        const delayed = await this.queue.getDelayed();
        
        const totalDepth = waiting.length + active.length + delayed.length;
        updateQueueDepth('email-send', totalDepth);
      } catch (error) {
        logger.error({ error }, 'Failed to update queue depth metrics');
      }
    }, 10000); // Update every 10 seconds
  }

  async addEmailJob(data: EmailJobData, options?: { delay?: number; priority?: number }): Promise<string> {
    try {
      const job = await this.queue.add('send-email', data, {
        jobId: data.messageId, // Use messageId as jobId for deduplication
        priority: options?.priority || 0,
        delay: options?.delay || 0,
      });

      logger.info({
        jobId: job.id,
        messageId: data.messageId,
        templateKey: data.templateKey,
        to: data.to.map(r => r.email)
      }, 'Email job queued');

      return job.id!;
    } catch (error) {
      logger.error({
        error: error instanceof Error ? error.message : 'Unknown error',
        messageId: data.messageId
      }, 'Failed to queue email job');
      throw error;
    }
  }

  async getJobStatus(jobId: string) {
    try {
      const job = await this.queue.getJob(jobId);
      if (!job) {
        return null;
      }

      return {
        id: job.id,
        data: job.data,
        progress: job.progress,
        returnvalue: job.returnvalue,
        failedReason: job.failedReason,
        processedOn: job.processedOn,
        finishedOn: job.finishedOn,
        timestamp: job.timestamp,
        attemptsMade: job.attemptsMade,
        opts: job.opts
      };
    } catch (error) {
      logger.error({ error, jobId }, 'Failed to get job status');
      throw error;
    }
  }

  async close(): Promise<void> {
    await this.queue.close();
    await this.redis.quit();
    logger.info('Email queue producer closed');
  }
}
