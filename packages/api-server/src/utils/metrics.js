"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookFailuresTotal = exports.retryCount = exports.queueDepth = exports.providerLatencyMs = exports.emailsFailedTotal = exports.emailsSentTotal = exports.emailsAcceptedTotal = void 0;
exports.setupMetricsEndpoint = setupMetricsEndpoint;
exports.updateQueueDepth = updateQueueDepth;
const prom_client_1 = __importDefault(require("prom-client"));
const register = new prom_client_1.default.Registry();
prom_client_1.default.collectDefaultMetrics({ register });
exports.emailsAcceptedTotal = new prom_client_1.default.Counter({
    name: 'emails_accepted_total',
    help: 'Total number of emails accepted',
    labelNames: ['tenant_id', 'template_key'],
    registers: [register]
});
exports.emailsSentTotal = new prom_client_1.default.Counter({
    name: 'emails_sent_total',
    help: 'Total number of emails sent',
    labelNames: ['provider', 'status'],
    registers: [register]
});
exports.emailsFailedTotal = new prom_client_1.default.Counter({
    name: 'emails_failed_total',
    help: 'Total number of emails that failed',
    labelNames: ['provider', 'error_type'],
    registers: [register]
});
exports.providerLatencyMs = new prom_client_1.default.Histogram({
    name: 'provider_latency_ms',
    help: 'Provider response latency in milliseconds',
    labelNames: ['provider'],
    buckets: [100, 500, 1000, 2000, 5000, 10000],
    registers: [register]
});
exports.queueDepth = new prom_client_1.default.Gauge({
    name: 'queue_depth',
    help: 'Current queue depth',
    labelNames: ['queue_name'],
    registers: [register]
});
exports.retryCount = new prom_client_1.default.Counter({
    name: 'retry_count',
    help: 'Total number of retries',
    labelNames: ['provider', 'attempt'],
    registers: [register]
});
exports.webhookFailuresTotal = new prom_client_1.default.Counter({
    name: 'webhook_failures_total',
    help: 'Total number of webhook failures',
    labelNames: ['provider', 'event_type'],
    registers: [register]
});
function setupMetricsEndpoint(fastify) {
    fastify.get('/metrics', async (request, reply) => {
        reply.type('text/plain');
        return register.metrics();
    });
}
function updateQueueDepth(queueName, depth) {
    exports.queueDepth.set({ queue_name: queueName }, depth);
}
//# sourceMappingURL=metrics.js.map