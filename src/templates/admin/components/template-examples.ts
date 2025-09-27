// Template examples showcasing full API functionality
export function getWelcomeExample() {
  return {
    template: {
      key: "transactional",
      locale: "en"
    },
    variables: {
      workspace_name: "Waymore",
      user_firstname: "John",
      product_name: "Waymore Platform",
      support_email: "support@waymore.io",
      email_title: "Welcome to Waymore!",
      custom_content: "Hello {{user_firstname}},<br><br>Welcome to {{product_name}}! Your account is ready to use. Here are some tips to get started:<br><br>• Explore your dashboard<br>• Set up your profile<br>• Connect your first integration<br><br>If you have any questions, don't hesitate to reach out to our support team.",
      image_url: "https://i.ibb.co/8LfvqPk7/Waymore-logo-Colour.png",
      image_alt: "Waymore Logo",
      facts: [
        { label: "Account Type", value: "Pro Plan" },
        { label: "Signup Date", value: "{{current_date}}" },
        { label: "Account ID", value: "ACC-{{user_id}}" }
      ],
      cta_primary: {
        label: "Get Started",
        url: "https://app.waymore.io/dashboard"
      },
      cta_secondary: {
        label: "View Documentation",
        url: "https://docs.waymore.io"
      },
      social_links: [
        { platform: "twitter", url: "https://twitter.com/waymore" },
        { platform: "linkedin", url: "https://linkedin.com/company/waymore" },
        { platform: "github", url: "https://github.com/waymore" }
      ],
      footer_text: "Questions? Contact us at <a href='mailto:support@waymore.io'>support@waymore.io</a> or visit our <a href='https://help.waymore.io'>help center</a>.",
      footer_links: [
        { label: "Privacy Policy", url: "https://waymore.io/privacy" },
        { label: "Terms of Service", url: "https://waymore.io/terms" },
        { label: "Unsubscribe", url: "https://waymore.io/unsubscribe?token=abc123" }
      ],
      copyright_text: "© 2024 Waymore Technologies Inc. All rights reserved. | <a href='https://waymore.io'>waymore.io</a>",
      theme: {
        font_family: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
        font_size: "16px",
        line_height: "26px",
        background_color: "#ffffff",
        body_background: "#f8fafc",
        text_color: "#374151",
        heading_color: "#1f2937",
        muted_text_color: "#6b7280",
        primary_button_color: "#3b82f6",
        primary_button_text_color: "#ffffff",
        secondary_button_color: "#6b7280",
        secondary_button_text_color: "#ffffff",
        card_background: "#f8fafc",
        border_color: "#e5e7eb",
        link_color: "#3b82f6",
        social_button_color: "#f3f4f6",
        social_icon_color: "#6b7280"
      }
    }
  };
}

export function getPaymentSuccessExample() {
  return {
    template: {
      key: "transactional",
      locale: "en"
    },
    variables: {
      workspace_name: "Waymore",
      user_firstname: "John",
      product_name: "Waymore Platform",
      support_email: "support@waymore.io",
      email_title: "Payment Successful - Receipt #INV-2024-001",
      custom_content: "Hello {{user_firstname}},<br><br>Your payment has been processed successfully!<br><br>Thank you for your business and continued trust in {{product_name}}.",
      image_url: "https://i.ibb.co/8LfvqPk7/Waymore-logo-Colour.png",
      image_alt: "Waymore Logo",
      facts: [
        { label: "Transaction ID", value: "TXN-{{transaction_id}}" },
        { label: "Amount", value: "$29.99" },
        { label: "Plan", value: "Pro Monthly" },
        { label: "Payment Method", value: "**** 4242" },
        { label: "Date", value: "{{current_date}}" },
        { label: "Next Billing", value: "{{next_billing_date}}" }
      ],
      cta_primary: {
        label: "Download Receipt",
        url: "https://app.waymore.io/receipts/{{transaction_id}}"
      },
      cta_secondary: {
        label: "View Billing History",
        url: "https://app.waymore.io/billing"
      },
      social_links: [
        { platform: "twitter", url: "https://twitter.com/waymore" },
        { platform: "linkedin", url: "https://linkedin.com/company/waymore" }
      ],
      theme: {
        primary_button_color: "#10b981",
        primary_button_text_color: "#ffffff",
        secondary_button_color: "#6b7280",
        secondary_button_text_color: "#ffffff"
      }
    }
  };
}

