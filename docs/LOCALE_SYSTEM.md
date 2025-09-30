# Locale System and Base Template Support

## Overview

The Waymore Transactional Emails Service supports a comprehensive locale system with intelligent fallback strategies and special base template functionality for testing and development.

## Supported Locales

### Standard Locales

The system supports a wide range of standard ISO 639-1 language codes:

**Primary Locales:**
- `en` - English
- `es` - Spanish  
- `fr` - French
- `de` - German
- `it` - Italian
- `pt` - Portuguese

**Extended Locales:**
- `ru` - Russian
- `ja` - Japanese
- `ko` - Korean
- `zh` - Chinese
- `ar` - Arabic
- `hi` - Hindi

**European Locales:**
- `nl` - Dutch
- `sv` - Swedish
- `da` - Danish
- `no` - Norwegian
- `fi` - Finnish
- `pl` - Polish
- `tr` - Turkish
- `cs` - Czech
- `sk` - Slovak
- `hu` - Hungarian
- `ro` - Romanian
- `bg` - Bulgarian
- `hr` - Croatian
- `sl` - Slovenian
- `et` - Estonian
- `lv` - Latvian
- `lt` - Lithuanian
- `el` - Greek
- `mt` - Maltese
- `cy` - Welsh
- `ga` - Irish
- `is` - Icelandic
- `fo` - Faroese
- `eu` - Basque

### Special Locale: `__base__`

The `__base__` locale is a special identifier that uses the base template structure with variables intact.

**When to Use `__base__`:**
- **Testing**: Verify template structure and variable detection
- **Debugging**: Check how variables are processed
- **Development**: Preview the template with variable placeholders
- **Documentation**: Show the template structure to developers
- **Fallback Testing**: Ensure base template works when locales are missing

## Fallback Strategy

### New Fallback Logic

The system now uses a **base template structure** fallback instead of falling back to a specific locale like "en".

**How it Works:**
1. **Request for specific locale** (e.g., "es")
2. **Check if locale exists** in the database
3. **If locale exists**: Use locale-specific content merged with base template
4. **If locale doesn't exist**: Use **base template structure only** (no locale merging)

**Benefits:**
- **Predictable**: Always falls back to what the developer originally defined
- **No Assumptions**: Doesn't assume "en" exists or is the default
- **Variable Preservation**: Variables remain intact in fallback scenarios
- **Developer-Friendly**: Matches natural template creation workflow

### Examples

**Scenario 1: Locale Exists**
```json
{
  "template": {
    "key": "welcome-email",
    "locale": "es"
  }
}
```
Result: Uses Spanish locale content merged with base template structure.

**Scenario 2: Locale Doesn't Exist**
```json
{
  "template": {
    "key": "welcome-email", 
    "locale": "fr"
  }
}
```
Result: Uses base template structure only (French locale not found).

**Scenario 3: Base Template Request**
```json
{
  "template": {
    "key": "welcome-email",
    "locale": "__base__"
  }
}
```
Result: Uses base template structure with variables intact.

## API Usage

### Standard Locale Usage

```json
{
  "template": {
    "key": "transactional",
    "locale": "es"
  },
  "variables": {
    "user_name": "Juan",
    "company_name": "Mi Empresa"
  }
}
```

### Base Template Usage

```json
{
  "template": {
    "key": "transactional", 
    "locale": "__base__"
  },
  "variables": {
    "user_name": "{{user.name}}",
    "company_name": "{{company.name}}"
  }
}
```

### cURL Examples

**Standard Locale:**
```bash
curl -X POST "https://api.waymore.io/email-gateway/api/v1/emails" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "template": {
      "key": "welcome-email",
      "locale": "es"
    },
    "variables": {
      "user_name": "Juan",
      "company_name": "Mi Empresa"
    },
    "to": [{"email": "user@example.com", "name": "Juan"}],
    "subject": "Bienvenido a Mi Empresa"
  }'
```

