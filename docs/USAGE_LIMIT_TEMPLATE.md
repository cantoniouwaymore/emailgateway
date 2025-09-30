# Usage Limit Warning Template

## 📧 Template Overview

The **Usage Limit Warning Template** (`usage-limit-warning-80pct`) is designed to notify users when they reach 80% of their subscription usage limit, giving them time to upgrade their plan or adjust their usage before hitting the hard cap.

### **Business Purpose**
- **Prevent Service Disruption**: Early warning before hitting 100% usage limit
- **Encourage Plan Upgrades**: Drive revenue through proactive upgrade prompts
- **Reduce Support Tickets**: Proactive communication reduces billing-related inquiries
- **Improve Transparency**: Keep users informed about their usage patterns

## 🎯 Template Features

### **Core Functionality**
- **80% Threshold Warning**: Triggered when usage reaches 80% of quota
- **Multi-Metric Support**: Works with contacts, events, storage, and other metrics
- **Visual Progress Tracking**: Progress bar showing current usage percentage
- **Action-Oriented**: Direct links to upgrade plan or manage usage
- **Comprehensive Details**: Complete usage information and remaining quota

### **Template Structure**
```json
{
  "header": {
    "logo_url": "{{company.logo_url}}",
    "logo_alt": "{{company.name}}",
    "tagline": "{{company.tagline|Empowering your business}}"
  },
  "hero": {
    "type": "icon",
    "icon": "⚠️",
    "icon_size": "48px"
  },
  "title": {
    "text": "Usage Limit Warning - 80% Reached",
    "size": "28px",
    "weight": "700",
    "color": "#f59e0b",
    "align": "center"
  },
  "body": {
    "intro": "Hi {{user.name}},",
    "paragraphs": [
      "You've reached 80% of your {{usage.metric_name}} limit for your {{subscription.plan_name}} subscription.",
      "You've used {{usage.current_usage}} of {{usage.limit}} {{usage.metric_name}} this {{subscription.billing_cycle}}.",
      "To avoid service interruption when you reach 100%, we recommend upgrading your plan or adjusting your usage.",
      "Don't worry - you still have {{usage.remaining}} {{usage.metric_name}} available until your next billing cycle."
    ],
    "note": "This is a friendly warning to help you stay ahead of your usage limits. Consider upgrading your plan to avoid any interruptions.",
    "font_size": "16px",
    "line_height": "26px"
  },
  "snapshot": {
    "title": "Usage Details",
    "facts": [
      { "label": "Current Plan", "value": "{{subscription.plan_name}}" },
      { "label": "Metric", "value": "{{usage.metric_name}}" },
      { "label": "Used", "value": "{{usage.current_usage}} / {{usage.limit}}" },
      { "label": "Remaining", "value": "{{usage.remaining}} {{usage.metric_name}}" },
      { "label": "Usage Percentage", "value": "{{usage.percentage}}%" },
      { "label": "Billing Cycle", "value": "{{subscription.billing_cycle}}" }
    ],
    "style": "table"
  },
  "visual": {
    "type": "progress",
    "progress_bars": [
      {
        "label": "{{usage.metric_name}} Usage",
        "current": "{{usage.current_usage}}",
        "max": "{{usage.limit}}",
        "unit": "{{usage.metric_name}}",
        "percentage": "{{usage.percentage}}",
        "color": "#f59e0b",
        "description": "{{usage.percentage}}% of your {{usage.metric_name}} limit used"
      }
    ]
  },
  "actions": {
    "primary": {
      "label": "Upgrade Plan",
      "url": "{{actions.upgrade_url}}",
      "style": "button",
      "color": "#f59e0b",
      "text_color": "#ffffff"
    },
    "secondary": {
      "label": "Manage Usage",
      "url": "{{actions.manage_usage_url}}",
      "style": "link",
      "color": "#6b7280"
    }
  },
  "support": {
    "title": "Need help?",
    "links": [
      { "label": "Usage FAQ", "url": "{{company.website}}/usage-faq" },
      { "label": "Contact Support", "url": "{{actions.contact_support_url}}" },
      { "label": "View Plans", "url": "{{actions.upgrade_url}}" }
    ]
  },
  "footer": {
    "tagline": "Empowering your business",
    "social_links": [
      { "platform": "twitter", "url": "https://twitter.com/waymore" },
      { "platform": "linkedin", "url": "https://linkedin.com/company/waymore" }
    ],
    "legal_links": [
      { "label": "Privacy Policy", "url": "{{company.website}}/privacy" },
      { "label": "Terms of Service", "url": "{{company.website}}/terms" }
    ],
    "copyright": "© 2025 {{company.name}}. All rights reserved."
  }
}
```

