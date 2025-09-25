import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../db/client';
import { ProviderManager } from '../../providers/manager';
import { logger } from '../../utils/logger';

export class HealthController {
  private providerManager: ProviderManager;

  constructor() {
    this.providerManager = new ProviderManager();
  }

  async healthCheck(request: FastifyRequest, reply: FastifyReply) {
    const startTime = Date.now();
    
    try {
      // Check database connectivity
      await prisma.$queryRaw`SELECT 1`;
      
      // Check provider health
      const providerHealth = await this.providerManager.getProviderHealth();
      const allProvidersHealthy = Object.values(providerHealth).every(p => p.healthy);
      
      const health = {
        status: allProvidersHealthy ? 'healthy' : 'degraded',
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()),
        checks: {
          database: 'healthy',
          providers: providerHealth
        },
        responseTime: Date.now() - startTime
      };

      logger.debug({ health }, 'Health check completed');
      
      reply.code(200);
      return health;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      logger.error({ error: errorMessage }, 'Health check failed');
      
      reply.code(503);
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        uptime: Math.floor(process.uptime()),
        error: errorMessage,
        responseTime: Date.now() - startTime
      };
    }
  }

  async readinessCheck(request: FastifyRequest, reply: FastifyReply) {
    const startTime = Date.now();
    
    try {
      // Check database connectivity
      await prisma.$queryRaw`SELECT 1`;
      
      // Check if at least one provider is healthy
      const providerHealth = await this.providerManager.getProviderHealth();
      const hasHealthyProvider = Object.values(providerHealth).some(p => p.healthy);
      
      if (!hasHealthyProvider) {
        reply.code(503);
        return {
          status: 'not ready',
          timestamp: new Date().toISOString(),
          reason: 'No healthy email providers available',
          responseTime: Date.now() - startTime
        };
      }

      const readiness = {
        status: 'ready',
        timestamp: new Date().toISOString(),
        checks: {
          database: 'ready',
          providers: providerHealth
        },
        responseTime: Date.now() - startTime
      };

      logger.debug({ readiness }, 'Readiness check completed');
      
      reply.code(200);
      return readiness;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      logger.error({ error: errorMessage }, 'Readiness check failed');
      
      reply.code(503);
      return {
        status: 'not ready',
        timestamp: new Date().toISOString(),
        reason: errorMessage,
        responseTime: Date.now() - startTime
      };
    }
  }

  async livenessCheck(request: FastifyRequest, reply: FastifyReply) {
    // Simple liveness check - just return OK if the process is running
    reply.code(200);
    return {
      status: 'alive',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime())
    };
  }
}
