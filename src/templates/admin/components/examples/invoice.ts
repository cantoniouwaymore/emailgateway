// Invoice email example - Monthly invoice with details
export function getInvoiceExample() {
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
        type: "none"
      },
      title: {
        text: "Invoice #INV-2024-001 - $29.99",
        size: "28px",
        weight: "700",
        color: "#1f2937",
        align: "center"
      },
      body: {
        paragraphs: [
          "Hello John, your monthly invoice is ready.",
          "Thank you for your continued business with Waymore Platform.",
          "Payment has been automatically processed from your saved payment method."
        ],
        font_size: "16px",
        line_height: "26px"
      },
      snapshot: {
        title: "Invoice Details",
        facts: [
          { label: "Invoice Number", value: "INV-2024-001" },
          { label: "Amount", value: "$29.99" },
          { label: "Plan", value: "Pro Monthly" },
          { label: "Billing Period", value: "January 1-31, 2024" },
          { label: "Payment Date", value: "January 15, 2024" },
          { label: "Payment Method", value: "**** 4242" }
        ],
        style: "table"
      },
      visual: {
        type: "none"
      },
      actions: {
        primary: {
          label: "Download Invoice",
          url: "https://app.waymore.io/invoices/INV-2024-001",
          style: "button",
          color: "#3b82f6",
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
        primary_button_color: "#3b82f6",
        primary_button_text_color: "#ffffff",
        secondary_button_color: "#6b7280",
        secondary_button_text_color: "#ffffff"
      }
    }
  };
}
