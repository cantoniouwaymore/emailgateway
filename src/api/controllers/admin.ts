import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../db/client';
import { logger } from '../../utils/logger';
import { generateDashboardHTML } from '../../templates/admin/dashboard.html';
import { generateMessageDetailsHTML } from '../../templates/admin/message-details.html';
import { generateSearchResultsHTML } from '../../templates/admin/search-results.html';

export class AdminController {
  async getDashboardHTML(request: FastifyRequest<{ Querystring: { page?: string; limit?: string; search?: string; email?: string; searchPage?: string; searchLimit?: string } }>, reply: FastifyReply) {
    try {
      const { page = '1', limit = '20', search, email, searchPage = '1', searchLimit = '20' } = request.query;
      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      const skip = (pageNum - 1) * limitNum;

      // Get comprehensive system health
      const healthResponse = await fetch('http://localhost:3000/health');
      const health = await healthResponse.json();

      // Get detailed service health
      const serviceHealth = await this.getDetailedServiceHealth();

      // Get total message count for pagination
      const totalMessages = await prisma.message.count();
      const totalPages = Math.ceil(totalMessages / limitNum);

      // Get recent messages with pagination
      const recentMessages = await prisma.message.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
        select: {
          messageId: true,
          status: true,
          attempts: true,
          lastError: true,
          createdAt: true,
          updatedAt: true,
          provider: true,
          providerMessageId: true,
          toJson: true,
          subject: true
        }
      });

      // Get message statistics
      const stats = await prisma.message.groupBy({
        by: ['status'],
        _count: { status: true }
      });

      // Get queue depth
      const queueDepth = await prisma.message.count({
        where: { status: 'QUEUED' }
      });

      // Get failed messages count
      const failedCount = await prisma.message.count({
        where: { status: 'FAILED' }
      });

      // Get sent messages count
      const sentCount = await prisma.message.count({
        where: { status: 'SENT' }
      });

      // Get system metrics
      const systemMetrics = this.getSystemMetrics();

