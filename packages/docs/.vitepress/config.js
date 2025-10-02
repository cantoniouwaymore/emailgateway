import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Email Gateway',
  description: 'Complete email service with API, workers, and admin UI',
  
  // Base URL for deployment
  base: '/docs/',
  
  // Theme configuration
  themeConfig: {
    // Navigation
    nav: [
      { text: 'Home', link: '/' },
      { text: 'API Reference', link: '/api/' },
      { text: 'Guides', link: '/guides/' },
      { text: 'Admin UI', link: 'http://localhost:5173/admin/' }
    ],

    // Sidebar
    sidebar: {
      '/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/introduction' },
            { text: 'Quick Start', link: '/quick-start' },
            { text: 'Installation', link: '/installation' }
          ]
        },
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api/' },
            { text: 'Authentication', link: '/api/authentication' },
            { text: 'Endpoints', link: '/api/endpoints' },
            { text: 'Webhooks', link: '/api/webhooks' }
          ]
        },
        {
          text: 'Guides',
          items: [
            { text: 'Developer Guide', link: '/guides/developer' },
            { text: 'Template System', link: '/guides/templates' },
            { text: 'Deployment', link: '/guides/deployment' },
            { text: 'Architecture', link: '/guides/architecture' }
          ]
        }
      ]
    },

    // Social links
    socialLinks: [
      { icon: 'github', link: 'https://github.com/cantoniouwaymore/emailgateway' }
    ],

    // Footer
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 Waymore Platform'
    },

    // Search
    search: {
      provider: 'local'
    }
  },

  // Markdown configuration
  markdown: {
    lineNumbers: true
  }
})
