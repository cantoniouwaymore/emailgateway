# 🎨 Universal Template Guide

> Complete guide to the enhanced universal email template with advanced features, customization options, and best practices.

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

The Universal Template is a powerful, feature-rich email template built with MJML and Handlebars. It provides:

- **Responsive Design**: Works across all email clients and devices
- **Dynamic Content**: Support for custom HTML content and multi-language
- **Visual Customization**: Complete theme control with colors, fonts, and styling
- **Interactive Elements**: Multi-button support and social media integration
- **Data Display**: Structured facts table for key-value information
- **Image Support**: Dynamic images with fallback to default branding

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

### 🔧 Core Variables

| Variable | Type | Required | Description | Example |
|----------|------|----------|-------------|---------|
| `workspace_name` | string | ✅ | Your company/workspace name | `"Waymore"` |
| `user_firstname` | string | ✅ | Recipient's first name | `"John"` |
| `product_name` | string | ✅ | Your product/service name | `"Waymore Platform"` |
| `support_email` | string | ✅ | Support contact email | `"support@waymore.io"` |
| `email_title` | string | ✅ | Main email heading | `"Welcome to Waymore!"` |
| `custom_content` | string | ❌ | HTML content for email body | `"Hello John,<br><br>Welcome!"` |

### 🖼️ Image Variables

| Variable | Type | Required | Description | Example |
|----------|------|----------|-------------|---------|
| `image_url` | string | ❌ | Custom image URL (PNG/JPG recommended) | `"https://example.com/logo.png"` |
| `image_alt` | string | ❌ | Alt text for accessibility | `"Company Logo"` |

**Note**: If `image_url` is not provided, the template will use the default Waymore logo.

### 📊 Content Variables

