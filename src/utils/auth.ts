import jwt from 'jsonwebtoken';
import { FastifyRequest } from 'fastify';

const JWT_SECRET = process.env['JWT_SECRET'] || 'default-secret';
const JWT_ISSUER = process.env['JWT_ISSUER'] || 'email-gateway';
const JWT_AUDIENCE = process.env['JWT_AUDIENCE'] || 'waymore-platform';

export interface JWTPayload {
  sub: string;
  iss: string;
  aud: string;
  scope: string[];
  exp: number;
  iat: number;
}

export function verifyJWT(token: string): JWTPayload {
  try {
    const payload = jwt.verify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
      algorithms: ['HS256']
    }) as JWTPayload;

    return payload;
  } catch (error) {
    throw new Error('Invalid JWT token');
  }
}

export function extractTokenFromRequest(request: FastifyRequest): string {
  const authHeader = request.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing or invalid Authorization header');
  }
  
  return authHeader.substring(7);
}

export function requireScope(requiredScope: string) {
  return (payload: JWTPayload): void => {
    if (!payload.scope || !payload.scope.includes(requiredScope)) {
      throw new Error(`Missing required scope: ${requiredScope}`);
    }
  };
}

export function generateTestToken(): string {
  const payload = {
    sub: 'test-client',
    iss: JWT_ISSUER,
    aud: JWT_AUDIENCE,
    scope: ['emails:send', 'emails:read'],
    exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour
    iat: Math.floor(Date.now() / 1000)
  };

  return jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256' });
}
