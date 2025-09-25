# Railway Deployment Guide

## Overview

This guide covers deploying the Email Gateway microservice on Railway with both API server and worker processes.

## Architecture

Railway deployment requires **two separate services**:

1. **API Service** (`email-gateway-api`): Handles HTTP requests and queues emails
2. **Worker Service** (`email-gateway-worker`): Processes email queue and sends emails

## Prerequisites

- Railway account
- Railway CLI installed (`npm install -g @railway/cli`)
- GitHub repository connected to Railway

## Step 1: Create Railway Project

```bash
# Login to Railway
railway login

# Create new project
railway new

# Link to existing project (if you have one)
railway link
```

## Step 2: Deploy API Service

### 2.1 Create API Service

```bash
# Create the API service
railway service create email-gateway-api

# Set environment variables for API service
railway variables set NODE_ENV=production
railway variables set SERVICE_MODE=api
railway variables set PORT=3000
railway variables set HOST=0.0.0.0
```

### 2.2 Configure API Service Environment

```bash
# JWT Configuration
railway variables set JWT_SECRET=your-super-secure-jwt-secret-key-here
railway variables set JWT_ISSUER=email-gateway
railway variables set JWT_AUDIENCE=waymore-platform

# Email Providers
railway variables set PROVIDERS_ENABLED=routee
railway variables set ROUTEE_CLIENT_ID=your-routee-client-id
railway variables set ROUTEE_CLIENT_SECRET=your-routee-client-secret
railway variables set ROUTEE_BASE_URL=https://connect.routee.net

# Rate Limiting
railway variables set RATE_GLOBAL_RPS=1000
railway variables set RATE_TENANT_DEFAULT_RPS=100

# Logging
railway variables set LOG_LEVEL=info
```

### 2.3 Add Database and Redis

```bash
# Add PostgreSQL database
railway add postgresql

# Add Redis
railway add redis
```

### 2.4 Deploy API Service

```bash
# Deploy the API service
railway up
```

## Step 3: Deploy Worker Service

### 3.1 Create Worker Service

```bash
# Create the worker service
railway service create email-gateway-worker

# Set environment variables for worker service
railway variables set NODE_ENV=production
railway variables set SERVICE_MODE=worker
```

### 3.2 Configure Worker Service Environment

```bash
# Copy the same environment variables as API service
# (Railway will share the same database and Redis)

# Worker-specific configuration
railway variables set WORKER_CONCURRENCY=5
railway variables set LOG_LEVEL=info
```

### 3.3 Deploy Worker Service

```bash
# Deploy the worker service
railway up
```

## Step 4: Verify Deployment

### 4.1 Check API Service

```bash
# Get the API service URL
railway domain

# Test the API
curl https://your-api-domain.railway.app/healthz
curl https://your-api-domain.railway.app/health
```

### 4.2 Check Worker Service

```bash
# Check worker logs
railway logs --service email-gateway-worker

# The worker should show:
# "Email worker is ready"
# "Processing email job" (when emails are sent)
```

### 4.3 Test Email Sending

```bash
# Get a test token
curl https://your-api-domain.railway.app/test-token

# Send a test email
curl -X POST https://your-api-domain.railway.app/api/v1/emails \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "to": [{"email": "test@example.com", "name": "Test User"}],
    "from": {"email": "noreply@yourdomain.com", "name": "Your App"},
    "subject": "Test Email",
    "template": {"key": "notifications/universal", "locale": "en"},
    "variables": {
      "email_title": "Test Email",
      "user_name": "Test User"
    }
  }'
```

## Step 5: Monitor Services

### 5.1 View Logs

```bash
# API service logs
railway logs --service email-gateway-api

# Worker service logs
railway logs --service email-gateway-worker
```

### 5.2 Check Metrics

```bash
# Visit the metrics endpoint
curl https://your-api-domain.railway.app/metrics
```

### 5.3 Monitor Health

```bash
# Check API health
curl https://your-api-domain.railway.app/health

# Check readiness
curl https://your-api-domain.railway.app/readyz
```

## Environment Variables Reference

### Required Variables

