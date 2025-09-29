// Dark mode email example - Feature announcement with dark theme
export function getDarkModeExample() {
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
        icon: "🌙",
        icon_size: "48px"
      },
      title: {
        text: "Dark Mode Available",
        size: "28px",
        weight: "700",
        color: "#ffffff",
        align: "center"
      },
      body: {
        paragraphs: [
          "Hello John, we've added dark mode to Waymore Platform!",
          "Switch to dark mode for a more comfortable viewing experience, especially in low-light conditions.",
          "You can toggle between light and dark themes in your account settings."
        ],
        font_size: "16px",
        line_height: "26px"
      },
      snapshot: {
        title: "Dark Mode Features",
        facts: [
          { label: "Eye Strain Reduction", value: "Up to 40%" },
          { label: "Battery Life", value: "Extended on OLED" },
          { label: "Auto Switch", value: "Based on time" },
          { label: "Custom Themes", value: "Available" }
        ],
        style: "table"
      },
      visual: {
        type: "none"
      },
      actions: {
        primary: {
          label: "Enable Dark Mode",
          url: "https://app.waymore.io/settings/appearance",
          style: "button",
          color: "#6366f1",
          text_color: "#ffffff"
        },
        secondary: {
          label: "Learn More",
          url: "https://waymore.io/dark-mode-guide",
          style: "link",
          color: "#9ca3af"
        }
      },
      support: {
        title: "Need help?",
        links: [
          { label: "Appearance FAQ", url: "https://waymore.io/appearance-faq" },
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
        dark_mode: true,
        dark_background_color: "#1a1a1a",
        dark_text_color: "#e0e0e0",
        dark_heading_color: "#ffffff",
        dark_muted_color: "#888888",
        dark_border_color: "#333333",
        dark_card_background: "#2a2a2a",
        primary_button_color: "#6366f1",
        primary_button_text_color: "#ffffff",
        secondary_button_color: "#6b7280",
        secondary_button_text_color: "#ffffff"
      }
    }
  };
}
