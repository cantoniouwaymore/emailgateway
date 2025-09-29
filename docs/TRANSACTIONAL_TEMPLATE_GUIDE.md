# 🎨 Transactional Template Guide

> Complete guide to the enhanced transactional email template with advanced features, customization options, and best practices.

## 📋 Table of Contents

- [Overview](#overview)
- [Template Features](#template-features)
- [Variable Reference](#variable-reference)
- [Theme Customization](#theme-customization)
- [Multi-Language Support](#multi-language-support)
- [Examples](#examples)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

The Transactional Template is a powerful, feature-rich email template built with MJML and Handlebars. It provides:

- **Responsive Design**: Works across all email clients and devices
- **Dynamic Content**: Support for custom HTML content and multi-language
- **Visual Customization**: Complete theme control with colors, fonts, and styling
- **Interactive Elements**: Multi-button support and social media integration
- **Data Display**: Structured facts table for key-value information
- **Image Support**: Dynamic images with fallback to default branding

## 📋 Important Note

**This guide focuses on template variables only.** The examples show the `variables` object that should be used in the email playground or when calling the email API. For complete email payloads, wrap the variables in the full email structure:

```json
{
  "to": [{"email": "user@example.com", "name": "John Doe"}],
  "from": {"email": "no-reply@waymore.io", "name": "Waymore"},
  "subject": "Your Email Subject",
  "template": {"key": "transactional", "locale": "en"},
  "variables": {
    // Template variables go here (see examples below)
  }
}
```

## 🤖 LLM Usage Instructions

**For AI/LLM Systems:** When generating transactional email templates, follow these rules:

1. **Use object-based structure**: Use structured sections (`header`, `hero`, `title`, `body`, `snapshot`, `visual`, `actions`, `support`, `footer`)
2. **Use proper structure**: Wrap template key/locale in `template` object, variables in `variables` object
3. **Avoid redundancy**: Don't duplicate information between facts table and progress bars
4. **Use consistent naming**: Follow the variable naming conventions shown in examples
5. **Include fallbacks**: Provide default values for optional variables when possible
6. **Validate structure**: Ensure all objects and arrays follow the documented format

**Template Structure:**
```json
{
  "template": {"key": "transactional", "locale": "en"},
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

## 📝 Variable Reference

### 🚨 Quick Reference for LLMs

**Template Structure:**
```json
{
  "template": {"key": "transactional", "locale": "en"},
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

**Key Rules:**
- ✅ **Object-Based Structure**: Use structured objects for each section (`header`, `hero`, `title`, `body`, `snapshot`, `visual`, `actions`, `support`, `footer`)
- ✅ **Flexible Variables**: Define any variables you want! Full Handlebars support
- ✅ Use proper JSON structure with template and variables objects
- ✅ Don't duplicate information between facts and progress bars
- ✅ Use consistent variable naming
- ❌ Don't mix template key/locale with variables
- ❌ Don't use SVG images
- ❌ Don't exceed 2 buttons or 5 social links

### 🔧 Object-Based Structure

**NEW STRUCTURED SYSTEM**: The template now supports organized object-based sections with comprehensive defaults.

**SECTION OBJECTS:**
| Section | Type | Description | Default Behavior |
|---------|------|-------------|------------------|
| `header` | object | Logo and tagline | Shows company logo with default tagline |
| `hero` | object | Hero image/icon | Hidden by default, can show image or icon |
| `title` | object | Email title | Large, bold heading with fallback text |
| `body` | object | Body paragraphs | 2-3 paragraphs with proper spacing |
| `snapshot` | object | Facts table | Structured key-value display |
| `visual` | object | Progress/countdown | Optional visual elements |
| `actions` | object | CTA buttons | Primary and secondary actions |
| `support` | object | Help links | FAQ and support resources |
| `footer` | object | Footer content | Logo, social, legal links |

### 🔧 Object-Based Structure Details

**STRUCTURED SECTIONS**: Each section is a self-contained object with its own properties and styling options.

**SECTION OBJECTS:**
| Section | Type | Description | Properties |
|---------|------|-------------|------------|
| `header` | object | Logo and tagline | `logo_url`, `logo_alt`, `tagline` |
| `hero` | object | Hero image/icon | `type`, `icon`, `icon_size`, `image_url`, `image_alt`, `image_width` |
| `title` | object | Email title | `text`, `size`, `weight`, `color`, `align` |
| `body` | object | Body paragraphs | `paragraphs`, `font_size`, `line_height` |
| `snapshot` | object | Facts table | `title`, `facts`, `style` |
| `visual` | object | Progress/countdown | `type`, `progress_bars`, `countdown` |
| `actions` | object | CTA buttons | `primary`, `secondary` |
| `support` | object | Help links | `title`, `links` |
| `footer` | object | Footer content | `tagline`, `social_links`, `legal_links`, `copyright` |


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

### Content Object

The `content` object supports multiple languages with automatic fallback:

```json
{
  "content": {
    "en": "Welcome to our platform!",
    "es": "¡Bienvenido a nuestra plataforma!",
    "fr": "Bienvenue sur notre plateforme!",
    "de": "Willkommen auf unserer Plattform!",
    "it": "Benvenuto nella nostra piattaforma!",
    "pt": "Bem-vindo à nossa plataforma!"
  }
}
```

### Locale Support

The template automatically selects content based on the `locale` parameter:

- **Template locale**: `"en"`, `"es"`, `"fr"`, `"de"`, `"it"`, `"pt"`
- **Fallback**: If locale not found, uses `custom_content`
- **Default**: If no `custom_content`, shows empty content

### Implementation

```json
{
  "template": {
    "key": "transactional",
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


## 💡 Examples

### Welcome Email

```json
{
  "template": {
    "key": "transactional",
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
    "key": "transactional",
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
    "key": "transactional",
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
    "key": "transactional",
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


## 🎯 Best Practices

### ✅ Do's

1. **Use object-based structure**: Use structured sections (`header`, `hero`, `title`, `body`, `snapshot`, `visual`, `actions`, `support`, `footer`)
2. **Use proper JSON structure**: Wrap template key/locale in `template` object, variables in `variables` object
3. **Avoid redundancy**: Don't duplicate information between facts table and progress bars
4. **Use PNG/JPG images**: Avoid SVG for better email client compatibility
5. **Test across email clients**: Gmail, Outlook, Apple Mail, etc.
6. **Use semantic HTML**: Proper heading structure and alt text
7. **Optimize images**: Compress images for faster loading
8. **Use consistent branding**: Apply your brand colors and fonts
9. **Test multi-language content**: Verify all supported locales
10. **Provide fallbacks**: Always have fallback content for missing variables
11. **Include footer links**: Add privacy policy, terms, and unsubscribe links
12. **Use structured data**: Leverage the object-based structure for better organization

### ❌ Don'ts

1. **Don't use SVG images**: Poor email client support
2. **Don't use external CSS**: Email clients strip external stylesheets
3. **Don't use complex layouts**: Keep it simple for better compatibility
4. **Don't forget alt text**: Important for accessibility
5. **Don't use too many buttons**: Max 2 buttons for better UX
6. **Don't use long URLs**: Shorten URLs for better display
7. **Don't forget mobile**: Test on mobile devices
8. **Don't use too many social links**: 3-5 links maximum
9. **Don't forget footer links**: Include unsubscribe and privacy policy links
10. **Don't use too many footer links**: 3-4 links maximum for better readability
11. **Don't duplicate information**: Avoid showing the same data in both facts table and progress bars
12. **Don't mix template structure**: Keep template key/locale separate from variables

### 🎨 Design Guidelines

1. **Color Contrast**: Ensure sufficient contrast for readability
2. **Font Sizes**: Use at least 14px for body text
3. **Button Sizes**: Make buttons at least 44px tall for touch
4. **Spacing**: Use consistent spacing between elements
5. **Images**: Optimize for retina displays (2x resolution)
6. **Loading**: Keep total email size under 100KB

## 🔧 Template Validation

### Validation API

Use the validation API to check your template structure before sending emails:

```bash
curl -X POST https://api.waymore.io/email-gateway/api/v1/templates/validate \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "template": {
      "key": "transactional",
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

#### Template Structure Errors

**Problem**: AI generates incorrect JSON structure
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
- Ensure locale is supported (en, es, fr, de, it, pt)
- Test with fallback to `custom_content`

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

**Last Updated**: September 2025  
**Template Version**: Transactional v2.0.0 (Object-Based Structure)