---
prev: '/guides/architecture'
next: '/guides/developer'
---

# Waymore Transactional Emails Service Deployment Guide

## Overview

This guide covers deploying the Waymore Transactional Emails Service **monorepo** containing multiple microservices in various environments, from local development to production Kubernetes clusters.

## Monorepo Services

The deployment includes the following services:

| Service | Port | Purpose | Dependencies |
|---------|------|---------|--------------|
| **API Server** | 3000 | HTTP API, admin dashboard, template management | PostgreSQL, Redis, Shared Types |
| **Email Worker** | 3001 | Background processing, email sending | Redis, Shared Types |
| **Admin UI** | 5173 | React frontend, template editor, monitoring | API Server, Shared Types |
| **Cleanup Worker** | - | Database maintenance, scheduled cleanup | PostgreSQL, Shared Types |
| **Shared Types** | - | TypeScript definitions | None |

## Prerequisites

### System Requirements
- **Node.js**: 20+ (LTS recommended)
- **Memory**: 512MB minimum, 1GB recommended
- **CPU**: 1 core minimum, 2 cores recommended
- **Storage**: 10GB for logs and temporary files

### External Dependencies
- **PostgreSQL**: 15+ with connection pooling
- **Redis**: 7+ for queue management
- **Load Balancer**: For production deployments

## Environment Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment (development/production) | Yes | `development` |
| `PORT` | Server port | No | `3000` |
| `HOST` | Server host | No | `0.0.0.0` |
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `REDIS_URL` | Redis connection string | Yes | - |
| `JWT_SECRET` | JWT signing secret | Yes | - |
| `JWT_ISSUER` | JWT issuer | No | `email-gateway` |
| `JWT_AUDIENCE` | JWT audience | No | `waymore-platform` |
| `PROVIDERS_ENABLED` | Enabled providers (comma-separated) | No | `routee` |
| `ROUTEE_CLIENT_ID` | Routee OAuth Client ID | Conditional* | - |
| `ROUTEE_CLIENT_SECRET` | Routee OAuth Client Secret | Conditional* | - |
| `ROUTEE_BASE_URL` | Routee API Base URL | No | `https://connect.routee.net` |
| `SES_ACCESS_KEY` | AWS SES access key | Conditional* | - |
| `SES_SECRET_KEY` | AWS SES secret key | Conditional* | - |
| `SES_REGION` | AWS SES region | Conditional* | `us-east-1` |
| `SENDGRID_API_KEY` | SendGrid API key | Conditional* | - |
| `RATE_GLOBAL_RPS` | Global rate limit (requests/second) | No | `200` |
| `RATE_TENANT_DEFAULT_RPS` | Per-tenant rate limit | No | `20` |
| `LOG_LEVEL` | Logging level (debug/info/warn/error) | No | `info` |
| `WORKER_CONCURRENCY` | Worker concurrency (parallel jobs) | No | `5` |
| `TIMEOUT_SEND_MS` | Email send timeout (milliseconds) | No | `10000` |
| `RETRY_MAX` | Maximum retry attempts | No | `6` |
| `WEBHOOK_BASE_URL` | Base URL for webhooks | No | `http://localhost:3000` |
| `ROUTEE_WEBHOOK_SECRET` | Webhook signature secret | No | - |
| `CLEANUP_ENABLED` | Enable automatic cleanup | No | `true` |
| `CLEANUP_INTERVAL_HOURS` | Cleanup interval (hours) | No | `24` |
| `USE_DATABASE_TEMPLATES` | Use database-stored templates | No | `true` |
| `TEMPLATE_FALLBACK_TO_FILES` | Fallback to file templates if DB fails | No | `false` (prod), `true` (dev) |
| `TEMPLATE_VALIDATION_ENABLED` | Enable template validation | No | `true` |
| `DEFAULT_FROM_EMAIL` | Default sender email | No | `marketing@waymore.io` |
| `DEFAULT_FROM_NAME` | Default sender name | No | `Waymore` |

\* Required if the corresponding provider is enabled in `PROVIDERS_ENABLED`

### Production Environment File