**Base Template:**
```bash
curl -X POST "https://api.waymore.io/email-gateway/api/v1/emails" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "template": {
      "key": "welcome-email",
      "locale": "__base__"
    },
    "variables": {
      "user_name": "{{user.name}}",
      "company_name": "{{company.name}}"
    },
    "to": [{"email": "user@example.com", "name": "Test User"}],
    "subject": "Welcome to {{company.name}}"
  }'
```

## Template Editor Integration

### Locale Dropdown

The template editor now includes a "Base Template (Variables)" option:

```html
<select id="template-locale">
  <option value="__base__">Base Template (Variables)</option>
  <option value="en">English (en) - Resolved Values</option>
  <option value="es">Spanish (es) - Resolved Values</option>
  <!-- ... other locales ... -->
</select>
```

### Editing Behavior

- **Base Template**: Shows variables like `{{user.name}}`
- **Locale-Specific**: Shows resolved values like "John Doe"
- **Clear Indication**: Subtitle shows whether editing "Base Template (Variables)" or "Resolved Values"

## Error Handling

### Invalid Locale

If an unsupported locale is provided (not in the supported list and not `__base__`):

```json
{
  "error": {
    "code": "INVALID_LOCALE",
    "message": "Invalid locale: invalid-locale. Must be a valid ISO 639-1 language code (e.g., 'en', 'es', 'fr') or '__base__'",
    "traceId": "req-123"
  }
}
```

### Locale Not Found

When a valid locale is provided but doesn't exist for the template:

- **No Error**: System falls back to base template structure
- **Logging**: System logs the fallback behavior
- **Response**: Email is sent with base template structure

## Best Practices

### For Developers

1. **Test with Base Template**: Always test with `__base__` to verify template structure
2. **Use Fallbacks**: Don't assume specific locales exist
3. **Variable Naming**: Use consistent variable naming across all locales
4. **Documentation**: Document which locales are supported for each template

### For Template Creation

1. **Start with Base**: Create the base template structure first
2. **Add Locales**: Add locale-specific content as needed
3. **Test Fallbacks**: Verify fallback behavior works correctly
4. **Variable Consistency**: Keep variables consistent across locales

### For Testing

1. **Base Template Testing**: Use `__base__` to test template structure
2. **Locale Testing**: Test each supported locale individually
3. **Fallback Testing**: Test with unsupported locales to verify fallback
4. **Variable Testing**: Verify variables work correctly in all scenarios

## Migration Notes

### From Previous Version

If you were previously relying on "en" as a fallback:

1. **Check Templates**: Ensure your base template structure is complete
2. **Test Fallbacks**: Verify fallback behavior works as expected
3. **Update Tests**: Update any tests that assumed "en" fallback
4. **Use `__base__`**: Use `__base__` for testing and debugging

### Backward Compatibility

- **Existing API Calls**: Continue to work without changes
- **Locale Support**: Extended locale support is backward compatible
- **Fallback Behavior**: New fallback strategy is more robust
- **Base Template**: New `__base__` locale adds functionality without breaking existing code

## Troubleshooting

### Common Issues

**Issue**: Template not rendering with expected locale
**Solution**: Check if locale exists in database, test with `__base__`

**Issue**: Variables not showing correctly
**Solution**: Use `__base__` to verify variable structure

**Issue**: Fallback not working
**Solution**: Verify base template structure is complete

**Issue**: Invalid locale error
**Solution**: Use supported locale codes or `__base__`

### Debugging Tips

1. **Use `__base__`**: Always test with base template first
2. **Check Logs**: Review server logs for fallback behavior
3. **Verify Database**: Ensure locale data exists in database
4. **Test API**: Use API directly to test locale behavior

## Conclusion

The new locale system provides:
- **Comprehensive Support**: 40+ standard locales plus base template
- **Intelligent Fallbacks**: Base template structure fallback strategy
- **Developer-Friendly**: Special `__base__` locale for testing and debugging
- **Robust Error Handling**: Clear error messages and graceful fallbacks
- **Backward Compatibility**: Existing code continues to work

This system ensures reliable email delivery regardless of locale availability while providing powerful debugging and testing capabilities through the base template functionality.
