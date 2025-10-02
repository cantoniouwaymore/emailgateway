import { EmailProvider, SendProviderRequest, SendProviderResult } from './types';
export declare class ProviderManager {
    private providers;
    private enabledProviders;
    constructor();
    private getEnabledProviders;
    private initializeProviders;
    sendEmail(request: SendProviderRequest): Promise<SendProviderResult>;
    getProvider(name: string): EmailProvider | null;
    private getPrimaryProvider;
    private sendWithProvider;
    getProviderHealth(): Promise<Record<string, {
        healthy: boolean;
        latency?: number;
        error?: string;
    }>>;
    getAvailableProviders(): string[];
}
//# sourceMappingURL=manager.d.ts.map