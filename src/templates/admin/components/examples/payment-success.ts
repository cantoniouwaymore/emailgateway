// Payment success email example - Transaction confirmation with receipt
export function getPaymentSuccessExample() {
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
        icon: "✅",
        icon_size: "48px"
      },
      title: {
        text: "Payment Successful - Receipt #INV-2024-001",
        size: "28px",
        weight: "700",
        color: "#10b981",
        align: "center"
      },
      body: {
        paragraphs: [
          "Hello John, your payment has been processed successfully!",
          "Thank you for your business and continued trust in Waymore Platform.",
          "Your receipt and transaction details are included below."
        ],
        font_size: "16px",
        line_height: "26px"
      },
      snapshot: {
        title: "Transaction Details",
        facts: [
          { label: "Transaction ID", value: "TXN-12345" },
          { label: "Amount", value: "$29.99" },
          { label: "Plan", value: "Pro Monthly" },
          { label: "Payment Method", value: "**** 4242" },
          { label: "Date", value: "January 15, 2024" },
          { label: "Next Billing", value: "February 15, 2024" }
        ],
        style: "table"
      },
      visual: {
        type: "none"
      },
      actions: {
        primary: {
          label: "Download Receipt",
          url: "https://app.waymore.io/receipts/TXN-12345",
          style: "button",
          color: "#10b981",
          text_color: "#ffffff"
        },
        secondary: {
          label: "View Billing History",
          url: "https://app.waymore.io/billing",
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
          { label: "Terms of Service", url: "https://waymore.io/terms" }
        ],
        copyright: "© 2024 Waymore Technologies Inc. All rights reserved."
      },
      theme: {
        primary_button_color: "#10b981",
        primary_button_text_color: "#ffffff",
        secondary_button_color: "#6b7280",
        secondary_button_text_color: "#ffffff"
      }
    }
  };
}