```bash
# .env.production
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Database (PostgreSQL 15+)
DATABASE_URL=postgresql://user:password@postgres-cluster:5432/emailgateway?sslmode=require&connection_limit=20

# Redis (7+)
REDIS_URL=redis://redis-cluster:6379?maxRetriesPerRequest=3

# JWT Authentication
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_ISSUER=email-gateway
JWT_AUDIENCE=waymore-platform

# Email Providers
PROVIDERS_ENABLED=routee,ses

# Routee Configuration (OAuth 2.0)
ROUTEE_CLIENT_ID=your-routee-client-id
ROUTEE_CLIENT_SECRET=your-routee-client-secret
ROUTEE_BASE_URL=https://connect.routee.net

# AWS SES Configuration
SES_ACCESS_KEY=your-ses-access-key
SES_SECRET_KEY=your-ses-secret-key
SES_REGION=us-east-1

# SendGrid Configuration (optional)
# SENDGRID_API_KEY=your-sendgrid-api-key

# Rate Limiting
RATE_GLOBAL_RPS=1000
RATE_TENANT_DEFAULT_RPS=100

# Timeouts and Retries
TIMEOUT_SEND_MS=10000
RETRY_MAX=6

# Webhook Configuration
WEBHOOK_BASE_URL=https://your-domain.com
ROUTEE_WEBHOOK_SECRET=your-webhook-secret

# Monitoring and Logging
LOG_LEVEL=info
WORKER_CONCURRENCY=10

# Database Cleanup (automatic data retention)
CLEANUP_ENABLED=true
CLEANUP_INTERVAL_HOURS=24
CLEANUP_DRY_RUN_FIRST=false
CLEANUP_MAX_RETRIES=3
CLEANUP_RETRY_DELAY_MS=30000
CLEANUP_MODE=scheduler
CLEANUP_DRY_RUN=false

# Template System
USE_DATABASE_TEMPLATES=true
TEMPLATE_FALLBACK_TO_FILES=false  # Strict mode: fail if template not in DB (recommended for production)
TEMPLATE_VALIDATION_ENABLED=true

# Default Email Settings
DEFAULT_FROM_EMAIL=marketing@waymore.io
DEFAULT_FROM_NAME=Waymore
```

## Local Development

### Quick Start
```bash
# Clone repository
git clone https://github.com/cantoniouwaymore/emailgateway.git
cd emailgateway

# Install dependencies
npm install

# Install services (macOS/Linux)
./install-services.sh

# Setup environment
cp env.example .env
# Edit .env with your configuration

# Run database migrations
npm run migrate

# Start development servers (REQUIRED: Both processes must run)
# Terminal 1 - API Server (handles HTTP requests, queues emails)
npm run dev:api

# Terminal 2 - Worker Process (processes queued emails, sends via providers)
npm run dev:worker
```

**⚠️ IMPORTANT**: The Internal Waymore Email Notification System requires **TWO processes** to function:
1. **API Server** - Receives HTTP requests and queues emails
2. **Worker Process** - Processes queued emails and sends them via providers

Both processes must be running for emails to be sent successfully.

### Docker Compose (Recommended)
```bash
# Start all services (PostgreSQL, Redis, API, Worker)
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f emailgateway-api
docker-compose logs -f emailgateway-worker

# Stop services
docker-compose down
```

**Note**: The docker-compose.yml file automatically:
- Starts PostgreSQL 15 with health checks
- Starts Redis 7 with persistence
- Runs database migrations on API startup
- Starts both API server (port 3000) and Worker (port 3001)
- Configures proper service dependencies
- Sets up persistent volumes for data

## Staging Deployment

### Docker Deployment
```bash
# Build image
docker build -t email-gateway:staging .

# Run API server
docker run -d \
  --name email-gateway-api-staging \
  --env-file .env.staging \
  -p 3000:3000 \
  email-gateway:staging \
  npm run start:api

# Run worker (on different port)
docker run -d \
  --name email-gateway-worker-staging \
  --env-file .env.staging \
  -e PORT=3001 \
  -p 3001:3001 \
  email-gateway:staging \
  npm run start:worker

# Run cleanup worker (optional, for data retention)
docker run -d \
  --name email-gateway-cleanup-staging \
  --env-file .env.staging \
  email-gateway:staging \
  npm run start:cleanup
```