export function getRenewalExample() {
  return {
    template: {
      key: "transactional",
      locale: "en"
    },
    variables: {
      workspace_name: "Waymore",
      user_firstname: "John",
      product_name: "Waymore Platform",
      support_email: "support@waymore.io",
      email_title: "Subscription Renewal Reminder - 7 Days",
      custom_content: "Hello {{user_firstname}},<br><br>Your {{product_name}} subscription will renew automatically in 7 days.<br><br>No action needed - your subscription will continue seamlessly.",
      image_url: "https://i.ibb.co/8LfvqPk7/Waymore-logo-Colour.png",
      image_alt: "Waymore Logo",
      facts: [
        { label: "Current Plan", value: "Pro Monthly" },
        { label: "Renewal Amount", value: "$29.99" },
        { label: "Renewal Date", value: "{{renewal_date}}" },
        { label: "Payment Method", value: "**** 4242" },
        { label: "Billing Cycle", value: "Monthly" }
      ],
      cta_primary: {
        label: "Update Payment Method",
        url: "https://app.waymore.io/billing/payment-methods"
      },
      cta_secondary: {
        label: "View Usage",
        url: "https://app.waymore.io/usage"
      },
      social_links: [
        { platform: "twitter", url: "https://twitter.com/waymore" },
        { platform: "linkedin", url: "https://linkedin.com/company/waymore" }
      ],
      footer_links: [
        { label: "Privacy Policy", url: "https://waymore.io/privacy" },
        { label: "Terms of Service", url: "https://waymore.io/terms" },
        { label: "Unsubscribe", url: "https://waymore.io/unsubscribe?token=abc123" }
      ],
      theme: {
        primary_button_color: "#f59e0b",
        primary_button_text_color: "#ffffff",
        secondary_button_color: "#6b7280",
        secondary_button_text_color: "#ffffff"
      }
    }
  };
}

export function getUsageExample() {
  return {
    template: {
      key: "transactional",
      locale: "en"
    },
    variables: {
      workspace_name: "Waymore",
      user_firstname: "John",
      product_name: "Waymore Platform",
      support_email: "support@waymore.io",
      email_title: "Usage Warning - 80% Limit Reached",
      custom_content: "Hello {{user_firstname}},<br><br>You've reached 80% of your monthly usage limit for {{product_name}}.<br><br>Consider upgrading your plan to avoid service interruption.",
      image_url: "https://i.ibb.co/8LfvqPk7/Waymore-logo-Colour.png",
      image_alt: "Waymore Logo",
      facts: [
        { label: "Current Usage", value: "8,000 emails" },
        { label: "Monthly Limit", value: "10,000 emails" },
        { label: "Remaining", value: "2,000 emails" },
        { label: "Usage Percentage", value: "80%" },
        { label: "Reset Date", value: "{{reset_date}}" }
      ],
      cta_primary: {
        label: "Upgrade Plan",
        url: "https://app.waymore.io/billing/upgrade"
      },
      cta_secondary: {
        label: "View Usage Details",
        url: "https://app.waymore.io/usage"
      },
      social_links: [
        { platform: "twitter", url: "https://twitter.com/waymore" },
        { platform: "linkedin", url: "https://linkedin.com/company/waymore" }
      ],
      footer_links: [
        { label: "Privacy Policy", url: "https://waymore.io/privacy" },
        { label: "Terms of Service", url: "https://waymore.io/terms" },
        { label: "Unsubscribe", url: "https://waymore.io/unsubscribe?token=abc123" }
      ],
      theme: {
        primary_button_color: "#ef4444",
        primary_button_text_color: "#ffffff",
        secondary_button_color: "#6b7280",
        secondary_button_text_color: "#ffffff"
      }
    }
  };
}

