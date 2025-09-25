import { EmailProvider, SendProviderRequest, SendProviderResult } from './types';
import { RouteeEmailProvider } from './routee';
import { logger } from '../utils/logger';
import { providerLatencyMs, emailsSentTotal, emailsFailedTotal } from '../utils/metrics';

export class ProviderManager {
  private providers: Map<string, EmailProvider> = new Map();
  private enabledProviders: string[];

  constructor() {
    this.enabledProviders = this.getEnabledProviders();
    this.initializeProviders();
  }

  private getEnabledProviders(): string[] {
    const enabled = process.env.PROVIDERS_ENABLED || 'routee';
    return enabled.split(',').map(p => p.trim());
  }

  private initializeProviders(): void {
    // Initialize Routee provider
    if (this.enabledProviders.includes('routee')) {
      const routeeProvider = new RouteeEmailProvider();
      this.providers.set('routee', routeeProvider);
      logger.info('Initialized Routee email provider');
    }

    // Add more providers here as needed
    // if (this.enabledProviders.includes('ses')) {
    //   const sesProvider = new SESEmailProvider();
    //   this.providers.set('ses', sesProvider);
    // }

    logger.info({ 
      enabledProviders: this.enabledProviders,
      availableProviders: Array.from(this.providers.keys())
    }, 'Email providers initialized');
  }

  async sendEmail(request: SendProviderRequest): Promise<SendProviderResult> {
    const primaryProvider = this.getPrimaryProvider();
    if (!primaryProvider) {
      throw new Error('No email providers available');
    }

    return this.sendWithProvider(primaryProvider, request);
  }

  private getPrimaryProvider(): EmailProvider | null {
    // Simple round-robin or preference-based selection
    // For now, just return the first available provider
    for (const providerName of this.enabledProviders) {
      const provider = this.providers.get(providerName);
      if (provider) {
        return provider;
      }
    }
    return null;
  }

  private async sendWithProvider(provider: EmailProvider, request: SendProviderRequest): Promise<SendProviderResult> {
    const startTime = Date.now();
    
    try {
      const result = await provider.send(request);
      const latency = Date.now() - startTime;
      
      // Record metrics
      providerLatencyMs.labels({ provider: provider.name }).observe(latency);
      
      if (result.status === 'sent') {
        emailsSentTotal.labels({ 
          provider: provider.name, 
          status: 'success' 
        }).inc();
      } else {
        emailsSentTotal.labels({ 
          provider: provider.name, 
          status: 'failed' 
        }).inc();
        emailsFailedTotal.labels({ 
          provider: provider.name, 
          error_type: result.error || 'unknown' 
        }).inc();
      }

      return result;
    } catch (error) {
      const latency = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Record failure metrics
      emailsFailedTotal.labels({ 
        provider: provider.name, 
        error_type: 'exception' 
      }).inc();
      
      logger.error({
        provider: provider.name,
        messageId: request.messageId,
        error: errorMessage,
        latency
      }, 'Provider send failed');

      return {
        provider: provider.name,
        status: 'failed',
        error: errorMessage
      };
    }
  }

  async getProviderHealth(): Promise<Record<string, { healthy: boolean; latency?: number; error?: string }>> {
    const healthChecks = await Promise.allSettled(
      Array.from(this.providers.entries()).map(async ([name, provider]) => {
        const health = await provider.health();
        return { name, ...health };
      })
    );

    const results: Record<string, { healthy: boolean; latency?: number; error?: string }> = {};
    
    healthChecks.forEach((result, index) => {
      const providerName = Array.from(this.providers.keys())[index];
      if (result.status === 'fulfilled') {
        results[providerName] = {
          healthy: result.value.healthy,
          latency: result.value.latency,
          error: result.value.error
        };
      } else {
        results[providerName] = {
          healthy: false,
          error: result.reason instanceof Error ? result.reason.message : 'Unknown error'
        };
      }
    });

    return results;
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }
}
