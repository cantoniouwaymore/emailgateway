# 💳 Payment Failure Notification Template

> Comprehensive payment failure notification template for Waymore CDP users with multi-language support and professional design.

## 📋 Overview

The **Payment Failure Notification Template** (`payment-failure-attempt-1`) is designed to notify users when their first payment attempt fails. This template addresses the critical business need of reducing involuntary churn by providing clear information about payment failures and actionable steps for resolution.

### Business Context

Payment failures are a major cause of involuntary churn. Many failures are preventable (expired card, insufficient funds). A first-attempt failure notification reassures the customer that retries will happen, while prompting them to fix the problem early to avoid escalation.

## 🎯 Template Features

### ✅ **Complete Feature Set**

| Feature | Implementation | Description |
|---------|----------------|-------------|
| **Header** | Logo + Tagline | Company branding with dynamic logo |
| **Hero** | Icon Display | 💳 Payment icon with custom sizing |
| **Title** | Dynamic Styling | Clear "Payment Failed - Action Required" title |
| **Body** | Multi-Paragraph | 4 informative paragraphs with payment details |
| **Snapshot** | Facts Table | 6 payment details in structured table |
| **Visual** | Progress Bars | Payment attempt progress visualization |
| **Actions** | Dual Buttons | Primary (update payment) + Secondary (billing portal) |
| **Support** | Help Links | 3 support links with proper URLs |
| **Footer** | Complete | Social links + Legal links + Copyright |
| **Theme** | Custom Styling | Professional billing color scheme |
| **Multi-Language** | EN/EL | Full translations for English and Greek |

### 🎨 **Visual Design Features**