### Docker Compose (Staging)
```yaml
# docker-compose.staging.yml
version: '3.8'
services:
  email-gateway:
    image: email-gateway:staging
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=staging
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  email-worker:
    image: email-gateway:staging
    command: npm run worker
    environment:
      - NODE_ENV=staging
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: emailgateway
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    restart: unless-stopped

volumes:
  postgres_data:
```

## Production Deployment

### Kubernetes Deployment

#### Namespace
```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: email-gateway
```

#### ConfigMap
```yaml
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: email-gateway-config
  namespace: email-gateway
data:
  NODE_ENV: "production"
  PORT: "3000"
  HOST: "0.0.0.0"
  JWT_ISSUER: "email-gateway"
  JWT_AUDIENCE: "waymore-platform"
  PROVIDERS_ENABLED: "routee,ses"
  RATE_GLOBAL_RPS: "1000"
  RATE_TENANT_DEFAULT_RPS: "100"
  LOG_LEVEL: "info"
  WORKER_CONCURRENCY: "10"
```

#### Secrets
```yaml
# k8s/secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  name: email-gateway-secrets
  namespace: email-gateway
type: Opaque
data:
  DATABASE_URL: <base64-encoded-database-url>
  REDIS_URL: <base64-encoded-redis-url>
  JWT_SECRET: <base64-encoded-jwt-secret>
  ROUTEE_CLIENT_ID: <base64-encoded-routee-client-id>
  ROUTEE_CLIENT_SECRET: <base64-encoded-routee-client-secret>
  SES_ACCESS_KEY: <base64-encoded-ses-access-key>
  SES_SECRET_KEY: <base64-encoded-ses-secret-key>
```

#### API Server Deployment
```yaml
# k8s/api-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: email-gateway-api
  namespace: email-gateway
spec:
  replicas: 3
  selector:
    matchLabels:
      app: email-gateway-api
  template:
    metadata:
      labels:
        app: email-gateway-api
    spec:
      containers:
      - name: email-gateway
        image: email-gateway:latest
        ports:
        - containerPort: 3000
        envFrom:
        - configMapRef:
            name: email-gateway-config
        - secretRef:
            name: email-gateway-secrets
        livenessProbe:
          httpGet:
            path: /healthz
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /readyz
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
```

#### Worker Deployment
```yaml
# k8s/worker-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: email-gateway-worker
  namespace: email-gateway
spec:
  replicas: 2
  selector:
    matchLabels:
      app: email-gateway-worker
  template:
    metadata:
      labels:
        app: email-gateway-worker
    spec:
      containers:
      - name: email-worker
        image: email-gateway:latest
        command: ["npm", "run", "start:worker"]
        env:
        - name: PORT
          value: "3001"
        envFrom:
        - configMapRef:
            name: email-gateway-config
        - secretRef:
            name: email-gateway-secrets
        livenessProbe:
          httpGet:
            path: /healthz
            port: 3001
          initialDelaySeconds: 30
          periodSeconds: 10
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
```

#### Cleanup Worker Deployment (Optional)
```yaml
# k8s/cleanup-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: email-gateway-cleanup
  namespace: email-gateway
spec:
  replicas: 1
  selector:
    matchLabels:
      app: email-gateway-cleanup
  template:
    metadata:
      labels:
        app: email-gateway-cleanup
    spec:
      containers:
      - name: cleanup-worker
        image: email-gateway:latest
        command: ["npm", "run", "start:cleanup"]
        envFrom:
        - configMapRef:
            name: email-gateway-config
        - secretRef:
            name: email-gateway-secrets
        resources:
          requests:
            memory: "256Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "250m"
```

#### Service
```yaml
# k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: email-gateway-service
  namespace: email-gateway
spec:
  selector:
    app: email-gateway-api
  ports:
  - port: 80
    targetPort: 3000
  type: ClusterIP
```

#### Ingress
```yaml
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: email-gateway-ingress
  namespace: email-gateway
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/rate-limit: "1000"
    nginx.ingress.kubernetes.io/rate-limit-window: "1m"
spec:
  tls:
  - hosts:
    - api.email.waymore.io
    secretName: email-gateway-tls
  rules:
  - host: api.email.waymore.io
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: email-gateway-service
            port:
              number: 80
```

