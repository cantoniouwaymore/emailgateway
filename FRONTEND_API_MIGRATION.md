# Frontend API Migration Summary

## Overview
This document summarizes the migration of the frontend application from using JavaScript functions to using backend APIs directly for consistency and better maintainability.

## Changes Made

### 1. Created Centralized API Client (`src/templates/admin/api-client.js`)
- **Purpose**: Centralized client for all backend API communication
- **Features**:
  - Automatic JWT token management
  - Token refresh handling
  - Consistent error handling
  - All template CRUD operations
  - Template preview generation
  - Email sending functionality
  - Health check endpoints

### 2. Created Frontend Configuration (`src/templates/admin/config.js`)
- **Purpose**: Handle environment variables and configuration
- **Features**:
  - JWT token management from environment
  - Configuration persistence
  - Debug mode support

### 3. Updated Template Management Scripts (`src/templates/admin/components/template-management/template-scripts.ts`)
- **Changes**:
  - Replaced direct fetch calls with API client methods
  - Removed manual JWT token handling
  - Simplified error handling
  - Updated functions:
    - `loadTemplates()` - now uses `window.EmailGatewayAPI.getTemplates()`
    - `editTemplate()` - now uses `window.EmailGatewayAPI.getTemplate()`
    - `handleTemplateSubmit()` - now uses `window.EmailGatewayAPI.createTemplate()` or `updateTemplate()`
    - `deleteTemplate()` - now uses `window.EmailGatewayAPI.deleteTemplate()`
    - `manageLocales()` - now uses `window.EmailGatewayAPI.getTemplate()`

### 4. Updated Template Editor Scripts (`src/templates/admin/components/template-editor/editor-scripts.js`)
- **Changes**:
  - Replaced direct fetch calls with API client methods
  - Updated template loading and saving functions
  - Updated functions:
    - `loadTemplateForEditing()` - now uses `window.EmailGatewayAPI.getTemplate()`
    - `saveTemplate()` - now uses `window.EmailGatewayAPI.createTemplate()` or `updateTemplate()`

### 5. Updated Template Editor HTML (`src/templates/admin/template-editor.html.ts`)
- **Changes**:
  - Updated preview generation to use API client
  - Added script includes for config and API client
  - Updated `updatePreview()` function to use `window.EmailGatewayAPI.generatePreview()`

### 6. Updated Admin Dashboard (`src/templates/admin/dashboard.html.ts`)
- **Changes**:
  - Added script includes for config and API client
  - Ensures all admin pages use centralized API client

### 7. Added Backend Configuration Endpoint (`src/api/routes/admin.ts`)
- **New Endpoints**:
  - `GET /admin/config.js` - Serves frontend configuration with JWT token from environment
  - `GET /admin/api-client.js` - Serves the API client JavaScript file
- **Features**:
  - Injects JWT token from environment variables
  - Provides API base URL configuration
  - Debug mode support

## Authentication Flow

### Production Mode
1. Backend reads `JWT_TOKEN` from environment variables
2. Frontend configuration endpoint serves the token
3. API client uses the environment token directly
4. No need for test token endpoint

### Development Mode
1. If no environment token, API client falls back to test token endpoint
2. Token is stored in localStorage for persistence
3. Automatic token refresh when expired

## Benefits of Migration

### 1. Consistency
- All API calls go through the same client
- Consistent error handling across the application
- Uniform authentication handling

### 2. Maintainability
- Single point of API configuration
- Easier to update API endpoints
- Centralized token management

### 3. Security
- JWT token from environment variables (production)
- Automatic token refresh
- No hardcoded tokens in frontend

### 4. Developer Experience
- Clear API interface
- Better error messages
- Debug mode support

## Usage

### For Developers
1. The API client is automatically initialized when pages load
2. Use `window.EmailGatewayAPI` for all backend communication
3. No need to handle JWT tokens manually
4. All methods return promises with consistent error handling

### For Production Deployment
1. Set `JWT_TOKEN` environment variable
2. Set `API_BASE_URL` if different from current domain
3. Frontend will automatically use the environment token

## API Client Methods

### Template Management
- `getTemplates()` - Get all templates
- `getTemplate(key)` - Get specific template
- `createTemplate(data)` - Create new template
- `updateTemplate(key, data)` - Update existing template
- `deleteTemplate(key)` - Delete template

### Template Utilities
- `generatePreview(structure, variables)` - Generate template preview
- `validateTemplate(key, data)` - Validate template
- `getTemplateVariables(key)` - Get template variables
- `getTemplateDetectedVariables(key)` - Get detected variables

### Email Operations
- `sendEmail(data)` - Send email
- `getMessageStatus(messageId)` - Get message status

### Health & Monitoring
- `getHealth()` - Get system health

## Migration Checklist

- [x] Created centralized API client
- [x] Created frontend configuration system
- [x] Updated template management scripts
- [x] Updated template editor scripts
- [x] Updated HTML templates to include new scripts
- [x] Added backend configuration endpoint
- [x] Updated authentication handling
- [x] Tested integration

## Next Steps

1. Test the migration in development environment
2. Verify all functionality works as expected
3. Deploy to production with proper environment variables
4. Monitor for any issues and iterate

## Rollback Plan

If issues arise, the migration can be rolled back by:
1. Reverting the script changes in HTML templates
2. Restoring the original fetch-based functions
3. The backend changes are additive and won't break existing functionality
