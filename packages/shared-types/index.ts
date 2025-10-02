/**
 * Shared TypeScript types for Email Gateway
 * 
 * This package contains all shared types used by both frontend and backend
 * to ensure consistency and type safety across the application.
 */

// Re-export all template types
export * from './template.types';

// Re-export all admin types
export * from './admin.types';

// Re-export all API types
export * from './api.types';

// Re-export all email types
export * from './email.types';

// Frontend-specific types that extend backend types
export * from './frontend.types';