### Deploy to Kubernetes
```bash
# Apply all resources
kubectl apply -f k8s/

# Check deployment status
kubectl get pods -n email-gateway
kubectl get services -n email-gateway
kubectl get ingress -n email-gateway

# View logs
kubectl logs -f deployment/email-gateway-api -n email-gateway
kubectl logs -f deployment/email-gateway-worker -n email-gateway
```

## Database Setup

### PostgreSQL Configuration

#### Production Settings
```sql
-- Connection pooling
ALTER SYSTEM SET max_connections = 200;
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';

-- Performance tuning
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;

-- Apply changes
SELECT pg_reload_conf();
```

#### Required Extensions
```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

#### Database Migration
```bash
# Run migrations
npm run migrate

# Verify schema
psql $DATABASE_URL -c "\dt"
psql $DATABASE_URL -c "\d messages"
psql $DATABASE_URL -c "\d idempotency_keys"
```

### Redis Configuration

#### Production Settings
```bash
# redis.conf
maxmemory 512mb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
appendonly yes
appendfsync everysec
```

## Monitoring Setup

### Prometheus Configuration
```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
- job_name: 'email-gateway'
  static_configs:
  - targets: ['email-gateway-service:80']
  metrics_path: /metrics
  scrape_interval: 5s
```

### Grafana Dashboard
```json
{
  "dashboard": {
    "title": "Internal Waymore Email Notification System Dashboard",
    "panels": [
      {
        "title": "Emails Sent",
        "type": "stat",
        "targets": [
          {
            "expr": "rate(emails_sent_total[5m])"
          }
        ]
      },
      {
        "title": "Queue Depth",
        "type": "graph",
        "targets": [
          {
            "expr": "queue_depth"
          }
        ]
      },
      {
        "title": "Error Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(emails_failed_total[5m]) / rate(emails_accepted_total[5m])"
          }
        ]
      }
    ]
  }
}
```

## Health Checks

### Kubernetes Health Checks
```yaml
# Health check configuration
livenessProbe:
  httpGet:
    path: /healthz
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3

readinessProbe:
  httpGet:
    path: /readyz
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 5
  timeoutSeconds: 3
  failureThreshold: 3
```

### Load Balancer Health Checks
```bash
# HAProxy configuration
backend email-gateway-backend
    option httpchk GET /healthz
    http-check expect status 200
    server email-gateway-1 10.0.1.10:3000 check
    server email-gateway-2 10.0.1.11:3000 check
    server email-gateway-3 10.0.1.12:3000 check
```

## Security Considerations

### Network Security
- **TLS Termination**: Use load balancer or ingress controller
- **Internal Communication**: Use service mesh or VPN
- **Firewall Rules**: Restrict access to necessary ports only

### Application Security
- **JWT Secrets**: Use strong, random secrets
- **Database Credentials**: Rotate regularly
- **Provider API Keys**: Store securely, rotate regularly
- **Rate Limiting**: Configure appropriate limits

### Container Security
- **Base Images**: Use minimal, security-scanned images
- **Non-root User**: Run containers as non-root
- **Resource Limits**: Set appropriate CPU and memory limits
- **Security Context**: Configure PodSecurityPolicy

## Backup and Recovery

### Database Backup
```bash
# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backup_$DATE.sql
aws s3 cp backup_$DATE.sql s3://email-gateway-backups/
```

### Redis Backup
```bash
# Redis backup
redis-cli --rdb /backup/redis_$(date +%Y%m%d_%H%M%S).rdb
```

### Application State
- **Stateless Design**: No persistent application state
- **Configuration**: Store in ConfigMaps and Secrets
- **Logs**: Centralized logging with log aggregation

## Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check connection
psql $DATABASE_URL -c "SELECT 1"

# Check connection pool
npm run migrate

# View database logs
kubectl logs -f deployment/postgres
```

#### Redis Connection Issues
```bash
# Check Redis connection
redis-cli -u $REDIS_URL ping

# Check Redis memory
redis-cli -u $REDIS_URL info memory
```

#### High Memory Usage
```bash
# Check memory usage
kubectl top pods -n email-gateway

# Check for memory leaks
kubectl logs -f deployment/email-gateway-api | grep "heap"
```

#### Queue Backlog
```bash
# Check queue depth
curl http://localhost:3000/metrics | grep queue_depth

# Restart workers
kubectl rollout restart deployment/email-gateway-worker
```

