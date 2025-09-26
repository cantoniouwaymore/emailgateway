import { prisma } from '../db/client';
import { logger } from './logger';

export interface CleanupStats {
  messagesDeleted: number;
  idempotencyKeysDeleted: number;
  providerEventsDeleted: number;
  totalDeleted: number;
  executionTimeMs: number;
}

export class DatabaseCleanupService {
  private readonly retentionDays: number;
  private readonly batchSize: number;

  constructor(retentionDays: number = 60, batchSize: number = 1000) {
    this.retentionDays = retentionDays;
    this.batchSize = batchSize;
  }

  /**
   * Calculate the cutoff date for data retention
   */
  private getCutoffDate(): Date {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.retentionDays);
    return cutoffDate;
  }

  /**
   * Clean up expired messages
   */
  private async cleanupMessages(cutoffDate: Date): Promise<number> {
    let totalDeleted = 0;
    let hasMore = true;

    while (hasMore) {
      const result = await prisma.message.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate
          }
        },
        // Limit batch size to avoid memory issues
        take: this.batchSize
      });

      totalDeleted += result.count;
      hasMore = result.count === this.batchSize;

      if (result.count > 0) {
        logger.info({
          deletedCount: result.count,
          totalDeleted,
          cutoffDate: cutoffDate.toISOString()
        }, 'Deleted expired messages batch');
      }
    }

    return totalDeleted;
  }

  /**
   * Clean up expired idempotency keys
   */
  private async cleanupIdempotencyKeys(cutoffDate: Date): Promise<number> {
    let totalDeleted = 0;
    let hasMore = true;

    while (hasMore) {
      const result = await prisma.idempotencyKey.deleteMany({
        where: {
          OR: [
            {
              createdAt: {
                lt: cutoffDate
              }
            },
            {
              expiresAt: {
                lt: new Date() // Also delete already expired keys
              }
            }
          ]
        },
        take: this.batchSize
      });

      totalDeleted += result.count;
      hasMore = result.count === this.batchSize;

      if (result.count > 0) {
        logger.info({
          deletedCount: result.count,
          totalDeleted,
          cutoffDate: cutoffDate.toISOString()
        }, 'Deleted expired idempotency keys batch');
      }
    }

    return totalDeleted;
  }

  /**
   * Clean up expired provider events
   */
  private async cleanupProviderEvents(cutoffDate: Date): Promise<number> {
    let totalDeleted = 0;
    let hasMore = true;

    while (hasMore) {
      const result = await prisma.providerEvent.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate
          }
        },
        take: this.batchSize
      });

      totalDeleted += result.count;
      hasMore = result.count === this.batchSize;

      if (result.count > 0) {
        logger.info({
          deletedCount: result.count,
          totalDeleted,
          cutoffDate: cutoffDate.toISOString()
        }, 'Deleted expired provider events batch');
      }
    }

    return totalDeleted;
  }

  /**
   * Get current database statistics
   */
  async getDatabaseStats(): Promise<{
    totalMessages: number;
    totalIdempotencyKeys: number;
    totalProviderEvents: number;
    oldestMessage?: Date;
    oldestIdempotencyKey?: Date;
    oldestProviderEvent?: Date;
  }> {
    const [messageCount, idempotencyCount, providerEventCount] = await Promise.all([
      prisma.message.count(),
      prisma.idempotencyKey.count(),
      prisma.providerEvent.count()
    ]);

    const [oldestMessage, oldestIdempotencyKey, oldestProviderEvent] = await Promise.all([
      prisma.message.findFirst({
        orderBy: { createdAt: 'asc' },
        select: { createdAt: true }
      }),
      prisma.idempotencyKey.findFirst({
        orderBy: { createdAt: 'asc' },
        select: { createdAt: true }
      }),
      prisma.providerEvent.findFirst({
        orderBy: { createdAt: 'asc' },
        select: { createdAt: true }
      })
    ]);

    return {
      totalMessages: messageCount,
      totalIdempotencyKeys: idempotencyCount,
      totalProviderEvents: providerEventCount,
      oldestMessage: oldestMessage?.createdAt,
      oldestIdempotencyKey: oldestIdempotencyKey?.createdAt,
      oldestProviderEvent: oldestProviderEvent?.createdAt
    };
  }

  /**
   * Perform the complete cleanup operation
   */
  async performCleanup(): Promise<CleanupStats> {
    const startTime = Date.now();
    const cutoffDate = this.getCutoffDate();

    logger.info({
      retentionDays: this.retentionDays,
      cutoffDate: cutoffDate.toISOString(),
      batchSize: this.batchSize
    }, 'Starting database cleanup');

    try {
      // Get stats before cleanup
      const statsBefore = await this.getDatabaseStats();
      logger.info({
        statsBefore
      }, 'Database stats before cleanup');

      // Perform cleanup operations in parallel for better performance
      const [messagesDeleted, idempotencyKeysDeleted, providerEventsDeleted] = await Promise.all([
        this.cleanupMessages(cutoffDate),
        this.cleanupIdempotencyKeys(cutoffDate),
        this.cleanupProviderEvents(cutoffDate)
      ]);

      const totalDeleted = messagesDeleted + idempotencyKeysDeleted + providerEventsDeleted;
      const executionTimeMs = Date.now() - startTime;

      const stats: CleanupStats = {
        messagesDeleted,
        idempotencyKeysDeleted,
        providerEventsDeleted,
        totalDeleted,
        executionTimeMs
      };

      // Get stats after cleanup
      const statsAfter = await this.getDatabaseStats();

      logger.info({
        stats,
        statsAfter,
        retentionDays: this.retentionDays,
        cutoffDate: cutoffDate.toISOString()
      }, 'Database cleanup completed successfully');

      return stats;

    } catch (error) {
      const executionTimeMs = Date.now() - startTime;
      
      logger.error({
        error,
        executionTimeMs,
        retentionDays: this.retentionDays,
        cutoffDate: cutoffDate.toISOString()
      }, 'Database cleanup failed');

      throw error;
    }
  }

  /**
   * Dry run - shows what would be deleted without actually deleting
   */
  async dryRun(): Promise<{
    messagesToDelete: number;
    idempotencyKeysToDelete: number;
    providerEventsToDelete: number;
    totalToDelete: number;
    cutoffDate: Date;
  }> {
    const cutoffDate = this.getCutoffDate();

    const [messagesToDelete, idempotencyKeysToDelete, providerEventsToDelete] = await Promise.all([
      prisma.message.count({
        where: {
          createdAt: {
            lt: cutoffDate
          }
        }
      }),
      prisma.idempotencyKey.count({
        where: {
          OR: [
            {
              createdAt: {
                lt: cutoffDate
              }
            },
            {
              expiresAt: {
                lt: new Date()
              }
            }
          ]
        }
      }),
      prisma.providerEvent.count({
        where: {
          createdAt: {
            lt: cutoffDate
          }
        }
      })
    ]);

    const totalToDelete = messagesToDelete + idempotencyKeysToDelete + providerEventsToDelete;

    logger.info({
      messagesToDelete,
      idempotencyKeysToDelete,
      providerEventsToDelete,
      totalToDelete,
      cutoffDate: cutoffDate.toISOString(),
      retentionDays: this.retentionDays
    }, 'Cleanup dry run completed');

    return {
      messagesToDelete,
      idempotencyKeysToDelete,
      providerEventsToDelete,
      totalToDelete,
      cutoffDate
    };
  }
}

// Export a default instance with 60-day retention (2 months)
export const cleanupService = new DatabaseCleanupService(60, 1000);