| Variable | Description | API Service | Worker Service |
|----------|-------------|-------------|----------------|
| `NODE_ENV` | Environment | ✅ | ✅ |
| `SERVICE_MODE` | Service type | `api` | `worker` |
| `DATABASE_URL` | PostgreSQL URL | ✅ | ✅ |
| `REDIS_URL` | Redis URL | ✅ | ✅ |
| `JWT_SECRET` | JWT signing secret | ✅ | ❌ |
| `PROVIDERS_ENABLED` | Enabled providers | ✅ | ✅ |
| `ROUTEE_CLIENT_ID` | Routee client ID | ✅ | ✅ |
| `ROUTEE_CLIENT_SECRET` | Routee client secret | ✅ | ✅ |

### Optional Variables

| Variable | Description | Default | API Service | Worker Service |
|----------|-------------|---------|-------------|----------------|
| `PORT` | Server port | `3000` | ✅ | ❌ |
| `HOST` | Server host | `0.0.0.0` | ✅ | ❌ |
| `WORKER_CONCURRENCY` | Worker concurrency | `5` | ❌ | ✅ |
| `RATE_GLOBAL_RPS` | Global rate limit | `200` | ✅ | ❌ |
| `LOG_LEVEL` | Logging level | `info` | ✅ | ✅ |

## Troubleshooting

### Common Issues

#### 1. Worker Not Processing Emails

```bash
# Check worker logs
railway logs --service email-gateway-worker

# Look for:
# - "Email worker is ready"
# - "Processing email job"
# - Any error messages
```

#### 2. Database Connection Issues

```bash
# Check database connection
railway run --service email-gateway-api npx prisma db push

# Check if migrations ran
railway run --service email-gateway-api npx prisma migrate status
```

#### 3. Redis Connection Issues

```bash
# Check Redis connection
railway run --service email-gateway-api node -e "
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);
redis.ping().then(() => console.log('Redis connected')).catch(console.error);
"
```

#### 4. API Service Not Starting

```bash
# Check API logs
railway logs --service email-gateway-api

# Common issues:
# - Missing environment variables
# - Database connection issues
# - Port binding issues
```

### Debug Commands

```bash
# Connect to API service shell
railway run --service email-gateway-api

# Connect to worker service shell
railway run --service email-gateway-worker

# Check environment variables
railway variables

# Check service status
railway status
```

## Scaling

### Horizontal Scaling

```bash
# Scale API service
railway scale --service email-gateway-api --replicas 3

# Scale worker service
railway scale --service email-gateway-worker --replicas 2
```

### Vertical Scaling

```bash
# Increase resources for API service
railway scale --service email-gateway-api --memory 1Gi --cpu 1

# Increase resources for worker service
railway scale --service email-gateway-worker --memory 512Mi --cpu 0.5
```

## Security

### Environment Variables Security

- Use Railway's built-in secrets management
- Never commit secrets to version control
- Rotate secrets regularly
- Use strong, random JWT secrets

### Network Security

- Railway provides automatic HTTPS
- Use Railway's built-in domain management
- Configure CORS appropriately
- Set up rate limiting

## Monitoring

### Health Checks

Railway automatically monitors:
- HTTP health checks (`/healthz`)
- Container health
- Resource usage
- Log errors

### Custom Monitoring

```bash
# Set up monitoring endpoints
curl https://your-api-domain.railway.app/health
curl https://your-api-domain.railway.app/metrics
curl https://your-api-domain.railway.app/readyz
```

## Backup and Recovery

### Database Backups

Railway provides automatic PostgreSQL backups. You can also:

```bash
# Manual backup
railway run --service email-gateway-api pg_dump $DATABASE_URL > backup.sql

# Restore from backup
railway run --service email-gateway-api psql $DATABASE_URL < backup.sql
```

### Redis Persistence

Railway Redis includes persistence by default.

## Cost Optimization

### Resource Management

```bash
# Monitor resource usage
railway metrics

# Optimize based on usage:
# - API service: Lower CPU, higher memory
# - Worker service: Higher CPU, lower memory
```

### Scaling Strategy

- Start with minimal resources
- Scale based on actual usage
- Use Railway's auto-scaling features
- Monitor costs regularly

---

**Last Updated**: December 2024  
**Railway Version**: Latest  
**Deployment Version**: 1.0.0
