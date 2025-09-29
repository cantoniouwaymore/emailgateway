// Usage alert email example - Usage warning with progress bars
export function getUsageExample() {
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
        icon: "⚠️",
        icon_size: "48px"
      },
      title: {
        text: "Usage Alert - 80% Limit Reached",
        size: "28px",
        weight: "700",
        color: "#f59e0b",
        align: "center"
      },
      body: {
        paragraphs: [
          "Hello John, you've used 80% of your Pro plan.",
          "You're approaching your monthly limit. Consider upgrading to avoid any service interruption.",
          "Your current usage breakdown is shown below."
        ],
        font_size: "16px",
        line_height: "26px"
      },
      visual: {
        type: "progress",
        progress_bars: [
          {
            label: "API Requests",
            current: 8000,
            total: 10000,
            percentage: 80,
            unit: "requests",
            color: "#f59e0b",
            description: "Monthly usage"
          }
        ]
      },
      snapshot: {
        title: "Usage Summary",
        facts: [
          { label: "Current Usage", value: "80%" },
          { label: "Plan Limit", value: "10,000 requests" },
          { label: "Used", value: "8,000 requests" },
          { label: "Remaining", value: "2,000 requests" }
        ],
        style: "table"
      },
      actions: {
        primary: {
          label: "Upgrade Plan",
          url: "https://app.waymore.io/upgrade",
          style: "button",
          color: "#f59e0b",
          text_color: "#ffffff"
        },
        secondary: {
          label: "View Usage Details",
          url: "https://app.waymore.io/usage",
          style: "link",
          color: "#6b7280"
        }
      },
      support: {
        title: "Need help?",
        links: [
          { label: "Usage FAQ", url: "https://waymore.io/usage-faq" },
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
        primary_button_color: "#f59e0b",
        primary_button_text_color: "#ffffff",
        secondary_button_color: "#6b7280",
        secondary_button_text_color: "#ffffff"
      }
    }
  };
}
