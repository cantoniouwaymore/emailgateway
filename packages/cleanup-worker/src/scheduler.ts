import { logger } from '../../api-server/src/utils/logger';
import { cleanupService, CleanupStats } from './cleanup';

export interface SchedulerConfig {
  enabled: boolean;
  intervalHours: number;
  dryRunFirst: boolean;
  maxRetries: number;
  retryDelayMs: number;
}

export class CleanupScheduler {
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;
  private config: SchedulerConfig;

  constructor(config: Partial<SchedulerConfig> = {}) {
    this.config = {
      enabled: config.enabled ?? true,
      intervalHours: config.intervalHours ?? 24, // Run daily by default
      dryRunFirst: config.dryRunFirst ?? false,
      maxRetries: config.maxRetries ?? 3,
      retryDelayMs: config.retryDelayMs ?? 30000, // 30 seconds
      ...config
    };
  }

  /**
   * Start the scheduled cleanup
   */
  start(): void {
    if (this.intervalId) {
      logger.warn('Cleanup scheduler is already running');
      return;
    }

    if (!this.config.enabled) {
      logger.info('Cleanup scheduler is disabled');
      return;
    }

    const intervalMs = this.config.intervalHours * 60 * 60 * 1000;
    
    // Ensure minimum interval of 1 hour to prevent issues
    const minIntervalMs = 60 * 60 * 1000; // 1 hour
    const actualIntervalMs = Math.max(intervalMs, minIntervalMs);
    
    logger.info({
      intervalHours: this.config.intervalHours,
      intervalMs: actualIntervalMs,
      dryRunFirst: this.config.dryRunFirst
    }, 'Starting cleanup scheduler');

    // Run immediately on start (after a short delay)
    setTimeout(() => {
      this.runCleanup();
    }, 5000);

    // Then run on schedule
    this.intervalId = setInterval(() => {
      this.runCleanup();
    }, actualIntervalMs);
  }

  /**
   * Stop the scheduled cleanup
   */
  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      logger.info('Cleanup scheduler stopped');
    }
  }

  /**
   * Check if scheduler is running
   */
  isActive(): boolean {
    return this.intervalId !== null;
  }

  /**
   * Get current configuration
   */
  getConfig(): SchedulerConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<SchedulerConfig>): void {
    this.config = { ...this.config, ...newConfig };
    logger.info({ config: this.config }, 'Cleanup scheduler configuration updated');
  }

  /**
   * Run cleanup with retry logic
   */
  private async runCleanup(): Promise<void> {
    if (this.isRunning) {
      logger.warn('Cleanup is already running, skipping this execution');
      return;
    }

    this.isRunning = true;
    let attempt = 0;
    let lastError: Error | null = null;

    while (attempt < this.config.maxRetries) {
      attempt++;
      
      try {
        logger.info({
          attempt,
          maxRetries: this.config.maxRetries
        }, 'Starting cleanup execution');

        // Run dry run first if configured
        if (this.config.dryRunFirst && attempt === 1) {
          logger.info('Running dry run first');
          const dryRunResult = await cleanupService.dryRun();
          logger.info({
            dryRunResult
          }, 'Dry run completed');
        }

        // Perform actual cleanup
        const stats = await cleanupService.performCleanup();
        
        logger.info({
          stats,
          attempt
        }, 'Cleanup execution completed successfully');

        this.isRunning = false;
        return;

      } catch (error) {
        lastError = error as Error;
        
        logger.error({
          error,
          attempt,
          maxRetries: this.config.maxRetries,
          willRetry: attempt < this.config.maxRetries
        }, 'Cleanup execution failed');

        if (attempt < this.config.maxRetries) {
          logger.info({
            retryDelayMs: this.config.retryDelayMs,
            nextAttempt: attempt + 1
          }, 'Retrying cleanup execution');
          
          await new Promise(resolve => setTimeout(resolve, this.config.retryDelayMs));
        }
      }
    }

    // All retries failed
    logger.error({
      error: lastError,
      totalAttempts: attempt
    }, 'Cleanup execution failed after all retries');

    this.isRunning = false;
  }

  /**
   * Run cleanup immediately (manual trigger)
   */
  async runNow(): Promise<CleanupStats> {
    if (this.isRunning) {
      throw new Error('Cleanup is already running');
    }

    logger.info('Manual cleanup execution triggered');
    return await cleanupService.performCleanup();
  }

  /**
   * Run dry run immediately (manual trigger)
   */
  async runDryRunNow(): Promise<{
    messagesToDelete: number;
    idempotencyKeysToDelete: number;
    providerEventsToDelete: number;
    totalToDelete: number;
    cutoffDate: Date;
  }> {
    logger.info('Manual dry run execution triggered');
    return await cleanupService.dryRun();
  }
}

// Export a default scheduler instance
export const cleanupScheduler = new CleanupScheduler({
  enabled: process.env.CLEANUP_ENABLED !== 'false',
  intervalHours: parseInt(process.env.CLEANUP_INTERVAL_HOURS || '24'),
  dryRunFirst: process.env.CLEANUP_DRY_RUN_FIRST === 'true',
  maxRetries: parseInt(process.env.CLEANUP_MAX_RETRIES || '3'),
  retryDelayMs: parseInt(process.env.CLEANUP_RETRY_DELAY_MS || '30000')
});
