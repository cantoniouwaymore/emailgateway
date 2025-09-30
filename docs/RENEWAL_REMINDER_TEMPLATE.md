# Subscription Renewal Reminder Template

## 📧 Template Overview

The **Subscription Renewal Reminder Template** (`subscription-renewal-reminder-7d`) is designed to notify users 7 days before their subscription expires, ensuring they have sufficient time to take action and maintain uninterrupted service.

### **Business Purpose**
- **Prevent Service Interruption**: Proactive notification before subscription expiry
- **Reduce Churn**: Give users time to address billing issues or upgrade plans
- **Improve Customer Experience**: Clear communication about renewal process
- **Increase Revenue**: Encourage plan upgrades and billing updates

## 🎯 Template Features

### **Core Functionality**
- **7-Day Advance Notice**: Triggered automatically 7 days before expiry
- **Multi-Channel Delivery**: Email notification + in-app banner/alert
- **Action-Oriented**: Direct links to manage subscription and billing
- **Progress Tracking**: Visual progress bar showing urgency
- **Comprehensive Details**: Complete subscription information at a glance

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
    "icon": "⏰",
    "icon_size": "48px"
  },
  "title": {
    "text": "Subscription Renewal Reminder",
    "size": "28px",
    "weight": "700",
    "color": "#2563eb",
    "align": "center"
  },
  "body": {
    "intro": "Hi {{user.name}},",
    "paragraphs": [
      "Your {{subscription.plan_name}} subscription will expire in {{subscription.days_until_expiry}} days on {{subscription.renewal_date}}.",
      "To ensure uninterrupted service, please review your billing information and confirm your renewal.",
      "You can manage your subscription, update payment methods, or upgrade your plan at any time.",
      "Don't worry - we'll send you another reminder closer to your renewal date if needed."
    ],
    "note": "We want to make sure you don't experience any service interruption. Please take a moment to confirm your subscription renewal.",
    "font_size": "16px",
    "line_height": "26px"
  },
  "snapshot": {
    "title": "Subscription Details",
    "facts": [
      { "label": "Current Plan", "value": "{{subscription.plan_name}}" },
      { "label": "Renewal Date", "value": "{{subscription.renewal_date}}" },
      { "label": "Days Until Expiry", "value": "{{subscription.days_until_expiry}} days" },
      { "label": "Billing Cycle", "value": "{{subscription.billing_cycle}}" },
      { "label": "Next Invoice", "value": "{{subscription.next_amount}} {{subscription.currency}}" },
      { "label": "Auto-Renewal", "value": "{{subscription.auto_renewal|Enabled}}" }
    ],
    "style": "table"
  },
  "visual": {
    "type": "progress",
    "progress_bars": [
      {
        "label": "Days Until Renewal",
        "current": "{{subscription.days_until_expiry}}",
        "max": "7",
        "unit": "days",
        "percentage": "{{subscription.urgency_percentage}}",
        "color": "#2563eb",
        "description": "{{subscription.days_until_expiry}} days until your subscription expires"
      }
    ]
  },
  "actions": {
    "primary": {
      "label": "Manage Subscription",
      "url": "{{actions.manage_subscription_url}}",
      "style": "button",
      "color": "#2563eb",
      "text_color": "#ffffff"
    },
    "secondary": {
      "label": "View Billing Portal",
      "url": "{{actions.billing_portal_url}}",
      "style": "link",
      "color": "#6b7280"
    }
  },
  "support": {
    "title": "Need help?",
    "links": [
      { "label": "Renewal FAQ", "url": "{{company.website}}/renewal-faq" },
      { "label": "Contact Support", "url": "{{actions.contact_support_url}}" },
      { "label": "Manage Subscription", "url": "{{actions.manage_subscription_url}}" }
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
    "renewal_date": "string",
    "days_until_expiry": "number",
    "billing_cycle": "string",
    "next_amount": "string",
    "currency": "string",
    "auto_renewal": "string",
    "urgency_percentage": "number"
  },
  "actions": {
    "manage_subscription_url": "string",
    "billing_portal_url": "string",
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
- **`subscription.renewal_date`**: Date when subscription expires (YYYY-MM-DD format)
- **`subscription.days_until_expiry`**: Number of days until expiry (should be 7)
- **`subscription.billing_cycle`**: Billing frequency (e.g., "Monthly", "Annual")
- **`subscription.next_amount`**: Amount of next invoice (e.g., "$29.99")
- **`subscription.currency`**: Currency code (e.g., "USD", "EUR")
- **`subscription.auto_renewal`**: Auto-renewal status (e.g., "Enabled", "Disabled")
- **`subscription.urgency_percentage`**: Urgency percentage (0-100, typically 100 for 7-day reminder)

#### **Action Variables**
- **`actions.manage_subscription_url`**: Direct link to subscription management page
- **`actions.billing_portal_url`**: Link to billing portal/dashboard
- **`actions.contact_support_url`**: Link to contact support with renewal context

## 🌍 Multi-Language Support

### **Base Locale (__base__) - Serves as English**
- **Title**: "Subscription Renewal Reminder"
- **Content**: Complete template structure with full English content
- **Actions**: "Manage Subscription" / "View Billing Portal"
- **Support**: English help links and FAQ
- **Note**: Base locale serves as the English version with complete data

### **Greek Locale (el)**
- **Title**: "Υπενθύμιση Ανανέωσης Συνδρομής"
- **Content**: Professional Greek copy for renewal notifications
- **Actions**: "Διαχείριση Συνδρομής" / "Προβολή Πύλης Χρέωσης"
- **Support**: Greek help links and localized FAQ
- **Cultural Adaptation**: Appropriate tone and terminology for Greek market

## 📧 Usage Examples

### **English Email (Base Locale)**
```json
{
  "to": [{"email": "john.doe@example.com", "name": "John Doe"}],
  "from": {"email": "billing@waymore.io", "name": "Waymore Billing Team"},
  "subject": "Subscription Renewal Reminder - 7 Days",
  "template": {"key": "subscription-renewal-reminder-7d", "locale": "__base__"},
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
      "renewal_date": "2025-02-15",
      "days_until_expiry": 7,
      "billing_cycle": "Monthly",
      "next_amount": "$29.99",
      "currency": "USD",
      "auto_renewal": "Enabled",
      "urgency_percentage": 100
    },
    "actions": {
      "manage_subscription_url": "https://app.waymore.io/billing/manage?token=abc123",
      "billing_portal_url": "https://app.waymore.io/billing",
      "contact_support_url": "https://waymore.io/support?topic=subscription-renewal"
    }
  },
  "metadata": {
    "tenantId": "acme_corp",
    "eventId": "subscription-renewal-reminder-7d",
    "notificationType": "subscription_renewal_reminder",
    "daysUntilExpiry": 7
  }
}
```

### **Greek Email**
```json
{
  "to": [{"email": "maria.papadopoulos@example.com", "name": "Μαρία Παπαδοπούλου"}],
  "from": {"email": "billing@waymore.io", "name": "Ομάδα Χρέωσης Waymore"},
  "subject": "Υπενθύμιση Ανανέωσης Συνδρομής - 7 Ημέρες",
  "template": {"key": "subscription-renewal-reminder-7d", "locale": "el"},
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
      "plan_name": "Πλάνο Pro",
      "renewal_date": "2025-02-15",
      "days_until_expiry": 7,
      "billing_cycle": "Μηνιαίο",
      "next_amount": "€24.99",
      "currency": "EUR",
      "auto_renewal": "Ενεργοποιημένη",
      "urgency_percentage": 100
    },
    "actions": {
      "manage_subscription_url": "https://app.waymore.io/billing/manage?token=def456&lang=el",
      "billing_portal_url": "https://app.waymore.io/billing?lang=el",
      "contact_support_url": "https://waymore.io/support?topic=subscription-renewal&lang=el"
    }
  },
  "metadata": {
    "tenantId": "papadopoulos_corp",
    "eventId": "subscription-renewal-reminder-7d",
    "notificationType": "subscription_renewal_reminder",
    "daysUntilExpiry": 7
  }
}
```

## 🚀 Quick Start

### **Template Creation**
```bash
# Create the renewal reminder template
npx ts-node scripts/create-renewal-reminder-template.ts
```

### **Email Sending**
```bash
# Send test renewal reminder emails
npx ts-node scripts/send-renewal-reminder-test.ts
```

### **Admin Interface**
- **View Template**: `http://localhost:3000/admin/template-editor?template=subscription-renewal-reminder-7d&mode=edit`
- **Edit Locales**: Switch between English and Greek
- **Preview**: See real-time preview of both locales

## 📈 Use Cases

### **Subscription Management Systems**
- **7-Day Advance Notice**: Proactive renewal reminders
- **Billing Portal Integration**: Direct links to manage subscriptions
- **Plan Upgrade Prompts**: Encourage users to upgrade before renewal
- **Payment Method Updates**: Guide users to update expired payment methods

### **Customer Success**
- **Churn Prevention**: Reduce involuntary subscription cancellations
- **Revenue Optimization**: Increase plan upgrades and renewals
- **Customer Education**: Inform users about renewal process
- **Support Reduction**: Proactive communication reduces support tickets

### **Business Operations**
- **Automated Workflows**: Trigger renewal reminders automatically
- **Multi-Channel Delivery**: Email + in-app notifications
- **Localized Communication**: Support multiple languages and regions
- **Analytics Integration**: Track renewal reminder effectiveness

## 🎨 Design Features

### **Visual Elements**
- **Clock Icon (⏰)**: Represents time-sensitive renewal reminder
- **Blue Color Scheme (#2563eb)**: Professional, trustworthy, informational
- **Progress Bar**: Visual representation of urgency (7 days remaining)
- **Clear Typography**: Easy-to-read content with proper hierarchy

### **User Experience**
- **Action-Oriented**: Clear primary and secondary actions
- **Comprehensive Information**: All subscription details in one place
- **Support Access**: Easy access to help and FAQ
- **Mobile Responsive**: Works across all devices and email clients

### **Content Strategy**
- **Friendly Tone**: Reassuring and helpful messaging
- **Clear Instructions**: Step-by-step guidance for renewal
- **Urgency Without Pressure**: Important but not alarming
- **Professional Branding**: Consistent with company identity

## 🔧 Technical Implementation

### **Template Key**
```
subscription-renewal-reminder-7d
```

### **Category**
```
notification
```

### **Trigger Conditions**
- **Timing**: 7 days before subscription expiry
- **Recipients**: Primary billing contact(s)
- **Frequency**: Once per subscription cycle
- **Deduplication**: Prevent multiple reminders for same expiry date

### **Integration Points**
- **Billing System**: Subscription data and renewal dates
- **User Management**: Contact information and preferences
- **Payment Processing**: Payment method status and updates
- **Analytics**: Track open rates, click rates, and conversions

## 📊 Success Metrics

### **Key Performance Indicators**
- **Email Open Rate**: Target >25% for renewal reminders
- **Click-Through Rate**: Target >15% for manage subscription links
- **Renewal Rate**: Measure impact on subscription renewals
- **Support Ticket Reduction**: Fewer billing-related inquiries

### **A/B Testing Opportunities**
- **Subject Lines**: Test different urgency levels
- **Content Length**: Short vs. detailed messaging
- **Visual Elements**: Different icons and colors
- **Call-to-Action**: Various button text and placement

## 🛠️ Customization Options

### **Content Customization**
- **Tone Adjustment**: Formal vs. casual messaging
- **Urgency Level**: Adjust based on business requirements
- **Additional Information**: Include usage statistics or upgrade offers
- **Branding Elements**: Custom colors, fonts, and imagery

### **Functional Customization**
- **Timing**: Adjust reminder window (3, 5, 7, or 14 days)
- **Recipients**: Include additional stakeholders
- **Actions**: Add custom links or workflows
- **Conditions**: Add business logic for different user segments

## 📚 Related Documentation

- **[TRANSACTIONAL_TEMPLATE_GUIDE.md](./TRANSACTIONAL_TEMPLATE_GUIDE.md)**: Complete guide to transactional templates
- **[LOCALE_SYSTEM.md](./LOCALE_SYSTEM.md)**: Multi-language support system
- **[API.md](./API.md)**: Email Gateway API documentation
- **[PAYMENT_FAILURE_TEMPLATE.md](./PAYMENT_FAILURE_TEMPLATE.md)**: Related payment failure template

## 🎉 Best Practices

### **Content Guidelines**
- **Be Proactive**: Send reminders early enough for action
- **Be Clear**: Use simple, direct language
- **Be Helpful**: Provide all necessary information and links
- **Be Consistent**: Maintain brand voice and visual identity

### **Technical Best Practices**
- **Test Thoroughly**: Verify all locales and variables
- **Monitor Performance**: Track delivery and engagement metrics
- **Update Regularly**: Keep content and links current
- **Backup Plans**: Have fallback templates for edge cases

---

**Template Created**: January 2025  
**Last Updated**: January 2025  
**Version**: 1.0  
**Status**: Production Ready ✅
