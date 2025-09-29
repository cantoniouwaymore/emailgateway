// Subscription upgrade email example - Plan upgrade confirmation
export function getUpgradeExample() {
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
        icon: "🚀",
        icon_size: "48px"
      },
      title: {
        text: "Upgrade Confirmation - Pro Plan Activated",
        size: "28px",
        weight: "700",
        color: "#10b981",
        align: "center"
      },
      body: {
        paragraphs: [
          "Hello John, congratulations on upgrading to the Pro plan!",
          "Your new features are now active and ready to use.",
          "Here's what you can expect with your Pro subscription."
        ],
        font_size: "16px",
        line_height: "26px"
      },
      snapshot: {
        title: "Pro Plan Features",
        facts: [
          { label: "API Requests", value: "Unlimited" },
          { label: "Storage", value: "100GB" },
          { label: "Priority Support", value: "24/7" },
          { label: "Advanced Analytics", value: "Included" }
        ],
        style: "table"
      },
      visual: {
        type: "none"
      },
      actions: {
        primary: {
          label: "Explore New Features",
          url: "https://app.waymore.io/features",
          style: "button",
          color: "#10b981",
          text_color: "#ffffff"
        },
        secondary: {
          label: "View Billing",
          url: "https://app.waymore.io/billing",
          style: "link",
          color: "#6b7280"
        }
      },
      support: {
        title: "Need help?",
        links: [
          { label: "Pro Features Guide", url: "https://waymore.io/pro-guide" },
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
