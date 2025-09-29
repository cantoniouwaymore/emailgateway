// Countdown email example - Limited time offer with countdown timer
export function getCountdownExample() {
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
        text: "Limited Time Offer - 24 Hours Left!",
        size: "28px",
        weight: "700",
        color: "#ef4444",
        align: "center"
      },
      body: {
        paragraphs: [
          "Hello John, don't miss out on our special promotion!",
          "Get 50% off your first year of Pro plan - but hurry, this offer expires soon.",
          "Use the code SAVE50 at checkout to claim your discount."
        ],
        font_size: "16px",
        line_height: "26px"
      },
      visual: {
        type: "countdown",
        countdown: {
          message: "Offer expires in",
          target_date: "2025-12-31T23:59:59Z", // New Year's Eve 2025 - always in the future for this year
          show_days: true,
          show_hours: true,
          show_minutes: true,
          show_seconds: true
        }
      },
      snapshot: {
        title: "Offer Details",
        facts: [
          { label: "Discount", value: "50% OFF" },
          { label: "Code", value: "SAVE50" },
          { label: "Valid For", value: "First Year" },
          { label: "Expires", value: "December 31, 2025" }
        ],
        style: "table"
      },
      actions: {
        primary: {
          label: "Claim Offer Now",
          url: "https://app.waymore.io/upgrade?code=SAVE50",
          style: "button",
          color: "#ef4444",
          text_color: "#ffffff"
        },
        secondary: {
          label: "Learn More",
          url: "https://waymore.io/promotion",
          style: "link",
          color: "#6b7280"
        }
      },
      support: {
        title: "Need help?",
        links: [
          { label: "Promotion FAQ", url: "https://waymore.io/promotion-faq" },
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
