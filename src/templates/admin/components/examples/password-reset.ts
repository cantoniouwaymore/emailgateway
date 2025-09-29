// Password reset email example - Security reset with token
export function getPasswordResetExample() {
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
        icon: "🔐",
        icon_size: "48px"
      },
      title: {
        text: "Password Reset Request",
        size: "28px",
        weight: "700",
        color: "#3b82f6",
        align: "center"
      },
      body: {
        paragraphs: [
          "Hello John, we received a request to reset your password.",
          "Click the button below to create a new password. This link will expire in 1 hour.",
          "If you didn't request this reset, please ignore this email."
        ],
        font_size: "16px",
        line_height: "26px"
      },
      snapshot: {
        title: "Security Details",
        facts: [
          { label: "Request Time", value: "January 15, 2024 at 2:30 PM" },
          { label: "IP Address", value: "192.168.1.1" },
          { label: "Location", value: "San Francisco, CA" },
          { label: "Link Expires", value: "January 15, 2024 at 3:30 PM" }
        ],
        style: "table"
      },
      visual: {
        type: "none"
      },
      actions: {
        primary: {
          label: "Reset Password",
          url: "https://app.waymore.io/reset-password?token=abc123",
          style: "button",
          color: "#3b82f6",
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
          { label: "Security FAQ", url: "https://waymore.io/security-faq" },
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
