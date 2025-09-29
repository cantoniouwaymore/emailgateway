// Monthly report email example - Analytics report with metrics
export function getMonthlyReportExample() {
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
        icon: "📊",
        icon_size: "48px"
      },
      title: {
        text: "Monthly Report - January 2024",
        size: "28px",
        weight: "700",
        color: "#1f2937",
        align: "center"
      },
      body: {
        paragraphs: [
          "Hello John, here's your monthly performance report for January 2024.",
          "Your account activity and key metrics are summarized below.",
          "Keep up the great work!"
        ],
        font_size: "16px",
        line_height: "26px"
      },
      snapshot: {
        title: "Key Metrics",
        facts: [
          { label: "API Calls", value: "45,230" },
          { label: "Active Users", value: "1,234" },
          { label: "Storage Used", value: "2.3 GB" },
          { label: "Uptime", value: "99.9%" }
        ],
        style: "table"
      },
      visual: {
        type: "progress",
        progress_bars: [
          {
            label: "API Usage",
            current: 45230,
            total: 50000,
            percentage: 90,
            unit: "calls",
            color: "#3b82f6",
            description: "Monthly API usage"
          },
          {
            label: "Storage Usage",
            current: 2.3,
            total: 10,
            percentage: 23,
            unit: "GB",
            color: "#10b981",
            description: "Storage consumption"
          }
        ]
      },
      actions: {
        primary: {
          label: "View Full Report",
          url: "https://app.waymore.io/analytics",
          style: "button",
          color: "#3b82f6",
          text_color: "#ffffff"
        },
        secondary: {
          label: "Export Data",
          url: "https://app.waymore.io/export",
          style: "link",
          color: "#6b7280"
        }
      },
      support: {
        title: "Need help?",
        links: [
          { label: "Analytics Guide", url: "https://waymore.io/analytics-guide" },
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
