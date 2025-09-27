# 🤖 AI Playground

> Generate email templates using natural language descriptions with AI-powered template generation.

## 🎯 Overview

The AI Playground is a powerful feature that allows developers to describe email templates in natural language and automatically generate the corresponding JSON structure. This eliminates the need to manually craft complex template configurations and speeds up the development process.

## ✨ Features

- **Natural Language Processing**: Describe your email template in plain English
- **Intelligent Template Generation**: AI automatically creates appropriate JSON structure
- **Multiple Email Types**: Support for welcome, payment, password reset, report, and notification emails
- **Quick Testing**: Built-in test email functionality
- **Copy & Paste Ready**: Generated templates are immediately usable
- **Example Templates**: Pre-built examples for common email scenarios

## 🚀 Getting Started

### Prerequisites

1. **OpenAI API Key**: Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. **Environment Configuration**: Add your OpenAI settings to `.env` file

### Environment Setup

Add these variables to your `.env` file:

```bash
# AI Configuration
OPENAI_API_KEY="your-openai-api-key"
OPENAI_MODEL="gpt-4"
OPENAI_MAX_TOKENS="2000"
OPENAI_TEMPERATURE="0.7"
```

**Configuration Options**:
- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `OPENAI_MODEL`: AI model to use (`gpt-4`, `gpt-3.5-turbo`, etc.)
- `OPENAI_MAX_TOKENS`: Maximum tokens for response (default: 2000)
- `OPENAI_TEMPERATURE`: Creativity level 0.0-1.0 (default: 0.7)

### Access the AI Playground

1. Start your email gateway service: `npm run dev`
2. Navigate to `http://localhost:3000/admin`
3. Click on the **"AI Playground"** tab
4. Start describing your email template!

### Basic Usage

1. **Describe Your Email**: Enter a natural language description of the email you want to create
2. **Configure Details**: Set workspace name, product name, and test user details
3. **Generate Template**: Click "Generate Template" to create the JSON structure
4. **Test Email**: Use the "Send Test Email" button to test your generated template
5. **Copy & Use**: Copy the generated JSON for use in your application

## 📝 Example Descriptions

### Welcome Email
```
A welcome email for new users that includes their name, a welcome message, account details, and a button to get started
```

### Payment Success
```
A payment confirmation email with transaction details, amount, date, and receipt download link
```

### Password Reset
```
A password reset email with security instructions, reset link, and expiration notice
```

### Monthly Report
```
A monthly analytics report email with key metrics, charts data, and insights
```

### Social Media
```
An email encouraging users to follow us on social media with links to our social profiles
```

## 🎨 Generated Template Structure

The AI generates templates with the following structure:

```json
{
  "template": {
    "key": "transactional",
    "locale": "en"
  },
  "variables": {
    "workspace_name": "Your Company",
    "user_firstname": "John",
    "product_name": "Your Product",
    "support_email": "support@waymore.io",
    "email_title": "Generated Title",
    "custom_content": "Generated HTML content...",
    "facts": [
      {"label": "Key", "value": "Value"}
    ],
    "cta_primary": {
      "label": "Primary Action",
      "url": "https://example.com"
    },
    "cta_secondary": {
      "label": "Secondary Action", 
      "url": "https://example.com"
    },
    "social_links": [
      {"platform": "twitter", "url": "https://twitter.com/company"}
    ]
  }
}
```

## 🔧 API Integration

### Generate Template Endpoint

**POST** `/api/admin/ai/generate-template`

**Headers**:
- `Authorization: Bearer <jwt_token>`
- `Content-Type: application/json`

**Request Body**:
```json
{
  "description": "Your natural language description",
  "workspaceName": "Your Company",
  "productName": "Your Product", 
  "userName": "Test User"
}
```

**Response**:
```json
{
  "template": {
    "template": {
      "key": "transactional",
      "locale": "en"
    },
    "variables": {
      // Generated template variables
    }
  }
}
```

### Test Email Endpoint

Use the generated template with the standard email sending endpoint:

**POST** `/api/emails`

```json
{
  "to": [{"email": "test@example.com", "name": "Test User"}],
  "from": {"email": "noreply@waymore.io", "name": "Waymore"},
  "subject": "Test Email Subject",
  "template": {
    "key": "transactional",
    "locale": "en"
  },
  "variables": {
    // Generated variables from AI
  }
}
```

## 🎯 Supported Email Types

The AI Playground recognizes and generates appropriate templates for:

### 1. Welcome/Onboarding Emails
- **Keywords**: welcome, onboard, new user, getting started
- **Features**: User greeting, account details, getting started tips, primary CTA
- **Example**: "A welcome email for new users with account setup instructions"

### 2. Payment/Transaction Emails
- **Keywords**: payment, transaction, receipt, confirmation, invoice
- **Features**: Transaction details, amount, date, receipt download, account link
- **Example**: "A payment confirmation email with receipt and transaction details"

### 3. Password Reset Emails
- **Keywords**: password, reset, security, login, authentication
- **Features**: Security instructions, reset link, expiration notice
- **Example**: "A password reset email with security instructions and reset link"

### 4. Report/Analytics Emails
- **Keywords**: report, analytics, metrics, monthly, weekly, insights
- **Features**: Key metrics, data visualization, export options, trends
- **Example**: "A monthly report email with user analytics and key metrics"

