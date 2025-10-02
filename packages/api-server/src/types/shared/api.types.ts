/**
 * Shared API types for Email Gateway
 * 
 * These types are used across both frontend and backend for API
 * communication and data exchange.
 */

/**
 * API error response
 */
export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    traceId?: string;
  };
}

/**
 * API success response
 */
export interface ApiSuccessResponse<T = any> {
  data: T;
  message?: string;
}

/**
 * API paginated response
 */
export interface ApiPaginatedResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * API health check response
 */
export interface ApiHealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  services: {
    database: boolean;
    queue: boolean;
    provider: boolean;
  };
}
