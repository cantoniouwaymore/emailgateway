# 🎨 Transactional Template Guide

> Complete guide to the enhanced transactional email template with advanced features, customization options, and best practices for developers.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Developer Overview](#developer-overview)
- [Template Creation](#template-creation)
- [Template Structure](#template-structure)
- [Variable System](#variable-system)
- [Multi-Language Support](#multi-language-support)
- [Theme Customization](#theme-customization)
- [Showcase Examples](#showcase-examples)
- [API Reference](#api-reference)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## 🚀 Quick Start

### For Template Creation
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

### For Email Sending
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

## 🎯 Developer Overview

The Transactional Template is a powerful, feature-rich email template built with MJML and Handlebars. It provides:

- **Object-Based Structure**: Organized sections (`header`, `hero`, `title`, `body`, `snapshot`, `visual`, `actions`, `support`, `footer`)
- **Responsive Design**: Works across all email clients and devices
- **Multi-Language Support**: 40+ locales with intelligent fallback system
- **Visual Customization**: Complete theme control with colors, fonts, and styling
- **Data Visualization**: Progress bars, countdown timers, and structured facts tables
- **Developer-Friendly**: Base template testing with `__base__` locale

## 📋 Important Note

**This guide covers both template creation and email sending.** 

- **Template Creation**: Use the examples in the [Template Creation](#template-creation) section to create reusable templates in the system
- **Email Sending**: Use the examples in the [Showcase Examples](#showcase-examples) section to send emails using existing templates

## ⚠️ Critical: Fallback Syntax Guidelines

### Avoid Nested Variables in Fallbacks

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
      "{{body.instruction|Click the button below to set a new password. For security, this link will expire in 30 minutes.}}"
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
  },
  "footer": {
    "tagline": "{{footer.tagline|Powered by {{company.name|Waymore}}}}"
  }
}
```

#### Best Practices

1. **Keep fallbacks simple**: Use static text or simple values only
2. **Create separate variables**: Use `{{company.name}}` and `{{footer.tagline}}` as separate variables
3. **Test rendering**: Always test template rendering with missing variables
4. **Follow the examples**: Use the patterns shown in this guide

For more details, see the [Locale System Documentation](./LOCALE_SYSTEM.md#fallback-syntax-guidelines).

For complete email payloads when sending emails, wrap the variables in the full email structure:

```json
{
  "to": [{"email": "user@example.com", "name": "John Doe"}],
  "from": {"email": "no-reply@waymore.io", "name": "Waymore"},
  "subject": "Your Email Subject",
  "template": {"key": "password-reset-template", "locale": "en"},
  "variables": {
    // Template variables go here (see examples below)
  }
}
```

## 🏗️ Template Creation

### Creating Templates in the System

Templates are created using the `/api/v1/templates` endpoint. This allows you to create reusable templates that can be referenced by key when sending emails.

### Template Creation Workflow

1. **Design your template structure** using the object-based sections
2. **Define your variable schema** with proper types and validation
3. **Create the template** using the API endpoint
4. **Test with `__base__` locale** to verify structure
5. **Add locale-specific content** as needed

### Required Fields

When creating a template, you must provide these required fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `key` | string | ✅ | Unique template identifier (lowercase, hyphens only) |
| `name` | string | ✅ | Human-readable template name |
| `description` | string | ❌ | Optional template description |
| `category` | string | ✅ | Template category for organization and filtering |
| `jsonStructure` | object | ✅ | Complete template definition (see structure below) |

## 📋 Template Structure

### Object-Based Architecture

The template system uses an organized, object-based structure with clear sections:

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

### Template Structure Example

The `jsonStructure` contains the actual template definition with Handlebars variables:

```json
{
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
    "paragraphs": "{{body.paragraphs}}",
    "font_size": "{{body.font_size}}",
    "line_height": "{{body.line_height}}"
  }
}
```

### Template Categories

Categories help organize templates by their purpose and use case. They are used for:
- **Organization**: Group related templates together
- **Filtering**: Find templates by type in admin interfaces
- **Reporting**: Track template usage by category
- **Permissions**: Apply different access controls by category

#### Available Categories

| Category | Description | When to Use | Examples |
|----------|-------------|-------------|----------|
| `transactional` | Essential account-related emails | User-initiated actions, account management | Password reset, email verification, order confirmations, billing notifications |
| `marketing` | Promotional and marketing emails | Marketing campaigns, newsletters, promotions | Newsletter, product announcements, promotional offers, event invitations |
| `notification` | System-generated notifications | Automated alerts, system updates | Usage alerts, security notifications, system maintenance, status updates |
| `test` | Development and testing templates | Testing, development, staging environments | Test emails, development templates, staging notifications |

#### Category Selection Guidelines

**Choose `transactional` when:**
- Email is triggered by a user action
- Email contains sensitive account information
- Email is essential for user account functionality
- Email is legally required (receipts, confirmations)

**Choose `marketing` when:**
- Email promotes products or services
- Email is part of a marketing campaign
- Email is sent to a large audience
- Email is promotional in nature

**Choose `notification` when:**
- Email is system-generated
- Email alerts about account status
- Email contains usage or quota information
- Email is an automated system message

**Choose `test` when:**
- Template is for development purposes
- Template is for testing email functionality
- Template is for staging environments
- Template is not for production use

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
          "intro": { "type": "string" },
          "paragraphs": { "type": "array", "items": { "type": "string" } },
          "note": { "type": "string" }
        }
      },
      "actions": {
        "type": "object",
        "properties": {
          "primary": {
            "type": "object",
            "properties": {
              "label": { "type": "string" },
              "url": { "type": "string" },
              "style": { "type": "string" },
              "color": { "type": "string" },
              "text_color": { "type": "string" }
            }
          },
          "secondary": {
            "type": "object",
            "properties": {
              "label": { "type": "string" },
              "url": { "type": "string" },
              "style": { "type": "string" },
              "color": { "type": "string" }
            }
          }
        }
      },
      "footer": {
        "type": "object",
        "properties": {
          "tagline": { "type": "string" },
          "legal_links": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "label": { "type": "string" },
                "url": { "type": "string" }
              }
            }
          },
          "copyright": { "type": "string" }
        }
      },
      "user_name": { "type": "string" },
      "account_email": { "type": "string" },
      "reset_link": { "type": "string", "format": "uri" },
      "expiry_time": { "type": "string" }
    },
    "required": ["user_name", "account_email", "reset_link", "expiry_time"]
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
      "intro": "{{body.intro}}",
      "paragraphs": "{{body.paragraphs}}",
      "note": "{{body.note}}"
    },
    "actions": {
      "primary": "{{actions.primary}}",
      "secondary": "{{actions.secondary}}"
    },
    "footer": {
      "tagline": "{{footer.tagline}}",
      "legal_links": "{{footer.legal_links}}",
      "copyright": "{{footer.copyright}}"
    },
    "user_name": "{{user_name}}",
    "account_email": "{{account_email}}",
    "reset_link": "{{reset_link}}",
    "expiry_time": "{{expiry_time}}"
  }
}'
```

### Template Creation Response

```json
{
  "template": {
    "id": "cmg6cw03b00028jeo373jlw3x",
    "key": "password-reset-template",
    "name": "Password Reset Template",
    "description": "Template for password reset emails",
    "category": "transactional",
    "variableSchema": { ... },
    "jsonStructure": { ... },
    "createdAt": "2025-09-30T09:29:33.048Z",
    "updatedAt": "2025-09-30T09:29:33.048Z",
    "locales": [...]
  },
  "locale": "en",
  "detectedVariables": ["title_text", "user_name", "reset_url", "company_name"],
  "variableDetails": [...]
}
```

### Template Key Validation

Template keys must follow these rules:
- ✅ **Lowercase letters only**: `password-reset-template`
- ✅ **Numbers allowed**: `template-v2`
- ✅ **Hyphens allowed**: `forgot-password-en`
- ✅ **Cannot start/end with hyphens**: `my-template` (not `-my-template` or `my-template-`)
- ❌ **No underscores**: `password_reset` (use `password-reset` instead)
- ❌ **No spaces**: `password reset` (use `password-reset` instead)
- ❌ **No special characters**: `password@reset` (use `password-reset` instead)

### Important: Template Key vs Category

**Template Key** (used to reference the template):
- Unique identifier for the template
- Used when sending emails: `"template": {"key": "password-reset-template"}`
- Examples: `password-reset-template`, `welcome-email`, `order-confirmation`

**Category** (organizational grouping):
- Groups templates by purpose/type
- Used when creating templates: `"category": "transactional"`
- Examples: `transactional`, `marketing`, `notification`, `test`

**Do NOT use category names as template keys!**

### Variable Schema Structure

The `variableSchema` field defines the structure of variables that can be used when sending emails with this template:

```json
{
  "variableSchema": {
    "type": "object",
    "properties": {
      "variable_name": {
        "type": "string|number|boolean|array|object",
        "description": "Optional description of the variable"
      }
    },
    "required": ["variable_name1", "variable_name2"]
  }
}
```

## 🔍 Template Validation

### Validation Endpoint

Before creating templates, you can validate the structure using the `/api/v1/templates/validate` endpoint:

```bash
curl --location 'http://localhost:3000/api/v1/templates/validate' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_JWT_TOKEN' \
--data-raw '{
  "template": {
    "key": "password-reset-template",
    "locale": "en"
  },
  "variables": {
    // Your template variables here
  }
}'
```

### Validation Response

**Valid Template:**
```json
{
  "valid": true,
  "errors": [],
  "warnings": [
    {
      "type": "missing_optional_variable",
      "field": "footer_links",
      "message": "Consider adding footer links for better user experience",
      "suggestion": "Add privacy policy, terms of service, and unsubscribe links"
    }
  ],
  "suggestions": [
    "Review warnings for best practices and accessibility"
  ]
}
```

**Invalid Template:**
```json
{
  "valid": false,
  "errors": [
    {
      "type": "invalid_variable_format",
      "field": "template.key",
      "message": "Template key must contain only lowercase letters, numbers, and hyphens (not starting/ending with hyphens)",
      "suggestion": "Use format like \"welcome-email\" or \"password-reset\""
    }
  ],
  "warnings": [],
  "suggestions": [
    "Fix all validation errors before using this template"
  ]
}
```

### Common Validation Errors

| Error Type | Description | Solution |
|------------|-------------|----------|
| `missing_required_variable` | Required field missing | Add the missing field |
| `invalid_variable_format` | Invalid format (e.g., template key) | Fix the format according to rules |
| `invalid_variable_type` | Wrong data type | Use correct type (string, number, boolean, etc.) |
| `invalid_url` | Invalid URL format | Use valid URL format |
| `invalid_color` | Invalid hex color | Use format like `#FF5733` |
| `exceeds_limit` | Too many items in array | Reduce array size |
| `missing_object_structure` | Missing required object structure | Use proper object-based sections |

## 🤖 Template Generation Instructions

**For Template Generation Systems:** When generating transactional email templates, follow these rules:

1. **Use object-based structure**: Use structured sections (`header`, `hero`, `title`, `body`, `snapshot`, `visual`, `actions`, `support`, `footer`)
2. **Use proper structure**: Wrap template key/locale in `template` object, variables in `variables` object
3. **Avoid redundancy**: Don't duplicate information between facts table and progress bars
4. **Use consistent naming**: Follow the variable naming conventions shown in examples
5. **Include fallbacks**: Provide default values for optional variables when possible
6. **Validate structure**: Ensure all objects and arrays follow the documented format

**Template Structure:**
```json
{
  "template": {"key": "password-reset-template", "locale": "en"},
  "variables": {
    "header": { /* header object */ },
    "title": { /* title object */ },
    "body": { /* body object */ },
    // ... other structured sections
  }
}
```

## ✨ Template Features

### 🎨 Visual Features

| Feature | Description | Implementation |
|---------|-------------|----------------|
| **Dynamic Logo** | Custom image with fallback to default | `image_url` + `image_alt` |
| **Multi-Button Layout** | Side-by-side primary and secondary buttons | `cta_primary` + `cta_secondary` |
| **Social Media Links** | Built-in social media integration | `social_links` array |
| **Facts Table** | Structured data display | `facts` array |
| **Custom Themes** | Complete visual customization | `theme` object |

### 🌍 Content Features

| Feature | Description | Implementation |
|---------|-------------|----------------|
| **Multi-Language** | Dynamic content based on locale | `content` object + `locale` |
| **HTML Content** | Rich HTML content support | `custom_content` string |
| **Dynamic Headings** | Customizable email titles | `email_title` string |
| **Personalization** | User-specific content | `user_firstname` + variables |

## 📝 Variable System

### 🚨 Quick Reference for Developers

**Template Structure:**
```json
{
  "template": {"key": "password-reset-template", "locale": "en"},
  "variables": {
    "header": {
      "logo_url": "string",
      "logo_alt": "string", 
      "tagline": "string"
    },
    "title": {
      "text": "string",
      "size": "string",
      "weight": "string",
      "color": "string",
      "align": "string"
    },
    "body": {
      "paragraphs": ["string"],
      "font_size": "string",
      "line_height": "string"
    },
    "snapshot": {
      "title": "string",
      "facts": [{"label": "string", "value": "string"}],
      "style": "string"
    },
    "visual": {
      "type": "progress|countdown|none",
      "progress_bars": [{"label": "string", "current": "number", "max": "number", "unit": "string", "percentage": "number", "color": "string", "description": "string"}],
      "countdown": {"message": "string", "target_date": "string", "show_days": "boolean", "show_hours": "boolean", "show_minutes": "boolean", "show_seconds": "boolean"}
    },
    "actions": {
      "primary": {"label": "string", "url": "string", "style": "string", "color": "string", "text_color": "string"},
      "secondary": {"label": "string", "url": "string", "style": "string", "color": "string"}
    },
    "support": {
      "title": "string",
      "links": [{"label": "string", "url": "string"}]
    },
    "footer": {
      "tagline": "string",
      "social_links": [{"platform": "string", "url": "string"}],
      "legal_links": [{"label": "string", "url": "string"}],
      "copyright": "string"
    },
    "theme": {
      "font_family": "string",
      "font_size": "string",
      "text_color": "string",
      "heading_color": "string",
      "background_color": "string",
      "primary_button_color": "string",
      "primary_button_text_color": "string"
    }
  }
}
```

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
| `dark_mode` | boolean | `false` | Enable dark mode support |
| `dark_background_color` | string | `"#1a1a1a"` | Dark mode background color |
| `dark_text_color` | string | `"#e0e0e0"` | Dark mode text color |
| `dark_heading_color` | string | `"#ffffff"` | Dark mode heading color |
| `dark_muted_color` | string | `"#888888"` | Dark mode muted text color |
| `dark_border_color` | string | `"#333333"` | Dark mode border color |
| `dark_card_background` | string | `"#2a2a2a"` | Dark mode card background |

### Dark Mode Example

```json
{
  "theme": {
    "font_family": "'Inter', 'Helvetica Neue', Arial, sans-serif",
    "text_color": "#e0e0e0",
    "heading_color": "#ffffff",
    "background_color": "#1a1a1a",
    "body_background": "#0d0d0d",
    "muted_text_color": "#888888",
    "border_color": "#333333",
    "primary_button_color": "#4CAF50",
    "primary_button_text_color": "#ffffff",
    "secondary_button_color": "#666666",
    "secondary_button_text_color": "#ffffff"
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

**European Locales:**
- `nl` - Dutch, `sv` - Swedish, `da` - Danish, `no` - Norwegian, `fi` - Finnish, `pl` - Polish, `tr` - Turkish, `cs` - Czech, `sk` - Slovak, `hu` - Hungarian, `ro` - Romanian, `bg` - Bulgarian, `hr` - Croatian, `sl` - Slovenian, `et` - Estonian, `lv` - Latvian, `lt` - Lithuanian, `el` - Greek, `mt` - Maltese, `cy` - Welsh, `ga` - Irish, `is` - Icelandic, `fo` - Faroese, `eu` - Basque

### Special Locale: `__base__`

The `__base__` locale is a special identifier that uses the base template structure with variables intact.

**When to Use `__base__`:**
- **Testing**: Verify template structure and variable detection
- **Debugging**: Check how variables are processed
- **Development**: Preview the template with variable placeholders
- **Documentation**: Show the template structure to developers

### Fallback Strategy

The system uses an intelligent fallback strategy:

1. **Request for specific locale** (e.g., "es")
2. **Check if locale exists** in the database
3. **If locale exists**: Use locale-specific content merged with base template
4. **If locale doesn't exist**: Use **base template structure only** (no locale merging)

**Benefits:**
- **Predictable**: Always falls back to what the developer originally defined
- **No Assumptions**: Doesn't assume "en" exists or is the default
- **Variable Preservation**: Variables remain intact in fallback scenarios
- **Developer-Friendly**: Matches natural template creation workflow

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

### Best Practices for Multi-Language

1. **Start with Base Template**: Create the base template structure first
2. **Add Locales Gradually**: Add locale-specific content as needed
3. **Test with `__base__`**: Always test with base template first
4. **Use Consistent Variables**: Keep variables consistent across all locales
5. **Provide Fallbacks**: Always have fallback content for missing variables

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
    },
    {
      "platform": "facebook",
      "url": "https://facebook.com/waymore"
    },
    {
      "platform": "instagram",
      "url": "https://instagram.com/waymore"
    }
  ]
}
```

**Supported Platforms**: `twitter`, `linkedin`, `github`, `facebook`, `instagram`

### Footer Links Array

Add footer links for privacy policy, terms of service, and unsubscribe:

```json
{
  "footer_links": [
    {
      "label": "Privacy Policy",
      "url": "https://example.com/privacy"
    },
    {
      "label": "Terms of Service",
      "url": "https://example.com/terms"
    },
    {
      "label": "Unsubscribe",
      "url": "https://example.com/unsubscribe?token=abc123"
    }
  ]
}
```

**Note**: Footer links are displayed horizontally with bullet separators (•) between them.

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
    },
    {
      "label": "Monthly Emails",
      "current": 8500,
      "max": 10000,
      "unit": "emails",
      "percentage": 85,
      "color": "#ef4444",
      "description": "Approaching monthly limit"
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


## 🎯 Showcase Examples

### SaaS Quota Research Showcase

The **SaaS Quota Research Showcase** (`saas-quota-research-showcase`) demonstrates all template capabilities with realistic SaaS content and multi-language support.

#### Features Demonstrated

| Feature | Implementation | Description |
|---------|----------------|-------------|
| **Header** | Logo + Tagline | Company branding with dynamic logo |
| **Hero** | Icon Display | 📊 Research icon with custom sizing |
| **Title** | Dynamic Styling | Customizable title with full styling options |
| **Body** | Multi-Paragraph | 4 paragraphs with custom fonts and spacing |
| **Snapshot** | Facts Table | 6 usage metrics in structured table |
| **Visual** | Progress Bars | API usage visualization with percentage |
| **Actions** | Dual Buttons | Primary (survey) + Secondary (dashboard) |
| **Support** | Help Links | 3 support links with proper URLs |
| **Footer** | Complete | Social links + Legal links + Copyright |
| **Theme** | Custom Styling | Professional SaaS color scheme |
| **Multi-Language** | EL/ES | Full translations for both locales |

#### Greek Email Example

```json
{
  "to": [{"email": "john.doe@example.com", "name": "Γιάννης Δημητρίου"}],
  "from": {"email": "research@waymore.io", "name": "Ομάδα Έρευνας Waymore"},
  "subject": "Βοηθήστε μας να βελτιώσουμε την εμπειρία σας - Έρευνα",
  "template": {"key": "saas-quota-research-showcase", "locale": "el"},
  "variables": {
    "user": {
      "name": "Γιάννης",
      "email": "john.doe@example.com",
      "role": "Διευθυντής Προϊόντος",
      "department": "Μηχανική"
    },
    "company": {
      "name": "Waymore",
      "logo_url": "https://i.ibb.co/8LfvqPk7/Waymore-logo-Colour.png",
      "website": "https://waymore.io"
    },
    "quota": {
      "current_usage": 7500,
      "limit": 10000,
      "percentage": 75,
      "period": "Μηνιαίος",
      "reset_date": "1 Μαρτίου 2024"
    },
    "usage": {
      "api_calls": 7500,
      "storage_gb": 12.5,
      "users_count": 8,
      "integrations": 5
    },
    "research": {
      "title": "Βοηθήστε μας να βελτιώσουμε την εμπειρία σας",
      "description": "Διεξάγουμε έρευνα για να κατανοήσουμε καλύτερα πώς χρησιμοποιείτε την πλατφόρμα μας και πώς μπορούμε να βελτιώσουμε την εμπειρία σας.",
      "incentive": "θα λάβετε πίστωση $50 στον λογαριασμό σας",
      "survey_url": "https://waymore.io/research/survey?token=abc123&lang=el"
    }
  }
}
```

#### Spanish Email Example

```json
{
  "to": [{"email": "juan.perez@example.com", "name": "Juan Pérez"}],
  "from": {"email": "research@waymore.io", "name": "Equipo de Investigación Waymore"},
  "subject": "Ayúdanos a Mejorar Tu Experiencia - Encuesta de Investigación",
  "template": {"key": "saas-quota-research-showcase", "locale": "es"},
  "variables": {
    "user": {
      "name": "Juan",
      "email": "juan.perez@example.com",
      "role": "Gerente de Producto",
      "department": "Ingeniería"
    },
    "quota": {
      "current_usage": 7500,
      "limit": 10000,
      "percentage": 75,
      "period": "Mensual",
      "reset_date": "1 de marzo, 2024"
    },
    "research": {
      "title": "Ayúdanos a Mejorar Tu Experiencia",
      "description": "Estamos realizando una investigación para entender mejor cómo usas nuestra plataforma y cómo podemos mejorar tu experiencia.",
      "incentive": "recibirás un crédito de $50 en tu cuenta",
      "survey_url": "https://waymore.io/research/survey?token=abc123&lang=es"
    }
  }
}
```

### Professional Design Features

#### Color Scheme
- **Primary**: `#10b981` (Green) - Research survey button
- **Secondary**: `#6b7280` (Gray) - Dashboard button  
- **Progress**: `#3b82f6` (Blue) - Usage progress bar
- **Text**: `#2c3e50` (Dark Blue) - Body text
- **Headings**: `#1a1a1a` (Black) - Title and headings

#### Typography
- **Font Family**: `'Inter', 'Helvetica Neue', Arial, sans-serif`
- **Title Size**: `32px` with `700` weight
- **Body Size**: `16px` with `26px` line height
- **Professional**: Clean, modern SaaS typography

## 💡 Additional Examples

### Welcome Email

```json
{
  "template": {
    "key": "password-reset-template",
    "locale": "en"
  },
  "variables": {
    "header": {
      "logo_url": "https://i.ibb.co/8LfvqPk7/Waymore-logo-Colour.png",
      "logo_alt": "Waymore",
      "tagline": "Empowering your business"
    },
    "hero": {
      "type": "none"
    },
    "title": {
      "text": "Welcome to Waymore!",
      "size": "28px",
      "weight": "700",
      "color": "#1f2937",
      "align": "center"
    },
    "body": {
      "paragraphs": [
        "Hello John, welcome to Waymore Platform!",
        "Your account is ready to use. Here are some tips to get started:",
        "• Explore your dashboard\n• Set up your profile\n• Connect your first integration\n\nIf you have any questions, don't hesitate to reach out to our support team."
      ],
      "font_size": "16px",
      "line_height": "26px"
    },
    "snapshot": {
      "title": "Account Summary",
      "facts": [
        { "label": "Account Type", "value": "Pro Plan" },
        { "label": "Signup Date", "value": "January 15, 2024" },
        { "label": "Account ID", "value": "ACC-12345" }
      ],
      "style": "table"
    },
    "visual": {
      "type": "progress",
      "progress_bars": [
        {
          "label": "Account Setup",
          "current": 3,
          "max": 5,
          "unit": "steps",
          "percentage": 60,
          "color": "#3b82f6",
          "description": "Complete your profile setup"
        }
      ]
    },
    "actions": {
      "primary": {
        "label": "Get Started",
        "url": "https://app.waymore.io/dashboard",
        "style": "button",
        "color": "#3b82f6",
        "text_color": "#ffffff"
      },
      "secondary": {
        "label": "View Documentation",
        "url": "https://docs.waymore.io",
        "style": "link",
        "color": "#6b7280"
      }
    },
    "support": {
      "title": "Need help?",
      "links": [
        { "label": "FAQ", "url": "https://waymore.io/faq" },
        { "label": "Contact Support", "url": "https://waymore.io/support" }
      ]
    },
    "footer": {
      "tagline": "Empowering your business",
      "social_links": [
        { "platform": "twitter", "url": "https://twitter.com/waymore" },
        { "platform": "linkedin", "url": "https://linkedin.com/company/waymore" }
      ],
      "legal_links": [
        { "label": "Privacy Policy", "url": "https://waymore.io/privacy" },
        { "label": "Terms of Service", "url": "https://waymore.io/terms" }
      ],
      "copyright": "© 2024 Waymore Technologies Inc. All rights reserved."
    }
  }
}
```

### Payment Success Email

```json
{
  "template": {
    "key": "password-reset-template",
    "locale": "en"
  },
  "variables": {
    "header": {
      "logo_url": "https://i.ibb.co/8LfvqPk7/Waymore-logo-Colour.png",
      "logo_alt": "Waymore",
      "tagline": "Empowering your business"
    },
    "hero": {
      "type": "icon",
      "icon": "✅",
      "icon_size": "48px"
    },
    "title": {
      "text": "Payment Successful - Receipt #INV-2024-001",
      "size": "28px",
      "weight": "700",
      "color": "#10b981",
      "align": "center"
    },
    "body": {
      "paragraphs": [
        "Hello John, your payment has been processed successfully!",
        "Thank you for your business and continued trust in Waymore Platform.",
        "Your receipt and transaction details are included below."
      ],
      "font_size": "16px",
      "line_height": "26px"
    },
    "snapshot": {
      "title": "Transaction Details",
      "facts": [
        { "label": "Transaction ID", "value": "TXN-12345" },
        { "label": "Amount", "value": "$29.99" },
        { "label": "Plan", "value": "Pro Monthly" },
        { "label": "Payment Method", "value": "**** 4242" },
        { "label": "Date", "value": "January 15, 2024" },
        { "label": "Next Billing", "value": "February 15, 2024" }
      ],
      "style": "table"
    },
    "visual": {
      "type": "none"
    },
    "actions": {
      "primary": {
        "label": "Download Receipt",
        "url": "https://app.waymore.io/receipts/TXN-12345",
        "style": "button",
        "color": "#10b981",
        "text_color": "#ffffff"
      },
      "secondary": {
        "label": "View Billing History",
        "url": "https://app.waymore.io/billing",
        "style": "link",
        "color": "#6b7280"
      }
    },
    "support": {
      "title": "Need help?",
      "links": [
        { "label": "Billing FAQ", "url": "https://waymore.io/billing-faq" },
        { "label": "Contact Support", "url": "https://waymore.io/support" }
      ]
    },
    "footer": {
      "tagline": "Empowering your business",
      "social_links": [
        { "platform": "twitter", "url": "https://twitter.com/waymore" },
        { "platform": "linkedin", "url": "https://linkedin.com/company/waymore" }
      ],
      "legal_links": [
        { "label": "Privacy Policy", "url": "https://waymore.io/privacy" },
        { "label": "Terms of Service", "url": "https://waymore.io/terms" }
      ],
      "copyright": "© 2024 Waymore Technologies Inc. All rights reserved."
    }
  }
}
```

### Usage Alert Email

```json
{
  "template": {
    "key": "password-reset-template",
    "locale": "en"
  },
  "variables": {
    "header": {
      "logo_url": "https://i.ibb.co/8LfvqPk7/Waymore-logo-Colour.png",
      "logo_alt": "Waymore",
      "tagline": "Empowering your business"
    },
    "hero": {
      "type": "icon",
      "icon": "⚠️",
      "icon_size": "48px"
    },
    "title": {
      "text": "Usage Alert - 80% Limit Reached",
      "size": "28px",
      "weight": "700",
      "color": "#f59e0b",
      "align": "center"
    },
    "body": {
      "paragraphs": [
        "Hello John, you've used 80% of your Pro plan.",
        "You're approaching your monthly limit. Consider upgrading to avoid any service interruption.",
        "Your current usage breakdown is shown below."
      ],
      "font_size": "16px",
      "line_height": "26px"
    },
    "visual": {
      "type": "progress",
      "progress_bars": [
        {
          "label": "API Requests",
          "current": 8000,
          "total": 10000,
          "percentage": 80,
          "unit": "requests",
          "color": "#f59e0b",
          "description": "Monthly usage"
        }
      ]
    },
    "snapshot": {
      "title": "Usage Summary",
      "facts": [
        { "label": "Current Usage", "value": "80%" },
        { "label": "Plan Limit", "value": "10,000 requests" },
        { "label": "Used", "value": "8,000 requests" },
        { "label": "Remaining", "value": "2,000 requests" }
      ],
      "style": "table"
    },
    "actions": {
      "primary": {
        "label": "Upgrade Plan",
        "url": "https://app.waymore.io/upgrade",
        "style": "button",
        "color": "#f59e0b",
        "text_color": "#ffffff"
      },
      "secondary": {
        "label": "View Usage Details",
        "url": "https://app.waymore.io/usage",
        "style": "link",
        "color": "#6b7280"
      }
    },
    "support": {
      "title": "Need help?",
      "links": [
        { "label": "Usage FAQ", "url": "https://waymore.io/usage-faq" },
        { "label": "Contact Support", "url": "https://waymore.io/support" }
      ]
    },
    "footer": {
      "tagline": "Empowering your business",
      "social_links": [
        { "platform": "twitter", "url": "https://twitter.com/waymore" },
        { "platform": "linkedin", "url": "https://linkedin.com/company/waymore" }
      ],
      "legal_links": [
        { "label": "Privacy Policy", "url": "https://waymore.io/privacy" },
        { "label": "Terms of Service", "url": "https://waymore.io/terms" }
      ],
      "copyright": "© 2024 Waymore Technologies Inc. All rights reserved."
    }
  }
}
```

### Countdown Timer Email

```json
{
  "template": {
    "key": "password-reset-template",
    "locale": "en"
  },
  "variables": {
    "header": {
      "logo_url": "https://i.ibb.co/8LfvqPk7/Waymore-logo-Colour.png",
      "logo_alt": "Waymore",
      "tagline": "Empowering your business"
    },
    "hero": {
      "type": "icon",
      "icon": "⏰",
      "icon_size": "48px"
    },
    "title": {
      "text": "Limited Time Offer - 24 Hours Left!",
      "size": "28px",
      "weight": "700",
      "color": "#ef4444",
      "align": "center"
    },
    "body": {
      "paragraphs": [
        "Hello John, don't miss out on our special promotion!",
        "Get 50% off your first year of Pro plan - but hurry, this offer expires soon.",
        "Use the code SAVE50 at checkout to claim your discount."
      ],
      "font_size": "16px",
      "line_height": "26px"
    },
    "visual": {
      "type": "countdown",
      "countdown": {
        "message": "Offer expires in",
        "target_date": "2024-01-16T23:59:59Z",
        "show_days": true,
        "show_hours": true,
        "show_minutes": true,
        "show_seconds": true
      }
    },
    "snapshot": {
      "title": "Offer Details",
      "facts": [
        { "label": "Discount", "value": "50% OFF" },
        { "label": "Code", "value": "SAVE50" },
        { "label": "Valid For", "value": "First Year" },
        { "label": "Expires", "value": "January 16, 2024" }
      ],
      "style": "table"
    },
    "actions": {
      "primary": {
        "label": "Claim Offer Now",
        "url": "https://app.waymore.io/upgrade?code=SAVE50",
        "style": "button",
        "color": "#ef4444",
        "text_color": "#ffffff"
      },
      "secondary": {
        "label": "Learn More",
        "url": "https://waymore.io/promotion",
        "style": "link",
        "color": "#6b7280"
      }
    },
    "support": {
      "title": "Need help?",
      "links": [
        { "label": "Promotion FAQ", "url": "https://waymore.io/promotion-faq" },
        { "label": "Contact Support", "url": "https://waymore.io/support" }
      ]
    },
    "footer": {
      "tagline": "Empowering your business",
      "social_links": [
        { "platform": "twitter", "url": "https://twitter.com/waymore" },
        { "platform": "linkedin", "url": "https://linkedin.com/company/waymore" }
      ],
      "legal_links": [
        { "label": "Privacy Policy", "url": "https://waymore.io/privacy" },
        { "label": "Terms of Service", "url": "https://waymore.io/terms" }
      ],
      "copyright": "© 2024 Waymore Technologies Inc. All rights reserved."
    }
  }
}
```

## 🎯 Complete Template Example

This example demonstrates a comprehensive template creation request that includes ALL available options and features:

### Complete Template Creation Request

```bash
curl --location 'http://localhost:3000/api/v1/templates' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_JWT_TOKEN' \
--data-raw '{
  "key": "comprehensive-email-template",
  "name": "Comprehensive Email Template",
  "description": "A complete template showcasing all available features and options",
  "category": "transactional",
  "jsonStructure": {
    "template": {
      "key": "comprehensive-email-template",
      "locale": "en",
      "subject": "Welcome to Our Platform",
      "from": "Your Company <noreply@yourcompany.com>",
      "preheader": "Complete email template showcasing all available features"
    },
    "variables": {
      "header": {
        "logo_url": "https://yourcompany.com/logo.png",
        "logo_alt": "Your Company Logo",
        "tagline": "Empowering your business"
      },
      "hero": {
        "type": "icon",
        "icon": "🎉",
        "icon_size": "48px"
      },
      "title": {
        "text": "Welcome to Our Platform!",
        "size": "28px",
        "weight": "700",
        "color": "#1f2937",
        "align": "center"
      },
      "body": {
        "intro": "Hi John,",
        "paragraphs": [
          "Welcome to our comprehensive email template system!",
          "This template showcases all available features and customization options.",
          "You can use any combination of these features to create the perfect email."
        ],
        "note": "If you have any questions, please contact our support team.",
        "font_size": "16px",
        "line_height": "26px"
      },
      "snapshot": {
        "title": "Account Information",
        "facts": [
          { "label": "Account Type", "value": "Premium" },
          { "label": "Created", "value": "January 1, 2024" },
          { "label": "Status", "value": "Active" }
        ],
        "style": "table"
      },
      "visual": {
        "type": "progress",
        "progress_bars": [
          {
            "label": "Profile Completion",
            "current": 75,
            "max": 100,
            "unit": "%",
            "percentage": 75,
            "color": "#3b82f6",
            "description": "Complete your profile setup"
          }
        ]
      },
      "actions": {
        "primary": {
          "label": "Get Started",
          "url": "https://yourcompany.com/dashboard",
          "style": "button",
          "color": "#3b82f6",
          "text_color": "#ffffff"
        },
        "secondary": {
          "label": "Learn More",
          "url": "https://yourcompany.com/docs",
          "style": "link",
          "color": "#6b7280"
        }
      },
      "support": {
        "title": "Need help?",
        "links": [
          { "label": "FAQ", "url": "https://yourcompany.com/faq" },
          { "label": "Contact Support", "url": "https://yourcompany.com/support" }
        ]
      },
      "footer": {
        "tagline": "Empowering your business",
        "social_links": [
          { "platform": "twitter", "url": "https://twitter.com/yourcompany" },
          { "platform": "linkedin", "url": "https://linkedin.com/company/yourcompany" }
        ],
        "legal_links": [
          { "label": "Privacy Policy", "url": "https://yourcompany.com/privacy" },
          { "label": "Terms of Service", "url": "https://yourcompany.com/terms" }
        ],
        "copyright": "© 2024 Your Company. All rights reserved."
      },
      "footer_links": [
        { "label": "Privacy Policy", "url": "https://yourcompany.com/privacy" },
        { "label": "Terms of Service", "url": "https://yourcompany.com/terms" },
        { "label": "Unsubscribe", "url": "https://yourcompany.com/unsubscribe?token=abc123" }
      ],
      "theme": {
        "font_family": "'Inter', 'Helvetica Neue', Arial, sans-serif",
        "font_size": "16px",
        "text_color": "#2c3e50",
        "heading_color": "#1a1a1a",
        "background_color": "#ffffff",
        "body_background": "#f4f4f4",
        "muted_text_color": "#888888",
        "border_color": "#e0e0e0",
        "primary_button_color": "#3b82f6",
        "primary_button_text_color": "#ffffff",
        "secondary_button_color": "#6c757d",
        "secondary_button_text_color": "#ffffff",
        "dark_mode": false,
        "dark_background_color": "#1a1a1a",
        "dark_text_color": "#e0e0e0",
        "dark_heading_color": "#ffffff",
        "dark_muted_color": "#888888",
        "dark_border_color": "#333333",
        "dark_card_background": "#2a2a2a"
      },
      "content": {
        "en": "Welcome to our platform!",
        "es": "¡Bienvenido a nuestra plataforma!",
        "fr": "Bienvenue sur notre plateforme!"
      },
      "custom_content": "Custom HTML content can be added here"
    },
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
      "hero": {
        "type": "object",
        "properties": {
          "type": { "type": "string", "enum": ["none", "image", "icon"] },
          "image_url": { "type": "string" },
          "image_alt": { "type": "string" },
          "image_width": { "type": "string" },
          "icon": { "type": "string" },
          "icon_size": { "type": "string" }
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
          "intro": { "type": "string" },
          "paragraphs": { "type": "array", "items": { "type": "string" } },
          "note": { "type": "string" },
          "font_size": { "type": "string" },
          "line_height": { "type": "string" }
        }
      },
      "snapshot": {
        "type": "object",
        "properties": {
          "title": { "type": "string" },
          "facts": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "label": { "type": "string" },
                "value": { "type": "string" }
              }
            }
          },
          "style": { "type": "string", "enum": ["table", "cards", "list"] }
        }
      },
      "visual": {
        "type": "object",
        "properties": {
          "type": { "type": "string", "enum": ["none", "progress", "countdown", "badge"] },
          "progress_bars": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "label": { "type": "string" },
                "current": { "type": "number" },
                "max": { "type": "number" },
                "unit": { "type": "string" },
                "percentage": { "type": "number" },
                "color": { "type": "string" },
                "description": { "type": "string" }
              }
            }
          },
          "countdown": {
            "type": "object",
            "properties": {
              "message": { "type": "string" },
              "target_date": { "type": "string" },
              "show_days": { "type": "boolean" },
              "show_hours": { "type": "boolean" },
              "show_minutes": { "type": "boolean" },
              "show_seconds": { "type": "boolean" }
            }
          }
        }
      },
      "actions": {
        "type": "object",
        "properties": {
          "primary": {
            "type": "object",
            "properties": {
              "label": { "type": "string" },
              "url": { "type": "string" },
              "style": { "type": "string", "enum": ["button", "link"] },
              "color": { "type": "string" },
              "text_color": { "type": "string" }
            }
          },
          "secondary": {
            "type": "object",
            "properties": {
              "label": { "type": "string" },
              "url": { "type": "string" },
              "style": { "type": "string", "enum": ["button", "link"] },
              "color": { "type": "string" },
              "text_color": { "type": "string" }
            }
          }
        }
      },
      "support": {
        "type": "object",
        "properties": {
          "title": { "type": "string" },
          "links": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "label": { "type": "string" },
                "url": { "type": "string" }
              }
            }
          }
        }
      },
      "footer": {
        "type": "object",
        "properties": {
          "tagline": { "type": "string" },
          "social_links": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "platform": { "type": "string", "enum": ["twitter", "linkedin", "github", "facebook", "instagram"] },
                "url": { "type": "string" }
              }
            }
          },
          "legal_links": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "label": { "type": "string" },
                "url": { "type": "string" }
              }
            }
          },
          "copyright": { "type": "string" }
        }
      },
      "footer_links": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "label": { "type": "string" },
            "url": { "type": "string" }
          }
        }
      },
      "theme": {
        "type": "object",
        "properties": {
          "font_family": { "type": "string" },
          "font_size": { "type": "string" },
          "text_color": { "type": "string" },
          "heading_color": { "type": "string" },
          "background_color": { "type": "string" },
          "body_background": { "type": "string" },
          "muted_text_color": { "type": "string" },
          "border_color": { "type": "string" },
          "primary_button_color": { "type": "string" },
          "primary_button_text_color": { "type": "string" },
          "secondary_button_color": { "type": "string" },
          "secondary_button_text_color": { "type": "string" },
          "dark_mode": { "type": "boolean" },
          "dark_background_color": { "type": "string" },
          "dark_text_color": { "type": "string" },
          "dark_heading_color": { "type": "string" },
          "dark_muted_color": { "type": "string" },
          "dark_border_color": { "type": "string" },
          "dark_card_background": { "type": "string" }
        }
      },
      "content": {
        "type": "object",
        "additionalProperties": { "type": "string" }
      },
      "custom_content": { "type": "string" }
    },
    "required": ["header", "title", "body"]
  },
  "jsonStructure": {
    "header": {
      "logo_url": "{{header.logo_url}}",
      "logo_alt": "{{header.logo_alt}}",
      "tagline": "{{header.tagline}}"
    },
    "hero": {
      "type": "{{hero.type}}",
      "image_url": "{{hero.image_url}}",
      "image_alt": "{{hero.image_alt}}",
      "image_width": "{{hero.image_width}}",
      "icon": "{{hero.icon}}",
      "icon_size": "{{hero.icon_size}}"
    },
    "title": {
      "text": "{{title.text}}",
      "size": "{{title.size}}",
      "weight": "{{title.weight}}",
      "color": "{{title.color}}",
      "align": "{{title.align}}"
    },
    "body": {
      "intro": "{{body.intro}}",
      "paragraphs": "{{body.paragraphs}}",
      "note": "{{body.note}}",
      "font_size": "{{body.font_size}}",
      "line_height": "{{body.line_height}}"
    },
    "snapshot": {
      "title": "{{snapshot.title}}",
      "facts": "{{snapshot.facts}}",
      "style": "{{snapshot.style}}"
    },
    "visual": {
      "type": "{{visual.type}}",
      "progress_bars": "{{visual.progress_bars}}",
      "countdown": "{{visual.countdown}}"
    },
    "actions": {
      "primary": "{{actions.primary}}",
      "secondary": "{{actions.secondary}}"
    },
    "support": {
      "title": "{{support.title}}",
      "links": "{{support.links}}"
    },
    "footer": {
      "tagline": "{{footer.tagline}}",
      "social_links": "{{footer.social_links}}",
      "legal_links": "{{footer.legal_links}}",
      "copyright": "{{footer.copyright}}"
    },
    "footer_links": "{{footer_links}}",
    "theme": {
      "font_family": "{{theme.font_family}}",
      "font_size": "{{theme.font_size}}",
      "text_color": "{{theme.text_color}}",
      "heading_color": "{{theme.heading_color}}",
      "background_color": "{{theme.background_color}}",
      "body_background": "{{theme.body_background}}",
      "muted_text_color": "{{theme.muted_text_color}}",
      "border_color": "{{theme.border_color}}",
      "primary_button_color": "{{theme.primary_button_color}}",
      "primary_button_text_color": "{{theme.primary_button_text_color}}",
      "secondary_button_color": "{{theme.secondary_button_color}}",
      "secondary_button_text_color": "{{theme.secondary_button_text_color}}",
      "dark_mode": "{{theme.dark_mode}}",
      "dark_background_color": "{{theme.dark_background_color}}",
      "dark_text_color": "{{theme.dark_text_color}}",
      "dark_heading_color": "{{theme.dark_heading_color}}",
      "dark_muted_color": "{{theme.dark_muted_color}}",
      "dark_border_color": "{{theme.dark_border_color}}",
      "dark_card_background": "{{theme.dark_card_background}}"
    },
      "content": {
        "type": "object",
        "additionalProperties": { "type": "string" }
      },
      "custom_content": { "type": "string" }
    },
    "required": ["header", "title", "body"]
  }
}'
```

### Complete Template Usage Example

Once the template is created, you can use it to send emails:

```bash
curl --location 'http://localhost:3000/api/v1/emails' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer YOUR_JWT_TOKEN' \
--header 'Idempotency-Key: unique-key-123' \
--data-raw '{
  "from": {
    "email": "noreply@yourcompany.com",
    "name": "Your Company"
  },
  "subject": "Complete Email Example",
  "to": [
    {
      "email": "user@example.com",
      "name": "John Doe"
    }
  ],
  "template": {
    "key": "comprehensive-email-template",
    "locale": "en"
  },
  "variables": {
    "header": {
      "logo_url": "https://yourcompany.com/logo.png",
      "logo_alt": "Your Company Logo",
      "tagline": "Empowering your business"
    },
    "hero": {
      "type": "icon",
      "icon": "🎉",
      "icon_size": "48px"
    },
    "title": {
      "text": "Welcome to Our Platform!",
      "size": "28px",
      "weight": "700",
      "color": "#1f2937",
      "align": "center"
    },
    "body": {
      "intro": "Hi John,",
      "paragraphs": [
        "Welcome to our comprehensive email template system!",
        "This template showcases all available features and customization options.",
        "You can use any combination of these features to create the perfect email."
      ],
      "note": "If you have any questions, please contact our support team.",
      "font_size": "16px",
      "line_height": "26px"
    },
    "snapshot": {
      "title": "Account Information",
      "facts": [
        { "label": "Account Type", "value": "Premium" },
        { "label": "Created", "value": "January 1, 2024" },
        { "label": "Status", "value": "Active" }
      ],
      "style": "table"
    },
    "visual": {
      "type": "progress",
      "progress_bars": [
        {
          "label": "Profile Completion",
          "current": 75,
          "max": 100,
          "unit": "%",
          "percentage": 75,
          "color": "#3b82f6",
          "description": "Complete your profile setup"
        }
      ]
    },
    "actions": {
      "primary": {
        "label": "Get Started",
        "url": "https://yourcompany.com/dashboard",
        "style": "button",
        "color": "#3b82f6",
        "text_color": "#ffffff"
      },
      "secondary": {
        "label": "Learn More",
        "url": "https://yourcompany.com/docs",
        "style": "link",
        "color": "#6b7280"
      }
    },
    "support": {
      "title": "Need help?",
      "links": [
        { "label": "FAQ", "url": "https://yourcompany.com/faq" },
        { "label": "Contact Support", "url": "https://yourcompany.com/support" }
      ]
    },
    "footer": {
      "tagline": "Empowering your business",
      "social_links": [
        { "platform": "twitter", "url": "https://twitter.com/yourcompany" },
        { "platform": "linkedin", "url": "https://linkedin.com/company/yourcompany" }
      ],
      "legal_links": [
        { "label": "Privacy Policy", "url": "https://yourcompany.com/privacy" },
        { "label": "Terms of Service", "url": "https://yourcompany.com/terms" }
      ],
      "copyright": "© 2024 Your Company. All rights reserved."
    },
    "footer_links": [
      { "label": "Privacy Policy", "url": "https://yourcompany.com/privacy" },
      { "label": "Terms of Service", "url": "https://yourcompany.com/terms" },
      { "label": "Unsubscribe", "url": "https://yourcompany.com/unsubscribe?token=abc123" }
    ],
    "theme": {
      "font_family": "'Inter', 'Helvetica Neue', Arial, sans-serif",
      "font_size": "16px",
      "text_color": "#2c3e50",
      "heading_color": "#1a1a1a",
      "background_color": "#ffffff",
      "body_background": "#f4f4f4",
      "muted_text_color": "#888888",
      "border_color": "#e0e0e0",
      "primary_button_color": "#3b82f6",
      "primary_button_text_color": "#ffffff",
      "secondary_button_color": "#6c757d",
      "secondary_button_text_color": "#ffffff",
      "dark_mode": false,
      "dark_background_color": "#1a1a1a",
      "dark_text_color": "#e0e0e0",
      "dark_heading_color": "#ffffff",
      "dark_muted_color": "#888888",
      "dark_border_color": "#333333",
      "dark_card_background": "#2a2a2a"
    },
    "content": {
      "en": "Welcome to our platform!",
      "es": "¡Bienvenido a nuestra plataforma!",
      "fr": "Bienvenue sur notre plateforme!"
    },
    "custom_content": "Custom HTML content can be added here"
  },
  "metadata": {
    "tenantId": "your_tenant",
    "eventId": "welcome_email",
    "notificationType": "welcome"
  }
}'
```

### Template Category Validation

Categories must be one of the predefined values:

**Valid Categories:**
- ✅ `transactional` - Essential account-related emails
- ✅ `marketing` - Promotional and marketing emails  
- ✅ `notification` - System-generated notifications
- ✅ `test` - Development and testing templates

**Invalid Categories:**
- ❌ Custom categories (e.g., `custom`, `my-category`)
- ❌ Empty or null values
- ❌ Non-string values

**Important**: The `category` field is **required** by the database, even though the API validation doesn't currently check for it. Omitting this field will result in a database error.

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

### Template Categories

**Valid Categories:**
- ✅ `transactional` - Essential account-related emails
- ✅ `marketing` - Promotional and marketing emails  
- ✅ `notification` - System-generated notifications
- ✅ `test` - Development and testing templates

**Invalid Categories:**
- ❌ Custom categories (e.g., `custom`, `my-category`)
- ❌ Empty or null values
- ❌ Non-string values

## 🎯 Best Practices

### ✅ Do's

#### Template Creation
1. **Always include required fields**: `key`, `name`, `category`, `variableSchema`, `jsonStructure`
2. **Use valid template keys**: lowercase, hyphens only, no special characters
3. **Define comprehensive variable schemas**: Include all possible variables with proper types
4. **Validate before creating**: Use the validation endpoint to check structure
5. **Use descriptive names**: Make template names and descriptions clear and meaningful
6. **Choose appropriate categories**: Use correct category for template type (transactional, marketing, notification, test)
7. **Test template creation**: Verify templates are created successfully before using

#### Template Structure (Based on Showcase Template)
8. **Use object-based structure**: Use structured sections (`header`, `hero`, `title`, `body`, `snapshot`, `visual`, `actions`, `support`, `footer`)
9. **Use proper JSON structure**: Wrap template key/locale in `template` object, variables in `variables` object
10. **Avoid redundancy**: Don't duplicate information between facts table and progress bars
11. **Use PNG/JPG images**: Avoid SVG for better email client compatibility
12. **Test across email clients**: Gmail, Outlook, Apple Mail, etc.
13. **Use semantic HTML**: Proper heading structure and alt text
14. **Optimize images**: Compress images for faster loading
15. **Use consistent branding**: Apply your brand colors and fonts
16. **Test multi-language content**: Verify all supported locales
17. **Provide fallbacks**: Always have fallback content for missing variables
18. **Include footer links**: Add privacy policy, terms, and unsubscribe links
19. **Use structured data**: Leverage the object-based structure for better organization
20. **Test with `__base__` locale**: Always test base template structure first
21. **Use realistic data**: Include realistic usage metrics and professional content
22. **Implement proper theming**: Use consistent color schemes and typography

#### Multi-Language Best Practices
23. **Start with base template**: Create base template structure first
24. **Add locales gradually**: Add locale-specific content as needed
25. **Use consistent variables**: Keep variables consistent across all locales
26. **Test fallback behavior**: Verify fallback behavior works correctly
27. **Use proper locale codes**: Use standard ISO 639-1 language codes

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

#### Multi-Language Don'ts
21. **Don't assume "en" fallback**: System falls back to base template structure, not "en"
22. **Don't skip base template testing**: Always test with `__base__` locale first
23. **Don't use invalid locale codes**: Stick to supported ISO 639-1 codes

### 🎨 Design Guidelines (From Showcase Template)

1. **Color Contrast**: Ensure sufficient contrast for readability
2. **Font Sizes**: Use at least 14px for body text
3. **Button Sizes**: Make buttons at least 44px tall for touch
4. **Spacing**: Use consistent spacing between elements
5. **Images**: Optimize for retina displays (2x resolution)
6. **Loading**: Keep total email size under 100KB
7. **Professional Typography**: Use modern font families like Inter or Helvetica Neue
8. **Consistent Branding**: Apply brand colors consistently across all elements
9. **Data Visualization**: Use progress bars and structured tables for data display
10. **Accessibility**: Include proper alt text and semantic HTML structure

## 🔧 Template Validation

### Validation API

Use the validation API to check your template structure before sending emails:

```bash
curl -X POST https://api.waymore.io/email-gateway/api/v1/templates/validate \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "template": {
      "key": "password-reset-template",
      "locale": "en"
    },
    "variables": {
      // Your template variables here
    }
  }'
```

### Validation Response

**Valid Template:**
```json
{
  "valid": true,
  "errors": [],
  "warnings": [
    {
      "type": "missing_optional_variable",
      "field": "footer_links",
      "message": "Consider adding footer links for better user experience",
      "suggestion": "Add privacy policy, terms of service, and unsubscribe links"
    }
  ],
  "suggestions": [
    "Review warnings for best practices and accessibility"
  ]
}
```

**Invalid Template:**
```json
{
  "valid": false,
  "errors": [
    {
      "type": "invalid_variable_format",
      "field": "support_email",
      "message": "support_email must be a valid email address",
      "suggestion": "Use a valid email format like 'support@example.com'"
    },
    {
      "type": "invalid_progress_bar",
      "field": "progress_bars[0].max",
      "message": "Progress bar missing required 'max' field",
      "suggestion": "Add max value for progress bar"
    }
  ],
  "warnings": [],
  "suggestions": [
    "Fix all validation errors before using this template"
  ]
}
```

### Common Validation Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `invalid_variable_format` | Invalid email format | Use valid email format like `support@example.com` |
| `invalid_progress_bar` | Progress bar missing `max` or `unit` | Add missing fields |
| `redundant_information` | Duplicate data in facts and progress bars | Remove duplicates |
| `invalid_url` | Invalid URL format | Use valid URL format |
| `invalid_color` | Invalid hex color | Use format like `#FF5733` |
| `exceeds_limit` | Too many items in array | Reduce array size |

### Validation Best Practices

1. **Always validate before sending**: Use the validation API to catch errors early
2. **Fix errors first**: Address all validation errors before warnings
3. **Review warnings**: Consider suggestions for better user experience
4. **Test with real data**: Validate with actual variable values
5. **Use in CI/CD**: Integrate validation into your deployment pipeline

## 📸 Image Sizing Best Practices

### 🎯 Hero Image Sizing

The `hero` section supports both icons and images. When using images, follow these guidelines for optimal email rendering:

#### ✅ **Recommended Image Widths**

| Use Case | Width | Description |
|----------|-------|-------------|
| **Large Hero Images** | `600px` | Full email width (desktop) |
| **Medium Hero Images** | `400px` | Standard hero size |
| **Small Hero Images** | `300px` | Compact hero size |
| **Logo Images** | `200px` | Company logos |
| **Small Logos** | `150px` | Footer logos |

#### ❌ **Avoid Percentage Widths**

**Important**: Email clients (Gmail, Outlook, Apple Mail) do not reliably support percentage-based widths for images. Use fixed pixel widths instead.

```json
// ✅ GOOD - Fixed pixel widths
{
  "hero": {
    "type": "image",
    "image_url": "https://example.com/hero.jpg",
    "image_alt": "Hero Image",
    "image_width": "400px"
  }
}

// ❌ BAD - Percentage widths (not supported in emails)
{
  "hero": {
    "type": "image", 
    "image_url": "https://example.com/hero.jpg",
    "image_alt": "Hero Image",
    "image_width": "100%"  // Will render inconsistently
  }
}
```

#### 📱 **Responsive Considerations**

- **Desktop**: Images render at specified pixel width
- **Mobile**: Images automatically scale down proportionally
- **Aspect Ratio**: Always maintained with `height: auto`

#### 🎨 **Image Quality Guidelines**

- **High Resolution**: Use 2x resolution for crisp display on retina screens
- **File Size**: Keep under 1MB for fast loading
- **Format**: Use JPEG for photos, PNG for graphics with transparency
- **Alt Text**: Always provide descriptive alt text for accessibility

#### 🔧 **Example Configurations**

```json
// Large hero image for announcements
{
  "hero": {
    "type": "image",
    "image_url": "https://example.com/announcement.jpg",
    "image_alt": "New Feature Announcement",
    "image_width": "600px",
    "show": true
  }
}

// Medium hero image for welcome emails
{
  "hero": {
    "type": "image", 
    "image_url": "https://example.com/welcome.jpg",
    "image_alt": "Welcome to Our Platform",
    "image_width": "400px",
    "show": true
  }
}

// Small logo for receipts
{
  "hero": {
    "type": "image",
    "image_url": "https://example.com/logo.png", 
    "image_alt": "Company Logo",
    "image_width": "200px",
    "show": true
  }
}
```

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

**Problem**: Template already exists error
**Solutions**:
- Check if template with same key already exists
- Use different template key
- Update existing template using PUT endpoint instead

#### Template Structure Errors

**Problem**: Template generation creates incorrect JSON structure
**Solutions**:
- Ensure `template` object contains `key` and `locale`
- Keep `variables` object separate from `template` object
- Use proper JSON syntax with correct brackets and commas
- Validate JSON structure before using

#### Missing Required Object Structure

**Problem**: Template fails due to missing required object structure
**Solutions**:
- Always include proper object-based sections: `header`, `title`, `body`
- Check object structure matches exactly (case-sensitive)
- Provide fallback values for optional sections
- Test with minimal required sections first

#### Images Not Displaying

**Problem**: Images not showing in email
**Solutions**:
- Use PNG or JPG format (avoid SVG)
- Ensure image URLs are publicly accessible
- Check image URL format (use direct links)
- Test image URL in browser first

#### Buttons Not Side-by-Side

**Problem**: Buttons stacking vertically instead of side-by-side
**Solutions**:
- Ensure both `cta_primary` and `cta_secondary` are provided
- Check button labels are not too long
- Verify template is using the latest version

#### Theme Not Applying

**Problem**: Custom theme colors not showing
**Solutions**:
- Check theme object structure
- Ensure color values are valid hex codes
- Verify theme object is properly nested in variables
- Test with a simple theme first

#### Multi-Language Not Working

**Problem**: Content not changing based on locale
**Solutions**:
- Check `content` object has the correct locale key
- Verify `template.locale` matches content keys
- Ensure locale is supported (en, es, fr, de, it, pt, etc.)
- Test with `__base__` locale to see base template structure
- Remember: If locale not found, system falls back to base template structure (not "en")

#### Social Links Not Showing

**Problem**: Social media links not displaying
**Solutions**:
- Check platform names are correct (twitter, linkedin, github, facebook, instagram)
- Verify URLs are valid and accessible
- Ensure social_links array is properly formatted
- Test with a single social link first

#### Footer Customization Not Working

**Problem**: Custom footer content not displaying
**Solutions**:
- Check `footer` object contains proper structure
- Verify `footer.social_links` array has correct structure with `platform` and `url`
- Ensure `footer.legal_links` array has correct structure with `label` and `url`
- Test with simple footer object first
- Check that footer object is properly nested in variables object

#### Hero Images Not Displaying Correctly

**Problem**: Hero images appear too small or too large in email clients
**Solutions**:
- **Use fixed pixel widths**: Replace percentage widths (`100%`, `50%`) with fixed pixels (`600px`, `300px`)
- **Check image dimensions**: Ensure image is high enough resolution for the specified width
- **Test in multiple clients**: Gmail, Outlook, and Apple Mail may render differently
- **Use recommended widths**: 600px (large), 400px (medium), 300px (small), 200px (logo)
- **Verify image URL**: Ensure the image URL is accessible and returns a valid image

**Example Fix**:
```json
// ❌ Problem - Percentage width
{
  "hero": {
    "type": "image",
    "image_url": "https://example.com/image.jpg",
    "image_width": "100%"  // Not supported in emails
  }
}

// ✅ Solution - Fixed pixel width
{
  "hero": {
    "type": "image", 
    "image_url": "https://example.com/image.jpg",
    "image_width": "600px"  // Works reliably in all email clients
  }
}
```

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
**Template Version**: Transactional v2.2.0 (Enhanced Developer Experience with Showcase Examples)  
**Guide Version**: 2.2.0 - Restructured for developers with showcase template best practices and enhanced locale system documentation

## 🎯 Key Improvements in This Version

### For Developers
- **Quick Start Section**: Immediate examples for template creation and email sending
- **Restructured Content**: Developer-focused organization with clear sections
- **Showcase Examples**: Real-world SaaS quota research template with multi-language support
- **Enhanced API Reference**: Complete endpoint documentation and category validation
- **Best Practices Integration**: Showcase template best practices integrated throughout

### Template System Enhancements
- **Object-Based Architecture**: Clear section organization and properties reference
- **Enhanced Locale System**: 40+ locales with intelligent fallback and `__base__` testing
- **Professional Examples**: Realistic SaaS content with Greek and Spanish translations
- **Comprehensive Validation**: Template structure validation and error handling
- **Developer-Friendly Testing**: Base template testing with `__base__` locale

### Documentation Structure
- **Quick Start**: Immediate examples for getting started
- **Developer Overview**: System capabilities and features
- **Template Creation**: Step-by-step workflow and requirements
- **Template Structure**: Object-based architecture and API structure
- **Variable System**: Naming conventions and section properties
- **Multi-Language Support**: Locale system with fallback strategies
- **Showcase Examples**: Real-world template demonstrations
- **API Reference**: Complete endpoint documentation
- **Best Practices**: Comprehensive do's and don'ts with showcase insights
- **Troubleshooting**: Common issues and solutions