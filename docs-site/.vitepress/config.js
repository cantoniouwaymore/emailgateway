import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Docs',
  description: 'Complete documentation for the Internal Waymore Email Notification System',
  markdown: {
    theme: 'github-dark',
    lineNumbers: true
  },
  head: [
    ['script', { type: 'module' }, `
      import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
      mermaid.initialize({ startOnLoad: true });
    `]
  ],
  themeConfig: {
    logo: {
      light: '/logo-light.svg',
      dark: '/logo-dark.svg'
    },
    outline: {
      level: [2, 6]
    },
    docFooter: {
      prev: 'Previous page',
      next: 'Next page'
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Admin Dashboard', link: '/admin/' }
    ],
    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Home', link: '/' },
          { text: 'Quick Start', link: '/quick-start' }
        ]
      },
      {
        text: 'API',
        items: [
          { text: 'API Reference', link: '/api/' }
        ]
      },
      {
        text: 'Guides',
        items: [
          { text: 'Architecture', link: '/guides/architecture' },
          { text: 'Deployment', link: '/guides/deployment' },
          { text: 'Developer Guide', link: '/guides/developer' },
          { text: 'Templates', link: '/guides/templates' },
          { text: 'Routee Integration', link: '/guides/routee' },
          { text: 'Locale System', link: '/guides/locale-system' },
          { text: 'Cleanup & Maintenance', link: '/guides/cleanup' },
          { text: 'Monorepo Structure', link: '/guides/monorepo-structure' }
        ]
      },
      {
        text: 'Admin',
        items: [
          { text: 'Admin Dashboard', link: '/admin/' }
        ]
      }
    ]
  }
})