      // Get recent webhook events for dashboard
      const recentWebhookEvents = await prisma.providerEvent.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          messageId: true,
          eventType: true,
          provider: true,
          createdAt: true
        }
      });

      // Handle search functionality if search query is provided
      let searchResults = null;
      let searchPagination = null;
      const searchQuery = search === 'true' ? email : search;
      if (searchQuery) {
        const searchPageNum = parseInt(searchPage, 10);
        const searchLimitNum = parseInt(searchLimit, 10);
        const searchSkip = (searchPageNum - 1) * searchLimitNum;

        // Get all messages and filter by recipient email
        const allMessages = await prisma.message.findMany({
          orderBy: { createdAt: 'desc' },
          select: {
            messageId: true,
            tenantId: true,
            toJson: true,
            subject: true,
            templateKey: true,
            locale: true,
            provider: true,
            providerMessageId: true,
            status: true,
            attempts: true,
            lastError: true,
            failureReason: true,
            createdAt: true,
            updatedAt: true
          }
        });

        // Filter messages where the recipient email matches
        const filteredMessages = allMessages.filter(message => {
          try {
            const recipients = typeof message.toJson === 'string' ? JSON.parse(message.toJson) : message.toJson;
            if (!recipients || !Array.isArray(recipients)) {
              return false;
            }
            return recipients.some((recipient: any) => 
              recipient.email && recipient.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
          } catch {
            return false;
          }
        });

        const searchTotalCount = filteredMessages.length;
        const searchTotalPages = Math.ceil(searchTotalCount / searchLimitNum);
        const searchPaginatedMessages = filteredMessages.slice(searchSkip, searchSkip + searchLimitNum);

        // Get webhook events for each search result
        const searchMessagesWithEvents = await Promise.all(
          searchPaginatedMessages.map(async (message) => {
            const latestEvent = await prisma.providerEvent.findFirst({
              where: { messageId: message.messageId },
              orderBy: { createdAt: 'desc' },
              select: {
                eventType: true,
                createdAt: true,
                rawJson: true
              }
            });

            return {
              messageId: message.messageId,
              tenantId: message.tenantId,
              toJson: message.toJson,
              subject: message.subject,
              templateKey: message.templateKey,
              locale: message.locale,
              provider: message.provider,
              providerMessageId: message.providerMessageId,
              status: message.status,
              attempts: message.attempts,
              lastError: message.lastError,
              failureReason: message.failureReason,
              createdAt: message.createdAt,
              updatedAt: message.updatedAt,
              latestWebhookEvent: latestEvent
            };
          })
        );

        searchResults = searchMessagesWithEvents;
        searchPagination = {
          currentPage: searchPageNum,
          totalPages: searchTotalPages,
          totalCount: searchTotalCount,
          limit: searchLimitNum
        };
      }

      const html = generateDashboardHTML({
        health,
        serviceHealth,
        systemMetrics,
        recentMessages,
        stats,
        queueDepth,
        failedCount,
        sentCount,
        totalMessages: recentMessages.length,
        recentWebhookEvents,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalCount: totalMessages,
          limit: limitNum
        },
        searchResults,
        searchQuery: searchQuery,
        searchPagination
      });
      
      return reply.type('text/html').send(html);
    } catch (error) {
      logger.error({ error }, 'Admin dashboard error');
      return reply.status(500).send({ error: 'Failed to load dashboard' });
    }
  }

  async getMessageDetailsHTML(request: FastifyRequest<{ Params: { messageId: string } }>, reply: FastifyReply) {
    try {
      const { messageId } = request.params;
      
      const message = await prisma.message.findUnique({
        where: { messageId },
        select: {
          messageId: true,
          tenantId: true,
          toJson: true,
          subject: true,
          templateKey: true,
          locale: true,
          variablesJson: true,
          provider: true,
          providerMessageId: true,
          status: true,
          attempts: true,
          lastError: true,
          failureReason: true,
          webhookUrl: true,
          createdAt: true,
          updatedAt: true
        }
      });

      const providerEvents = await prisma.providerEvent.findMany({
        where: { messageId },
        orderBy: { createdAt: 'desc' }
      });

      if (!message) {
        return reply.status(404).send({ error: 'Message not found' });
      }

      const html = generateMessageDetailsHTML({ 
        message: { ...message, providerEvents } 
      });
      
      return reply.type('text/html').send(html);
    } catch (error) {
      logger.error({ error, messageId: request.params.messageId }, 'Message details error');
      return reply.status(500).send({ error: 'Failed to load message details' });
    }
  }

  async getApiData(request: FastifyRequest, reply: FastifyReply) {
    try {
      // Get comprehensive system health
      const healthResponse = await fetch('http://localhost:3000/health');
      const health = await healthResponse.json();

      // Get detailed service health
      const serviceHealth = await this.getDetailedServiceHealth();

      // Get recent messages with latest webhook events
      const recentMessages = await prisma.message.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20,
        select: {
          messageId: true,
          status: true,
          attempts: true,
          lastError: true,
          failureReason: true,
          createdAt: true,
          updatedAt: true,
          provider: true,
          providerMessageId: true,
          toJson: true,
          subject: true
        }
      });

      // Get latest webhook event for each message
      const messagesWithLatestEvents = await Promise.all(
        recentMessages.map(async (message) => {
          const latestEvent = await prisma.providerEvent.findFirst({
            where: { messageId: message.messageId },
            orderBy: { createdAt: 'desc' },
            select: {
              eventType: true,
              createdAt: true,
              rawJson: true
            }
          });

          return {
            ...message,
            latestWebhookEvent: latestEvent
          };
        })
      );

      // Get statistics
      const stats = await prisma.message.groupBy({
        by: ['status'],
        _count: { status: true }
      });

      const queueDepth = await prisma.message.count({
        where: { status: 'QUEUED' }
      });

      // Get system metrics
      const systemMetrics = this.getSystemMetrics();

      // Get recent webhook events
      const recentWebhookEvents = await prisma.providerEvent.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20,
        select: {
          id: true,
          messageId: true,
          eventType: true,
          provider: true,
          createdAt: true,
          rawJson: true
        }
      });

      return reply.send({
        health,
        serviceHealth,
        systemMetrics,
        recentMessages: messagesWithLatestEvents,
        stats,
        queueDepth,
        recentWebhookEvents,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error({ error }, 'Admin API data error');
      return reply.status(500).send({ error: 'Failed to load data' });
    }
  }

  async getWebhookEvents(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { messageId } = request.params as { messageId: string };
      
      const webhookEvents = await prisma.providerEvent.findMany({
        where: { messageId },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          eventType: true,
          provider: true,
          createdAt: true,
          rawJson: true
        }
      });

      return reply.send({
        messageId,
        events: webhookEvents,
        count: webhookEvents.length
      });
    } catch (error) {
      logger.error({ error, messageId: request.params }, 'Webhook events error');
      return reply.status(500).send({ error: 'Failed to load webhook events' });
    }
  }

  async getRecentWebhookEvents(request: FastifyRequest, reply: FastifyReply) {
    try {
      const recentWebhookEvents = await prisma.providerEvent.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
        select: {
          id: true,
          messageId: true,
          eventType: true,
          provider: true,
          createdAt: true,
          rawJson: true
        }
      });

      return reply.send({
        events: recentWebhookEvents,
        count: recentWebhookEvents.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error({ error }, 'Recent webhook events error');
      return reply.status(500).send({ error: 'Failed to load recent webhook events' });
    }
  }

  async searchByRecipient(request: FastifyRequest<{ Querystring: { email: string; page?: string; limit?: string } }>, reply: FastifyReply) {
    try {
      const { email, page = '1', limit = '20' } = request.query;
      
      if (!email) {
        return reply.status(400).send({ error: 'Email parameter is required' });
      }

      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      const skip = (pageNum - 1) * limitNum;

      // Get all messages and filter by recipient email
      // This is not the most efficient approach for large datasets, but it works with the current schema
      const allMessages = await prisma.message.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
          messageId: true,
          tenantId: true,
          toJson: true,
          subject: true,
          templateKey: true,
          locale: true,
          provider: true,
          providerMessageId: true,
          status: true,
          attempts: true,
          lastError: true,
          failureReason: true,
          createdAt: true,
          updatedAt: true
        }
      });

      // Filter messages where the recipient email matches
      const filteredMessages = allMessages.filter(message => {
        try {
          const recipients = typeof message.toJson === 'string' ? JSON.parse(message.toJson) : message.toJson;
          if (!recipients || !Array.isArray(recipients)) {
            return false;
          }
          return recipients.some((recipient: any) => 
            recipient.email && recipient.email.toLowerCase().includes(email.toLowerCase())
          );
        } catch {
          return false;
        }
      });

      const totalCount = filteredMessages.length;
      const totalPages = Math.ceil(totalCount / limitNum);
      const paginatedMessages = filteredMessages.slice(skip, skip + limitNum);

      // Get webhook events for each message
      const messagesWithEvents = await Promise.all(
        paginatedMessages.map(async (message) => {
          const latestEvent = await prisma.providerEvent.findFirst({
            where: { messageId: message.messageId },
            orderBy: { createdAt: 'desc' },
            select: {
              eventType: true,
              createdAt: true,
              rawJson: true
            }
          });

          return {
            messageId: message.messageId,
            tenantId: message.tenantId,
            toJson: message.toJson,
            subject: message.subject,
            templateKey: message.templateKey,
            locale: message.locale,
            provider: message.provider,
            providerMessageId: message.providerMessageId,
            status: message.status,
            attempts: message.attempts,
            lastError: message.lastError,
            failureReason: message.failureReason,
            createdAt: message.createdAt,
            updatedAt: message.updatedAt,
            latestWebhookEvent: latestEvent
          };
        })
      );

      const html = generateSearchResultsHTML({
        email,
        messages: messagesWithEvents,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalCount,
          limit: limitNum
        }
      });

      return reply.type('text/html').send(html);
    } catch (error) {
      logger.error({ error, email: request.query.email }, 'Search by recipient error');
      return reply.status(500).send({ error: 'Failed to search messages' });
    }
  }

  private async getDetailedServiceHealth() {
    const healthChecks = await Promise.allSettled([
      this.checkDatabaseHealth(),
      this.checkRedisHealth(),
      this.checkWorkerHealth(),
      this.checkProviderHealth()
    ]);

    return {
      database: healthChecks[0].status === 'fulfilled' ? healthChecks[0].value : { healthy: false, error: 'Database check failed' },
      redis: healthChecks[1].status === 'fulfilled' ? healthChecks[1].value : { healthy: false, error: 'Redis check failed' },
      worker: healthChecks[2].status === 'fulfilled' ? healthChecks[2].value : { healthy: false, error: 'Worker check failed' },
      providers: healthChecks[3].status === 'fulfilled' ? healthChecks[3].value : { healthy: false, error: 'Provider check failed' }
    };
  }

  private async checkDatabaseHealth() {
    try {
      const startTime = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      const latency = Date.now() - startTime;
      
      // Get connection pool info
      const poolInfo = await prisma.$queryRaw<Array<{
        total_connections: bigint;
        active_connections: bigint;
        idle_connections: bigint;
      }>>`
        SELECT 
          count(*) as total_connections,
          count(*) FILTER (WHERE state = 'active') as active_connections,
          count(*) FILTER (WHERE state = 'idle') as idle_connections
        FROM pg_stat_activity 
        WHERE datname = current_database()
      `;

      return {
        healthy: true,
        latency,
        details: {
          connectionPool: {
            total_connections: Number(poolInfo[0]?.total_connections || 0),
            active_connections: Number(poolInfo[0]?.active_connections || 0),
            idle_connections: Number(poolInfo[0]?.idle_connections || 0)
          },
          database: process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'unknown'
        }
      };
    } catch (error) {
      return {
        healthy: false,
        error: error instanceof Error ? error.message : 'Unknown database error'
      };
    }
  }

  private async checkRedisHealth() {
    try {
      const startTime = Date.now();
      const Redis = require('ioredis');
      const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
      
      await redis.ping();
      const latency = Date.now() - startTime;
      
      // Get Redis info
      const info = await redis.info('memory');
      const memoryInfo = info.split('\n').reduce((acc: any, line: string) => {
        const [key, value] = line.split(':');
        if (key && value) {
          acc[key] = value.trim();
        }
        return acc;
      }, {});

      await redis.quit();

      return {
        healthy: true,
        latency,
        details: {
          memory: {
            used: memoryInfo.used_memory_human,
            peak: memoryInfo.used_memory_peak_human,
            fragmentation: memoryInfo.mem_fragmentation_ratio
          },
          redis: process.env.REDIS_URL?.split('@')[1] || 'localhost:6379'
        }
      };
    } catch (error) {
      return {
        healthy: false,
        error: error instanceof Error ? error.message : 'Unknown Redis error'
      };
    }
  }

  private async checkWorkerHealth() {
    try {
      // Check if there are any recent worker activities
      const recentWorkerActivity = await prisma.message.count({
        where: {
          updatedAt: {
            gte: new Date(Date.now() - 5 * 60 * 1000) // Last 5 minutes
          },
          status: {
            in: ['SENT', 'FAILED']
          }
        }
      });

      // Check for stuck messages (queued for too long)
      const stuckMessages = await prisma.message.count({
        where: {
          status: 'QUEUED',
          createdAt: {
            lt: new Date(Date.now() - 10 * 60 * 1000) // Older than 10 minutes
          }
        }
      });

      return {
        healthy: stuckMessages === 0,
        details: {
          recentActivity: recentWorkerActivity,
          stuckMessages,
          workerStatus: stuckMessages > 0 ? 'degraded' : 'healthy'
        }
      };
    } catch (error) {
      return {
        healthy: false,
        error: error instanceof Error ? error.message : 'Unknown worker error'
      };
    }
  }

  private async checkProviderHealth() {
    try {
      const { ProviderManager } = await import('../../providers/manager');
      const providerManager = new ProviderManager();
      const providerHealth = await providerManager.getProviderHealth();
      
      const allHealthy = Object.values(providerHealth).every(p => p.healthy);
      
      return {
        healthy: allHealthy,
        details: providerHealth
      };
    } catch (error) {
      return {
        healthy: false,
        error: error instanceof Error ? error.message : 'Unknown provider error'
      };
    }
  }

  private getSystemMetrics() {
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    return {
      memory: {
        used: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
        total: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
        external: Math.round(memUsage.external / 1024 / 1024), // MB
        rss: Math.round(memUsage.rss / 1024 / 1024) // MB
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system
      },
      uptime: Math.floor(process.uptime()),
      nodeVersion: process.version,
      platform: process.platform,
      serviceMode: process.env.SERVICE_MODE || 'api'
    };
  }

  private formatUptime(seconds: number): string {
    if (!seconds) return '0s';
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  }




}