export function getUpgradeExample() {
  return {
    template: {
      key: "transactional",
      locale: "en"
    },
    variables: {
      workspace_name: "Waymore",
      user_firstname: "John",
      product_name: "Waymore Platform",
      support_email: "support@waymore.io",
      email_title: "Plan Upgrade Confirmed - Welcome to Pro!",
      custom_content: "Hello {{user_firstname}},<br><br>Congratulations! Your {{product_name}} plan has been successfully upgraded.<br><br>You now have access to all Pro features and benefits.",
      image_url: "https://i.ibb.co/8LfvqPk7/Waymore-logo-Colour.png",
      image_alt: "Waymore Logo",
      facts: [
        { label: "New Plan", value: "Pro Monthly" },
        { label: "Monthly Cost", value: "$29.99" },
        { label: "Features", value: "Unlimited emails, Priority support" },
        { label: "Effective Date", value: "{{upgrade_date}}" },
        { label: "Next Billing", value: "{{next_billing_date}}" }
      ],
      cta_primary: {
        label: "Explore New Features",
        url: "https://app.waymore.io/features"
      },
      cta_secondary: {
        label: "Contact Support",
        url: "https://app.waymore.io/support"
      },
      social_links: [
        { platform: "twitter", url: "https://twitter.com/waymore" },
        { platform: "linkedin", url: "https://linkedin.com/company/waymore" },
        { platform: "github", url: "https://github.com/waymore" }
      ],
      footer_links: [
        { label: "Privacy Policy", url: "https://waymore.io/privacy" },
        { label: "Terms of Service", url: "https://waymore.io/terms" },
        { label: "Unsubscribe", url: "https://waymore.io/unsubscribe?token=abc123" }
      ],
      theme: {
        primary_button_color: "#8b5cf6",
        primary_button_text_color: "#ffffff",
        secondary_button_color: "#6b7280",
        secondary_button_text_color: "#ffffff"
      }
    }
  };
}

export function getPaymentFailureExample() {
  return {
    template: {
      key: "transactional",
      locale: "en"
    },
    variables: {
      workspace_name: "Waymore",
      user_firstname: "John",
      product_name: "Waymore Platform",
      support_email: "support@waymore.io",
      email_title: "Payment Failed - Action Required",
      custom_content: "Hello {{user_firstname}},<br><br>We were unable to process your payment for {{product_name}}.<br><br>Please update your payment method to continue service without interruption.",
      image_url: "https://i.ibb.co/8LfvqPk7/Waymore-logo-Colour.png",
      image_alt: "Waymore Logo",
      facts: [
        { label: "Failed Amount", value: "$29.99" },
        { label: "Plan", value: "Pro Monthly" },
        { label: "Failure Reason", value: "Insufficient funds" },
        { label: "Attempt Date", value: "{{failure_date}}" },
        { label: "Next Retry", value: "{{retry_date}}" }
      ],
      cta_primary: {
        label: "Update Payment Method",
        url: "https://app.waymore.io/billing/payment-methods"
      },
      cta_secondary: {
        label: "Contact Support",
        url: "https://app.waymore.io/support"
      },
      social_links: [
        { platform: "twitter", url: "https://twitter.com/waymore" },
        { platform: "linkedin", url: "https://linkedin.com/company/waymore" }
      ],
      footer_links: [
        { label: "Privacy Policy", url: "https://waymore.io/privacy" },
        { label: "Terms of Service", url: "https://waymore.io/terms" },
        { label: "Unsubscribe", url: "https://waymore.io/unsubscribe?token=abc123" }
      ],
      theme: {
        primary_button_color: "#ef4444",
        primary_button_text_color: "#ffffff",
        secondary_button_color: "#6b7280",
        secondary_button_text_color: "#ffffff"
      }
    }
  };
}

export function getInvoiceExample() {
  return {
    template: {
      key: "transactional",
      locale: "en"
    },
    variables: {
      workspace_name: "Waymore",
      user_firstname: "John",
      product_name: "Waymore Platform",
      support_email: "support@waymore.io",
      email_title: "Invoice #INV-2024-001 - Payment Due",
      custom_content: "Hello {{user_firstname}},<br><br>Your invoice for {{product_name}} is ready for payment.<br><br>Please review the details below and complete payment by the due date.",
      image_url: "https://i.ibb.co/8LfvqPk7/Waymore-logo-Colour.png",
      image_alt: "Waymore Logo",
      facts: [
        { label: "Invoice Number", value: "INV-2024-001" },
        { label: "Amount Due", value: "$29.99" },
        { label: "Due Date", value: "{{due_date}}" },
        { label: "Billing Period", value: "{{billing_period}}" },
        { label: "Payment Terms", value: "Net 30" }
      ],
      cta_primary: {
        label: "Pay Now",
        url: "https://app.waymore.io/invoices/INV-2024-001/pay"
      },
      cta_secondary: {
        label: "Download PDF",
        url: "https://app.waymore.io/invoices/INV-2024-001/download"
      },
      social_links: [
        { platform: "twitter", url: "https://twitter.com/waymore" },
        { platform: "linkedin", url: "https://linkedin.com/company/waymore" }
      ],
      footer_links: [
        { label: "Privacy Policy", url: "https://waymore.io/privacy" },
        { label: "Terms of Service", url: "https://waymore.io/terms" },
        { label: "Unsubscribe", url: "https://waymore.io/unsubscribe?token=abc123" }
      ],
      theme: {
        primary_button_color: "#059669",
        primary_button_text_color: "#ffffff",
        secondary_button_color: "#6b7280",
        secondary_button_text_color: "#ffffff"
      }
    }
  };
}

