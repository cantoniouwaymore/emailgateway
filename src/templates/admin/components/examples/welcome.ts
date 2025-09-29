// Welcome email example - Basic onboarding with progress bars
export function getWelcomeExample() {
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
        type: "image",
        image_url: "https://i.ibb.co/kg6jGjXZ/Lets-Start-4.png",
        image_alt: "Let's Start",
        image_width: "400px", // Fixed pixel width for email compatibility
        padding: "20px 0px 30px 0px",
        show: true
      },
      title: {
        text: "Welcome to Waymore!",
        size: "28px",
        weight: "700",
        color: "#1f2937",
        align: "center"
      },
      body: {
        paragraphs: [
          "Hello John, welcome to Waymore Platform!",
          "Your account is ready to use. Here are some tips to get started:",
          "• Explore your dashboard\n• Set up your profile\n• Connect your first integration\n\nIf you have any questions, don't hesitate to reach out to our support team."
        ],
        font_size: "16px",
        line_height: "26px"
      },
      snapshot: {
        title: "Account Summary",
        facts: [
          { label: "Account Type", value: "Pro Plan" },
          { label: "Signup Date", value: "January 15, 2024" },
          { label: "Account ID", value: "ACC-12345" }
        ],
        style: "table"
      },
      visual: {
        type: "progress",
        progress_bars: [
          {
            label: "Account Setup",
            current: 3,
            max: 5,
            unit: "steps",
            percentage: 60,
            color: "#3b82f6",
            description: "Complete your profile setup"
          }
        ]
      },
      actions: {
        primary: {
          label: "Get Started",
          url: "https://app.waymore.io/dashboard",
          style: "button",
          color: "#3b82f6",
          text_color: "#ffffff"
        },
        secondary: {
          label: "View Documentation",
          url: "https://docs.waymore.io",
          style: "link",
          color: "#6b7280"
        }
      },
      support: {
        title: "Need help?",
        links: [
          { label: "FAQ", url: "https://waymore.io/faq" },
          { label: "Contact Support", url: "https://waymore.io/support" }
        ]
      },
      footer: {
        tagline: "Empowering your business",
        social_links: [
          { platform: "twitter", url: "https://twitter.com/waymore" },
          { platform: "linkedin", url: "https://linkedin.com/company/waymore" },
          { platform: "github", url: "https://github.com/waymore" }
        ],
        legal_links: [
          { label: "Privacy Policy", url: "https://waymore.io/privacy" },
          { label: "Terms of Service", url: "https://waymore.io/terms" },
          { label: "Unsubscribe", url: "https://waymore.io/unsubscribe?token=abc123" }
        ],
        copyright: "© 2024 Waymore Technologies Inc. All rights reserved."
      },
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