### 5. Notification/Alert Emails
- **Keywords**: notification, alert, reminder, update, important
- **Features**: Priority indicators, action requirements, status updates
- **Example**: "An important notification email requiring user action"

### 6. Social Media Emails
- **Keywords**: social, follow, connect, community, social media
- **Features**: Social media links, community engagement, follow buttons
- **Example**: "An email encouraging users to follow us on social media"

## 🛠️ Customization

### OpenAI Integration

The AI Playground uses OpenAI's GPT models for intelligent template generation. The system includes:

- **Smart Fallback**: If OpenAI is unavailable, falls back to pattern-based generation
- **Structured Prompts**: Carefully crafted prompts ensure consistent JSON output
- **Error Handling**: Robust error handling with automatic fallback
- **Configurable Models**: Support for different OpenAI models (GPT-4, GPT-3.5-turbo, etc.)

### Customizing AI Behavior

You can customize the AI generation by modifying the system prompt in `src/api/controllers/ai.ts`:

```typescript
const systemPrompt = `You are an expert email template generator...`;
```

### Adding New Email Types

To add support for new email types, modify the `generateWithPatterns` method in `src/api/controllers/ai.ts`:

```typescript
// Add new email type detection
else if (lowerDescription.includes('your-keyword')) {
  emailTitle = 'Your Custom Title';
  customContent = 'Your custom content...';
  // Add specific features for this email type
}
```

### Customizing Generated Content

The AI generation logic can be customized to:
- Add new template variables
- Modify content structure
- Include additional features (themes, social links, etc.)
- Support new languages
- Adjust AI model parameters

## 🔍 Troubleshooting

### Common Issues

**Template not generating correctly**:
- Ensure your description is clear and specific
- Include relevant keywords for the email type
- Check that all required fields are filled
- Verify OpenAI API key is valid and has sufficient credits

**OpenAI API errors**:
- Check your API key is correct and active
- Ensure you have sufficient OpenAI credits
- Verify the model you're using is available
- Check network connectivity to OpenAI servers

**Test email not sending**:
- Verify JWT token is valid
- Check that test email address is valid
- Ensure all required template variables are present

**Generated content not appropriate**:
- Try rephrasing your description
- Use more specific keywords
- Check the example templates for reference
- Adjust the `OPENAI_TEMPERATURE` setting for more/less creativity

**Fallback to pattern-based generation**:
- Check OpenAI API key configuration
- Verify network connectivity
- Review server logs for OpenAI API errors
- Ensure OpenAI account has sufficient credits

### Debug Tips

1. **Use specific descriptions**: "A welcome email" vs "A welcome email for new users that includes their name, account details, and a button to get started"
2. **Include relevant keywords**: Use terms like "payment", "welcome", "reset", "report" to trigger appropriate templates
3. **Test with examples**: Start with the provided examples to understand the format
4. **Check generated JSON**: Review the generated template structure before testing
5. **Monitor AI usage**: Check OpenAI dashboard for API usage and costs
6. **Test fallback**: Temporarily disable OpenAI API key to test pattern-based generation

## 📚 Best Practices

### Writing Effective Descriptions

1. **Be Specific**: Include details about content, buttons, and data to display
2. **Use Keywords**: Include relevant terms that match supported email types
3. **Mention Features**: Specify if you want facts tables, multiple buttons, social links, etc.
4. **Include Context**: Mention the purpose and audience of the email

### Example Descriptions

✅ **Good**: "A welcome email for new users that includes their name, a welcome message, account type details in a facts table, and a primary button to get started"

❌ **Poor**: "Welcome email"

✅ **Good**: "A payment confirmation email with transaction ID, amount, date, and a receipt download button"

❌ **Poor**: "Payment email"

### Testing Workflow

1. **Generate Template**: Use AI to create initial template
2. **Review Structure**: Check generated JSON for completeness
3. **Test Email**: Send test email to verify functionality
4. **Customize**: Modify template as needed for your specific use case
5. **Integrate**: Use final template in your application

## 🚀 Advanced Usage

### Batch Template Generation

Generate multiple templates programmatically:

```javascript
const templates = [
  {
    description: "Welcome email for new users",
    workspaceName: "My Company",
    productName: "My Product",
    userName: "John"
  },
  {
    description: "Payment confirmation email",
    workspaceName: "My Company", 
    productName: "My Product",
    userName: "John"
  }
];

for (const template of templates) {
  const response = await fetch('/api/admin/ai/generate-template', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + jwtToken
    },
    body: JSON.stringify(template)
  });
  
  const result = await response.json();
  console.log('Generated template:', result.template);
}
```

### Template Validation

Validate generated templates before use:

```javascript
function validateGeneratedTemplate(template) {
  const required = ['workspace_name', 'user_firstname', 'product_name', 'email_title'];
  const variables = template.variables;
  
  for (const field of required) {
    if (!variables[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
  
  return true;
}
```

## 📖 Related Documentation

- [Transactional Template Guide](TRANSACTIONAL_TEMPLATE_GUIDE.md) - Complete template reference
- [API Documentation](API.md) - Full API reference
- [Developer Guide](DEVELOPER.md) - Development setup and best practices

---

**Last Updated**: September 2025  
**AI Playground Version**: v1.0.0
