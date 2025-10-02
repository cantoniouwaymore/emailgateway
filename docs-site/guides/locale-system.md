# Locale System

This guide covers the multi-language support and internationalization features of the Internal Waymore Email Notification System.

## Overview

The Internal Waymore Email Notification System supports multiple languages and locales, allowing you to send emails in different languages based on user preferences or system settings.

## Configuration

### Supported Locales

The system supports the following locales by default:

- `en` - English
- `es` - Spanish
- `fr` - French
- `de` - German
- `it` - Italian
- `pt` - Portuguese
- `ru` - Russian
- `ja` - Japanese
- `ko` - Korean
- `zh` - Chinese

### Adding New Locales

To add a new locale:

1. **Update Configuration**:
```javascript
// config/locales.js
export const supportedLocales = [
  'en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh',
  'ar', 'hi', 'th' // New locales
];
```

2. **Create Locale Files**:
```bash
mkdir -p templates/locales/ar
mkdir -p templates/locales/hi
mkdir -p templates/locales/th
```

3. **Add Translations**:
```json
// templates/locales/ar/strings.json
{
  "welcome": "مرحباً",
  "thank_you": "شكراً لك",
  "goodbye": "وداعاً"
}
```

## Template Localization

### Creating Localized Templates

Templates can be created for specific locales:

```javascript
// Create English template
const enTemplate = {
  key: 'welcome',
  locale: 'en',
  subject: 'Welcome to {{company_name}}!',
  html: '<h1>Welcome {{user_name}}!</h1>'
};

// Create Spanish template
const esTemplate = {
  key: 'welcome',
  locale: 'es',
  subject: '¡Bienvenido a {{company_name}}!',
  html: '<h1>¡Bienvenido {{user_name}}!</h1>'
};
```

### Template Fallback

If a template doesn't exist for a specific locale, the system falls back to the default locale (usually `en`):

```javascript
// This will use 'en' template if 'fr' doesn't exist
const template = { key: 'welcome', locale: 'fr' };
```

## Sending Localized Emails

### Basic Usage

```javascript
const response = await fetch('/api/v1/emails', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  },
  body: JSON.stringify({
    to: [{ email: 'user@example.com', name: 'John Doe' }],
    subject: 'Welcome!',
    template: { key: 'welcome', locale: 'es' },
    variables: {
      user_name: 'John',
      company_name: 'Acme Corp'
    }
  })
});
```

### Auto-Detection

The system can automatically detect the user's locale:

```javascript
// Auto-detect locale from user preferences
const template = { key: 'welcome', locale: 'auto' };
```

### Locale-Specific Variables

Variables can be localized:

```javascript
{
  "template": { "key": "welcome", "locale": "es" },
  "variables": {
    "user_name": "Juan",
    "company_name": "Acme Corp",
    "welcome_message": "¡Bienvenido!",
    "button_text": "Comenzar"
  }
}
```

## Date and Time Localization

### Date Formatting

Dates are automatically formatted according to the locale:

```javascript
// English: "January 1, 2024"
// Spanish: "1 de enero de 2024"
// French: "1 janvier 2024"
const date = new Date().toLocaleDateString(locale);
```

### Time Formatting

Times are formatted according to locale conventions:

```javascript
// English: "2:30 PM"
// Spanish: "14:30"
// French: "14h30"
const time = new Date().toLocaleTimeString(locale);
```

## Number Localization

### Currency Formatting

```javascript
// English: "$1,234.56"
// Spanish: "1.234,56 €"
// French: "1 234,56 €"
const currency = new Intl.NumberFormat(locale, {
  style: 'currency',
  currency: 'USD'
}).format(1234.56);
```

### Number Formatting

```javascript
// English: "1,234.56"
// Spanish: "1.234,56"
// French: "1 234,56"
const number = new Intl.NumberFormat(locale).format(1234.56);
```

## RTL Support

### Right-to-Left Languages

The system supports right-to-left languages like Arabic and Hebrew:

```css
/* RTL styles */
[dir="rtl"] {
  text-align: right;
  direction: rtl;
}

[dir="rtl"] .email-content {
  margin-right: 0;
  margin-left: 20px;
}
```

### Template Structure

```html
<!-- RTL template -->
<html dir="rtl" lang="ar">
<head>
  <meta charset="utf-8">
  <title>{{subject}}</title>
</head>
<body>
  <div class="email-content">
    <h1>{{user_name}}، مرحباً بك!</h1>
    <p>شكراً لك على انضمامك إلى {{company_name}}.</p>
  </div>
</body>
</html>
```

## Best Practices

### Template Design

1. **Flexible Layouts** - Design templates that work in different languages
2. **Text Expansion** - Account for text length differences
3. **Cultural Sensitivity** - Consider cultural differences in design
4. **Testing** - Test templates in all supported locales

### Content Management

1. **Translation Workflow** - Establish clear translation processes
2. **Quality Control** - Review translations for accuracy
3. **Consistency** - Maintain consistent terminology
4. **Updates** - Keep translations up to date

### Performance

1. **Caching** - Cache localized templates
2. **Lazy Loading** - Load translations on demand
3. **CDN** - Use CDN for static assets
4. **Compression** - Compress localized content

## Troubleshooting

### Common Issues

**Missing Translations**
- Check if locale files exist
- Verify locale configuration
- Check fallback behavior

**Rendering Issues**
- Verify RTL support
- Check CSS for locale-specific styles
- Test in different browsers

**Performance Issues**
- Check template caching
- Monitor translation loading
- Optimize locale files

### Debugging

Enable debug mode for locale issues:

```env
DEBUG_LOCALE=true
LOG_LEVEL=debug
```

Check locale detection:

```javascript
console.log('Detected locale:', req.locale);
console.log('Available locales:', supportedLocales);
console.log('Template path:', templatePath);
```

## Support

For locale-related issues:

- 📖 [Full Documentation](/)
- 🔧 [API Reference](/api/)
- 💬 [GitHub Issues](https://github.com/cantoniouwaymore/emailgateway/issues)
- 📧 [Support](mailto:cantoni@waymore.io)
