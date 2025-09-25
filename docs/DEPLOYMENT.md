# Email Gateway Deployment Guide

## Overview

This guide covers deploying the Email Gateway microservice in various environments, from local development to production Kubernetes clusters.

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
| `NODE_ENV` | Environment | Yes | `development` |
| `PORT` | Server port | No | `3000` |
| `HOST` | Server host | No | `0.0.0.0` |
| `DATABASE_URL` | PostgreSQL connection | Yes | - |
| `REDIS_URL` | Redis connection | Yes | - |
| `JWT_SECRET` | JWT signing secret | Yes | - |
| `JWT_ISSUER` | JWT issuer | No | `email-gateway` |
| `JWT_AUDIENCE` | JWT audience | No | `waymore-platform` |
| `PROVIDERS_ENABLED` | Enabled providers | No | `routee` |
| `ROUTEE_API_KEY` | Routee API key | Conditional | - |
| `SES_ACCESS_KEY` | AWS SES access key | Conditional | - |
| `SES_SECRET_KEY` | AWS SES secret key | Conditional | - |
| `SENDGRID_API_KEY` | SendGrid API key | Conditional | - |
| `RATE_GLOBAL_RPS` | Global rate limit | No | `200` |
| `RATE_TENANT_DEFAULT_RPS` | Per-tenant rate limit | No | `100` |
| `LOG_LEVEL` | Logging level | No | `info` |
| `WORKER_CONCURRENCY` | Worker concurrency | No | `5` |

### Production Environment File

```bash
# .env.production
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Database
DATABASE_URL=postgresql://user:password@postgres-cluster:5432/emailgateway?sslmode=require&connection_limit=20

# Redis
REDIS_URL=redis://redis-cluster:6379?maxRetriesPerRequest=3

# JWT
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_ISSUER=email-gateway
JWT_AUDIENCE=waymore-platform

# Providers
PROVIDERS_ENABLED=routee,ses
ROUTEE_API_KEY=your-routee-api-key
SES_ACCESS_KEY=your-ses-access-key
SES_SECRET_KEY=your-ses-secret-key
SES_REGION=us-east-1

# Rate Limiting
RATE_GLOBAL_RPS=1000
RATE_TENANT_DEFAULT_RPS=100

# Monitoring
LOG_LEVEL=info
WORKER_CONCURRENCY=10
```

## Local Development

### Quick Start
```bash
# Clone repository
git clone <repository-url>
cd emailgateway

# Install dependencies
npm install

# Install services
./install-services.sh

# Setup environment
cp env.example .env

# Run migrations
npm run migrate

# Start development servers
npm run dev    # Terminal 1
npm run worker # Terminal 2
```

### Docker Compose
```bash
# Start all services
docker-compose up -d

# Run migrations
npm run migrate

# Start application
npm run dev
npm run worker
```

## Staging Deployment

### Docker Deployment
```bash
# Build image
docker build -t email-gateway:staging .

# Run with environment file
docker run -d \
  --name email-gateway-staging \
  --env-file .env.staging \
  -p 3000:3000 \
  email-gateway:staging

# Run worker
docker run -d \
  --name email-gateway-worker-staging \
  --env-file .env.staging \
  email-gateway:staging \
  npm run worker
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
  ROUTEE_API_KEY: <base64-encoded-routee-key>
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
        command: ["npm", "run", "worker"]
        envFrom:
        - configMapRef:
            name: email-gateway-config
        - secretRef:
            name: email-gateway-secrets
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
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
    "title": "Email Gateway Dashboard",
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
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Redis configuration verified
- [ ] SSL certificates valid
- [ ] Monitoring configured
- [ ] Backup strategy in place

### Deployment
- [ ] Deploy to staging first
- [ ] Run smoke tests
- [ ] Deploy to production
- [ ] Verify health checks
- [ ] Monitor metrics
- [ ] Check logs for errors

### Post-deployment
- [ ] Verify all endpoints working
- [ ] Check queue processing
- [ ] Monitor error rates
- [ ] Verify provider integration
- [ ] Test webhook delivery
- [ ] Update documentation

---

**Last Updated**: September 2024  
**Deployment Version**: 1.0.0