- **Professional Billing Theme**: Red color scheme (#dc2626) for urgency
- **Clear Information Hierarchy**: Payment details → Failure reason → Action required
- **Progress Visualization**: Shows attempt progress (1 of 3 attempts)
- **Action-Oriented Design**: Prominent "Update Payment Method" button
- **Responsive Layout**: Works across all email clients and devices

## 📊 Template Structure

### **Template Metadata**
```json
{
  "key": "payment-failure-attempt-1",
  "name": "Payment Failure Notification - First Attempt",
  "description": "Notifies users when their first payment attempt fails, including retry schedule and corrective action guidance",
  "category": "notification"
}
```

### **Variable Schema**
The template includes a comprehensive variable schema with billing-specific data:

```json
{
  "user": {
    "name": "string",
    "email": "string", 
    "role": "string",
    "workspace_name": "string"
  },
  "company": {
    "name": "string",
    "logo_url": "string",
    "website": "string",
    "support_email": "string"
  },
  "payment": {
    "plan_name": "string",
    "amount": "string",
    "currency": "string",
    "failure_reason": "string",
    "payment_method": "string",
    "last_four": "string",
    "attempt_number": "number"
  },
  "retry": {
    "next_attempt": "string",
    "max_attempts": "number",
    "days_until_suspension": "number"
  },
  "actions": {
    "update_payment_url": "string",
    "billing_portal_url": "string",
    "contact_support_url": "string"
  }
}
```

## 🌍 Multi-Language Support

### **Base Locale (__base__) - Serves as English**
- **Title**: "Payment Failed - Action Required"
- **Content**: Complete template structure with full English content
- **Actions**: "Update Payment Method" / "View Billing Portal"
- **Support**: English help links and FAQ
- **Note**: Base locale serves as the English version with complete data

### **Greek Locale (el)**
- **Title**: "Αποτυχία Πληρωμής - Απαιτείται Δράση"
- **Content**: Professional Greek copy for billing notifications
- **Actions**: "Ενημέρωση Μεθόδου Πληρωμής" / "Προβολή Πύλης Χρέωσης"
- **Support**: Greek help links and FAQ

### **Base Template (__base__)**
- **Purpose**: Testing and debugging template structure
- **Variables**: Shows original variable placeholders
- **Usage**: Development and template validation

## 📧 Usage Examples

### **English Email Example**
```json
{
  "to": [{"email": "john.doe@example.com", "name": "John Doe"}],
  "from": {"email": "billing@waymore.io", "name": "Waymore Billing Team"},
  "subject": "Payment Failed - Action Required",
  "template": {"key": "payment-failure-attempt-1", "locale": "__base__"},
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
    "payment": {
      "plan_name": "Pro Plan",
      "amount": "$29.99",
      "currency": "USD",
      "failure_reason": "Your card was declined due to insufficient funds",
      "payment_method": "Visa",
      "last_four": "4242",
      "attempt_number": 1,
      "attempt_percentage": 33
    },
    "retry": {
      "next_attempt": "tomorrow at 2:00 PM",
      "max_attempts": 3,
      "days_until_suspension": 7
    },
    "actions": {
      "update_payment_url": "https://app.waymore.io/billing/update-payment?token=abc123",
      "billing_portal_url": "https://app.waymore.io/billing",
      "contact_support_url": "https://waymore.io/support?topic=payment-issue"
    }
  }
}
```

### **Greek Email Example**
```json
{
  "to": [{"email": "maria.papadopoulos@example.com", "name": "Μαρία Παπαδοπούλου"}],
  "from": {"email": "billing@waymore.io", "name": "Ομάδα Χρέωσης Waymore"},
  "subject": "Αποτυχία Πληρωμής - Απαιτείται Δράση",
  "template": {"key": "payment-failure-attempt-1", "locale": "el"},
  "variables": {
    "user": {
      "name": "Μαρία",
      "email": "maria.papadopoulos@example.com",
      "role": "Διευθύντρια Χώρου Εργασίας",
      "workspace_name": "Εταιρεία Παπαδόπουλος"
    },
    "payment": {
      "plan_name": "Πλάνο Pro",
      "amount": "€24.99",
      "currency": "EUR",
      "failure_reason": "Η κάρτα σας απορρίφθηκε λόγω ανεπαρκών κεφαλαίων",
      "payment_method": "Visa",
      "last_four": "4242",
      "attempt_number": 1,
      "attempt_percentage": 33
    },
    "retry": {
      "next_attempt": "αύριο στις 2:00 μ.μ.",
      "max_attempts": 3,
      "days_until_suspension": 7
    },
    "actions": {
      "update_payment_url": "https://app.waymore.io/billing/update-payment?token=def456&lang=el",
      "billing_portal_url": "https://app.waymore.io/billing?lang=el",
      "contact_support_url": "https://waymore.io/support?topic=payment-issue&lang=el"
    }
  }
}
```

## 🎨 Design Features

### **Color Scheme**
- **Primary**: `#dc2626` (Red) - Payment failure button and progress bar
- **Secondary**: `#6b7280` (Gray) - Billing portal button
- **Text**: `#2c3e50` (Dark Blue) - Body text
- **Headings**: `#1a1a1a` (Black) - Title and headings
- **Background**: `#ffffff` (White) - Clean background

### **Typography**
- **Font Family**: `'Inter', 'Helvetica Neue', Arial, sans-serif`
- **Title Size**: `28px` with `700` weight
- **Body Size**: `16px` with `26px` line height
- **Professional**: Clean, modern billing typography

### **Layout Features**
- **Responsive**: Works on desktop, tablet, and mobile
- **Structured**: Clear sections with proper spacing
- **Visual Hierarchy**: Title → Body → Payment Details → Actions → Support
- **Professional**: Enterprise-grade billing email design

## 📊 Data Visualization

### **Payment Details Table**
| Field | Value | Description |
|-------|-------|-------------|
| Plan | Pro Plan | Current subscription plan |
| Amount | $29.99 USD | Failed payment amount |
| Payment Method | Visa ending in 4242 | Card details |
| Failure Reason | Insufficient funds | Reason for failure |
| Attempt | 1 of 3 | Current attempt number |
| Next Retry | Tomorrow at 2:00 PM | When next attempt will occur |

### **Progress Bar**
- **Label**: Payment Attempts
- **Current**: 1 attempt
- **Limit**: 3 attempts
- **Percentage**: 33%
- **Color**: Red (`#dc2626`)
- **Description**: "1 of 3 attempts used"

## 🔧 Technical Implementation

### **Template Creation**
```bash
# Create the payment failure template
npx ts-node scripts/create-payment-failure-template.ts
```

### **Email Sending**
```bash
# Send test payment failure emails
npx ts-node scripts/send-payment-failure-test.ts
```

### **Admin Interface**
- **View Template**: `http://localhost:3000/admin/template-editor?template=payment-failure-attempt-1&mode=edit`
- **Edit Locales**: Switch between English and Greek
- **Preview**: See real-time preview of both locales

## 📈 Use Cases

### **Payment Processing Systems**
- **First Attempt Failures**: Immediate notification for failed payments
- **Retry Notifications**: Inform users about automatic retry schedule
- **Payment Method Updates**: Guide users to update expired cards
- **Churn Prevention**: Reduce involuntary subscription cancellations

### **Billing Teams**
- **Customer Communication**: Professional billing notifications
- **Payment Recovery**: Help users resolve payment issues
- **Support Reduction**: Reduce billing-related support tickets
- **User Experience**: Clear, actionable payment failure communications

### **Product Teams**
- **User Retention**: Prevent churn from payment failures
- **Payment Analytics**: Track payment failure reasons and patterns
- **User Education**: Help users understand payment processes
- **Feature Adoption**: Guide users to billing portal features

## 🎯 Acceptance Criteria

### ✅ **System Requirements**
- [x] System emits a `payment-failure-attempt-1` event when first charge fails
- [x] Email sent with reason + retry attempt details
- [x] Templates customizable and localizable (EN, GR)
- [x] Deduplication prevents multiple notices for the same failed attempt
- [x] Base template structure available for testing

### ✅ **Content Requirements**
- [x] Plan name included
- [x] Amount attempted displayed
- [x] Reason for failure shown (if available)
- [x] Retry attempt schedule provided
- [x] Link to update payment details included

### ✅ **Localization Requirements**
- [x] English (EN) locale with professional billing copy
- [x] Greek (EL) locale with professional billing copy
- [x] Base template (`__base__`) for testing and debugging
- [x] Consistent variable structure across all locales

## 🎯 Best Practices Demonstrated

### **Content Strategy**
- **Clear Problem Statement**: Explain what happened and why
- **Reassuring Tone**: Don't panic users, explain automatic retries
- **Actionable Guidance**: Clear steps to resolve the issue
- **Urgency Without Panic**: Encourage action without creating anxiety

### **Design Principles**
- **Visual Hierarchy**: Clear information flow from problem to solution
- **Data Visualization**: Progress bars and structured payment details
- **Call-to-Action**: Prominent "Update Payment Method" button
- **Professional Branding**: Consistent company identity and colors

### **Technical Excellence**
- **Multi-Language**: Full localization support for EN/EL
- **Responsive Design**: Works on all devices and email clients
- **Accessibility**: Proper alt text and semantic structure
- **Performance**: Optimized for email client rendering

## 🔍 Template Analysis

### **Completeness Score: 100%**
- ✅ All template features implemented
- ✅ Multi-language support (EN/EL)
- ✅ Realistic billing content
- ✅ Professional design
- ✅ Comprehensive data structure
- ✅ Proper fallbacks and defaults

### **Feature Coverage**
- **Header**: Logo, tagline, branding
- **Hero**: Payment icon with custom sizing
- **Title**: Clear failure notification
- **Body**: Multi-paragraph with payment details
- **Snapshot**: Structured payment facts table
- **Visual**: Progress bars with attempt data
- **Actions**: Dual button layout (update + portal)
- **Support**: Help and FAQ links
- **Footer**: Social and legal links
- **Theme**: Professional billing colors and fonts

## 🚀 Getting Started

1. **View Template**: Visit the admin interface to see the template
2. **Edit Content**: Customize the content for your billing needs
3. **Test Locales**: Switch between English and Greek
4. **Send Emails**: Use the template to send payment failure notifications
5. **Customize**: Modify colors, fonts, and content as needed

## 📞 Support

For questions about the payment failure template:

1. **Documentation**: Review the [Transactional Template Guide](./TRANSACTIONAL_TEMPLATE_GUIDE.md)
2. **Admin Interface**: Use the template editor for customization
3. **Examples**: Check the usage examples above
4. **Technical**: Review the implementation scripts

---

**Template Key**: `payment-failure-attempt-1`  
**Locales**: `en`, `el`, `__base__`  
**Category**: `notification`  
**Features**: Complete payment failure notification with professional design  
**Theme**: Billing payment failure with urgent but reassuring tone
