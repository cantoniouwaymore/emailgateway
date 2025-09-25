# 📧 Email Gateway API - Postman Collection

## 🚀 Quick Start Guide

### 1. Import the Collection
1. Open Postman
2. Click **Import** button
3. Select the file: `Email-Gateway-API.postman_collection.json`
4. The collection will be imported with all endpoints ready to use

### 2. Set Up Environment Variables
The collection uses these variables (automatically configured):
- `base_url`: `http://localhost:3000` (default)
- `jwt_token`: Auto-generated when you get a token
- `message_id`: Auto-captured when you send an email

### 3. Get Started
1. **Get JWT Token** → Run "Get JWT Token" request
2. **Send Email** → Use any of the email sending requests
3. **Check Status** → Use "Get Message Status" with the captured message ID

---

## 📋 Available Endpoints

### 🔐 Authentication
- **Get JWT Token** - Get authentication token (valid for 1 hour)

### 📧 Email Operations
- **Send Email - Universal Template** - Basic email sending
- **Send Email - Multiple Recipients** - Send to multiple people with CC
- **Send Email - With Webhook URL** - Include webhook for status updates

### 📊 Message Status
- **Get Message Status** - Check email delivery status

### 🏥 System Health
- **Health Check** - Service health status
- **Readiness Check** - Service readiness
- **Metrics** - System statistics

### 🎛️ Admin Dashboard
- **Admin Dashboard** - Web interface for monitoring
- **Admin API Data** - JSON API for dashboard data

### 🔗 Webhooks
- **Routee Webhook (Simulate)** - Test webhook events

---

## 🎯 Common Use Cases

### Send a Welcome Email
1. Run **"Get JWT Token"**
2. Run **"Send Email - Universal Template"**
3. Update the JSON body with your recipient details:
   ```json
   {
     "to": [
       {
         "email": "newuser@example.com",
         "name": "New User"
       }
     ],
     "variables": {
       "title": "Welcome to Our Platform",
       "details": "Thank you for joining us!",
       "status": "New Member",
       "provider": "Your Company"
     }
   }
   ```

### Send to Multiple Recipients
1. Use **"Send Email - Multiple Recipients"**
2. Add multiple recipients in the `to` array
3. Optionally add CC recipients

### Monitor Email Status
1. After sending an email, the `message_id` is automatically captured
2. Run **"Get Message Status"** to check delivery status
3. Check the admin dashboard at `http://localhost:3000/admin`

### Test Webhook Events
1. Use **"Routee Webhook (Simulate)"** to test status updates
2. Set the `provider_message_id` variable to a real message ID
3. This simulates Routee sending status updates

---

## 🔧 Configuration

### Environment Variables
- **base_url**: Change to your production URL when deploying
- **jwt_token**: Automatically managed by the collection
- **message_id**: Automatically captured from email responses

### Custom Headers
The collection automatically adds:
- **Authorization**: Bearer token for authentication
- **Idempotency-Key**: Prevents duplicate emails
- **Content-Type**: application/json for requests

---

## 📝 Request Examples

### Basic Email Send
```json
{
  "from": {
    "email": "marketing@waymore.io",
    "name": "Waymore Team"
  },
  "subject": "Welcome to Waymore",
  "template": {
    "key": "universal",
    "locale": "en"
  },
  "to": [
    {
      "email": "user@example.com",
      "name": "User Name"
    }
  ],
  "variables": {
    "title": "Welcome!",
    "details": "Thank you for joining us.",
    "status": "New User",
    "provider": "Waymore Platform"
  }
}
```

### Multiple Recipients
```json
{
  "from": {
    "email": "marketing@waymore.io",
    "name": "Waymore Team"
  },
  "subject": "Important Update",
  "template": {
    "key": "universal",
    "locale": "en"
  },
  "to": [
    {
      "email": "user1@example.com",
      "name": "User One"
    },
    {
      "email": "user2@example.com",
      "name": "User Two"
    }
  ],
  "cc": [
    {
      "email": "manager@example.com",
      "name": "Manager"
    }
  ],
  "variables": {
    "title": "Important Update",
    "details": "We have an important update for you.",
    "status": "Update Required",
    "provider": "Waymore Platform"
  }
}
```

---

## 🚨 Error Handling

### Common Error Responses
- **400 Bad Request**: Missing required fields or invalid data
- **401 Unauthorized**: Invalid or expired JWT token
- **409 Conflict**: Duplicate idempotency key
- **500 Internal Server Error**: Server-side error

### Troubleshooting
1. **Token Expired**: Run "Get JWT Token" again
2. **Missing Fields**: Check the request body against the examples
3. **Duplicate Email**: Change the Idempotency-Key value
4. **Server Error**: Check the server logs and health status

---

## 🔄 Automation Features

The collection includes automatic features:
- **Auto Token Management**: JWT tokens are automatically extracted and stored
- **Auto Message ID Capture**: Message IDs are captured from email responses
- **Auto Idempotency Keys**: Unique keys are generated for each request
- **Auto Status Updates**: Webhook events can be simulated for testing

---

## 📊 Monitoring

### Admin Dashboard
- **URL**: `http://localhost:3000/admin`
- **Features**: Real-time email status, system health, message history
- **Auto-refresh**: Updates every 30 seconds

### API Monitoring
- **Health Check**: `/health` - Service status
- **Metrics**: `/metrics` - System statistics
- **Admin API**: `/admin/api/data` - JSON data for dashboards

---

## 🚀 Production Deployment

When deploying to production:
1. Update `base_url` variable to your production URL
2. Configure proper JWT token generation (not using test endpoint)
3. Set up proper webhook URLs for status notifications
4. Configure environment variables for database and providers

---

## 📞 Support

For issues or questions:
1. Check the server logs for detailed error information
2. Use the health check endpoints to verify service status
3. Check the admin dashboard for email delivery status
4. Review the API documentation for request/response formats

---

**Happy Email Sending! 📧✨**
