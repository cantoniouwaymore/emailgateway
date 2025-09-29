// Payment failure email example - Failed payment notification
export function getPaymentFailureExample() {
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
        icon: "❌",
        icon_size: "48px"
      },
      title: {
        text: "Payment Failed - Action Required",
        size: "28px",
        weight: "700",
        color: "#ef4444",
        align: "center"
      },
      body: {
        paragraphs: [
          "Hello John, we were unable to process your payment.",
          "Please update your payment method to continue using Waymore Platform.",
          "Your service will remain active for 3 more days."
        ],
        font_size: "16px",
        line_height: "26px"
      },
      snapshot: {
        title: "Payment Details",
        facts: [
          { label: "Failed Amount", value: "$29.99" },
          { label: "Payment Method", value: "**** 4242" },
          { label: "Failure Reason", value: "Card expired" },
          { label: "Service Expires", value: "January 18, 2024" }
        ],
        style: "table"
      },
      visual: {
        type: "none"
      },
      actions: {
        primary: {
          label: "Update Payment Method",
          url: "https://app.waymore.io/billing/payment-methods",
          style: "button",
          color: "#ef4444",
          text_color: "#ffffff"
        },
        secondary: {
          label: "Contact Support",
          url: "https://waymore.io/support",
          style: "link",
          color: "#6b7280"
        }
      },
      support: {
        title: "Need help?",
        links: [
          { label: "Payment FAQ", url: "https://waymore.io/payment-faq" },
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
          { label: "Terms of Service", url: "https://waymore.io/terms" }
        ],
        copyright: "© 2024 Waymore Technologies Inc. All rights reserved."
      },
      theme: {
        primary_button_color: "#ef4444",
        primary_button_text_color: "#ffffff",
        secondary_button_color: "#6b7280",
        secondary_button_text_color: "#ffffff"
      }
    }
  };
}