## 🔧 Variable Schema

### **Required Variables**
```json
{
  "user": {
    "name": "string",
    "email": "string", 
    "workspace_name": "string",
    "role": "string"
  },
  "company": {
    "name": "string",
    "logo_url": "string",
    "website": "string",
    "support_email": "string"
  },
  "subscription": {
    "plan_name": "string",
    "billing_cycle": "string",
    "current_period_start": "string",
    "current_period_end": "string"
  },
  "usage": {
    "metric_name": "string",
    "current_usage": "number",
    "limit": "number",
    "remaining": "number",
    "percentage": "number",
    "warning_threshold": "number"
  },
  "actions": {
    "upgrade_url": "string",
    "manage_usage_url": "string",
    "contact_support_url": "string"
  }
}
```

### **Variable Descriptions**

#### **User Variables**
- **`user.name`**: User's display name
- **`user.email`**: User's email address
- **`user.role`**: User's role (e.g., "Workspace Owner", "Admin")
- **`user.workspace_name`**: Name of the workspace/organization

#### **Company Variables**
- **`company.name`**: Company name (e.g., "Waymore")
- **`company.logo_url`**: URL to company logo image
- **`company.website`**: Company website URL
- **`company.support_email`**: Support email address

#### **Subscription Variables**
- **`subscription.plan_name`**: Name of the current plan
- **`subscription.billing_cycle`**: Billing frequency (e.g., "Monthly", "Annual")
- **`subscription.current_period_start`**: Start date of current billing period (YYYY-MM-DD)
- **`subscription.current_period_end`**: End date of current billing period (YYYY-MM-DD)

#### **Usage Variables**
- **`usage.metric_name`**: Name of the metric (e.g., "contacts", "events", "storage")
- **`usage.current_usage`**: Current usage amount (number)
- **`usage.limit`**: Total limit for the metric (number)
- **`usage.remaining`**: Remaining usage available (number)
- **`usage.percentage`**: Usage percentage (0-100, should be 80 for this template)
- **`usage.warning_threshold`**: Warning threshold percentage (typically 80)

#### **Action Variables**
- **`actions.upgrade_url`**: Direct link to plan upgrade page
- **`actions.manage_usage_url`**: Link to usage management dashboard
- **`actions.contact_support_url`**: Link to contact support with usage context

## 🌍 Multi-Language Support

### **Base Locale (__base__) - Serves as English**
- **Title**: "Usage Limit Warning - 80% Reached"
- **Content**: Complete template structure with full English content
- **Actions**: "Upgrade Plan" / "Manage Usage"
- **Support**: English help links and FAQ
- **Note**: Base locale serves as the English version with complete data

### **Greek Locale (el)**
- **Title**: "Προειδοποίηση Ορίου Χρήσης - 80% Έφτασε"
- **Content**: Professional Greek copy for usage limit notifications
- **Actions**: "Αναβάθμιση Προγράμματος" / "Διαχείριση Χρήσης"
- **Support**: Greek help links and localized FAQ
- **Cultural Adaptation**: Appropriate tone and terminology for Greek market

## 📧 Usage Examples