| Variable | Type | Required | Description | Example |
|----------|------|----------|-------------|---------|
| `facts` | array | ❌ | Key-value pairs for facts table | See [Facts Array](#facts-array) |
| `content` | object | ❌ | Multi-language content | See [Multi-Language](#multi-language-support) |

### 🔘 Call-to-Action Variables

| Variable | Type | Required | Description | Example |
|----------|------|----------|-------------|---------|
| `cta_primary` | object | ❌ | Primary button | `{"label": "Get Started", "url": "https://app.com"}` |
| `cta_secondary` | object | ❌ | Secondary button | `{"label": "Learn More", "url": "https://docs.com"}` |

### 📱 Social Media Variables

| Variable | Type | Required | Description | Example |
|----------|------|----------|-------------|---------|
| `social_links` | array | ❌ | Social media links | See [Social Links Array](#social-links-array) |

### 🎨 Theme Variables

| Variable | Type | Required | Description | Example |
|----------|------|----------|-------------|---------|
| `theme` | object | ❌ | Complete theme customization | See [Theme Object](#theme-object) |

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
    "key": "universal",
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

## 💡 Examples

### Basic Welcome Email

```json
{
  "to": [{"email": "user@example.com", "name": "John Doe"}],
  "from": {"email": "no-reply@waymore.io", "name": "Waymore"},
  "subject": "Welcome to Waymore!",
  "template": {"key": "universal", "locale": "en"},
  "variables": {
    "workspace_name": "Waymore",
    "user_firstname": "John",
    "product_name": "Waymore Platform",
    "support_email": "support@waymore.io",
    "email_title": "Welcome to Waymore!",
    "custom_content": "Hello John,<br><br>Welcome to our platform! Your account is ready to use.",
    "cta_primary": {
      "label": "Get Started",
      "url": "https://app.waymore.io/dashboard"
    }
  }
}
```

### Multi-Button Email

```json
{
  "template": {"key": "universal", "locale": "en"},
  "variables": {
    "workspace_name": "Waymore",
    "user_firstname": "John",
    "product_name": "Waymore Platform",
    "support_email": "support@waymore.io",
    "email_title": "Complete Your Setup",
    "custom_content": "Hello John,<br><br>Your account is almost ready! Complete these steps to get started.",
    "cta_primary": {
      "label": "Complete Setup",
      "url": "https://app.waymore.io/setup"
    },
    "cta_secondary": {
      "label": "Learn More",
      "url": "https://docs.waymore.io/getting-started"
    }
  }
}
```

### Themed Email

```json
{
  "template": {"key": "universal", "locale": "en"},
  "variables": {
    "workspace_name": "Waymore",
    "user_firstname": "John",
    "product_name": "Waymore Platform",
    "support_email": "support@waymore.io",
    "email_title": "Your Monthly Report",
    "custom_content": "Hello John,<br><br>Here's your monthly activity summary.",
    "facts": [
      {"label": "Emails Sent", "value": "1,247"},
      {"label": "Open Rate", "value": "23.4%"},
      {"label": "Click Rate", "value": "5.2%"}
    ],
    "theme": {
      "font_family": "'Inter', 'Helvetica Neue', Arial, sans-serif",
      "text_color": "#2c3e50",
      "heading_color": "#1a1a1a",
      "primary_button_color": "#28a745",
      "background_color": "#f8f9fa"
    }
  }
}
```

### Multi-Language Email

```json
{
  "template": {"key": "universal", "locale": "es"},
  "variables": {
    "workspace_name": "Waymore",
    "user_firstname": "Juan",
    "product_name": "Plataforma Waymore",
    "support_email": "soporte@waymore.io",
    "email_title": "¡Bienvenido a Waymore!",
    "content": {
      "en": "Welcome to our platform!",
      "es": "¡Bienvenido a nuestra plataforma!",
      "fr": "Bienvenue sur notre plateforme!"
    },
    "cta_primary": {
      "label": "Comenzar",
      "url": "https://app.waymore.io/dashboard"
    }
  }
}
```

### Social Media Email

```json
{
  "template": {"key": "universal", "locale": "en"},
  "variables": {
    "workspace_name": "Waymore",
    "user_firstname": "John",
    "product_name": "Waymore Platform",
    "support_email": "support@waymore.io",
    "email_title": "Follow Us for Updates",
    "custom_content": "Hello John,<br><br>Stay connected with us on social media for the latest updates and news.",
    "social_links": [
      {"platform": "twitter", "url": "https://twitter.com/waymore_io"},
      {"platform": "linkedin", "url": "https://linkedin.com/company/waymore"},
      {"platform": "github", "url": "https://github.com/waymore"}
    ]
  }
}
```

## 🎯 Best Practices

### ✅ Do's

1. **Always provide required variables**: `workspace_name`, `user_firstname`, `product_name`, `support_email`, `email_title`
2. **Use PNG/JPG images**: Avoid SVG for better email client compatibility
3. **Test across email clients**: Gmail, Outlook, Apple Mail, etc.
4. **Use semantic HTML**: Proper heading structure and alt text
5. **Optimize images**: Compress images for faster loading
6. **Use consistent branding**: Apply your brand colors and fonts
7. **Test multi-language content**: Verify all supported locales
8. **Provide fallbacks**: Always have fallback content for missing variables

### ❌ Don'ts

1. **Don't use SVG images**: Poor email client support
2. **Don't use external CSS**: Email clients strip external stylesheets
3. **Don't use complex layouts**: Keep it simple for better compatibility
4. **Don't forget alt text**: Important for accessibility
5. **Don't use too many buttons**: Max 2 buttons for better UX
6. **Don't use long URLs**: Shorten URLs for better display
7. **Don't forget mobile**: Test on mobile devices
8. **Don't use too many social links**: 3-5 links maximum

### 🎨 Design Guidelines

1. **Color Contrast**: Ensure sufficient contrast for readability
2. **Font Sizes**: Use at least 14px for body text
3. **Button Sizes**: Make buttons at least 44px tall for touch
4. **Spacing**: Use consistent spacing between elements
5. **Images**: Optimize for retina displays (2x resolution)
6. **Loading**: Keep total email size under 100KB

## 🔧 Troubleshooting

### Common Issues

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
**Template Version**: Universal v1.1.0