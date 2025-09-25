# Railway Deployment Guide

This guide explains how to deploy the Email Gateway to Railway with separate API and Worker services.

## Architecture Overview

The Email Gateway is deployed as two separate Railway services:

1. **API Service** (`email-gateway-api`) - Handles HTTP requests and queues emails
2. **Worker Service** (`email-gateway-worker`) - Processes the email queue

Both services share the same codebase but run different entry points.

## Prerequisites

1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login to Railway:
   ```bash
   railway login
   ```

3. Ensure you have your Routee credentials ready.

## Deployment Options

### Option 1: Deploy Both Services (Recommended)

Deploy both API and Worker services:

```bash
# Deploy API service
./deploy-api.sh

# Deploy Worker service
./deploy-worker.sh
```

### Option 2: Deploy Services Individually

If you want to deploy services one at a time:

```bash
# Deploy only API service
./deploy-api.sh

# Deploy only Worker service
./deploy-worker.sh
```

## Service Configuration

### API Service Configuration

The API service is configured with:
- **Service Name**: `email-gateway-api`
- **Start Command**: `npm run start:api`
- **Health Check**: `/healthz`
- **Port**: 3000
- **Environment Variables**:
  - `SERVICE_MODE=api`
  - `NODE_ENV=production`
  - `LOG_LEVEL=info`
  - `PORT=3000`
  - `HOST=0.0.0.0`
  - `RATE_GLOBAL_RPS=1000`
  - `RATE_TENANT_DEFAULT_RPS=100`

### Worker Service Configuration

The Worker service is configured with:
- **Service Name**: `email-gateway-worker`
- **Start Command**: `npm run start:worker`
- **Health Check**: `/healthz`
- **Port**: 3000
- **Environment Variables**:
  - `SERVICE_MODE=worker`
  - `NODE_ENV=production`
  - `LOG_LEVEL=info`
  - `PORT=3000`
  - `HOST=0.0.0.0`
  - `WORKER_CONCURRENCY=5`

## Infrastructure Setup

Both services will automatically get:
- **PostgreSQL Database** - For storing messages and templates
- **Redis** - For the email queue
- **Environment Variables** - For email provider configuration

## Environment Variables

### Required Variables

Both services need these variables set:

```bash
# Database
DATABASE_URL=postgresql://...

# Redis
REDIS_URL=redis://...

# Email Provider (Routee)
PROVIDERS_ENABLED=routee
ROUTEE_CLIENT_ID=your_client_id
ROUTEE_CLIENT_SECRET=your_client_secret
ROUTEE_BASE_URL=https://connect.routee.net

# JWT Authentication
JWT_SECRET=your_jwt_secret
JWT_ISSUER=email-gateway
JWT_AUDIENCE=waymore-platform
```

### Service-Specific Variables

**API Service Only:**
```bash
SERVICE_MODE=api
RATE_GLOBAL_RPS=1000
RATE_TENANT_DEFAULT_RPS=100
```

**Worker Service Only:**
```bash
SERVICE_MODE=worker
WORKER_CONCURRENCY=5
```

## Railway Configuration Files

The project includes separate Railway configuration files:

- `railway-api.toml` - Configuration for API service
- `railway-worker.toml` - Configuration for Worker service

These files specify the start commands and health check paths for each service.

## Monitoring and Logs

### View Logs

```bash
# API service logs
railway logs --service email-gateway-api

# Worker service logs
railway logs --service email-gateway-worker
```

### Health Checks

Both services expose health check endpoints:
- **API Service**: `https://your-api-domain.railway.app/healthz`
- **Worker Service**: `https://your-worker-domain.railway.app/healthz`

### Monitoring

- **API Service**: Monitor HTTP requests, response times, and error rates
- **Worker Service**: Monitor queue processing, job completion rates, and failures

## Testing the Deployment

### Test API Service

1. Get your API domain:
   ```bash
   railway domain --service email-gateway-api
   ```

2. Test health check:
   ```bash
   curl https://your-api-domain.railway.app/healthz
   ```

3. Get a test token (development only):
   ```bash
   curl https://your-api-domain.railway.app/test-token
   ```

4. Send a test email:
   ```bash
   curl -X POST https://your-api-domain.railway.app/api/v1/emails \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "templateKey": "welcome",
       "to": "test@example.com",
       "variables": {"name": "John"}
     }'
   ```

### Test Worker Service

1. Check worker logs:
   ```bash
   railway logs --service email-gateway-worker
   ```

2. Look for email processing logs when you send emails through the API.

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Ensure PostgreSQL is added to both services
   - Check `DATABASE_URL` environment variable

2. **Redis Connection Issues**
   - Ensure Redis is added to both services
   - Check `REDIS_URL` environment variable

3. **Worker Not Processing Jobs**
   - Check worker logs for errors
   - Ensure both services can access the same Redis instance
   - Verify `WORKER_CONCURRENCY` setting

4. **API Service Not Starting**
   - Check API logs for startup errors
   - Verify all required environment variables are set
   - Ensure database migrations are running

### Debug Commands

```bash
# Check service status
railway status --service email-gateway-api
railway status --service email-gateway-worker

# View environment variables
railway variables --service email-gateway-api
railway variables --service email-gateway-worker

# Check service logs
railway logs --service email-gateway-api --tail
railway logs --service email-gateway-worker --tail
```

## Scaling

### API Service Scaling

The API service can be scaled horizontally by increasing the number of instances in Railway.

### Worker Service Scaling

The Worker service can be scaled by:
1. Increasing the number of instances
2. Adjusting `WORKER_CONCURRENCY` environment variable
3. Monitoring queue depth and processing rates

## Security Considerations

1. **JWT Secrets**: Use strong, unique JWT secrets for each service
2. **Database Access**: Both services need database access but with appropriate permissions
3. **Redis Access**: Both services need Redis access for queue communication
4. **Environment Variables**: Keep sensitive data in Railway's environment variables

## Maintenance

### Database Migrations

Migrations are automatically run during service startup. For manual migrations:

```bash
# Run migrations on API service
railway run --service email-gateway-api npx prisma migrate deploy

# Run migrations on Worker service
railway run --service email-gateway-worker npx prisma migrate deploy
```

### Updates

To update the services:

1. Push changes to your repository
2. Railway will automatically rebuild and redeploy both services
3. Monitor logs during deployment to ensure successful startup

## Support

For issues or questions:
1. Check the logs for both services
2. Verify environment variables are set correctly
3. Ensure both services can communicate with shared infrastructure
4. Review the Railway documentation for platform-specific issues
