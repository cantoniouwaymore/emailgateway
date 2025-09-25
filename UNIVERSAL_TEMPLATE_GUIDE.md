# Universal Email Template Guide

## Overview

The Universal Email Template (`universal-en`) is a flexible, single template that can handle all email notification types in the Waymore email gateway. It supports dynamic content, custom text, and various notification scenarios.

## Template Structure

### Required Variables
- `email_title` - The main title/heading of the email
- `workspace_name` - Name of the workspace/company
- `support_email` - Support contact email

### Optional Variables

#### Custom Content
- `custom_content` - **NEW!** Additional HTML content that appears after the title and before the facts table
  - Supports HTML formatting (use `{{{custom_content}}}` for HTML rendering)
  - Perfect for personalized messages, explanations, or additional context
  - **Supports Handlebars variables**: Use `{{user_firstname}}`, `{{product_name}}`, etc. for dynamic content

#### Facts Table
- `facts` - Array of objects with `label` and `value` properties
  - Automatically renders as a table in HTML
  - Renders as bullet points in text version

#### Call-to-Action Buttons
- `cta_primary` - Primary action button with `label` and `url`
- `cta_secondary` - Secondary action button with `label` and `url`

#### User Information
- `user_firstname` - User's first name
- `user_name` - User's full name
- `product_name` - Name of the product/service

## Usage Examples

### 1. Usage Threshold Warning (Enhanced)
```json
{
  "template": {"key": "universal", "locale": "en"},
  "variables": {
    "email_title": "Usage Threshold Warning",
    "workspace_name": "Waymore",
    "support_email": "support@waymore.io",
    "user_firstname": "Antonio",
    "product_name": "Waymore Platform",
    "custom_content": "Hello {{user_firstname}},<br><br>Your current <strong>{{product_name}}</strong> subscription is at <strong>{{usage_percent}}%</strong> of its limit.<br><br>👉 <strong>To avoid interruptions</strong>, you may want to review your plan and upgrade if needed.",
    "facts": [
      {"label": "Used:", "value": "8,000 emails"},
      {"label": "Limit:", "value": "10,000 emails"},
      {"label": "Usage:", "value": "80%"}
    ],
    "cta_primary": {
      "label": "Manage Plan",
      "url": "https://app.waymore.io/billing"
    }
  }
}
```

### 2. Renewal Reminder (Enhanced)
```json
{
  "template": {"key": "universal", "locale": "en"},
  "variables": {
    "email_title": "Renewal Reminder",
    "workspace_name": "Waymore",
    "support_email": "support@waymore.io",
    "user_firstname": "Antonio",
    "custom_content": "Hello {{user_firstname}},<br><br>Your <strong>Pro</strong> plan will renew on <strong>01 Oct 2025</strong>.<br><br>💡 <strong>Tip:</strong> Make sure your payment method is up to date to avoid any service interruptions.",
    "facts": [
      {"label": "Plan:", "value": "Pro"},
      {"label": "Renewal Date:", "value": "01 Oct 2025"},
      {"label": "Workspace:", "value": "Waymore"}
    ],
    "cta_primary": {
      "label": "Manage Billing",
      "url": "https://app.waymore.io/billing"
    }
  }
}
```

### 3. Welcome Email (Enhanced)
```json
{
  "template": {"key": "universal", "locale": "en"},
  "variables": {
    "email_title": "Welcome to Waymore!",
    "workspace_name": "Waymore",
    "support_email": "support@waymore.io",
    "user_firstname": "Antonio",
    "product_name": "Waymore Platform",
    "custom_content": "Hello {{user_firstname}},<br><br>🎉 <strong>Welcome to {{product_name}}!</strong><br><br>We're excited to have you on board. Here are some quick tips to get you started:<br><br>• <strong>Explore the dashboard</strong> to see your workspace overview<br>• <strong>Invite team members</strong> to collaborate on your projects<br>• <strong>Check out our documentation</strong> for detailed guides<br><br>If you have any questions, don't hesitate to reach out to our support team.",
    "facts": [
      {"label": "Account Type:", "value": "Pro Plan"},
      {"label": "Workspace:", "value": "Waymore"},
      {"label": "Setup Status:", "value": "Complete"}
    ],
    "cta_primary": {
      "label": "Get Started",
      "url": "https://app.waymore.io/dashboard"
    },
    "cta_secondary": {
      "label": "View Documentation",
      "url": "https://docs.waymore.io"
    }
  }
}
```

## Benefits of Universal Template

### ✅ **Single Template Management**
- One template handles all notification types
- Consistent branding across all emails
- Easier maintenance and updates

### ✅ **Flexible Content**
- `custom_content` allows for personalized messages
- Facts table for structured data
- Optional CTA buttons for actions

### ✅ **Clean Codebase**
- No need for multiple template files
- Reduced complexity
- Better maintainability

### ✅ **Developer Friendly**
- Simple API structure
- Clear variable naming
- Easy to understand and implement

## Template Features

### 🎨 **Visual Elements**
- Waymore logo (real LinkedIn logo)
- Professional styling
- Responsive design
- Consistent color scheme

### 📧 **Email Structure**
1. **Header** - Logo
2. **Title** - Dynamic email title
3. **Custom Content** - Optional personalized message
4. **Facts Table** - Optional structured data
5. **CTA Buttons** - Optional action buttons
6. **Footer** - Support contact information

### 🔧 **Technical Features**
- Handlebars templating
- MJML for HTML emails
- Plain text fallback
- Variable substitution
- Conditional content blocks

## Migration from Specific Templates

If you were using specific templates before, here's how to migrate:

### Before (Specific Templates)
```json
{
  "template": {"key": "usage-80-threshold", "locale": "en"},
  "variables": { /* specific variables */ }
}
```

### After (Universal Template)
```json
{
  "template": {"key": "universal", "locale": "en"},
  "variables": {
    "email_title": "Usage Threshold Warning",
    "custom_content": "Your personalized message here...",
    "facts": [ /* your data */ ],
    "cta_primary": { /* your action */ }
  }
}
```

## Best Practices

### 1. **Use Custom Content Wisely**
- Keep messages concise and relevant
- Use HTML formatting for emphasis
- Include user's name for personalization
- **Use Handlebars variables**: The `custom_content` field now supports Handlebars variable processing

#### ✅ Correct Usage (with Handlebars variables):
```json
"custom_content": "Hello {{user_firstname}},<br><br>Your <strong>{{plan_name}}</strong> plan will renew on <strong>{{renewal_date}}</strong>."
```

#### ✅ Also Correct (with actual values):
```json
"custom_content": "Hello Antonio,<br><br>Your <strong>Pro</strong> plan will renew on <strong>01 Oct 2025</strong>."
```

**Note**: The template engine now processes Handlebars variables in `custom_content`, so you can use either approach depending on your needs.

### 2. **Structure Your Facts**
- Use clear, descriptive labels
- Keep values concise
- Order by importance

### 3. **CTA Button Guidelines**
- Primary CTA should be the main action
- Secondary CTA for additional options
- Use action-oriented language

### 4. **Testing**
- Always test with different data sets
- Verify both HTML and text versions
- Check email client compatibility

## Support

For questions or issues with the universal template:
- Check the test files in the repository
- Review the API documentation
- Contact the development team

---

**Last Updated**: September 25, 2025  
**Template Version**: Universal v1.0  
**Status**: Production Ready ✅
