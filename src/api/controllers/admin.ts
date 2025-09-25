import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../db/client';
import { logger } from '../../utils/logger';
import { Recipient } from '../../types/email';

export class AdminController {
  async getDashboardHTML(request: FastifyRequest, reply: FastifyReply) {
    try {
      // Get system health
      const healthResponse = await fetch('http://localhost:3000/health');
      const health = await healthResponse.json();

      // Get recent messages (last 50)
      const recentMessages = await prisma.message.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
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

      const html = this.generateDashboardHTML({
        health,
        recentMessages,
        stats,
        queueDepth,
        failedCount,
        sentCount,
        totalMessages: recentMessages.length
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
        where: { messageId }
      });

      const providerEvents = await prisma.providerEvent.findMany({
        where: { messageId },
        orderBy: { createdAt: 'desc' }
      });

      if (!message) {
        return reply.status(404).send({ error: 'Message not found' });
      }

      const html = this.generateMessageDetailsHTML({ 
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

      // Get recent messages
      const recentMessages = await prisma.message.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20,
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

      return reply.send({
        health,
        serviceHealth,
        systemMetrics,
        recentMessages,
        stats,
        queueDepth,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error({ error }, 'Admin API data error');
      return reply.status(500).send({ error: 'Failed to load data' });
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

  private generateDashboardHTML(data: any): string {
    const { health, recentMessages, stats, queueDepth, failedCount, sentCount } = data;
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Gateway Admin</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js" defer></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        .status-queued { @apply bg-yellow-100 text-yellow-800; }
        .status-sent { @apply bg-green-100 text-green-800; }
        .status-failed { @apply bg-red-100 text-red-800; }
        .status-delivered { @apply bg-blue-100 text-blue-800; }
        .status-bounced { @apply bg-orange-100 text-orange-800; }
        .status-suppressed { @apply bg-gray-100 text-gray-800; }
    </style>
</head>
<body class="bg-gray-50">
    <nav class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <h1 class="text-xl font-bold text-gray-900">
                        <i class="fas fa-envelope mr-2"></i>
                        Email Gateway Admin
                    </h1>
                </div>
                <div class="flex items-center space-x-4">
                    <span class="text-sm text-gray-500" id="last-updated">
                        <i class="fas fa-clock mr-1"></i>
                        ${new Date().toLocaleTimeString()}
                    </span>
                </div>
            </div>
        </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900">Email Gateway Dashboard</h1>
            <p class="mt-2 text-gray-600">Monitor email delivery status and system health</p>
        </div>

        <!-- System Health Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <!-- System Status -->
            <div class="bg-white overflow-hidden shadow rounded-lg">
                <div class="p-5">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <i class="fas fa-heartbeat text-2xl ${health.status === 'healthy' ? 'text-green-500' : 'text-red-500'}"></i>
                        </div>
                        <div class="ml-5 w-0 flex-1">
                            <dl>
                                <dt class="text-sm font-medium text-gray-500 truncate">System Status</dt>
                                <dd class="text-lg font-medium text-gray-900">${health.status || 'Unknown'}</dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Queue Depth -->
            <div class="bg-white overflow-hidden shadow rounded-lg">
                <div class="p-5">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <i class="fas fa-list-ul text-2xl text-blue-500"></i>
                        </div>
                        <div class="ml-5 w-0 flex-1">
                            <dl>
                                <dt class="text-sm font-medium text-gray-500 truncate">Queue Depth</dt>
                                <dd class="text-lg font-medium text-gray-900">${queueDepth || 0}</dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sent Messages -->
            <div class="bg-white overflow-hidden shadow rounded-lg">
                <div class="p-5">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <i class="fas fa-paper-plane text-2xl text-green-500"></i>
                        </div>
                        <div class="ml-5 w-0 flex-1">
                            <dl>
                                <dt class="text-sm font-medium text-gray-500 truncate">Sent Today</dt>
                                <dd class="text-lg font-medium text-gray-900">${sentCount || 0}</dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Failed Messages -->
            <div class="bg-white overflow-hidden shadow rounded-lg">
                <div class="p-5">
                    <div class="flex items-center">
                        <div class="flex-shrink-0">
                            <i class="fas fa-exclamation-triangle text-2xl text-red-500"></i>
                        </div>
                        <div class="ml-5 w-0 flex-1">
                            <dl>
                                <dt class="text-sm font-medium text-gray-500 truncate">Failed Today</dt>
                                <dd class="text-lg font-medium text-gray-900">${failedCount || 0}</dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Recent Messages Table -->
        <div class="bg-white shadow overflow-hidden sm:rounded-md">
            <div class="px-4 py-5 sm:px-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                    <i class="fas fa-envelope mr-2"></i>
                    Recent Messages
                </h3>
                <p class="mt-1 max-w-2xl text-sm text-gray-500">
                    Latest email messages and their delivery status
                </p>
            </div>
            <div class="border-t border-gray-200">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message ID</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            ${recentMessages.map((message: any) => `
                                <tr class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">${message.messageId}</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full status-${message.status.toLowerCase()}">${message.status}</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${this.getRecipientEmail(message.toJson)}</td>
                                    <td class="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">${message.subject}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${message.provider || 'N/A'}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${new Date(message.createdAt).toLocaleString()}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <a href="/admin/messages/${message.messageId}" class="text-indigo-600 hover:text-indigo-900">
                                            <i class="fas fa-eye mr-1"></i>
                                            View
                                        </a>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Refresh Button -->
        <div class="mt-6 flex justify-end">
            <button onclick="location.reload()" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <i class="fas fa-sync-alt mr-2"></i>
                Refresh Data
            </button>
        </div>
    </main>

    <script>
        // Auto-refresh every 30 seconds
        setInterval(() => {
            location.reload();
        }, 30000);
    </script>
</body>
</html>`;
  }

  private generateMessageDetailsHTML(data: any): string {
    const { message } = data;
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Message Details - Email Gateway Admin</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        .status-queued { @apply bg-yellow-100 text-yellow-800; }
        .status-sent { @apply bg-green-100 text-green-800; }
        .status-failed { @apply bg-red-100 text-red-800; }
        .status-delivered { @apply bg-blue-100 text-blue-800; }
        .status-bounced { @apply bg-orange-100 text-orange-800; }
        .status-suppressed { @apply bg-gray-100 text-gray-800; }
    </style>
</head>
<body class="bg-gray-50">
    <nav class="bg-white shadow-sm border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <h1 class="text-xl font-bold text-gray-900">
                        <i class="fas fa-envelope mr-2"></i>
                        Email Gateway Admin
                    </h1>
                </div>
                <div class="flex items-center space-x-4">
                    <a href="/admin" class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                        <i class="fas fa-arrow-left mr-1"></i>
                        Back to Dashboard
                    </a>
                </div>
            </div>
        </div>
    </nav>

    <main class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900">Message Details</h1>
            <p class="mt-2 text-gray-600">Detailed information about email message</p>
        </div>

        <!-- Message Information -->
        <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div class="px-4 py-5 sm:px-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                    <i class="fas fa-info-circle mr-2"></i>
                    Message Information
                </h3>
            </div>
            <div class="border-t border-gray-200">
                <dl>
                    <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt class="text-sm font-medium text-gray-500">Message ID</dt>
                        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-mono">${message.messageId}</dd>
                    </div>
                    <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt class="text-sm font-medium text-gray-500">Status</dt>
                        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full status-${message.status.toLowerCase()}">${message.status}</span>
                        </dd>
                    </div>
                    <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt class="text-sm font-medium text-gray-500">Attempts</dt>
                        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">${message.attempts}</dd>
                    </div>
                    <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt class="text-sm font-medium text-gray-500">Provider</dt>
                        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">${message.provider || 'N/A'}</dd>
                    </div>
                    <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt class="text-sm font-medium text-gray-500">Provider Message ID</dt>
                        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-mono">${message.providerMessageId || 'N/A'}</dd>
                    </div>
                    <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt class="text-sm font-medium text-gray-500">Created At</dt>
                        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">${new Date(message.createdAt).toLocaleString()}</dd>
                    </div>
                    <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt class="text-sm font-medium text-gray-500">Updated At</dt>
                        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">${new Date(message.updatedAt).toLocaleString()}</dd>
                    </div>
                    ${message.lastError ? `
                    <div class="bg-red-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt class="text-sm font-medium text-red-500">Last Error</dt>
                        <dd class="mt-1 text-sm text-red-900 sm:mt-0 sm:col-span-2 font-mono">${message.lastError}</dd>
                    </div>
                    ` : ''}
                </dl>
            </div>
        </div>

        <!-- Email Content -->
        <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div class="px-4 py-5 sm:px-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                    <i class="fas fa-envelope mr-2"></i>
                    Email Content
                </h3>
            </div>
            <div class="border-t border-gray-200">
                <dl>
                    <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt class="text-sm font-medium text-gray-500">Subject</dt>
                        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">${message.subject}</dd>
                    </div>
                    <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt class="text-sm font-medium text-gray-500">Recipients</dt>
                        <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            ${this.getRecipientsList(message.toJson)}
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
    </main>
</body>
</html>`;
  }

  private getRecipientEmail(toJson: string): string {
    try {
      const recipients = JSON.parse(toJson);
      return recipients[0]?.email || 'N/A';
    } catch {
      return 'N/A';
    }
  }

  private getRecipientsList(toJson: string): string {
    try {
      const recipients = JSON.parse(toJson);
      return recipients.map((r: Recipient) => `
        <div class="mb-1">
          <span class="font-medium">${r.email}</span>
          ${r.name ? `<span class="text-gray-500">(${r.name})</span>` : ''}
        </div>
      `).join('');
    } catch {
      return 'N/A';
    }
  }
}