export function getPasswordResetExample() {
  return {
    template: {
      key: "transactional",
      locale: "en"
    },
    variables: {
      workspace_name: "Waymore",
      user_firstname: "John",
      product_name: "Waymore Platform",
      support_email: "support@waymore.io",
      email_title: "Reset Your Password",
      custom_content: "Hello {{user_firstname}},<br><br>We received a request to reset your password for {{product_name}}.<br><br>Click the button below to create a new password. This link will expire in 24 hours.",
      image_url: "https://i.ibb.co/8LfvqPk7/Waymore-logo-Colour.png",
      image_alt: "Waymore Logo",
      facts: [
        { label: "Request Time", value: "{{request_time}}" },
        { label: "IP Address", value: "{{ip_address}}" },
        { label: "Expires", value: "{{expiry_time}}" },
        { label: "Account", value: "{{user_email}}" }
      ],
      cta_primary: {
        label: "Reset Password",
        url: "https://app.waymore.io/reset-password?token={{reset_token}}"
      },
      cta_secondary: {
        label: "Contact Support",
        url: "https://app.waymore.io/support"
      },
      social_links: [
        { platform: "twitter", url: "https://twitter.com/waymore" },
        { platform: "linkedin", url: "https://linkedin.com/company/waymore" }
      ],
      footer_links: [
        { label: "Privacy Policy", url: "https://waymore.io/privacy" },
        { label: "Terms of Service", url: "https://waymore.io/terms" },
        { label: "Unsubscribe", url: "https://waymore.io/unsubscribe?token=abc123" }
      ],
      theme: {
        primary_button_color: "#dc2626",
        primary_button_text_color: "#ffffff",
        secondary_button_color: "#6b7280",
        secondary_button_text_color: "#ffffff"
      }
    }
  };
}

export function getMonthlyReportExample() {
  return {
    template: {
      key: "transactional",
      locale: "en"
    },
    variables: {
      workspace_name: "Waymore",
      user_firstname: "John",
      product_name: "Waymore Platform",
      support_email: "support@waymore.io",
      email_title: "Your Monthly Report - January 2024",
      custom_content: "Hello {{user_firstname}},<br><br>Here's your monthly performance report for {{product_name}}.<br><br>You've had an amazing month with significant growth across all metrics.",
      image_url: "https://i.ibb.co/8LfvqPk7/Waymore-logo-Colour.png",
      image_alt: "Waymore Logo",
      facts: [
        { label: "Emails Sent", value: "12,450" },
        { label: "Delivery Rate", value: "98.5%" },
        { label: "Open Rate", value: "24.3%" },
        { label: "Click Rate", value: "8.7%" },
        { label: "Growth", value: "+15.2%" }
      ],
      cta_primary: {
        label: "View Full Report",
        url: "https://app.waymore.io/reports/january-2024"
      },
      cta_secondary: {
        label: "Export Data",
        url: "https://app.waymore.io/reports/export"
      },
      social_links: [
        { platform: "twitter", url: "https://twitter.com/waymore" },
        { platform: "linkedin", url: "https://linkedin.com/company/waymore" },
        { platform: "github", url: "https://github.com/waymore" }
      ],
      footer_links: [
        { label: "Privacy Policy", url: "https://waymore.io/privacy" },
        { label: "Terms of Service", url: "https://waymore.io/terms" },
        { label: "Unsubscribe", url: "https://waymore.io/unsubscribe?token=abc123" }
      ],
      theme: {
        primary_button_color: "#0ea5e9",
        primary_button_text_color: "#ffffff",
        secondary_button_color: "#6b7280",
        secondary_button_text_color: "#ffffff"
      }
    }
  };
}

// Export all examples as a single object
export const templateExamples = {
  'welcome': getWelcomeExample(),
  'payment-success': getPaymentSuccessExample(),
  'renewal-7': getRenewalExample(),
  'usage-80': getUsageExample(),
  'upgrade': getUpgradeExample(),
  'payment-failure': getPaymentFailureExample(),
  'invoice': getInvoiceExample(),
  'password-reset': getPasswordResetExample(),
  'monthly-report': getMonthlyReportExample()
};