### **English Email - Contacts Usage**
```json
{
  "to": [{"email": "john.doe@example.com", "name": "John Doe"}],
  "from": {"email": "billing@waymore.io", "name": "Waymore Usage Team"},
  "subject": "Usage Limit Warning - 80% of Contacts Limit Reached",
  "template": {"key": "usage-limit-warning-80pct", "locale": "__base__"},
  "variables": {
    "user": {
      "name": "John",
      "email": "john.doe@example.com",
      "role": "Workspace Owner",
      "workspace_name": "Acme Corporation"
    },
    "company": {
      "name": "Waymore",
      "logo_url": "https://i.ibb.co/8LfvqPk7/Waymore-logo-Colour.png",
      "website": "https://waymore.io",
      "support_email": "support@waymore.io"
    },
    "subscription": {
      "plan_name": "Pro Plan",
      "billing_cycle": "Monthly",
      "current_period_start": "2025-01-01",
      "current_period_end": "2025-01-31"
    },
    "usage": {
      "metric_name": "contacts",
      "current_usage": 24000,
      "limit": 30000,
      "remaining": 6000,
      "percentage": 80,
      "warning_threshold": 80
    },
    "actions": {
      "upgrade_url": "https://app.waymore.io/billing/upgrade?token=abc123",
      "manage_usage_url": "https://app.waymore.io/usage/contacts",
      "contact_support_url": "https://waymore.io/support?topic=usage-limits"
    }
  },
  "metadata": {
    "tenantId": "acme_corp",
    "eventId": "usage-limit-warning-80pct",
    "notificationType": "usage_limit_warning",
    "usagePercentage": 80
  }
}
```

### **Greek Email - Events Usage**
```json
{
  "to": [{"email": "maria.papadopoulos@example.com", "name": "Μαρία Παπαδοπούλου"}],
  "from": {"email": "billing@waymore.io", "name": "Ομάδα Χρήσης Waymore"},
  "subject": "Προειδοποίηση Ορίου Χρήσης - 80% του Ορίου Events Έφτασε",
  "template": {"key": "usage-limit-warning-80pct", "locale": "el"},
  "variables": {
    "user": {
      "name": "Μαρία",
      "email": "maria.papadopoulos@example.com",
      "role": "Διευθύντρια Χώρου Εργασίας",
      "workspace_name": "Εταιρεία Παπαδόπουλος"
    },
    "company": {
      "name": "Waymore",
      "logo_url": "https://i.ibb.co/8LfvqPk7/Waymore-logo-Colour.png",
      "website": "https://waymore.io",
      "support_email": "support@waymore.io"
    },
    "subscription": {
      "plan_name": "Business Plan",
      "billing_cycle": "Μηνιαίο",
      "current_period_start": "2025-01-01",
      "current_period_end": "2025-01-31"
    },
    "usage": {
      "metric_name": "events",
      "current_usage": 800000,
      "limit": 1000000,
      "remaining": 200000,
      "percentage": 80,
      "warning_threshold": 80
    },
    "actions": {
      "upgrade_url": "https://app.waymore.io/billing/upgrade?token=def456&lang=el",
      "manage_usage_url": "https://app.waymore.io/usage/events?lang=el",
      "contact_support_url": "https://waymore.io/support?topic=usage-limits&lang=el"
    }
  },
  "metadata": {
    "tenantId": "papadopoulos_corp",
    "eventId": "usage-limit-warning-80pct",
    "notificationType": "usage_limit_warning",
    "usagePercentage": 80
  }
}
```

## 🚀 Quick Start

### **Template Creation**
```bash
# Create the usage limit warning template
npx ts-node scripts/create-usage-limit-template.ts
```

### **Email Sending**
```bash
# Send test usage limit warning emails
npx ts-node scripts/send-usage-limit-test.ts
```

### **Admin Interface**
- **View Template**: `http://localhost:3000/admin/template-editor?template=usage-limit-warning-80pct&mode=edit`
- **Edit Locales**: Switch between English and Greek
- **Preview**: See real-time preview of both locales

## 📈 Use Cases

### **CDP Subscription Management**
- **Contacts Limit**: Warn when contact storage approaches limit
- **Events Tracking**: Alert when event processing approaches quota
- **Storage Usage**: Notify about storage space consumption
- **API Calls**: Warn about API usage approaching limits

### **Customer Success**
- **Proactive Communication**: Early warning prevents service disruption
- **Revenue Optimization**: Drive plan upgrades through usage insights
- **Churn Prevention**: Reduce frustration from unexpected limits
- **Usage Education**: Help customers understand their consumption patterns

### **Business Operations**
- **Automated Monitoring**: Real-time usage tracking and alerts
- **Multi-Channel Delivery**: Email + in-app notifications
- **Localized Communication**: Support multiple languages and regions
- **Analytics Integration**: Track warning effectiveness and upgrade conversions

