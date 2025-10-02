import client from 'prom-client';
import { FastifyInstance } from 'fastify';

// Create a Registry
const register = new client.Registry();

// Add default metrics
client.collectDefaultMetrics({ register });

// Custom metrics
export const emailsAcceptedTotal = new client.Counter({
  name: 'emails_accepted_total',
  help: 'Total number of emails accepted',
  labelNames: ['tenant_id', 'template_key'],
  registers: [register]
});

export const emailsSentTotal = new client.Counter({
  name: 'emails_sent_total',
  help: 'Total number of emails sent',
  labelNames: ['provider', 'status'],
  registers: [register]
});

export const emailsFailedTotal = new client.Counter({
  name: 'emails_failed_total',
  help: 'Total number of emails that failed',
  labelNames: ['provider', 'error_type'],
  registers: [register]
});

export const providerLatencyMs = new client.Histogram({
  name: 'provider_latency_ms',
  help: 'Provider response latency in milliseconds',
  labelNames: ['provider'],
  buckets: [100, 500, 1000, 2000, 5000, 10000],
  registers: [register]
});

export const queueDepth = new client.Gauge({
  name: 'queue_depth',
  help: 'Current queue depth',
  labelNames: ['queue_name'],
  registers: [register]
});

export const retryCount = new client.Counter({
  name: 'retry_count',
  help: 'Total number of retries',
  labelNames: ['provider', 'attempt'],
  registers: [register]
});

export const webhookFailuresTotal = new client.Counter({
  name: 'webhook_failures_total',
  help: 'Total number of webhook failures',
  labelNames: ['provider', 'event_type'],
  registers: [register]
});

export function setupMetricsEndpoint(fastify: FastifyInstance): void {
  fastify.get('/metrics', async (request, reply) => {
    reply.type('text/plain');
    return register.metrics();
  });
}

export function updateQueueDepth(queueName: string, depth: number): void {
  queueDepth.set({ queue_name: queueName }, depth);
}
