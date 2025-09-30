# Hard Limit Reached Template

## 📧 Template Overview

The **Hard Limit Reached Template** (`hard-limit-reached-100pct`) is designed to notify users when they reach 100% of their subscription usage limit, explaining why their actions are blocked and providing immediate upgrade options to restore service.

### **Business Purpose**
- **Explain Service Blocking**: Clear communication about why actions are failing
- **Reduce Frustration**: Turn system limitations into understandable business rules
- **Drive Immediate Upgrades**: Urgent upgrade prompts to restore functionality
- **Prevent Support Overload**: Proactive communication reduces "system error" tickets

## 🎯 Template Features

### **Core Functionality**
- **100% Limit Reached**: Triggered when usage hits absolute quota limit
- **Blocking Banner Support**: Designed for in-app blocking notifications
- **Urgent Upgrade Prompts**: Immediate action required messaging
- **Clear Explanation**: Why actions are blocked and what needs to happen
- **Multi-Metric Support**: Works with all usage types (contacts, events, storage, etc.)

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
    "icon": "🚫",
    "icon_size": "48px"
  },
  "title": {
    "text": "Usage Limit Reached - Action Required",
    "size": "28px",
    "weight": "700",
    "color": "#dc2626",
    "align": "center"
  },
  "body": {
    "intro": "Hi {{user.name}},",
    "paragraphs": [
      "You've reached 100% of your {{usage.metric_name}} limit for your {{subscription.plan_name}} subscription.",
      "You've used all {{usage.limit}} {{usage.metric_name}} this {{subscription.billing_cycle}}, and no further usage is possible until you upgrade your plan.",
      "This means certain actions may be blocked (such as importing new contacts or tracking additional events) until you increase your limits.",
      "To continue working without disruption, please upgrade your plan immediately."
    ],
    "note": "Don't worry - your existing data is safe. You just need to upgrade your plan to continue adding new {{usage.metric_name}}.",
    "font_size": "16px",
    "line_height": "26px"
  },
  "snapshot": {
    "title": "Usage Details",
    "facts": [
      { "label": "Current Plan", "value": "{{subscription.plan_name}}" },
      { "label": "Metric", "value": "{{usage.metric_name}}" },
      { "label": "Used", "value": "{{usage.current_usage}} / {{usage.limit}}" },
      { "label": "Remaining", "value": "0 {{usage.metric_name}}" },
      { "label": "Usage Percentage", "value": "100%" },
      { "label": "Status", "value": "Limit Reached" }
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
        "percentage": "100",
        "color": "#dc2626",
        "description": "100% of your {{usage.metric_name}} limit has been reached"
      }
    ]
  },
  "actions": {
    "primary": {
      "label": "Upgrade Plan Now",
      "url": "{{actions.upgrade_url}}",
      "style": "button",
      "color": "#dc2626",
      "text_color": "#ffffff"
    },
    "secondary": {
      "label": "View Usage Details",
      "url": "{{actions.usage_details_url}}",
      "style": "link",
      "color": "#6b7280"
    }
  },
  "support": {
    "title": "Need immediate help?",
    "links": [
      { "label": "Usage Limits FAQ", "url": "{{company.website}}/usage-limits-faq" },
      { "label": "Contact Support", "url": "{{actions.contact_support_url}}" },
      { "label": "Upgrade Now", "url": "{{actions.upgrade_url}}" }
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
    "percentage": "number",
    "limit_reached_at": "string"
  },
  "actions": {
    "upgrade_url": "string",
    "usage_details_url": "string",
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
- **`usage.current_usage`**: Current usage amount (number) - should equal limit
- **`usage.limit`**: Total limit for the metric (number)
- **`usage.percentage`**: Usage percentage (should always be 100 for this template)
- **`usage.limit_reached_at`**: Timestamp when limit was reached (ISO 8601 format)

#### **Action Variables**
- **`actions.upgrade_url`**: Direct link to plan upgrade page (urgent priority)
- **`actions.usage_details_url`**: Link to detailed usage dashboard
- **`actions.contact_support_url`**: Link to contact support with limit context

## 🌍 Multi-Language Support

### **Base Locale (__base__) - Serves as English**
- **Title**: "Usage Limit Reached - Action Required"
- **Content**: Complete template structure with full English content
- **Actions**: "Upgrade Plan Now" / "View Usage Details"
- **Support**: English help links and FAQ
- **Note**: Base locale serves as the English version with complete data

### **Greek Locale (el)**
- **Title**: "Έφτασε το Όριο Χρήσης - Απαιτείται Δράση"
- **Content**: Professional Greek copy for hard limit notifications
- **Actions**: "Αναβάθμιση Προγράμματος Τώρα" / "Προβολή Λεπτομερειών Χρήσης"
- **Support**: Greek help links and localized FAQ
- **Cultural Adaptation**: Appropriate tone and terminology for Greek market

## 📧 Usage Examples

### **English Email - Contacts Limit Reached**
```json
{
  "to": [{"email": "john.doe@example.com", "name": "John Doe"}],
  "from": {"email": "billing@waymore.io", "name": "Waymore Limit Team"},
  "subject": "URGENT: Usage Limit Reached - Contacts Import Blocked",
  "template": {"key": "hard-limit-reached-100pct", "locale": "__base__"},
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
      "current_usage": 30000,
      "limit": 30000,
      "percentage": 100,
      "limit_reached_at": "2025-01-15T14:30:00Z"
    },
    "actions": {
      "upgrade_url": "https://app.waymore.io/billing/upgrade?token=abc123&urgent=true",
      "usage_details_url": "https://app.waymore.io/usage/contacts?limit_reached=true",
      "contact_support_url": "https://waymore.io/support?topic=limit-reached&urgent=true"
    }
  },
  "metadata": {
    "tenantId": "acme_corp",
    "eventId": "hard-limit-reached-100pct",
    "notificationType": "hard_limit_reached",
    "usagePercentage": 100,
    "urgent": true
  }
}
```

### **Greek Email - Storage Limit Reached**
```json
{
  "to": [{"email": "maria.papadopoulos@example.com", "name": "Μαρία Παπαδοπούλου"}],
  "from": {"email": "billing@waymore.io", "name": "Ομάδα Ορίων Waymore"},
  "subject": "ΕΠΕΙΓΟΝ: Έφτασε το Όριο Χρήσης - Αποθήκευση Μπλοκαρίστηκε",
  "template": {"key": "hard-limit-reached-100pct", "locale": "el"},
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
      "metric_name": "storage",
      "current_usage": 50000000000,
      "limit": 50000000000,
      "percentage": 100,
      "limit_reached_at": "2025-01-15T16:45:00Z"
    },
    "actions": {
      "upgrade_url": "https://app.waymore.io/billing/upgrade?token=def456&lang=el&urgent=true",
      "usage_details_url": "https://app.waymore.io/usage/storage?lang=el&limit_reached=true",
      "contact_support_url": "https://waymore.io/support?topic=limit-reached&lang=el&urgent=true"
    }
  },
  "metadata": {
    "tenantId": "papadopoulos_corp",
    "eventId": "hard-limit-reached-100pct",
    "notificationType": "hard_limit_reached",
    "usagePercentage": 100,
    "urgent": true
  }
}
```

## 🚀 Quick Start

### **Template Creation**
```bash
# Create the hard limit reached template
npx ts-node scripts/create-hard-limit-template.ts
```

### **Email Sending**
```bash
# Send test hard limit notification emails
npx ts-node scripts/send-hard-limit-test.ts
```

### **Admin Interface**
- **View Template**: `http://localhost:3000/admin/template-editor?template=hard-limit-reached-100pct&mode=edit`
- **Edit Locales**: Switch between English and Greek
- **Preview**: See real-time preview of both locales

## 📈 Use Cases

### **CDP Subscription Management**
- **Contacts Limit**: Notify when contact import is blocked
- **Events Tracking**: Alert when event processing is halted
- **Storage Usage**: Notify when file uploads are blocked
- **API Calls**: Warn when API requests are rate-limited

### **Customer Experience**
- **Clear Communication**: Explain why actions are failing
- **Reduced Frustration**: Turn system errors into understandable limits
- **Immediate Resolution**: Direct path to restore functionality
- **Support Reduction**: Fewer "system broken" tickets

### **Business Operations**
- **Urgent Upgrade Prompts**: High-conversion upgrade opportunities
- **Multi-Channel Delivery**: Email + blocking in-app banners
- **Localized Communication**: Support multiple languages and regions
- **Analytics Integration**: Track conversion rates and response times

## 🎨 Design Features

### **Visual Elements**
- **Blocking Icon (🚫)**: Represents service interruption and blocked actions
- **Red Color Scheme (#dc2626)**: Urgent, attention-grabbing, indicates critical status
- **Progress Bar**: Visual representation showing 100% usage reached
- **Clear Typography**: Easy-to-read content with proper hierarchy

### **User Experience**
- **Urgent Actions**: Prominent upgrade button with immediate priority
- **Clear Explanation**: Why actions are blocked and what needs to happen
- **Support Access**: Easy access to help and FAQ
- **Mobile Responsive**: Works across all devices and email clients

### **Content Strategy**
- **Urgent but Professional**: Serious tone without panic
- **Clear Instructions**: Step-by-step guidance for resolution
- **Data Safety Assurance**: Reassure users their existing data is safe
- **Immediate Action**: Emphasize urgency of upgrade requirement

## 🔧 Technical Implementation

### **Template Key**
```
hard-limit-reached-100pct
```

### **Category**
```
notification
```

### **Trigger Conditions**
- **Timing**: When usage reaches exactly 100% of quota
- **Recipients**: Primary billing contact(s) and all workspace admins
- **Frequency**: Once per billing cycle per metric
- **Deduplication**: Prevent multiple notifications for same metric in same cycle

### **Integration Points**
- **Usage Monitoring**: Real-time tracking of subscription metrics
- **User Management**: Contact information and preferences
- **Billing System**: Plan details and upgrade options
- **Analytics**: Track notification effectiveness and upgrade conversions

## 📊 Success Metrics

### **Key Performance Indicators**
- **Email Open Rate**: Target >40% for urgent limit notifications
- **Click-Through Rate**: Target >25% for upgrade links
- **Upgrade Conversion**: Measure immediate upgrade conversions
- **Support Ticket Reduction**: Fewer "system error" inquiries

### **A/B Testing Opportunities**
- **Subject Lines**: Test different urgency levels
- **Content Tone**: Formal vs. urgent messaging
- **Visual Elements**: Different icons and colors
- **Call-to-Action**: Various button text and placement

## 🛠️ Customization Options

### **Content Customization**
- **Urgency Level**: Adjust tone based on business requirements
- **Additional Information**: Include usage trends or upgrade benefits
- **Branding Elements**: Custom colors, fonts, and imagery
- **Support Integration**: Custom help desk or chat integration

### **Functional Customization**
- **Multi-Metric Support**: Handle multiple limit types simultaneously
- **Recipients**: Include additional stakeholders or team members
- **Actions**: Add custom links or workflows
- **Conditions**: Add business logic for different user segments

## 📚 Related Documentation

- **[TRANSACTIONAL_TEMPLATE_GUIDE.md](./TRANSACTIONAL_TEMPLATE_GUIDE.md)**: Complete guide to transactional templates
- **[LOCALE_SYSTEM.md](./LOCALE_SYSTEM.md)**: Multi-language support system
- **[API.md](./API.md)**: Email Gateway API documentation
- **[USAGE_LIMIT_TEMPLATE.md](./USAGE_LIMIT_TEMPLATE.md)**: Related 80% usage warning template
- **[PAYMENT_FAILURE_TEMPLATE.md](./PAYMENT_FAILURE_TEMPLATE.md)**: Related payment failure template

## 🎉 Best Practices

### **Content Guidelines**
- **Be Clear**: Explain exactly why actions are blocked
- **Be Urgent**: Emphasize immediate action required
- **Be Reassuring**: Confirm existing data is safe
- **Be Consistent**: Maintain brand voice and visual identity

### **Technical Best Practices**
- **Test Thoroughly**: Verify all locales and variable combinations
- **Monitor Performance**: Track delivery and engagement metrics
- **Update Regularly**: Keep content and links current
- **Backup Plans**: Have fallback templates for edge cases

### **Business Best Practices**
- **Right Timing**: Send immediately when 100% limit is reached
- **Clear Actions**: Make upgrade path obvious and urgent
- **Support Integration**: Provide immediate access to help
- **Analytics Focus**: Track and optimize based on conversion data

---

**Template Created**: January 2025  
**Last Updated**: January 2025  
**Version**: 1.0  
**Status**: Production Ready ✅
