/**
 * Common API types and response structures
 */

/**
 * Standard API error response
 */
export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
    traceId?: string;
  };
}

/**
 * Standard API success response
 */
export interface ApiSuccessResponse<T = unknown> {
  data?: T;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * API request context
 */
export interface ApiRequestContext {
  requestId: string;
  userId?: string;
  userEmail?: string;
  ip?: string;
  userAgent?: string;
  timestamp: Date;
}

/**
 * Health check response
 */
export interface HealthCheckResponse {
  status: 'ok' | 'error';
  timestamp: string;
  version?: string;
  services?: {
    [serviceName: string]: {
      status: 'healthy' | 'unhealthy';
      message?: string;
    };
  };
}

