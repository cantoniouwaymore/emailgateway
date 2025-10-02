import { EmailProvider, SendProviderRequest, SendProviderResult, WebhookEvent, HealthStatus } from './types';
export declare class RouteeEmailProvider implements EmailProvider {
    readonly name = "routee";
    private clientId;
    private clientSecret;
    private baseUrl;
    private accessToken;
    private tokenExpiry;
    constructor(clientId?: string, clientSecret?: string);
    private getAccessToken;
    send(request: SendProviderRequest): Promise<SendProviderResult>;
    parseWebhook(payload: unknown, headers: Record<string, string>): WebhookEvent[];
    private mapRouteeEventType;
    health(): Promise<HealthStatus>;
}
//# sourceMappingURL=routee.d.ts.map