#### Port Conflict Issues
```bash
# Error: listen EADDRINUSE: address already in use 0.0.0.0:3000
```

**Solution**: The worker process tries to start a health check server on port 3000, which conflicts with the API server. Start the worker with a different port:

```bash
# Use different port for worker health check
PORT=3001 npm run dev:worker

# Or set in environment
export PORT=3001
npm run dev:worker
```

**Verification**:
```bash
# Check API server is running on port 3000
curl http://localhost:3000/healthz

# Check worker health check on port 3001
curl http://localhost:3001/healthz
```

### Performance Tuning

#### Database Optimization
```sql
-- Add indexes for performance
CREATE INDEX CONCURRENTLY idx_messages_tenant_id ON messages(tenant_id);
CREATE INDEX CONCURRENTLY idx_messages_status ON messages(status);
CREATE INDEX CONCURRENTLY idx_messages_created_at ON messages(created_at);
CREATE INDEX CONCURRENTLY idx_idempotency_expires_at ON idempotency_keys(expires_at);
```

#### Redis Optimization
```bash
# Optimize Redis configuration
redis-cli CONFIG SET maxmemory-policy allkeys-lru
redis-cli CONFIG SET save "900 1 300 10 60 10000"
```

#### Application Optimization
```bash
# Increase worker concurrency
kubectl set env deployment/email-gateway-worker WORKER_CONCURRENCY=20

# Adjust rate limits
kubectl set env deployment/email-gateway-api RATE_GLOBAL_RPS=2000
```

## Deployment Checklist

### Pre-deployment
- [ ] Environment variables configured (see `.env.production` template)
- [ ] Database credentials and connection tested
- [ ] Redis instance available and accessible
- [ ] Email provider credentials (Routee/SES/SendGrid) verified
- [ ] SSL/TLS certificates obtained and configured
- [ ] JWT secret generated (minimum 32 characters)
- [ ] Webhook URL configured (for production domain)
- [ ] Database migrations reviewed
- [ ] Monitoring and alerting configured
- [ ] Backup strategy in place
- [ ] Firewall rules configured
- [ ] Load balancer configured (if applicable)

### Build and Test
- [ ] Code built successfully: `npm run build`
- [ ] TypeScript compilation successful
- [ ] All tests passing: `npm test`
- [ ] Linting passed: `npm run lint`
- [ ] Docker image built successfully
- [ ] Staging environment tested

### Deployment
- [ ] Deploy to staging first
- [ ] Run smoke tests on staging
- [ ] Verify API server starts correctly
- [ ] Verify worker starts correctly
- [ ] Test email sending on staging
- [ ] Check webhook delivery on staging
- [ ] Deploy to production
- [ ] Run database migrations: `npx prisma migrate deploy`
- [ ] Verify health checks pass
- [ ] Monitor metrics immediately after deployment
- [ ] Check logs for errors
- [ ] Verify no startup errors

### Post-deployment Verification
- [ ] API health endpoint responding: `GET /healthz`
- [ ] Worker health endpoint responding: `GET /healthz` (port 3001)
- [ ] Database connectivity verified
- [ ] Redis connectivity verified
- [ ] All API endpoints accessible
- [ ] Test email sent successfully
- [ ] Email delivered via provider
- [ ] Webhook received and processed
- [ ] Queue processing working
- [ ] Admin dashboard accessible
- [ ] Metrics endpoint working: `GET /metrics`
- [ ] Error rates normal (< 1%)
- [ ] Response times acceptable (< 500ms p95)
- [ ] Provider integration working
- [ ] Template rendering working
- [ ] Database cleanup scheduled (if enabled)

### Monitoring
- [ ] Set up alerts for:
  - [ ] API server downtime
  - [ ] Worker process downtime
  - [ ] High error rates (> 5%)
  - [ ] Queue backlog (> 1000 messages)
  - [ ] Database connection failures
  - [ ] Redis connection failures
  - [ ] High memory usage (> 80%)
  - [ ] High CPU usage (> 80%)
  - [ ] Slow response times (> 1s p95)

### Documentation
- [ ] Update deployment documentation
- [ ] Document environment variables
- [ ] Record deployment date and version
- [ ] Update runbook with any issues encountered
- [ ] Share deployment notes with team

## Production Startup Scripts

