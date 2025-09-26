# Database Cleanup System

This document describes the automatic database cleanup system that removes old data to keep the service running smoothly.

## Overview

The cleanup system automatically removes database entries older than 2 months (60 days) to prevent the database from growing indefinitely. This helps maintain performance and reduces storage costs.

## What Gets Cleaned Up

The cleanup system removes data from three main tables:

### 1. Messages Table (`messages`)
- **Purpose**: Stores email message information and status tracking
- **Cleanup**: Removes messages older than 60 days based on `createdAt` timestamp
- **Impact**: Removes historical email sending records

### 2. Idempotency Keys Table (`idempotency_keys`)
- **Purpose**: Ensures exactly-once processing of requests
- **Cleanup**: Removes keys older than 60 days OR already expired based on `expiresAt` timestamp
- **Impact**: Removes old idempotency tracking data

### 3. Provider Events Table (`provider_events`)
- **Purpose**: Stores webhook events from email providers
- **Cleanup**: Removes events older than 60 days based on `createdAt` timestamp
- **Impact**: Removes historical webhook event data

## Configuration

### Environment Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `CLEANUP_ENABLED` | Enable/disable cleanup system | `true` | `true` |
| `CLEANUP_INTERVAL_HOURS` | How often to run cleanup (hours) | `24` | `24` |
| `CLEANUP_DRY_RUN_FIRST` | Run dry run before actual cleanup | `false` | `true` |
| `CLEANUP_MAX_RETRIES` | Maximum retry attempts on failure | `3` | `3` |
| `CLEANUP_RETRY_DELAY_MS` | Delay between retries (milliseconds) | `30000` | `30000` |
| `CLEANUP_MODE` | Run mode: `scheduler` or `once` | `scheduler` | `once` |
| `CLEANUP_DRY_RUN` | Run in dry-run mode (no actual deletion) | `false` | `true` |

### Example Configuration

```bash
# Enable cleanup with daily runs
CLEANUP_ENABLED=true
CLEANUP_INTERVAL_HOURS=24
CLEANUP_DRY_RUN_FIRST=false
CLEANUP_MAX_RETRIES=3
CLEANUP_RETRY_DELAY_MS=30000
CLEANUP_MODE=scheduler
CLEANUP_DRY_RUN=false
```

## Usage

### 1. Scheduled Cleanup (Recommended)

Run the cleanup worker as a background service that automatically cleans up data:

```bash
# Development
npm run dev:cleanup

# Production
npm run start:cleanup

# Or use the startup script
./start-cleanup.sh
```

### 2. One-Time Cleanup

Run cleanup once and exit:

```bash
# Run actual cleanup
npm run cleanup:once

# Run dry run (see what would be deleted)
npm run cleanup:dry-run
```

### 3. Manual Cleanup

You can also run cleanup programmatically:

```typescript
import { cleanupService } from './src/utils/cleanup';

// Run dry run
const dryRunResult = await cleanupService.dryRun();
console.log('Would delete:', dryRunResult);

// Run actual cleanup
const stats = await cleanupService.performCleanup();
console.log('Cleanup stats:', stats);
```

## Monitoring

### Logs

The cleanup system provides detailed logging:

```
[INFO] Starting database cleanup
[INFO] Database stats before cleanup: { totalMessages: 1000, totalIdempotencyKeys: 500, ... }
[INFO] Deleted expired messages batch: { deletedCount: 100, totalDeleted: 100, ... }
[INFO] Database cleanup completed successfully: { stats: { messagesDeleted: 100, ... } }
```

### Metrics

The cleanup system tracks:
- Number of records deleted per table
- Total execution time
- Retry attempts
- Success/failure rates

### Database Statistics

You can check current database statistics:

```typescript
import { cleanupService } from './src/utils/cleanup';

const stats = await cleanupService.getDatabaseStats();
console.log('Database stats:', stats);
```

## Safety Features

### 1. Batch Processing
- Processes records in batches to avoid memory issues
- Default batch size: 1000 records
- Configurable batch size

### 2. Retry Logic
- Automatic retry on failures
- Configurable retry attempts and delays
- Exponential backoff

### 3. Dry Run Mode
- Preview what would be deleted without actually deleting
- Safe testing of cleanup logic
- Detailed reporting

### 4. Graceful Shutdown
- Handles SIGTERM and SIGINT signals
- Completes current batch before stopping
- Proper resource cleanup

## Deployment

### Docker

Add to your `docker-compose.yml`:

```yaml
services:
  cleanup-worker:
    build: .
    command: npm run start:cleanup
    environment:
      - CLEANUP_ENABLED=true
      - CLEANUP_INTERVAL_HOURS=24
      - CLEANUP_MODE=scheduler
    depends_on:
      - postgres
      - redis
    restart: unless-stopped
```

### Railway

Deploy as a separate service:

```bash
# Set environment variables
railway variables set CLEANUP_ENABLED=true
railway variables set CLEANUP_INTERVAL_HOURS=24
railway variables set CLEANUP_MODE=scheduler

# Deploy cleanup worker
railway deploy --service cleanup-worker
```

### Kubernetes

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cleanup-worker
spec:
  replicas: 1
  selector:
    matchLabels:
      app: cleanup-worker
  template:
    metadata:
      labels:
        app: cleanup-worker
    spec:
      containers:
      - name: cleanup-worker
        image: your-image:latest
        command: ["npm", "run", "start:cleanup"]
        env:
        - name: CLEANUP_ENABLED
          value: "true"
        - name: CLEANUP_INTERVAL_HOURS
          value: "24"
        - name: CLEANUP_MODE
          value: "scheduler"
```

## Troubleshooting

### Common Issues

1. **Cleanup not running**
   - Check `CLEANUP_ENABLED` is set to `true`
   - Verify database connection
   - Check logs for errors

2. **High memory usage**
   - Reduce batch size in configuration
   - Monitor database performance
   - Consider running during off-peak hours

3. **Cleanup taking too long**
   - Increase batch size (if memory allows)
   - Run during low-traffic periods
   - Consider running more frequently with smaller batches

### Debug Mode

Enable debug logging:

```bash
LOG_LEVEL=debug npm run cleanup
```

### Manual Verification

Check what would be deleted:

```bash
npm run cleanup:dry-run
```

## Best Practices

1. **Start with Dry Run**: Always test with dry run first
2. **Monitor Performance**: Watch database performance during cleanup
3. **Schedule Appropriately**: Run during low-traffic periods
4. **Backup First**: Ensure you have backups before first cleanup
5. **Gradual Rollout**: Start with longer retention periods and reduce gradually

## Retention Period

The default retention period is **60 days (2 months)**. This can be configured by modifying the `DatabaseCleanupService` constructor:

```typescript
// Change retention to 30 days
const cleanupService = new DatabaseCleanupService(30, 1000);
```

## Performance Impact

- **Batch Processing**: Minimizes database load
- **Indexed Queries**: Uses existing indexes for efficient deletion
- **Parallel Operations**: Cleans up multiple tables simultaneously
- **Configurable Timing**: Can be scheduled during off-peak hours

The cleanup system is designed to have minimal impact on your application's performance while effectively managing database growth.
