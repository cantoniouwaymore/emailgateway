# Cleanup & Maintenance

This guide covers data cleanup and maintenance procedures to keep your Internal Waymore Email Notification System system running smoothly.

## Overview

The Internal Waymore Email Notification System system includes automated cleanup processes to maintain optimal performance and storage efficiency. This guide explains how these processes work and how to configure them.

## Cleanup Processes

### Message Cleanup

Old messages are automatically cleaned up based on configurable retention policies:

- **Default Retention**: 30 days
- **Configurable**: Set via environment variables
- **Automated**: Runs daily via scheduled jobs

### Log Cleanup

System logs are cleaned up to prevent disk space issues:

- **Application Logs**: 7 days retention
- **Error Logs**: 30 days retention
- **Access Logs**: 14 days retention

### Queue Cleanup

Failed and completed jobs are cleaned up from the queue:

- **Completed Jobs**: 24 hours
- **Failed Jobs**: 7 days (for retry analysis)
- **Dead Letter Queue**: 30 days

## Configuration

### Environment Variables

```env
# Message retention (in days)
MESSAGE_RETENTION_DAYS=30

# Log retention (in days)
LOG_RETENTION_DAYS=7
ERROR_LOG_RETENTION_DAYS=30
ACCESS_LOG_RETENTION_DAYS=14

# Queue cleanup (in hours)
QUEUE_CLEANUP_HOURS=24
FAILED_QUEUE_CLEANUP_DAYS=7
```

### Manual Cleanup

You can trigger manual cleanup processes:

```bash
# Clean up old messages
npm run cleanup:messages

# Clean up logs
npm run cleanup:logs

# Clean up queue
npm run cleanup:queue

# Full cleanup
npm run cleanup:all
```

## Monitoring

### Health Checks

The system includes health checks for cleanup processes:

```bash
# Check cleanup status
curl http://localhost:3000/health/cleanup
```

### Metrics

Cleanup metrics are available via the metrics endpoint:

```bash
# Get cleanup metrics
curl http://localhost:3000/metrics
```

## Best Practices

### Retention Policies

1. **Messages**: Keep for 30-90 days depending on compliance requirements
2. **Logs**: Keep error logs longer than access logs
3. **Queue**: Clean up completed jobs quickly to maintain performance

### Monitoring

1. **Disk Space**: Monitor disk usage regularly
2. **Performance**: Watch for cleanup process performance
3. **Errors**: Monitor cleanup process errors

### Backup

Before major cleanup operations:

1. **Database Backup**: Ensure recent database backup
2. **Log Backup**: Archive important logs
3. **Configuration Backup**: Save current configuration

## Troubleshooting

### Common Issues

**Cleanup Not Running**
- Check cron jobs or scheduled tasks
- Verify environment variables
- Check process logs

**Disk Space Issues**
- Reduce retention periods
- Run manual cleanup
- Check for stuck processes

**Performance Issues**
- Optimize cleanup queries
- Run cleanup during off-peak hours
- Consider partitioning large tables

### Logs

Check cleanup process logs:

```bash
# Application logs
tail -f logs/app.log | grep cleanup

# Error logs
tail -f logs/error.log | grep cleanup

# Worker logs
tail -f logs/worker.log | grep cleanup
```

## Advanced Configuration

### Custom Cleanup Scripts

You can create custom cleanup scripts:

```javascript
// custom-cleanup.js
const { cleanupMessages, cleanupLogs } = require('./src/cleanup');

async function customCleanup() {
  // Custom cleanup logic
  await cleanupMessages({ olderThan: '7d' });
  await cleanupLogs({ olderThan: '3d' });
}

customCleanup();
```

### Scheduled Cleanup

Set up custom cleanup schedules:

```bash
# Add to crontab
0 2 * * * /path/to/emailgateway/cleanup.sh
```

## Support

For questions about cleanup and maintenance:

- 📖 [Full Documentation](/)
- 🔧 [API Reference](/api/)
- 💬 [GitHub Issues](https://github.com/cantoniouwaymore/emailgateway/issues)
- 📧 [Support](mailto:cantoni@waymore.io)
