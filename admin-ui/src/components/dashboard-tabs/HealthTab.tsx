import { Card, CardContent } from '@/components/ui/card';
import { Heart, List, Send, AlertTriangle, Database, MemoryStick, Cpu, Mail, Activity, Clock, Server, RefreshCw } from 'lucide-react';

interface HealthTabProps {
  healthData: any;
  messagesData: any;
}

export function HealthTab({ healthData, messagesData }: HealthTabProps) {
  const stats = messagesData?.stats || [];
  const queueDepth = messagesData?.queueDepth || 0;
  const serviceHealth = messagesData?.serviceHealth || {};
  const systemMetrics = messagesData?.systemMetrics || {};

  const sentCount = stats.find((s: any) => s.status === 'SENT' || s.status === 'DELIVERED')?._count?.status || 0;
  const failedCount = stats.find((s: any) => s.status === 'FAILED')?._count?.status || 0;

  const formatUptime = (seconds: number): string => {
    if (!seconds) return '0s';
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m`;
    return `${seconds}s`;
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-600" />
          Key Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Heart className={`h-8 w-8 ${healthData?.status === 'healthy' ? 'text-green-500' : 'text-red-500'}`} />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">System Status</p>
                  <p className="text-lg font-semibold">{healthData?.status || 'Unknown'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <List className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Queue Depth</p>
                  <p className="text-lg font-semibold">{queueDepth}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Send className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sent Total</p>
                  <p className="text-lg font-semibold">{sentCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <AlertTriangle className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Failed Total</p>
                  <p className="text-lg font-semibold">{failedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Service Health */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Server className="h-5 w-5 text-blue-600" />
          Service Health
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Database className={`h-8 w-8 ${serviceHealth?.database?.healthy ? 'text-green-500' : 'text-red-500'}`} />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Database</p>
                  <p className="text-lg font-semibold">{serviceHealth?.database?.healthy ? 'Healthy' : 'Unhealthy'}</p>
                  <p className="text-xs text-muted-foreground">
                    {serviceHealth?.database?.latency ? `${serviceHealth.database.latency}ms` : ''}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <MemoryStick className={`h-8 w-8 ${serviceHealth?.redis?.healthy ? 'text-green-500' : 'text-red-500'}`} />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Redis</p>
                  <p className="text-lg font-semibold">{serviceHealth?.redis?.healthy ? 'Healthy' : 'Unhealthy'}</p>
                  <p className="text-xs text-muted-foreground">
                    {serviceHealth?.redis?.latency ? `${serviceHealth.redis.latency}ms` : ''}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Cpu className={`h-8 w-8 ${serviceHealth?.worker?.healthy ? 'text-green-500' : 'text-red-500'}`} />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Worker</p>
                  <p className="text-lg font-semibold">{serviceHealth?.worker?.healthy ? 'Healthy' : 'Unhealthy'}</p>
                  <p className="text-xs text-muted-foreground">
                    {serviceHealth?.worker?.details?.stuckMessages ? `${serviceHealth.worker.details.stuckMessages} stuck` : ''}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Mail className={`h-8 w-8 ${serviceHealth?.providers?.healthy ? 'text-green-500' : 'text-red-500'}`} />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Providers</p>
                  <p className="text-lg font-semibold">{serviceHealth?.providers?.healthy ? 'Healthy' : 'Unhealthy'}</p>
                  <p className="text-xs text-muted-foreground">
                    {Object.keys(serviceHealth?.providers?.details || {}).length} providers
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* System Metrics */}
      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-600" />
          System Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <MemoryStick className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Memory Usage</p>
                  <p className="text-lg font-semibold">{systemMetrics?.memory?.used || 0} MB</p>
                  <p className="text-xs text-muted-foreground">RSS: {systemMetrics?.memory?.rss || 0} MB</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Clock className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Uptime</p>
                  <p className="text-lg font-semibold">{formatUptime(systemMetrics?.uptime || 0)}</p>
                  <p className="text-xs text-muted-foreground">{systemMetrics?.serviceMode || 'api'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Server className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Node Version</p>
                  <p className="text-lg font-semibold">{systemMetrics?.nodeVersion || 'Unknown'}</p>
                  <p className="text-xs text-muted-foreground">{systemMetrics?.platform || 'Unknown'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <RefreshCw className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                  <p className="text-lg font-semibold">{new Date().toLocaleTimeString()}</p>
                  <p className="text-xs text-muted-foreground">Auto-refresh: 30s</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

