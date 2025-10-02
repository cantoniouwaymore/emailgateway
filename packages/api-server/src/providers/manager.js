"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderManager = void 0;
const routee_1 = require("./routee");
const logger_1 = require("../utils/logger");
const metrics_1 = require("../utils/metrics");
class ProviderManager {
    providers = new Map();
    enabledProviders;
    constructor() {
        this.enabledProviders = this.getEnabledProviders();
        this.initializeProviders();
    }
    getEnabledProviders() {
        const enabled = process.env.PROVIDERS_ENABLED || 'routee';
        return enabled.split(',').map(p => p.trim());
    }
    initializeProviders() {
        if (this.enabledProviders.includes('routee')) {
            if (!process.env.ROUTEE_CLIENT_ID || !process.env.ROUTEE_CLIENT_SECRET) {
                logger_1.logger.warn('Routee provider enabled but ROUTEE_CLIENT_ID or ROUTEE_CLIENT_SECRET not set');
                throw new Error('Routee provider requires ROUTEE_CLIENT_ID and ROUTEE_CLIENT_SECRET environment variables');
            }
            const routeeProvider = new routee_1.RouteeEmailProvider();
            this.providers.set('routee', routeeProvider);
            logger_1.logger.info('Initialized Routee email provider (OAuth 2.0)');
        }
        logger_1.logger.info({
            enabledProviders: this.enabledProviders,
            availableProviders: Array.from(this.providers.keys())
        }, 'Email providers initialized');
    }
    async sendEmail(request) {
        const primaryProvider = this.getPrimaryProvider();
        if (!primaryProvider) {
            throw new Error('No email providers available');
        }
        return this.sendWithProvider(primaryProvider, request);
    }
    getProvider(name) {
        return this.providers.get(name) || null;
    }
    getPrimaryProvider() {
        for (const providerName of this.enabledProviders) {
            const provider = this.providers.get(providerName);
            if (provider) {
                return provider;
            }
        }
        return null;
    }
    async sendWithProvider(provider, request) {
        const startTime = Date.now();
        try {
            const result = await provider.send(request);
            const latency = Date.now() - startTime;
            metrics_1.providerLatencyMs.labels({ provider: provider.name }).observe(latency);
            if (result.status === 'sent') {
                metrics_1.emailsSentTotal.labels({
                    provider: provider.name,
                    status: 'success'
                }).inc();
            }
            else {
                metrics_1.emailsSentTotal.labels({
                    provider: provider.name,
                    status: 'failed'
                }).inc();
                metrics_1.emailsFailedTotal.labels({
                    provider: provider.name,
                    error_type: result.error || 'unknown'
                }).inc();
            }
            return result;
        }
        catch (error) {
            const latency = Date.now() - startTime;
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            metrics_1.emailsFailedTotal.labels({
                provider: provider.name,
                error_type: 'exception'
            }).inc();
            logger_1.logger.error({
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
    async getProviderHealth() {
        const healthChecks = await Promise.allSettled(Array.from(this.providers.entries()).map(async ([name, provider]) => {
            const health = await provider.health();
            return { name, ...health };
        }));
        const results = {};
        healthChecks.forEach((result, index) => {
            const providerName = Array.from(this.providers.keys())[index];
            if (result.status === 'fulfilled') {
                results[providerName] = {
                    healthy: result.value.healthy,
                    latency: result.value.latency,
                    error: result.value.error
                };
            }
            else {
                results[providerName] = {
                    healthy: false,
                    error: result.reason instanceof Error ? result.reason.message : 'Unknown error'
                };
            }
        });
        return results;
    }
    getAvailableProviders() {
        return Array.from(this.providers.keys());
    }
}
exports.ProviderManager = ProviderManager;
//# sourceMappingURL=manager.js.map