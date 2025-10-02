# 🎨 Template System Guide

> Complete guide to the email template system with advanced features, customization options, and best practices for developers.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Template System Overview](#template-system-overview)
- [Template Creation](#template-creation)
- [Template Structure](#template-structure)
- [Variable System](#variable-system)
- [Multi-Language Support](#multi-language-support)
- [Theme Customization](#theme-customization)
- [API Reference](#api-reference)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## 🚀 Quick Start

### Template Creation
```bash
curl -X POST http://localhost:3000/api/v1/templates \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "key": "my-template",
    "name": "My Template",
    "category": "transactional",
    "variableSchema": { "type": "object", "properties": {} },
    "jsonStructure": {
      "header": { "logo_url": "{{header.logo_url}}" },
      "title": { "text": "{{title.text}}" },
      "body": { "paragraphs": "{{body.paragraphs}}" }
    }
  }'
```

### Email Sending
```bash
curl -X POST http://localhost:3000/api/v1/emails \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "to": [{"email": "user@example.com", "name": "John Doe"}],
    "from": {"email": "noreply@company.com", "name": "Company"},
    "subject": "Your Email Subject",
    "template": {"key": "my-template", "locale": "en"},
    "variables": {
      "header": {"logo_url": "https://example.com/logo.png"},
      "title": {"text": "Welcome!"},
      "body": {"paragraphs": ["Hello John!"]}
    }
  }'
```

## 🎯 Template System Overview

The Template System is a powerful email template system built with MJML and Handlebars that provides:

- **Object-Based Structure**: Organized sections (`header`, `hero`, `title`, `body`, `snapshot`, `visual`, `actions`, `support`, `footer`)
- **Responsive Design**: Works across all email clients and devices
- **Multi-Language Support**: 40+ locales with intelligent fallback system
- **Visual Customization**: Complete theme control with colors, fonts, and styling
- **Data Visualization**: Progress bars, countdown timers, and structured facts tables
- **Developer-Friendly**: Base template testing with `__base__` locale

### Core Components

| Component | Purpose | Key Features |
|-----------|---------|--------------|
| **Template Engine** | Renders templates with variables | MJML + Handlebars integration |
| **Variable System** | Manages dynamic content | Object-based structure with fallbacks |
| **Locale System** | Multi-language support | 40+ locales with intelligent fallback |
| **Theme Engine** | Visual customization | Complete color and typography control |
| **Validation System** | Template validation | Structure and variable validation |

### Object-Based Structure

```
Template
├── Header (branding, logo, tagline)
├── Hero (visual elements, icons, images)
├── Title (main heading with styling)
├── Body (content paragraphs)
├── Snapshot (structured data display)
├── Visual (progress bars, countdowns)
├── Actions (call-to-action buttons)
├── Support (help links)
└── Footer (social links, legal links, copyright)
```

## 🏗️ Template Creation

### Required Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `key` | string | ✅ | Unique template identifier (lowercase, hyphens only) |
| `name` | string | ✅ | Human-readable template name |
| `description` | string | ❌ | Optional template description |
| `category` | string | ✅ | Template category for organization and filtering |
| `jsonStructure` | object | ✅ | Complete template definition |

### Template Categories

| Category | Description | When to Use |
|----------|-------------|-------------|
| `transactional` | Essential account-related emails | Password reset, email verification, order confirmations |
| `marketing` | Promotional and marketing emails | Newsletter, product announcements, promotional offers |
| `notification` | System-generated notifications | Usage alerts, security notifications, system maintenance |
| `test` | Development and testing templates | Testing, development, staging environments |

### Template Key Validation

Template keys must follow these rules:
- ✅ **Lowercase letters only**: `password-reset-template`
- ✅ **Numbers allowed**: `template-v2`
- ✅ **Hyphens allowed**: `forgot-password-en`
- ❌ **No underscores**: `password_reset` (use `password-reset` instead)
- ❌ **No spaces**: `password reset` (use `password-reset` instead)
- ❌ **No special characters**: `password@reset` (use `password-reset` instead)

### Template Creation Request

```bash
curl --location 'http://localhost:3000/api/v1/templates' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_JWT_TOKEN' \
--data-raw '{
  "key": "password-reset-template",
  "name": "Password Reset Template",
  "description": "Template for password reset emails",
  "category": "transactional",
  "variableSchema": {
    "type": "object",
    "properties": {
      "header": {
        "type": "object",
        "properties": {
          "logo_url": { "type": "string" },
          "logo_alt": { "type": "string" },
          "tagline": { "type": "string" }
        }
      },
      "title": {
        "type": "object",
        "properties": {
          "text": { "type": "string" },
          "size": { "type": "string" },
          "weight": { "type": "string" },
          "color": { "type": "string" },
          "align": { "type": "string" }
        }
      },
      "body": {
        "type": "object",
        "properties": {
          "paragraphs": { "type": "array", "items": { "type": "string" } }
        }
      }
    },
    "required": ["header", "title", "body"]
  },
  "jsonStructure": {
    "header": {
      "logo_url": "{{header.logo_url}}",
      "logo_alt": "{{header.logo_alt}}",
      "tagline": "{{header.tagline}}"
    },
    "title": {
      "text": "{{title.text}}",
      "size": "{{title.size}}",
      "weight": "{{title.weight}}",
      "color": "{{title.color}}",
      "align": "{{title.align}}"
    },
    "body": {
      "paragraphs": "{{body.paragraphs}}"
    }
  }
}'
```

## 📋 Template Structure

### Object-Based Architecture

| Section | Purpose | Key Properties |
|---------|---------|----------------|
| `header` | Branding & logo | `logo_url`, `logo_alt`, `tagline` |
| `hero` | Visual element | `type`, `icon`, `image_url`, `image_width` |
| `title` | Main heading | `text`, `size`, `weight`, `color`, `align` |
| `body` | Content paragraphs | `paragraphs`, `font_size`, `line_height` |
| `snapshot` | Data display | `title`, `facts`, `style` |
| `visual` | Progress/countdown | `type`, `progress_bars`, `countdown` |
| `actions` | Call-to-action buttons | `primary`, `secondary` |
| `support` | Help links | `title`, `links` |
| `footer` | Footer content | `tagline`, `social_links`, `legal_links`, `copyright` |

### API Structure

The API expects a **flat structure** with these top-level fields:

```json
{
  "key": "template-key",
  "name": "Template Name", 
  "description": "Optional description",
  "category": "transactional",
  "variableSchema": {
    // JSON schema defining variable structure
  },
  "jsonStructure": {
    // Template structure with Handlebars variables
  }
}
```

## 📝 Variable System

### Variable Naming Conventions

**Best Practices:**
- ✅ **Object-Based Structure**: Use structured objects for each section (`header`, `hero`, `title`, `body`, `snapshot`, `visual`, `actions`, `support`, `footer`)
- ✅ **Consistent Naming**: Use snake_case for variable names (`user_name`, `company_name`)
- ✅ **Descriptive Names**: Use clear, descriptive variable names
- ✅ **Fallback Values**: Always provide fallback values using `{{variable|fallback}}` syntax
- ❌ **No Nested Fallbacks**: Never use `{{variable}}` inside fallback values
- ❌ **No Mixed Structure**: Don't mix template key/locale with variables

### Section Properties Reference

| Section | Properties | Description |
|---------|------------|-------------|
| `header` | `logo_url`, `logo_alt`, `tagline` | Branding and company identity |
| `hero` | `type`, `icon`, `icon_size`, `image_url`, `image_alt`, `image_width` | Visual elements (icons or images) |
| `title` | `text`, `size`, `weight`, `color`, `align` | Main email heading |
| `body` | `paragraphs`, `font_size`, `line_height` | Email content and formatting |
| `snapshot` | `title`, `facts`, `style` | Structured data display |
| `visual` | `type`, `progress_bars`, `countdown` | Progress indicators and timers |
| `actions` | `primary`, `secondary` | Call-to-action buttons |
| `support` | `title`, `links` | Help and support resources |
| `footer` | `tagline`, `social_links`, `legal_links`, `copyright` | Footer content and links |

### ⚠️ Critical: Fallback Syntax Guidelines

**Avoid Nested Variables in Fallbacks**

When creating templates with fallback values, **never use nested `{{variable}}` syntax inside fallback values**. This causes Handlebars parsing errors and will prevent template rendering.

#### ✅ Correct Fallback Syntax

```json
{
  "title": {
    "text": "{{title.text|Reset your password}}"
  },
  "body": {
    "paragraphs": [
      "{{greeting|Hi}} {{user.name|John}},",
      "{{body.instruction|Click the button below to set a new password.}}"
    ]
  }
}
```

#### ❌ Incorrect Fallback Syntax (CAUSES ERRORS)

```json
// ❌ WRONG - Nested variables in fallback values
{
  "body": {
    "paragraphs": [
      "{{instruction|Click here to reset password for {{company.name|Waymore}}}}"
    ]
  }
}
```

## 🌍 Multi-Language Support

### Supported Locales

The system supports 40+ standard ISO 639-1 language codes:

**Primary Locales:**
- `en` - English, `es` - Spanish, `fr` - French, `de` - German, `it` - Italian, `pt` - Portuguese

**Extended Locales:**
- `ru` - Russian, `ja` - Japanese, `ko` - Korean, `zh` - Chinese, `ar` - Arabic, `hi` - Hindi

### Special Locale: `__base__`

The `__base__` locale is a special identifier that uses the base template structure with variables intact.

**When to Use `__base__`:**
- **Testing**: Verify template structure and variable detection
- **Debugging**: Check how variables are processed
- **Development**: Preview the template with variable placeholders

### Fallback Strategy

The system uses an intelligent fallback strategy:

1. **Request for specific locale** (e.g., "es")
2. **Check if locale exists** in the database
3. **If locale exists**: Use locale-specific content merged with base template
4. **If locale doesn't exist**: Use **base template structure only** (no locale merging)

### Implementation Examples

**Standard Locale Usage:**
```json
{
  "template": {
    "key": "password-reset-template",
    "locale": "es"
  },
  "variables": {
    "content": {
      "en": "Welcome to our platform!",
      "es": "¡Bienvenido a nuestra plataforma!",
      "fr": "Bienvenue sur notre plateforme!"
    }
  }
}
```

**Base Template Usage (for testing/debugging):**
```json
{
  "template": {
    "key": "password-reset-template",
    "locale": "__base__"
  },
  "variables": {
    "user_name": "{{user.name}}",
    "company_name": "{{company.name}}",
    "reset_url": "{{reset.url}}"
  }
}
```

## 🎨 Theme Customization

### Theme Object

The `theme` object allows complete visual customization:

```json
{
  "theme": {
    "font_family": "'Roboto', 'Helvetica Neue', Arial, sans-serif",
    "font_size": "16px",
    "text_color": "#2c3e50",
    "heading_color": "#1a1a1a",
    "background_color": "#ffffff",
    "body_background": "#f4f4f4",
    "muted_text_color": "#888888",
    "border_color": "#e0e0e0",
    "primary_button_color": "#007bff",
    "primary_button_text_color": "#ffffff",
    "secondary_button_color": "#6c757d",
    "secondary_button_text_color": "#ffffff"
  }
}
```

### Theme Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `font_family` | string | `"Helvetica Neue, Helvetica, Arial, sans-serif"` | Font family for all text |
| `font_size` | string | `"16px"` | Base font size |
| `text_color` | string | `"#555555"` | Main text color |
| `heading_color` | string | `"#333333"` | Heading text color |
| `background_color` | string | `"#ffffff"` | Section background color |
| `body_background` | string | `"#f4f4f4"` | Email body background color |
| `muted_text_color` | string | `"#888888"` | Footer and muted text color |
| `border_color` | string | `"#e0e0e0"` | Table and divider border color |
| `primary_button_color` | string | `"#007bff"` | Primary button background |
| `primary_button_text_color` | string | `"#ffffff"` | Primary button text color |
| `secondary_button_color` | string | `"#6c757d"` | Secondary button background |
| `secondary_button_text_color` | string | `"#ffffff"` | Secondary button text color |
| `social_button_color` | string | `"#1f2937"` | Social icon button background (dark background for better dark mode support) |
| `social_icon_color` | string | `"#ffffff"` | Social icon color (white icons on dark background) |

## 📊 Data Structures

### Facts Array

Display structured data in a table format:

```json
{
  "facts": [
    {
      "label": "Account Type",
      "value": "Premium"
    },
    {
      "label": "Created",
      "value": "2024-01-01"
    },
    {
      "label": "Last Login",
      "value": "2024-01-15"
    },
    {
      "label": "Status",
      "value": "Active"
    }
  ]
}
```

### Social Links Array

Add social media links to the email footer:

```json
{
  "social_links": [
    {
      "platform": "twitter",
      "url": "https://twitter.com/waymore_io"
    },
    {
      "platform": "linkedin",
      "url": "https://linkedin.com/company/waymore"
    },
    {
      "platform": "github",
      "url": "https://github.com/waymore"
    }
  ]
}
```

**Supported Platforms**: `twitter`, `linkedin`, `github`, `facebook`, `instagram`

> **💡 Dark Mode Tip**: Social icons default to white icons on dark backgrounds (`#1f2937`) for optimal visibility in both light and dark mode email clients. Customize via `theme.social_button_color` and `theme.social_icon_color` if needed.

### Progress Bars Array

Display progress bars for data visualization:

```json
{
  "progress_bars": [
    {
      "label": "Storage Usage",
      "current": 75,
      "max": 100,
      "unit": "GB",
      "percentage": 75,
      "color": "#3b82f6",
      "description": "75% of your storage quota used"
    }
  ]
}
```

### Countdown Object

Add countdown timers for time-sensitive content:

```json
{
  "countdown": {
    "message": "Special offer expires in",
    "target_date": "2024-12-31T23:59:59Z",
    "show_days": true,
    "show_hours": true,
    "show_minutes": true,
    "show_seconds": false
  }
}
```

## 📚 API Reference

### Template Management Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/templates` | GET | List all templates |
| `/api/v1/templates` | POST | Create new template |
| `/api/v1/templates/:key` | GET | Get specific template |
| `/api/v1/templates/:key` | PUT | Update template |
| `/api/v1/templates/:key` | DELETE | Delete template |
| `/api/v1/templates/:key/validate` | POST | Validate template variables |
| `/api/v1/templates/validate` | POST | Validate template structure |

### Email Sending Endpoint

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/emails` | POST | Send email using template |

## 🎯 Best Practices

### ✅ Do's

#### Template Creation
1. **Always include required fields**: `key`, `name`, `category`, `variableSchema`, `jsonStructure`
2. **Use valid template keys**: lowercase, hyphens only, no special characters
3. **Define comprehensive variable schemas**: Include all possible variables with proper types
4. **Validate before creating**: Use the validation endpoint to check structure
5. **Use descriptive names**: Make template names and descriptions clear and meaningful
6. **Choose appropriate categories**: Use correct category for template type

#### Template Structure
7. **Use object-based structure**: Use structured sections (`header`, `hero`, `title`, `body`, `snapshot`, `visual`, `actions`, `support`, `footer`)
8. **Use proper JSON structure**: Wrap template key/locale in `template` object, variables in `variables` object
9. **Avoid redundancy**: Don't duplicate information between facts table and progress bars
10. **Use PNG/JPG images**: Avoid SVG for better email client compatibility
11. **Test across email clients**: Gmail, Outlook, Apple Mail, etc.
12. **Use semantic HTML**: Proper heading structure and alt text
13. **Optimize images**: Compress images for faster loading
14. **Use consistent branding**: Apply your brand colors and fonts
15. **Test multi-language content**: Verify all supported locales
16. **Provide fallbacks**: Always have fallback content for missing variables
17. **Include footer links**: Add privacy policy, terms, and unsubscribe links
18. **Use structured data**: Leverage the object-based structure for better organization
19. **Test with `__base__` locale**: Always test base template structure first

### ❌ Don'ts

#### Template Creation
1. **Don't skip required fields**: Always include `variableSchema` and `jsonStructure`
2. **Don't use invalid template keys**: No underscores, spaces, or special characters
3. **Don't create templates without validation**: Always validate structure first
4. **Don't use generic names**: Avoid names like "template1" or "test"
5. **Don't skip variable schema**: Always define the structure of variables
6. **Don't ignore validation errors**: Fix all errors before creating templates
7. **Don't use custom categories**: Stick to predefined categories only

#### Template Structure
8. **Don't use SVG images**: Poor email client support
9. **Don't use external CSS**: Email clients strip external stylesheets
10. **Don't use complex layouts**: Keep it simple for better compatibility
11. **Don't forget alt text**: Important for accessibility
12. **Don't use too many buttons**: Max 2 buttons for better UX
13. **Don't use long URLs**: Shorten URLs for better display
14. **Don't forget mobile**: Test on mobile devices
15. **Don't use too many social links**: 3-5 links maximum
16. **Don't forget footer links**: Include unsubscribe and privacy policy links
17. **Don't use too many footer links**: 3-4 links maximum for better readability
18. **Don't duplicate information**: Avoid showing the same data in both facts table and progress bars
19. **Don't mix template structure**: Keep template key/locale separate from variables
20. **Don't use nested fallbacks**: Never use `{{variable}}` inside fallback values

## 🔧 Troubleshooting

### Common Issues

#### Template Creation Errors

**Problem**: Template creation fails with `PrismaClientValidationError`
**Solutions**:
- Ensure all required fields are provided: `key`, `name`, `category`, `variableSchema`, `jsonStructure`
- **Important**: Always include `category` field even though API validation doesn't check for it
- Check template key format: lowercase, hyphens only, no special characters
- Validate variable schema structure before creating
- Use proper JSON syntax with correct brackets and commas

**Problem**: Template key validation fails
**Solutions**:
- Use lowercase letters and hyphens only: `password-reset-template`
- Avoid underscores, spaces, and special characters
- Don't start or end with hyphens
- Use descriptive, meaningful keys

#### Template Structure Errors

**Problem**: Template generation creates incorrect JSON structure
**Solutions**:
- Ensure `template` object contains `key` and `locale`
- Keep `variables` object separate from `template` object
- Use proper JSON syntax with correct brackets and commas
- Validate JSON structure before using

#### Images Not Displaying

**Problem**: Images not showing in email
**Solutions**:
- Use PNG or JPG format (avoid SVG)
- Ensure image URLs are publicly accessible
- Check image URL format (use direct links)
- Test image URL in browser first

#### Multi-Language Not Working

**Problem**: Content not changing based on locale
**Solutions**:
- Check `content` object has the correct locale key
- Verify `template.locale` matches content keys
- Ensure locale is supported (en, es, fr, de, it, pt, etc.)
- Test with `__base__` locale to see base template structure
- Remember: If locale not found, system falls back to base template structure (not "en")

### Debug Steps

1. **Check API Response**: Verify the email was queued successfully
2. **Check Message Status**: Use the message status endpoint
3. **Test Template**: Use a simple template first
4. **Check Logs**: Review server logs for errors
5. **Validate JSON**: Ensure all JSON is valid
6. **Test Variables**: Use minimal required variables first

### Support

If you encounter issues:

1. **Check Documentation**: Review this guide and API docs
2. **Test Examples**: Use the provided examples as starting points
3. **Check Logs**: Review server logs for error messages
4. **Contact Support**: Reach out to the development team

---

**Last Updated**: January 2025  
**Template Version**: Template System v2.2.0  
**Guide Version**: 2.2.0 - Streamlined for developers with essential knowledge