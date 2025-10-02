#!/usr/bin/env node

/**
 * Database Cleanup Worker
 * This worker runs the database cleanup service to remove old data
 */

import 'dotenv/config';

import { connectDatabase, disconnectDatabase } from '../../api-server/src/db/client';
import { logger } from '../../api-server/src/utils/logger';
import { cleanupService } from './cleanup';
import { cleanupScheduler } from './scheduler';

async function startCleanupWorker() {
  try {
    logger.info('Starting Database Cleanup Worker...');

    // Connect to database
    await connectDatabase();

    // Check if we should run in scheduler mode or one-time cleanup
    const mode = process.env.CLEANUP_MODE || 'scheduler';
    const dryRun = process.env.CLEANUP_DRY_RUN === 'true';

    if (mode === 'scheduler') {
      logger.info('Running in scheduler mode');
      
      // Start the scheduler
      cleanupScheduler.start();

      logger.info('Database Cleanup Worker started in scheduler mode');

      // Graceful shutdown
      const gracefulShutdown = async (signal: string) => {
        logger.info({ signal }, 'Received shutdown signal');
        
        try {
          cleanupScheduler.stop();
          await disconnectDatabase();
          logger.info('Cleanup worker shut down gracefully');
          process.exit(0);
        } catch (error) {
          logger.error({ error }, 'Error during shutdown');
          process.exit(1);
        }
      };

      process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
      process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    } else if (mode === 'once') {
      logger.info('Running in one-time cleanup mode');
      
      if (dryRun) {
        logger.info('Running dry run...');
        const dryRunResult = await cleanupService.dryRun();
        logger.info({ dryRunResult }, 'Dry run completed');
      } else {
        logger.info('Running actual cleanup...');
        const stats = await cleanupService.performCleanup();
        logger.info({ stats }, 'Cleanup completed');
      }

      await disconnectDatabase();
      logger.info('One-time cleanup completed, exiting');
      process.exit(0);

    } else {
      throw new Error(`Invalid cleanup mode: ${mode}. Valid modes are 'scheduler' or 'once'`);
    }

  } catch (error) {
    logger.error({ error }, 'Failed to start cleanup worker');
    process.exit(1);
  }
}

// Start cleanup worker if this file is run directly
if (require.main === module) {
  startCleanupWorker();
}