The application provides several startup scripts for different deployment scenarios:

### Available Scripts

| Script | Description | Use Case |
|--------|-------------|----------|
| `start-production.sh` | Starts both API and Worker | Single-server deployment |
| `start-api.sh` | Starts API server only | Multi-server deployment |
| `start-worker.sh` | Starts worker only | Multi-server deployment |
| `start-cleanup.sh` | Starts cleanup worker | Data retention management |
| `start-dev.sh` | Starts dev environment with ngrok | Local development |

### Single-Server Deployment
```bash
# Build the application
npm run build

# Start both API and Worker together
./start-production.sh
```

This script:
- Waits for database connectivity
- Runs database migrations
- Starts API server on port 3000
- Starts worker on port 3001
- Handles graceful shutdown

### Multi-Server Deployment
```bash
# Server 1 - API Server
npm run build
./start-api.sh

# Server 2 - Worker Process
npm run build
./start-worker.sh

# Server 3 - Cleanup Worker (optional)
npm run build
./start-cleanup.sh
```

### Verification Steps

After deployment, verify the system is working correctly:

```bash
# 1. Check API health
curl http://localhost:3000/healthz
# Expected: {"status":"ok"}

# 2. Check Worker health
curl http://localhost:3001/healthz
# Expected: {"status":"ok"}

# 3. Check detailed health status
curl http://localhost:3000/health
# Expected: JSON with database, redis, and provider status

# 4. Get test JWT token (development only)
curl http://localhost:3000/test-token
# Expected: {"token":"eyJ..."}

# 5. Test sending an email
curl -X POST http://localhost:3000/api/v1/emails \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: test-$(date +%s)" \
  -d '{
    "to": [{"email": "test@example.com", "name": "Test User"}],
    "from": {"email": "no-reply@waymore.io", "name": "Waymore"},
    "subject": "Test Email",
    "template": {"key": "transactional", "locale": "en"},
    "variables": {
      "workspace_name": "Waymore",
      "user_firstname": "Test",
      "email_title": "Test Email"
    }
  }'
# Expected: {"messageId":"msg_...","status":"queued"}

# 6. Check message status
curl http://localhost:3000/api/v1/messages/msg_abc123 \
  -H "Authorization: Bearer YOUR_TOKEN"
# Expected: Message details with status

# 7. View Prometheus metrics
curl http://localhost:3000/metrics
# Expected: Prometheus-formatted metrics

# 8. Access admin dashboard
# Open http://localhost:3000/admin in browser
```

## Support and Troubleshooting

### Getting Help
- **Documentation**: https://github.com/cantoniouwaymore/emailgateway/tree/main/docs
- **Issues**: https://github.com/cantoniouwaymore/emailgateway/issues
- **Support Email**: cantoniou@waymore.io

### Common Deployment Issues

#### Database Connection Timeout
**Error**: `Database is unavailable - sleeping`

**Solution**: 
- Verify PostgreSQL is running and accessible
- Check DATABASE_URL format and credentials
- Ensure network connectivity between services
- Increase connection timeout if needed

#### Redis Connection Failed
**Error**: `Redis connection failed`

**Solution**:
- Verify Redis is running: `redis-cli ping`
- Check REDIS_URL configuration
- Ensure Redis accepts connections from your IP
- Check firewall rules

#### Worker Not Processing Jobs
**Symptoms**: Emails stuck in QUEUED status

**Solution**:
- Verify worker process is running: `ps aux | grep worker`
- Check worker logs for errors
- Verify Redis connectivity
- Ensure PORT=3001 is set for worker
- Restart worker process

#### Port Conflict on Startup
**Error**: `EADDRINUSE: address already in use`

**Solution**:
- For worker, always set PORT=3001
- Check if another process is using the port: `lsof -i :3000`
- Kill conflicting process or use different port
- In Kubernetes, ensure proper port configuration

#### Migration Failures
**Error**: `Migration failed`

**Solution**:
- Check database credentials
- Verify database user has CREATE/ALTER permissions
- Run migrations manually: `npx prisma migrate deploy`
- Check migration files in `prisma/migrations/`

---

**Last Updated**: October 2025  
**Deployment Version**: 1.0.0  
**Repository**: https://github.com/cantoniouwaymore/emailgateway
