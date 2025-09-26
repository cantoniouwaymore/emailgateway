import { formatUptime } from '../../../utils/html-helpers';

export function generateHealthSection(data: any): string {
  const { health, serviceHealth, systemMetrics, queueDepth, sentCount, failedCount } = data;
  
  return `
    <div id="health-tab" class="tab-content">
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">
          <i class="fas fa-heartbeat mr-3 text-indigo-600"></i>
          System Health Overview
        </h2>
        <p class="text-lg text-gray-600">
          Monitor the overall health and performance of your email gateway system
        </p>
      </div>
      
      ${generateSystemHealthCards(health, queueDepth, sentCount, failedCount)}
      ${generateServiceHealthSection(serviceHealth)}
      ${generateSystemMetricsSection(systemMetrics)}
    </div>`;
}

function generateSystemHealthCards(health: any, queueDepth: number, sentCount: number, failedCount: number): string {
  return `
    <div class="mb-8">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">
        <i class="fas fa-tachometer-alt mr-2 text-blue-600"></i>
        Key Metrics
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
    </div>`;
}

function generateServiceHealthSection(serviceHealth: any): string {
  return `
    <div class="mb-8">
      <h2 class="text-xl font-bold text-gray-900 mb-4">
        <i class="fas fa-server mr-2"></i>
        Service Health
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <i class="fas fa-database text-2xl ${serviceHealth?.database?.healthy ? 'text-green-500' : 'text-red-500'}"></i>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Database</dt>
                  <dd class="text-lg font-medium text-gray-900">${serviceHealth?.database?.healthy ? 'Healthy' : 'Unhealthy'}</dd>
                  <dd class="text-xs text-gray-500">${serviceHealth?.database?.latency ? serviceHealth.database.latency + 'ms' : ''}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <i class="fas fa-memory text-2xl ${serviceHealth?.redis?.healthy ? 'text-green-500' : 'text-red-500'}"></i>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Redis</dt>
                  <dd class="text-lg font-medium text-gray-900">${serviceHealth?.redis?.healthy ? 'Healthy' : 'Unhealthy'}</dd>
                  <dd class="text-xs text-gray-500">${serviceHealth?.redis?.latency ? serviceHealth.redis.latency + 'ms' : ''}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <i class="fas fa-cogs text-2xl ${serviceHealth?.worker?.healthy ? 'text-green-500' : 'text-red-500'}"></i>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Worker</dt>
                  <dd class="text-lg font-medium text-gray-900">${serviceHealth?.worker?.healthy ? 'Healthy' : 'Unhealthy'}</dd>
                  <dd class="text-xs text-gray-500">${serviceHealth?.worker?.details?.stuckMessages ? serviceHealth.worker.details.stuckMessages + ' stuck' : ''}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <i class="fas fa-envelope text-2xl ${serviceHealth?.providers?.healthy ? 'text-green-500' : 'text-red-500'}"></i>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Providers</dt>
                  <dd class="text-lg font-medium text-gray-900">${serviceHealth?.providers?.healthy ? 'Healthy' : 'Unhealthy'}</dd>
                  <dd class="text-xs text-gray-500">${Object.keys(serviceHealth?.providers?.details || {}).length} providers</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
}

function generateSystemMetricsSection(systemMetrics: any): string {
  return `
    <div class="mb-8">
      <h2 class="text-xl font-bold text-gray-900 mb-4">
        <i class="fas fa-chart-line mr-2"></i>
        System Metrics
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <i class="fas fa-memory text-2xl text-blue-500"></i>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Memory Usage</dt>
                  <dd class="text-lg font-medium text-gray-900">${systemMetrics?.memory?.used || 0} MB</dd>
                  <dd class="text-xs text-gray-500">RSS: ${systemMetrics?.memory?.rss || 0} MB</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <i class="fas fa-clock text-2xl text-green-500"></i>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Uptime</dt>
                  <dd class="text-lg font-medium text-gray-900">${formatUptime(systemMetrics?.uptime || 0)}</dd>
                  <dd class="text-xs text-gray-500">${systemMetrics?.serviceMode || 'api'}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <i class="fab fa-node-js text-2xl text-green-500"></i>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Node Version</dt>
                  <dd class="text-lg font-medium text-gray-900">${systemMetrics?.nodeVersion || 'Unknown'}</dd>
                  <dd class="text-xs text-gray-500">${systemMetrics?.platform || 'Unknown'}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <i class="fas fa-sync-alt text-2xl text-blue-500"></i>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Last Updated</dt>
                  <dd class="text-lg font-medium text-gray-900">${new Date().toLocaleTimeString()}</dd>
                  <dd class="text-xs text-gray-500">Auto-refresh: 30s</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
}
