import pino from 'pino';

const isDevelopment = process.env['NODE_ENV'] === 'development';

export const logger = pino({
  level: process.env['LOG_LEVEL'] || 'info',
  transport: isDevelopment ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname'
    }
  } : undefined,
  serializers: {
    req: (req: any) => ({
      method: req.method,
      url: req.url,
      headers: {
        'user-agent': req.headers['user-agent'],
        'content-type': req.headers['content-type']
      }
    }),
    res: (res: any) => ({
      statusCode: res.statusCode
    })
  }
});

export function createTraceId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

export function hashEmail(email: string): string {
  // Simple hash for logging purposes - don't use for security
  return Buffer.from(email, 'utf-8').toString('base64').substring(0, 8);
}
