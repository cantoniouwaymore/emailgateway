import { z } from 'zod';

const recipientSchema = z.object({
  email: z.string().email(),
  name: z.string().optional()
});

const templateSchema = z.object({
  key: z.string().min(1),
  locale: z.string().optional(),
  version: z.string().optional()
});

const attachmentSchema = z.object({
  filename: z.string().min(1),
  contentBase64: z.string(),
  contentType: z.string().min(1)
});

export const sendEmailRequestSchema = z.object({
  messageId: z.string().optional(),
  to: z.array(recipientSchema).min(1),
  cc: z.array(recipientSchema).optional(),
  bcc: z.array(recipientSchema).optional(),
  from: recipientSchema,
  replyTo: recipientSchema.optional(),
  subject: z.string().min(1).max(200),
  template: templateSchema,
  variables: z.record(z.unknown()).optional(),
  attachments: z.array(attachmentSchema).optional(),
  metadata: z.record(z.unknown()).optional(),
  webhookUrl: z.string().url().optional()
});

export const sendEmailResponseSchema = z.object({
  messageId: z.string(),
  status: z.literal('queued')
});

export const messageStatusSchema = z.object({
  messageId: z.string(),
  status: z.enum(['queued', 'sent', 'delivered', 'bounced', 'failed', 'suppressed']),
  attempts: z.number().int().min(0),
  lastError: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const errorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    traceId: z.string().optional()
  })
});

// Fastify schema definitions
export const sendEmailSchema = {
  headers: {
    type: 'object',
    properties: {
      'authorization': { type: 'string' },
      'idempotency-key': { type: 'string' }
    },
    required: ['authorization', 'idempotency-key']
  },
  response: {
    202: {
      type: 'object',
      properties: {
        messageId: { type: 'string' },
        status: { type: 'string', enum: ['queued'] }
      },
      required: ['messageId', 'status']
    },
    400: {
      type: 'object',
      properties: {
        error: {
          type: 'object',
          properties: {
            code: { type: 'string' },
            message: { type: 'string' },
            traceId: { type: 'string' }
          },
          required: ['code', 'message']
        }
      },
      required: ['error']
    },
    401: {
      type: 'object',
      properties: {
        error: {
          type: 'object',
          properties: {
            code: { type: 'string' },
            message: { type: 'string' },
            traceId: { type: 'string' }
          },
          required: ['code', 'message']
        }
      },
      required: ['error']
    },
    409: {
      type: 'object',
      properties: {
        error: {
          type: 'object',
          properties: {
            code: { type: 'string' },
            message: { type: 'string' },
            traceId: { type: 'string' }
          },
          required: ['code', 'message']
        }
      },
      required: ['error']
    }
  }
};

export const getMessageStatusSchema = {
  params: {
    type: 'object',
    properties: {
      messageId: { type: 'string' }
    },
    required: ['messageId']
  },
  response: {
    200: {
      type: 'object',
      properties: {
        messageId: { type: 'string' },
        status: { type: 'string', enum: ['queued', 'sent', 'delivered', 'bounced', 'failed', 'suppressed'] },
        attempts: { type: 'number' },
        lastError: { type: 'string' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' }
      },
      required: ['messageId', 'status', 'attempts', 'createdAt', 'updatedAt']
    },
    404: {
      type: 'object',
      properties: {
        error: {
          type: 'object',
          properties: {
            code: { type: 'string' },
            message: { type: 'string' },
            traceId: { type: 'string' }
          },
          required: ['code', 'message']
        }
      },
      required: ['error']
    }
  }
};

export const healthCheckSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        timestamp: { type: 'string' },
        uptime: { type: 'number' }
      },
      required: ['status', 'timestamp', 'uptime']
    },
    503: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        timestamp: { type: 'string' },
        uptime: { type: 'number' },
        error: { type: 'string' },
        responseTime: { type: 'number' }
      },
      required: ['status', 'timestamp', 'uptime']
    }
  }
};