## 🎨 Design Features

### **Visual Elements**
- **Warning Icon (⚠️)**: Represents caution and attention needed
- **Orange Color Scheme (#f59e0b)**: Warning color that's attention-grabbing but not alarming
- **Progress Bar**: Visual representation of usage percentage
- **Clear Typography**: Easy-to-read content with proper hierarchy

### **User Experience**
- **Action-Oriented**: Clear primary and secondary actions
- **Comprehensive Information**: All usage details in one place
- **Support Access**: Easy access to help and FAQ
- **Mobile Responsive**: Works across all devices and email clients

### **Content Strategy**
- **Friendly Warning**: Urgent but not panic-inducing
- **Clear Instructions**: Step-by-step guidance for resolution
- **Transparency**: Full visibility into usage and limits
- **Professional Branding**: Consistent with company identity

## 🔧 Technical Implementation

### **Template Key**
```
usage-limit-warning-80pct
```

### **Category**
```
notification
```

### **Trigger Conditions**
- **Timing**: When usage reaches 80% of quota
- **Recipients**: Primary billing contact(s) and workspace admins
- **Frequency**: Once per billing cycle per metric
- **Deduplication**: Prevent multiple warnings for same metric in same cycle

### **Integration Points**
- **Usage Tracking**: Real-time monitoring of subscription metrics
- **User Management**: Contact information and preferences
- **Billing System**: Plan details and upgrade options
- **Analytics**: Track warning effectiveness and user behavior

## 📊 Success Metrics

### **Key Performance Indicators**
- **Email Open Rate**: Target >30% for usage warnings
- **Click-Through Rate**: Target >20% for upgrade links
- **Upgrade Conversion**: Measure impact on plan upgrades
- **Support Ticket Reduction**: Fewer usage-related inquiries

### **A/B Testing Opportunities**
- **Subject Lines**: Test different urgency levels
- **Threshold Timing**: Test 70%, 80%, or 90% warning points
- **Visual Elements**: Different icons and colors
- **Call-to-Action**: Various button text and placement

## 🛠️ Customization Options

### **Content Customization**
- **Threshold Adjustment**: Change warning percentage (70%, 85%, 90%)
- **Tone Modification**: Formal vs. casual messaging
- **Additional Information**: Include usage trends or recommendations
- **Branding Elements**: Custom colors, fonts, and imagery

### **Functional Customization**
- **Multi-Metric Support**: Handle multiple usage types simultaneously
- **Recipients**: Include additional stakeholders or team members
- **Actions**: Add custom links or workflows
- **Conditions**: Add business logic for different user segments

## 📚 Related Documentation

- **[TRANSACTIONAL_TEMPLATE_GUIDE.md](./TRANSACTIONAL_TEMPLATE_GUIDE.md)**: Complete guide to transactional templates
- **[LOCALE_SYSTEM.md](./LOCALE_SYSTEM.md)**: Multi-language support system
- **[API.md](./API.md)**: Email Gateway API documentation
- **[PAYMENT_FAILURE_TEMPLATE.md](./PAYMENT_FAILURE_TEMPLATE.md)**: Related payment failure template
- **[RENEWAL_REMINDER_TEMPLATE.md](./RENEWAL_REMINDER_TEMPLATE.md)**: Related renewal reminder template

## 🎉 Best Practices

### **Content Guidelines**
- **Be Proactive**: Send warnings early enough for action
- **Be Clear**: Use simple, direct language about usage and limits
- **Be Helpful**: Provide actionable solutions and upgrade options
- **Be Consistent**: Maintain brand voice and visual identity

### **Technical Best Practices**
- **Test Thoroughly**: Verify all locales and variable combinations
- **Monitor Performance**: Track delivery and engagement metrics
- **Update Regularly**: Keep content and links current
- **Backup Plans**: Have fallback templates for edge cases

### **Business Best Practices**
- **Right Timing**: 80% threshold provides optimal balance
- **Clear Actions**: Make upgrade path obvious and easy
- **Support Integration**: Provide easy access to help
- **Analytics Focus**: Track and optimize based on data

---

**Template Created**: January 2025  
**Last Updated**: January 2025  
**Version**: 1.0  
**Status**: Production Ready ✅
