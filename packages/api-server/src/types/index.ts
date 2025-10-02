/**
 * Centralized type exports
 * 
 * Import all types from this file for convenience:
 * import { TemplateRenderOptions, ApiErrorResponse } from '@/types';
 * 
 * This file now re-exports from the shared-types package to ensure
 * consistency between frontend and backend.
 */

// Re-export shared types from the workspace package
// Using relative path to the correct shared-types location
export * from './shared';

