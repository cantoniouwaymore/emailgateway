import client from 'prom-client';
import { FastifyInstance } from 'fastify';
export declare const emailsAcceptedTotal: client.Counter<"tenant_id" | "template_key">;
export declare const emailsSentTotal: client.Counter<"provider" | "status">;
export declare const emailsFailedTotal: client.Counter<"provider" | "error_type">;
export declare const providerLatencyMs: client.Histogram<"provider">;
export declare const queueDepth: client.Gauge<"queue_name">;
export declare const retryCount: client.Counter<"provider" | "attempt">;
export declare const webhookFailuresTotal: client.Counter<"provider" | "event_type">;
export declare function setupMetricsEndpoint(fastify: FastifyInstance): void;
export declare function updateQueueDepth(queueName: string, depth: number): void;
//# sourceMappingURL=metrics.d.ts.map