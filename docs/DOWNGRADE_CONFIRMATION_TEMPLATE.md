# Subscription Downgrade Confirmation Template

## 📧 Template Overview

The **Subscription Downgrade Confirmation Template** (`subscription-downgrade-confirmation`) is designed to confirm successful plan downgrades, explain new limits and restrictions, provide clear information about when changes take effect, and set proper expectations to reduce confusion and frustration.

### **Business Purpose**
- **Set Clear Expectations**: Explain exactly what will change and when
- **Reduce Confusion**: Prevent users from being surprised by sudden feature losses
- **Avoid Billing Disputes**: Clear communication about cost savings and billing changes
- **Maintain Customer Satisfaction**: Help users understand their new plan benefits
- **Prevent Support Overload**: Proactive communication reduces "Where did my features go?" inquiries

## 🎯 Template Features

### **Core Functionality**
- **Immediate Confirmation**: Triggered right after successful downgrade action
- **Clear Limitations**: Explains reduced limits and features they'll lose
- **Effective Date**: When the downgrade takes effect (usually end of billing period)
- **Billing Transparency**: Shows cost savings and billing impact
- **Multi-Channel Support**: Email confirmation + in-app banner/alert support

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
    "icon": "📉",
    "icon_size": "48px"
  },
  "title": {
    "text": "Plan Downgrade Confirmed",
    "size": "28px",
    "weight": "700",
    "color": "#6b7280",
    "align": "center"
  },
  "body": {
    "intro": "Hi {{user.name}},",
    "paragraphs": [
      "Your subscription has been successfully changed from {{downgrade.old_plan}} to {{downgrade.new_plan}}.",
      "The downgrade will take effect on {{downgrade.effective_date}}, and you'll see the reduced cost reflected in your next billing cycle.",
      "Please note that some features and higher limits from your previous plan will no longer be available after the effective date.",
      "We understand that business needs change, and we're here to help you optimize your Waymore experience within your new plan limits."
    ],
    "note": "You can view your new plan details and current usage anytime through your account dashboard.",
    "font_size": "16px",
    "line_height": "26px"
  },
  "snapshot": {
    "title": "Downgrade Details",
    "facts": [
      { "label": "Previous Plan", "value": "{{downgrade.old_plan}}" },
      { "label": "New Plan", "value": "{{downgrade.new_plan}}" },
      { "label": "Effective Date", "value": "{{downgrade.effective_date}}" },
      { "label": "Cost Savings", "value": "{{billing.savings_amount}} {{billing.currency}} per {{billing.billing_cycle}}" },
      { "label": "Next Invoice Date", "value": "{{billing.next_invoice_date}}" },
      { "label": "Downgrade Type", "value": "{{downgrade.downgrade_type}}" }
    ],
    "style": "table"
  },
  "visual": {
    "type": "progress",
    "progress_bars": [
      {
        "label": "New Plan Status",
        "current": "Scheduled",
        "max": "Active",
        "unit": "",
        "percentage": "0",
        "color": "#6b7280",
        "description": "Downgrade scheduled for {{downgrade.effective_date}}"
      }
    ]
  },
  "limitations": {
    "title": "New Plan Limits & Features",
    "items": [
      {
        "category": "{{limitations.category_1}}",
        "items": [
          "{{limitations.item_1}}",
          "{{limitations.item_2}}",
          "{{limitations.item_3}}"
        ]
      },
      {
        "category": "{{limitations.category_2}}",
        "items": [
          "{{limitations.item_4}}",
          "{{limitations.item_5}}",
          "{{limitations.item_6}}"
        ]
      }
    ]
  },
  "actions": {
    "primary": {
      "label": "View New Plan Details",
      "url": "{{actions.plan_details_url}}",
      "style": "button",
      "color": "#6b7280",
      "text_color": "#ffffff"
    },
    "secondary": {
      "label": "Manage Billing",
      "url": "{{actions.billing_url}}",
      "style": "link",
      "color": "#6b7280"
    }
  },
  "support": {
    "title": "Need help adjusting to your new plan?",
    "links": [
      { "label": "Plan Comparison Guide", url: "{{company.website}}/plans" },
      { "label": "Usage Optimization Tips", url: "{{company.website}}/usage-tips" },
      { "label": "Contact Support", url: "{{actions.contact_support_url}}" },
      { "label": "View Billing Details", url: "{{actions.billing_url}}" }
    ]
  },
  "footer": {
    "tagline": "Empowering your business",
    "social_links": [
      { "platform": "twitter", url: "https://twitter.com/waymore" },
      { "platform": "linkedin", url: "https://linkedin.com/company/waymore" }
    ],
    "legal_links": [
      { "label": "Privacy Policy", url: "{{company.website}}/privacy" },
      { "label": "Terms of Service", url: "{{company.website}}/terms" }
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
  "downgrade": {
    "old_plan": "string",
    "new_plan": "string",
    "effective_date": "string",
    "downgrade_type": "string"
  },
  "billing": {
    "savings_amount": "string",
    "currency": "string",
    "next_invoice_date": "string",
    "billing_cycle": "string"
  },
  "limitations": {
    "category_1": "string",
    "category_2": "string",
    "item_1": "string",
    "item_2": "string",
    "item_3": "string",
    "item_4": "string",
    "item_5": "string",
    "item_6": "string"
  },
  "actions": {
    "plan_details_url": "string",
    "billing_url": "string",
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

#### **Downgrade Variables**
- **`downgrade.old_plan`**: Name of the previous plan (e.g., "Business Plan")
- **`downgrade.new_plan`**: Name of the new downgraded plan (e.g., "Pro Plan")
- **`downgrade.effective_date`**: Date when downgrade takes effect (YYYY-MM-DD)
- **`downgrade.downgrade_type`**: Type of downgrade (e.g., "End of Billing Period", "Immediate")

#### **Billing Variables**
- **`billing.savings_amount`**: Cost savings from downgrade (e.g., "$50.00")
- **`billing.currency`**: Currency code (e.g., "USD", "EUR")
- **`billing.next_invoice_date`**: Date of next invoice (YYYY-MM-DD)
- **`billing.billing_cycle`**: Billing frequency (e.g., "month", "year")

#### **Limitations Variables**
- **`limitations.category_1`**: First category of limitations (e.g., "Reduced Limits")
- **`limitations.category_2`**: Second category of limitations (e.g., "Limited Features")
- **`limitations.item_1`** to **`limitations.item_6`**: Specific limitation descriptions (e.g., "30,000 contacts (down from 100,000)")

#### **Action Variables**
- **`actions.plan_details_url`**: Direct link to new plan details and limitations
- **`actions.billing_url`**: Link to billing management dashboard
- **`actions.contact_support_url`**: Link to contact support with downgrade context

## 🌍 Multi-Language Support

### **Base Locale (__base__) - Serves as English**
- **Title**: "Plan Downgrade Confirmed"
- **Content**: Complete template structure with full English content
- **Actions**: "View New Plan Details" / "Manage Billing"
- **Support**: English help links and usage optimization tips
- **Note**: Base locale serves as the English version with complete data

### **Greek Locale (el)**
- **Title**: "Η Κατάβαση Προγράμματος Επιβεβαιώθηκε"
- **Content**: Professional Greek copy for downgrade confirmation notifications
- **Actions**: "Προβολή Λεπτομερειών Νέου Προγράμματος" / "Διαχείριση Χρέωσης"
- **Support**: Greek help links and localized usage optimization tips
- **Cultural Adaptation**: Appropriate tone and terminology for Greek market

## 📧 Usage Examples

### **English Email - Business to Pro Downgrade**
```json
{
  "to": [{"email": "john.doe@example.com", "name": "John Doe"}],
  "from": {"email": "billing@waymore.io", "name": "Waymore Billing Team"},
  "subject": "Plan Downgrade Confirmed - Business to Pro Plan",
  "template": {"key": "subscription-downgrade-confirmation", "locale": "__base__"},
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
    "downgrade": {
      "old_plan": "Business Plan",
      "new_plan": "Pro Plan",
      "effective_date": "2025-02-01",
      "downgrade_type": "End of Billing Period"
    },
    "billing": {
      "savings_amount": "$50.00",
      "currency": "USD",
      "next_invoice_date": "2025-02-01",
      "billing_cycle": "month"
    },
    "limitations": {
      "category_1": "Reduced Limits",
      "category_2": "Limited Features",
      "item_1": "30,000 contacts (down from 100,000)",
      "item_2": "Limited events tracking (down from unlimited)",
      "item_3": "50GB storage (down from 500GB)",
      "item_4": "Basic analytics dashboard",
      "item_5": "Standard integrations only",
      "item_6": "Email support (no priority access)"
    },
    "actions": {
      "plan_details_url": "https://app.waymore.io/billing/plan-details?downgrade=true",
      "billing_url": "https://app.waymore.io/billing",
      "contact_support_url": "https://waymore.io/support?topic=downgrade-confirmation"
    }
  },
  "metadata": {
    "tenantId": "acme_corp",
    "eventId": "subscription-downgrade-confirmation",
    "notificationType": "downgrade_confirmation",
    "downgradeType": "end_of_period",
    "fromPlan": "business",
    "toPlan": "pro"
  }
}
```

### **Greek Email - Pro to Starter Downgrade**
```json
{
  "to": [{"email": "maria.papadopoulos@example.com", "name": "Μαρία Παπαδοπούλου"}],
  "from": {"email": "billing@waymore.io", "name": "Ομάδα Χρέωσης Waymore"},
  "subject": "Η Κατάβαση Προγράμματος Επιβεβαιώθηκε - Pro σε Starter Plan",
  "template": {"key": "subscription-downgrade-confirmation", "locale": "el"},
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
    "downgrade": {
      "old_plan": "Pro Plan",
      "new_plan": "Starter Plan",
      "effective_date": "2025-02-01",
      "downgrade_type": "Τέλος Περιόδου Χρέωσης"
    },
    "billing": {
      "savings_amount": "€20.00",
      "currency": "EUR",
      "next_invoice_date": "2025-02-01",
      "billing_cycle": "μήνα"
    },
    "limitations": {
      "category_1": "Μειωμένα Όρια",
      "category_2": "Περιορισμένες Λειτουργίες",
      "item_1": "5,000 επαφές (από 30,000)",
      "item_2": "1,000 events ανά μήνα (από 10,000)",
      "item_3": "5GB αποθήκευση (από 50GB)",
      "item_4": "Βασικό dashboard αναλυτικών",
      "item_5": "Χωρίς API ενσωματώσεις",
      "item_6": "Email υποστήριξη μόνο"
    },
    "actions": {
      "plan_details_url": "https://app.waymore.io/billing/plan-details?downgrade=true&lang=el",
      "billing_url": "https://app.waymore.io/billing?lang=el",
      "contact_support_url": "https://waymore.io/support?topic=downgrade-confirmation&lang=el"
    }
  },
  "metadata": {
    "tenantId": "papadopoulos_corp",
    "eventId": "subscription-downgrade-confirmation",
    "notificationType": "downgrade_confirmation",
    "downgradeType": "end_of_period",
    "fromPlan": "pro",
    "toPlan": "starter"
  }
}
```

## 🚀 Quick Start

### **Template Creation**
```bash
# Create the downgrade confirmation template
npx ts-node scripts/create-downgrade-confirmation-template.ts
```

### **Email Sending**
```bash
# Send test downgrade confirmation emails
npx ts-node scripts/send-downgrade-confirmation-test.ts
```

### **Admin Interface**
- **View Template**: `http://localhost:3000/admin/template-editor?template=subscription-downgrade-confirmation&mode=edit`
- **Edit Locales**: Switch between English and Greek
- **Preview**: See real-time preview of both locales

## 📈 Use Cases

### **Subscription Management Systems**
- **Plan Downgrades**: Confirmation for all types of plan downgrades
- **Feature Limitations**: Clear explanation of what features will be lost
- **Billing Transparency**: Show cost savings and billing impact
- **Expectation Setting**: Help users prepare for reduced capabilities

### **Customer Experience**
- **Downgrade Confirmation**: Immediate proof that downgrade was processed
- **Clear Expectations**: Help users understand what will change and when
- **Billing Clarity**: Transparent information about cost savings
- **Supportive Tone**: Acknowledge that business needs change

### **Business Operations**
- **Automated Confirmation**: Immediate notification after successful downgrade
- **Multi-Channel Delivery**: Email + in-app banner confirmations
- **Localized Communication**: Support multiple languages and regions
- **Support Reduction**: Comprehensive information prevents confusion

## 🎨 Design Features

### **Visual Elements**
- **Downgrade Icon (📉)**: Represents reduction and change in service level
- **Neutral Color Scheme (#6b7280)**: Professional gray that's informative but not alarming
- **Progress Bar**: Visual representation showing "Scheduled" status until effective date
- **Limitation Categories**: Organized display of reduced features and limits

### **User Experience**
- **Supportive Tone**: Understanding and helpful messaging about business changes
- **Clear Information**: Comprehensive downgrade details and limitations
- **Expectation Setting**: Help users prepare for reduced capabilities
- **Mobile Responsive**: Works across all devices and email clients

### **Content Strategy**
- **Empathetic Approach**: Acknowledge that business needs change
- **Clear Communication**: Honest explanation of limitations and changes
- **Helpful Resources**: Provide links to optimization tips and support
- **Professional Tone**: Maintain brand voice while being supportive

## 🔧 Technical Implementation

### **Template Key**
```
subscription-downgrade-confirmation
```

### **Category**
```
notification
```

### **Trigger Conditions**
- **Timing**: Immediately after successful downgrade action
- **Recipients**: Primary billing contact(s) and workspace admins
- **Frequency**: Once per successful downgrade
- **Deduplication**: Prevent multiple confirmations for same downgrade

### **Integration Points**
- **Plan Management**: Integration with subscription and billing systems
- **Limitation Catalog**: Dynamic limitation descriptions based on plan changes
- **Billing System**: Cost savings calculation and next invoice dates
- **Analytics**: Track confirmation effectiveness and user understanding

## 📊 Success Metrics

### **Key Performance Indicators**
- **Email Open Rate**: Target >35% for downgrade confirmations
- **Support Ticket Reduction**: Fewer "Where did my features go?" inquiries
- **Billing Dispute Reduction**: Fewer billing-related complaints
- **User Understanding**: Positive feedback on clear communication

### **A/B Testing Opportunities**
- **Subject Lines**: Test different approaches to downgrade messaging
- **Content Tone**: Formal vs. supportive messaging
- **Visual Elements**: Different icons and colors
- **Call-to-Action**: Various approaches to drive plan management

## 🛠️ Customization Options

### **Content Customization**
- **Tone Adjustment**: More formal vs. more supportive messaging
- **Limitation Detail**: Adjust level of detail about reduced features
- **Branding Elements**: Custom colors, fonts, and imagery
- **Support Integration**: Custom help desk or optimization resources

### **Functional Customization**
- **Multi-Plan Support**: Handle different downgrade paths and combinations
- **Limitation Mapping**: Dynamic limitation descriptions based on plan types
- **Billing Integration**: Custom savings calculations and display
- **Analytics Integration**: Track downgrade confirmation effectiveness

## 📚 Related Documentation

- **[TRANSACTIONAL_TEMPLATE_GUIDE.md](./TRANSACTIONAL_TEMPLATE_GUIDE.md)**: Complete guide to transactional templates
- **[LOCALE_SYSTEM.md](./LOCALE_SYSTEM.md)**: Multi-language support system
- **[API.md](./API.md)**: Email Gateway API documentation
- **[UPGRADE_SUCCESS_TEMPLATE.md](./UPGRADE_SUCCESS_TEMPLATE.md)**: Related upgrade success template
- **[RENEWAL_SUCCESS_TEMPLATE.md](./RENEWAL_SUCCESS_TEMPLATE.md)**: Related renewal success template

## 🎉 Best Practices

### **Content Guidelines**
- **Be Supportive**: Acknowledge that business needs change
- **Be Clear**: Explain exactly what will change and when
- **Be Honest**: Don't minimize the impact of reduced features
- **Be Helpful**: Provide resources for optimization and support

### **Technical Best Practices**
- **Test Thoroughly**: Verify all locales and limitation combinations
- **Monitor Performance**: Track delivery and engagement metrics
- **Update Regularly**: Keep limitation descriptions current
- **Backup Plans**: Have fallback templates for edge cases

### **Business Best Practices**
- **Right Timing**: Send immediately after successful downgrade
- **Clear Expectations**: Make limitations and changes obvious
- **Support Integration**: Provide easy access to optimization help
- **Analytics Focus**: Track and optimize based on user understanding

---

**Template Created**: January 2025  
**Last Updated**: January 2025  
**Version**: 1.0  
**Status**: Production Ready ✅
