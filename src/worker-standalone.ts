import 'dotenv/config';

import { connectDatabase, disconnectDatabase } from './db/client';
import { logger } from './utils/logger';
import { EmailWorker } from './queue/worker';

async function start() {
  try {
    // Connect to database
    await connectDatabase();

    // Start the email worker
    const worker = new EmailWorker();
    
    logger.info('Waymore Transactional Emails Service Worker started');

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      logger.info({ signal }, 'Received shutdown signal');
      
      try {
        await worker.shutdown();
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
