# Routee Email Provider Integration

## Overview

The Email Gateway supports two implementations of the Routee email provider:

1. **Stub/Mock Implementation** (`routee.ts`) - For development and testing
2. **Real API Implementation** (`routee-real.ts`) - For production use with actual Routee API

## Routee API v.2 Integration

Based on the [Routee Email API v.2 documentation](https://docs.routee.net/reference/email-v2-authorization), the real implementation uses:

- **OAuth 2.0 Client Credentials** for authentication
- **RESTful API** for sending emails
- **Webhook support** for delivery notifications
- **Comprehensive error handling** with specific error codes

## Authentication

### OAuth 2.0 Flow

The Routee provider uses OAuth 2.0 client credentials grant type:

```typescript
// Authentication endpoint
POST https://auth.routee.net/oauth/token/

// Request body
{
  "grant_type": "client_credentials",
  "client_id": "your-client-id",
  "client_secret": "your-client-secret"
}

// Response
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

### Environment Configuration

```bash
# Required for real Routee implementation
ROUTEE_CLIENT_ID="your-routee-client-id"
ROUTEE_CLIENT_SECRET="your-routee-client-secret"
ROUTEE_BASE_URL="https://connect.routee.net"

# Sender Verification
ROUTEE_DEFAULT_SENDER="no-reply@yourdomain.com"
ROUTEE_AUTO_ADD_SENDERS="true"
ROUTEE_SENDER_VERIFICATION_TIMEOUT="30000"

# Optional: Legacy API key (for backward compatibility)
ROUTEE_API_KEY="your-routee-api-key"
```

## Email Sending

### API Endpoint

```
POST https://connect.routee.net/emails
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Request Format

Based on the [Routee Email API v.2 Request Fields Summary](https://docs.routee.net/reference/email-plus-request-fields-summary):

```typescript
interface RouteeEmailRequest {
  from: {
    name?: string;
    email: string;
  };
  to: Array<{
    name?: string;
    email: string;
  }>;
  cc?: Array<{
    name?: string;
    email: string;
  }>;
  bcc?: Array<{
    name?: string;
    email: string;
  }>;
  replyTo?: {
    name?: string;
    email: string;
  };
  subject: string;
  content: {
    html: string;
    text?: string;
  };
  attachments?: Array<{
    content: string; // base64 encoded
    type: string; // MIME type
    filename: string;
  }>;
  scheduledDate?: string;
  ttl?: number; // Time-to-live in minutes (30-4320)
  maxAttempts?: number;
  callback?: {
    url: string;
    headers?: Record<string, string>;
  };
  label?: string; // Custom label (up to 80 characters)
  dsn?: {
    notify: string; // 'NEVER', 'FAILURE', 'DELAY', 'SUCCESS', 'FAILURE_DELAY'
  };
}
```

### Response Format

```typescript
interface RouteeEmailResponse {
  trackingId: string; // Unique tracking identifier
}
```

## Error Handling

### Common Error Codes

Based on the Routee API documentation:

| Error Code | Type | Explanation |
|------------|------|-------------|
| 000000 | InvalidDomain | The provided sender domain is invalid |
| 000001 | InvalidSender | The provided sender is invalid |
| 000002 | UnverifiedSender | The provided sender is unverified |
| 000004 | NoActiveSubscription | No active transactional email subscription |
| 000005 | InsufficientResourcesException | Not enough resources to send email |

### Error Response Format

```typescript
interface RouteeErrorResponse {
  errorCode: string;
  type: string;
  explanation: string;
}
```

## Webhook Integration

### Webhook Events

The Routee provider can receive webhook notifications for email events:

- **delivered** - Email successfully delivered
- **bounce** - Email bounced back
- **open** - Email was opened
- **click** - Link was clicked
- **spam** - Email marked as spam
- **reject** - Email rejected by recipient server

### Webhook Payload

```typescript
interface RouteeWebhookPayload {
  events: Array<{
    messageId: string;
    trackingId: string;
    eventType: string;
    timestamp: string;
    details?: Record<string, unknown>;
  }>;
}
```

## Implementation Details

### Token Management

The real Routee implementation includes automatic token management:

```typescript
private async getAccessToken(): Promise<string> {
  // Check if current token is still valid
  if (this.accessToken && Date.now() < this.tokenExpiry) {
    return this.accessToken;
  }

  // Request new token
  const response = await fetch('https://auth.routee.net/oauth/token/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: this.clientId,
      client_secret: this.clientSecret
    })
  });

  const data = await response.json();
  this.accessToken = data.access_token;
  this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // 1 minute buffer

  return this.accessToken;
}
```

### Request Transformation

The implementation transforms our internal email format to Routee's API format:

```typescript
const routeeRequest: RouteeEmailRequest = {
  from: {
    name: request.from.name,
    email: request.from.email
  },
  to: request.to.map(recipient => ({
    name: recipient.name,
    email: recipient.email
  })),
  subject: request.subject,
  content: {
    html: request.html,
    text: request.text
  },
  ttl: 60, // 1 hour default
  maxAttempts: 3,
  label: request.metadata?.tenantId as string || 'email-gateway'
};
```

### Health Checks

The health check implementation tests authentication:

```typescript
async health(): Promise<HealthStatus> {
  try {
    // Test authentication as health check
    await this.getAccessToken();
    return { healthy: true };
  } catch (error) {
    return { 
      healthy: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
```


## Usage

### Development Mode (Stub)

For development and testing, the stub implementation is used by default:

```bash
# No additional configuration needed
PROVIDERS_ENABLED="routee"
```

### Production Mode (Real API)

To use the real Routee API:

```bash
# Add OAuth credentials
ROUTEE_CLIENT_ID="your-routee-client-id"
ROUTEE_CLIENT_SECRET="your-routee-client-secret"
ROUTEE_BASE_URL="https://connect.routee.net"

# Enable Routee provider
PROVIDERS_ENABLED="routee"
```

### Automatic Detection

The provider manager automatically detects which implementation to use:

```typescript
// Check if we should use real Routee implementation
const useRealRoutee = process.env.ROUTEE_CLIENT_ID && process.env.ROUTEE_CLIENT_SECRET;

if (useRealRoutee) {
  const routeeProvider = new RouteeEmailProviderReal();
  logger.info('Initialized Routee email provider (Real API)');
} else {
  const routeeProvider = new RouteeEmailProvider();
  logger.info('Initialized Routee email provider (Stub/Mock)');
}
```

## Testing

### Stub Implementation Testing

The stub implementation includes realistic behavior simulation:

- **Latency**: 100-300ms simulated API delay
- **Failure Rate**: 5% random failure rate for testing
- **Health Checks**: 10% random failure rate
- **Provider Message IDs**: Realistic format generation

### Real API Testing

For testing with the real Routee API:

1. **Get Routee Credentials**: Sign up at [routee.net](https://routee.net)
2. **Configure Environment**: Add `ROUTEE_CLIENT_ID` and `ROUTEE_CLIENT_SECRET`
3. **Test Authentication**: Verify OAuth token retrieval
4. **Send Test Email**: Use the API to send a test email
5. **Monitor Logs**: Check for successful delivery and webhook events

## Monitoring

### Metrics

The Routee provider reports the following metrics:

- **Provider Latency**: Time taken for API calls
- **Success Rate**: Percentage of successful sends
- **Error Rate**: Percentage of failed sends
- **Token Refresh**: OAuth token renewal frequency

### Logging

Structured logging includes:

```typescript
logger.info({
  provider: 'routee',
  messageId: 'msg_123',
  providerMessageId: 'routee_tracking_456',
  latency: 258
}, 'Email sent successfully via Routee');
```

### Health Monitoring

Health checks can be monitored via:

```bash
# Check provider health
curl http://localhost:3000/health

# Response includes provider status
{
  "checks": {
    "providers": {
      "status": "ok",
      "available": ["routee"],
      "active": "routee"
    }
  }
}
```

## Best Practices

### Security

1. **Secure Credentials**: Store OAuth credentials in secure environment variables
2. **Token Rotation**: The implementation handles automatic token refresh
3. **HTTPS Only**: Always use HTTPS for API communications
4. **Webhook Validation**: Validate webhook signatures when implemented

### Performance

1. **Token Caching**: Tokens are cached to avoid unnecessary authentication requests
2. **Connection Pooling**: Use HTTP connection pooling for better performance
3. **Timeout Configuration**: Set appropriate timeouts for API calls
4. **Retry Logic**: Implement exponential backoff for retries

### Error Handling

1. **Specific Error Codes**: Handle Routee-specific error codes appropriately
2. **Fallback Strategy**: Consider fallback to other providers on failures
3. **Circuit Breaker**: Implement circuit breaker pattern for reliability
4. **Monitoring**: Monitor error rates and alert on anomalies

## Migration from Stub to Real API

To migrate from stub to real Routee implementation:

1. **Get Routee Account**: Sign up for Routee services
2. **Configure Credentials**: Add OAuth credentials to environment
3. **Test Authentication**: Verify token retrieval works
4. **Send Test Email**: Confirm email sending works
5. **Monitor Logs**: Check for any errors or issues
6. **Update Documentation**: Update any relevant documentation

## Troubleshooting

### Common Issues

1. **Authentication Failures**
   - Verify `ROUTEE_CLIENT_ID` and `ROUTEE_CLIENT_SECRET`
   - Check if credentials are active in Routee dashboard
   - Ensure proper OAuth 2.0 client credentials setup

2. **Sender Verification**
   - Ensure sender email is verified in Routee
   - Check domain verification status
   - Verify sender is not in blacklist

3. **Rate Limiting**
   - Check Routee account limits
   - Implement appropriate rate limiting
   - Monitor API usage in Routee dashboard

4. **Webhook Issues**
   - Verify webhook URL is accessible
   - Check webhook signature validation
   - Monitor webhook delivery logs

### Debug Mode

Enable debug logging for detailed troubleshooting:

```bash
LOG_LEVEL=debug
```

This will show detailed logs including:
- OAuth token requests and responses
- API request/response details
- Webhook payload parsing
- Error details and stack traces

---

**Last Updated**: September 2024  
**Routee API Version**: v.2  
**Documentation**: [Routee Email API v.2](https://docs.routee.net/reference/email-v2-authorization)
