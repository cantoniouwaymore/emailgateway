"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteeEmailProvider = void 0;
const logger_1 = require("../utils/logger");
class RouteeEmailProvider {
    name = 'routee';
    clientId;
    clientSecret;
    baseUrl;
    accessToken = null;
    tokenExpiry = 0;
    constructor(clientId, clientSecret) {
        this.clientId = clientId || process.env.ROUTEE_CLIENT_ID || '';
        this.clientSecret = clientSecret || process.env.ROUTEE_CLIENT_SECRET || '';
        this.baseUrl = process.env.ROUTEE_BASE_URL || 'https://connect.routee.net';
    }
    async getAccessToken() {
        if (this.accessToken && Date.now() < this.tokenExpiry) {
            return this.accessToken;
        }
        try {
            logger_1.logger.debug({ provider: this.name }, 'Authenticating with Routee');
            const basicAuth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
            logger_1.logger.debug({
                provider: this.name,
                clientId: this.clientId,
                hasSecret: !!this.clientSecret
            }, 'Authenticating with Routee using Basic Auth');
            const response = await fetch('https://auth.routee.net/oauth/token?grant_type=client_credentials', {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${basicAuth}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Routee authentication failed: ${response.status} - ${errorText}`);
            }
            const data = await response.json();
            this.accessToken = data.access_token;
            this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000;
            logger_1.logger.info({ provider: this.name }, 'Successfully authenticated with Routee');
            return this.accessToken;
        }
        catch (error) {
            logger_1.logger.error({
                provider: this.name,
                error: error instanceof Error ? error.message : 'Unknown error'
            }, 'Failed to authenticate with Routee');
            throw error;
        }
    }
    async send(request) {
        const startTime = Date.now();
        try {
            const accessToken = await this.getAccessToken();
            logger_1.logger.info({
                provider: this.name,
                messageId: request.messageId,
                to: request.to.map(r => r.email),
                from: request.from.email
            }, 'Sending email via Routee');
            const routeeRequest = {
                from: {
                    name: request.from.name,
                    address: request.from.email
                },
                to: request.to.map(recipient => ({
                    name: recipient.name,
                    address: recipient.email
                })),
                subject: request.subject,
                content: {
                    html: request.html
                },
                ttl: 4320,
                maxAttempts: 10,
                label: request.metadata?.tenantId || 'waymore-transactional-emails-service'
            };
            if (request.cc && request.cc.length > 0) {
                routeeRequest.cc = request.cc.map(recipient => ({
                    name: recipient.name,
                    address: recipient.email
                }));
            }
            if (request.bcc && request.bcc.length > 0) {
                routeeRequest.bcc = request.bcc.map(recipient => ({
                    name: recipient.name,
                    address: recipient.email
                }));
            }
            if (request.replyTo) {
                routeeRequest.replyTo = {
                    name: request.replyTo.name,
                    address: request.replyTo.email
                };
            }
            if (request.attachments && request.attachments.length > 0) {
                routeeRequest.attachments = request.attachments.map(attachment => ({
                    content: attachment.content.toString('base64'),
                    type: attachment.contentType,
                    filename: attachment.filename
                }));
            }
            const webhookUrl = process.env.WEBHOOK_BASE_URL || process.env.BASE_URL || 'http://localhost:3000';
            routeeRequest.callback = {
                statusCallback: {
                    strategy: "OnChange",
                    url: `${webhookUrl}/webhooks/routee`
                },
                eventCallback: {
                    onClick: `${webhookUrl}/webhooks/routee`,
                    onOpen: `${webhookUrl}/webhooks/routee`
                }
            };
            console.log('=== ROUTEE API DEBUG ===');
            console.log('Routee API URL:', `${this.baseUrl}/transactional-email`);
            console.log('Access Token:', accessToken ? `${accessToken.substring(0, 20)}...` : 'MISSING');
            console.log('Routee API Request:', JSON.stringify(routeeRequest, null, 2));
            console.log('========================');
            const response = await fetch(`${this.baseUrl}/transactional-email`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(routeeRequest)
            });
            const latency = Date.now() - startTime;
            console.log('=== ROUTEE API RESPONSE ===');
            console.log('Status:', response.status);
            console.log('Headers:', Object.fromEntries(response.headers.entries()));
            console.log('==========================');
            if (!response.ok) {
                let errorMessage = `Routee API error: ${response.status}`;
                let errorDetails = '';
                try {
                    const errorText = await response.text();
                    console.log('Routee API Error Response:', errorText);
                    try {
                        const errorData = JSON.parse(errorText);
                        console.log('Parsed Routee Error Data:', JSON.stringify(errorData, null, 2));
                        if (errorData.message) {
                            errorMessage = errorData.message;
                            errorDetails = `Error Code: ${errorData.errorCode || 'N/A'}, Service: ${errorData.service || 'N/A'}`;
                        }
                        else if (errorData.type && errorData.explanation) {
                            errorMessage = `${errorData.type}: ${errorData.explanation}`;
                        }
                        else if (errorData.errorCode && errorData.explanation) {
                            errorMessage = `${errorData.errorCode}: ${errorData.explanation}`;
                        }
                        else {
                            errorMessage = `Routee API error: ${response.status} - ${errorText}`;
                        }
                    }
                    catch (parseError) {
                        console.log('Failed to parse Routee error response as JSON:', parseError);
                        errorMessage = `Routee API error: ${response.status} - ${errorText}`;
                    }
                }
                catch (readError) {
                    console.log('Failed to read Routee error response:', readError);
                    errorMessage = `Routee API error: ${response.status} - Failed to read response`;
                }
                logger_1.logger.error({
                    provider: this.name,
                    messageId: request.messageId,
                    error: errorMessage,
                    errorDetails,
                    latency,
                    statusCode: response.status
                }, 'Failed to send email via Routee');
                return {
                    provider: this.name,
                    status: 'failed',
                    error: errorMessage
                };
            }
            const responseData = await response.json();
            console.log('Routee API Success Response:', JSON.stringify(responseData, null, 2));
            logger_1.logger.info({
                provider: this.name,
                messageId: request.messageId,
                providerMessageId: responseData.trackingId,
                latency
            }, 'Email sent successfully via Routee');
            return {
                provider: this.name,
                providerMessageId: responseData.trackingId,
                status: 'sent',
                details: {
                    queuedAt: new Date().toISOString(),
                    estimatedDelivery: new Date(Date.now() + 60000).toISOString(),
                    routeeTrackingId: responseData.trackingId
                }
            };
        }
        catch (error) {
            const latency = Date.now() - startTime;
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            logger_1.logger.error({
                provider: this.name,
                messageId: request.messageId,
                error: errorMessage,
                latency
            }, 'Failed to send email via Routee');
            return {
                provider: this.name,
                status: 'failed',
                error: errorMessage
            };
        }
    }
    parseWebhook(payload, headers) {
        try {
            logger_1.logger.info({ provider: this.name }, 'Parsing Routee webhook');
            const routeePayload = payload;
            if (!routeePayload || !routeePayload.trackingId || !routeePayload.status) {
                return [];
            }
            return [{
                    messageId: routeePayload.trackingId,
                    eventType: this.mapRouteeEventType(routeePayload.status.name),
                    provider: this.name,
                    timestamp: new Date(routeePayload.status.dateTime * 1000).toISOString(),
                    details: {
                        routeeEventType: routeePayload.status.name,
                        routeeTrackingId: routeePayload.trackingId,
                        statusId: routeePayload.status.id,
                        final: routeePayload.status.final,
                        delivered: routeePayload.status.delivered
                    }
                }];
        }
        catch (error) {
            logger_1.logger.error({
                provider: this.name,
                error: error instanceof Error ? error.message : 'Unknown error'
            }, 'Failed to parse Routee webhook');
            return [];
        }
    }
    mapRouteeEventType(routeeEventType) {
        const eventTypeMap = {
            'send': 'delivered',
            'delivered': 'delivered',
            'opened': 'open',
            'bounce': 'bounce',
            'click': 'click',
            'spam': 'spam',
            'reject': 'reject',
            'failed': 'bounce',
            'dropped': 'reject'
        };
        return eventTypeMap[routeeEventType] || 'delivered';
    }
    async health() {
        const startTime = Date.now();
        try {
            logger_1.logger.debug({ provider: this.name }, 'Checking Routee health');
            await this.getAccessToken();
            const latency = Date.now() - startTime;
            return {
                healthy: true,
                latency
            };
        }
        catch (error) {
            const latency = Date.now() - startTime;
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            logger_1.logger.error({
                provider: this.name,
                error: errorMessage,
                latency
            }, 'Routee health check failed');
            return {
                healthy: false,
                latency,
                error: errorMessage
            };
        }
    }
}
exports.RouteeEmailProvider = RouteeEmailProvider;
//# sourceMappingURL=routee.js.map