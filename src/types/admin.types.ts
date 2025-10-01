/**
 * Admin dashboard and management types
 */

/**
 * Dashboard health check response
 */
export interface DashboardHealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  database: boolean;
  queue: boolean;
  provider: boolean;
  uptime: number;
  timestamp: string;
}

/**
 * Dashboard service health details
 */
export interface ServiceHealthDetails {
  api: {
    status: string;
    uptime: number;
  };
  database: {
    status: string;
    latency?: number;
  };
  queue: {
    status: string;
    depth: number;
  };
  provider: {
    status: string;
    name: string;
  };
}

/**
 * Dashboard system metrics
 */
export interface SystemMetrics {
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  cpu: {
    usage: number;
  };
  disk?: {
    used: number;
    total: number;
    percentage: number;
  };
}

/**
 * Message statistics
 */
export interface MessageStats {
  total: number;
  sent: number;
  failed: number;
  queued: number;
  delivered: number;
  bounced: number;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number;
  limit: number;
  total?: number;
  totalPages?: number;
}

/**
 * Search parameters
 */
export interface SearchParams extends PaginationParams {
  query?: string;
  filters?: Record<string, unknown>;
}

/**
 * Dashboard data structure
 */
export interface DashboardData {
  health: DashboardHealthCheck;
  serviceHealth: ServiceHealthDetails;
  systemMetrics: SystemMetrics;
  messageStats: MessageStats;
  recentMessages: any[];
  pagination: PaginationParams;
  recentWebhookEvents?: any[];
}

