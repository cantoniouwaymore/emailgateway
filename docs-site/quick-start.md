---
prev: '/'
next: '/api/'
---

# Quick Start

Get up and running with Internal Waymore Email Notification System in just a few minutes.

## Prerequisites

- Node.js 20+ 
- Redis server
- PostgreSQL database
- Email provider account (Routee, SendGrid, etc.)

## Installation

1. **Clone the repository:**
```bash
git clone https://github.com/cantoniouwaymore/emailgateway.git
cd emailgateway
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp env.example .env
# Edit .env with your configuration
```

4. **Set up the database:**
```bash
npm run migrate
```

5. **Start the services:**
```bash
npm run dev:all
```

## Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/emailgateway"

# Redis
REDIS_URL="redis://localhost:6379"

# Email Provider
ROUTEE_CLIENT_ID="your_client_id"
ROUTEE_CLIENT_SECRET="your_client_secret"

# JWT
JWT_SECRET="your_jwt_secret"
```

### Email Provider Setup

1. **Routee (Recommended):**
   - Sign up at [Routee](https://routee.net)
   - Get your Client ID and Secret
   - Add them to your `.env` file

2. **Other Providers:**
   - SendGrid, Mailgun, etc. (coming soon)

## Your First Email

1. **Access the Admin UI:**
   - Open http://localhost:5173/admin/
   - Navigate to Templates tab

2. **Create a Template:**
   - Click "Create Template"
   - Use this sample template:

```handlebars
<h1>Welcome {{user_name}}!</h1>
<p>Thank you for joining {{company_name}}.</p>
<p>Your account is now active and ready to use.</p>
```

3. **Send a Test Email:**
   - Use the API or Admin UI
   - Send to your email address

## API Example

```bash
curl -X POST http://localhost:3000/api/v1/emails \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "to": [{"email": "test@example.com", "name": "Test User"}],
    "subject": "Welcome!",
    "template": {"key": "welcome", "locale": "en"},
    "variables": {
      "user_name": "Test User",
      "company_name": "My Company"
    }
  }'
```

## Next Steps

- 📖 [Read the full API documentation](/api/)
- 🎨 [Learn about templates](/guides/templates)
- 🏗️ [Understand the architecture](/guides/architecture)
- 🚀 [Deploy to production](/guides/deployment)

## Need Help?

- Check the [FAQ](/faq)
- Join our [Discord community](https://discord.gg/emailgateway)
- Open an [issue on GitHub](https://github.com/cantoniouwaymore/emailgateway/issues)
