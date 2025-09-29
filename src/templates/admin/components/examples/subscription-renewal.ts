// Subscription renewal email example - Reminder with countdown timer
export function getRenewalExample() {
  return {
    template: {
      key: "transactional",
      locale: "en"
    },
    variables: {
      header: {
        logo_url: "https://i.ibb.co/8LfvqPk7/Waymore-logo-Colour.png",
        logo_alt: "Waymore",
        tagline: "Empowering your business"
      },
      hero: {
        type: "icon",
        icon: "⏰",
        icon_size: "48px"
      },
      title: {
        text: "Subscription Renewal Reminder - 7 Days",
        size: "28px",
        weight: "700",
        color: "#f59e0b",
        align: "center"
      },
      body: {
        paragraphs: [
          "Hello John, your Waymore Platform subscription will renew automatically in 7 days.",
          "No action needed - your subscription will continue seamlessly.",
          "Your payment method on file will be charged automatically."
        ],
        font_size: "16px",
        line_height: "26px"
      },
      snapshot: {
        title: "Subscription Details",
        facts: [
          { label: "Current Plan", value: "Pro Monthly" },
          { label: "Renewal Amount", value: "$29.99" },
          { label: "Renewal Date", value: "February 15, 2024" },
          { label: "Payment Method", value: "**** 4242" },
          { label: "Billing Cycle", value: "Monthly" }
        ],
        style: "table"
      },
      visual: {
        type: "countdown",
        countdown: {
          message: "Your subscription renews in",
          target_date: "2024-02-15T00:00:00Z",
          show_days: true,
          show_hours: true,
          show_minutes: false,
          show_seconds: false
        }
      },
      actions: {
        primary: {
          label: "Update Payment Method",
          url: "https://app.waymore.io/billing/payment-methods",
          style: "button",
          color: "#f59e0b",
          text_color: "#ffffff"
        },
        secondary: {
          label: "View Usage",
          url: "https://app.waymore.io/usage",
          style: "link",
          color: "#6b7280"
        }
      },
      support: {
        title: "Need help?",
        links: [
          { label: "Billing FAQ", url: "https://waymore.io/billing-faq" },
          { label: "Contact Support", url: "https://waymore.io/support" }
        ]
      },
      footer: {
        tagline: "Empowering your business",
        social_links: [
          { platform: "twitter", url: "https://twitter.com/waymore" },
          { platform: "linkedin", url: "https://linkedin.com/company/waymore" }
        ],
        legal_links: [
          { label: "Privacy Policy", url: "https://waymore.io/privacy" },
          { label: "Terms of Service", url: "https://waymore.io/terms" },
          { label: "Unsubscribe", url: "https://waymore.io/unsubscribe?token=abc123" }
        ],
        copyright: "© 2024 Waymore Technologies Inc. All rights reserved."
      },
      theme: {
        primary_button_color: "#f59e0b",
        primary_button_text_color: "#ffffff",
        secondary_button_color: "#6b7280",
        secondary_button_text_color: "#ffffff"
      }
    }
  };
}
