import 'dotenv/config';

import { connectDatabase, disconnectDatabase } from './db/client';
import { logger } from './utils/logger';
import { Worker } from 'bullmq';
import Redis from 'ioredis';
import { EmailJobData } from './queue/producer';

async function start() {
  try {
    // Connect to database
    await connectDatabase();

    // Set up Redis connection
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    const redis = new Redis(redisUrl, {
      maxRetriesPerRequest: null,
      lazyConnect: true
    });

    // Create worker
    const worker = new Worker<EmailJobData>('email-send', async (job) => {
      logger.info({
        jobId: job.id,
        messageId: job.data.messageId,
        attempts: job.attemptsMade
      }, 'Processing email job');
      
      // Import and use the existing job processing logic
      const { EmailWorker } = await import('./queue/worker');
      const emailWorker = new EmailWorker();
      await emailWorker.processEmailJob(job);
    }, {
      connection: redis,
      concurrency: parseInt(process.env.WORKER_CONCURRENCY || '5'),
    });

    // Set up worker events
    worker.on('ready', () => {
      logger.info('Email worker is ready');
    });

    worker.on('error', (error) => {
      logger.error({ error }, 'Email worker error');
    });

    worker.on('failed', (job, error) => {
      logger.error({
        jobId: job?.id,
        messageId: job?.data.messageId,
        error: error.message,
        attempts: job?.attemptsMade
      }, 'Email job failed in worker');
    });

    worker.on('completed', (job) => {
      logger.info({
        jobId: job.id,
        messageId: job.data.messageId
      }, 'Email job completed in worker');
    });

    logger.info('Waymore Transactional Emails Service Worker started');

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      logger.info({ signal }, 'Received shutdown signal');
      
      try {
        await worker.close();
        await redis.quit();
        await disconnectDatabase();
        logger.info('Worker shut down gracefully');
        process.exit(0);
      } catch (error) {
        logger.error({ error }, 'Error during shutdown');
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error({ error }, 'Failed to start worker');
    process.exit(1);
  }
}

// Start worker if this file is run directly
if (require.main === module) {
  start();
}
