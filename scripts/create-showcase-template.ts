import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const key = 'showcase';

  const exists = await prisma.template.findUnique({ where: { key } });
  if (exists) {
    console.log(`Template ${key} already exists. Updating its data...`);
  }

  const variableSchema = {
    type: 'object',
    properties: {
      header: {
        type: 'object',
        properties: {
          logo_url: { type: 'string' },
          logo_alt: { type: 'string' },
          tagline: { type: 'string' }
        }
      },
      hero: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['none', 'image', 'icon'] },
          image_url: { type: 'string' },
          image_alt: { type: 'string' },
          image_width: { type: 'string' },
          icon: { type: 'string' },
          icon_size: { type: 'string' }
        }
      },
      title: {
        type: 'object',
        properties: {
          text: { type: 'string' },
          size: { type: 'string' },
          weight: { type: 'string' },
          color: { type: 'string' },
          align: { type: 'string' }
        }
      },
      body: {
        type: 'object',
        properties: {
          intro: { type: 'string' },
          paragraphs: { type: 'array', items: { type: 'string' } },
          note: { type: 'string' },
          font_size: { type: 'string' },
          line_height: { type: 'string' }
        }
      },
      snapshot: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          facts: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                label: { type: 'string' },
                value: { type: 'string' }
              }
            }
          },
          style: { type: 'string', enum: ['table', 'cards', 'list'] }
        }
      },
      visual: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['none', 'progress', 'countdown'] },
          progress_bars: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                label: { type: 'string' },
                current: { type: 'number' },
                max: { type: 'number' },
                unit: { type: 'string' },
                percentage: { type: 'number' },
                color: { type: 'string' },
                description: { type: 'string' }
              }
            }
          },
          countdown: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              target_date: { type: 'string' },
              show_days: { type: 'boolean' },
              show_hours: { type: 'boolean' },
              show_minutes: { type: 'boolean' },
              show_seconds: { type: 'boolean' }
            }
          }
        }
      },
      actions: {
        type: 'object',
        properties: {
          primary: {
            type: 'object',
            properties: {
              label: { type: 'string' },
              url: { type: 'string' },
              style: { type: 'string', enum: ['button', 'link'] },
              color: { type: 'string' },
              text_color: { type: 'string' }
            }
          },
          secondary: {
            type: 'object',
            properties: {
              label: { type: 'string' },
              url: { type: 'string' },
              style: { type: 'string', enum: ['button', 'link'] },
              color: { type: 'string' },
              text_color: { type: 'string' }
            }
          }
        }
      },
      support: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          links: {
            type: 'array',
            items: { type: 'object', properties: { label: { type: 'string' }, url: { type: 'string' } } }
          }
        }
      },
      footer: {
        type: 'object',
        properties: {
          tagline: { type: 'string' },
          social_links: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                platform: { type: 'string', enum: ['twitter', 'linkedin', 'github', 'facebook', 'instagram'] },
                url: { type: 'string' }
              }
            }
          },
          legal_links: {
            type: 'array',
            items: { type: 'object', properties: { label: { type: 'string' }, url: { type: 'string' } } }
          },
          copyright: { type: 'string' }
        }
      },
      footer_links: {
        type: 'array',
        items: { type: 'object', properties: { label: { type: 'string' }, url: { type: 'string' } } }
      },
      theme: {
        type: 'object',
        properties: {
          font_family: { type: 'string' },
          font_size: { type: 'string' },
          text_color: { type: 'string' },
          heading_color: { type: 'string' },
          background_color: { type: 'string' },
          body_background: { type: 'string' },
          muted_text_color: { type: 'string' },
          border_color: { type: 'string' },
          primary_button_color: { type: 'string' },
          primary_button_text_color: { type: 'string' },
          secondary_button_color: { type: 'string' },
          secondary_button_text_color: { type: 'string' },
          dark_mode: { type: 'boolean' },
          dark_background_color: { type: 'string' },
          dark_text_color: { type: 'string' },
          dark_heading_color: { type: 'string' },
          dark_muted_color: { type: 'string' },
          dark_border_color: { type: 'string' },
          dark_card_background: { type: 'string' }
        }
      },
      content: { type: 'object', additionalProperties: { type: 'string' } },
      custom_content: { type: 'string' }
    },
    required: ['header', 'title', 'body']
  } as any;

  const jsonStructure = {
    header: {
      logo_url: 'https://i.ibb.co/8LfvqPk7/Waymore-logo-Colour.png',
      logo_alt: 'Waymore',
      tagline: 'Empowering your business'
    },
    hero: {
      type: 'icon',
      icon: '🎯',
      icon_size: '48px',
      image_url: 'https://picsum.photos/800/400',
      image_alt: 'Showcase Hero',
      image_width: '600px'
    },
    title: {
      text: 'Showcase: All Features in One Email',
      size: '28px',
      weight: '700',
      color: '#1f2937',
      align: 'center'
    },
    body: {
      intro: 'Hi John,',
      paragraphs: [
        'This email demonstrates every available section and option in our transactional template system.',
        'You can mix and match components, customize visuals, and localize content with ease.',
        'Scroll down to see snapshot facts, progress visuals, dual CTAs, support links, and a rich footer.'
      ],
      note: 'Tip: You can turn any section on/off by omitting it from variables.',
      font_size: '16px',
      line_height: '26px'
    },
    snapshot: {
      title: 'Account Snapshot',
      facts: [
        { label: 'Account Type', value: 'Pro Plan' },
        { label: 'User ID', value: 'USR-123456' },
        { label: 'Created', value: '2024-06-01' },
        { label: 'Status', value: 'Active' }
      ],
      style: 'table'
    },
    visual: {
      type: 'progress',
      progress_bars: [
        { label: 'Profile Completion', current: 75, max: 100, unit: '%', percentage: 75, color: '#3b82f6', description: 'Complete your profile' },
        { label: 'Monthly Emails', current: 8500, max: 10000, unit: 'emails', percentage: 85, color: '#ef4444', description: 'Approaching monthly limit' }
      ],
      countdown: {
        message: 'Trial ends in',
        target_date: '2099-12-31T23:59:59Z',
        show_days: true,
        show_hours: true,
        show_minutes: true,
        show_seconds: false
      }
    },
    actions: {
      primary: { label: 'Open Dashboard', url: 'https://app.waymore.io/dashboard', style: 'button', color: '#3b82f6', text_color: '#ffffff' },
      secondary: { label: 'View Docs', url: 'https://docs.waymore.io', style: 'link', color: '#6b7280', text_color: '#ffffff' }
    },
    support: {
      title: 'Need help?',
      links: [
        { label: 'FAQ', url: 'https://waymore.io/faq' },
        { label: 'Contact Support', url: 'https://waymore.io/support' }
      ]
    },
    footer: {
      tagline: 'Empowering your business',
      social_links: [
        { platform: 'twitter', url: 'https://twitter.com/waymore' },
        { platform: 'linkedin', url: 'https://linkedin.com/company/waymore' }
      ],
      legal_links: [
        { label: 'Privacy Policy', url: 'https://waymore.io/privacy' },
        { label: 'Terms of Service', url: 'https://waymore.io/terms' }
      ],
      copyright: '© 2025 Waymore Technologies Inc. All rights reserved.'
    },
    footer_links: [
      { label: 'Privacy Policy', url: 'https://waymore.io/privacy' },
      { label: 'Terms', url: 'https://waymore.io/terms' },
      { label: 'Unsubscribe', url: 'https://waymore.io/unsubscribe?token=example' }
    ],
    theme: {
      font_family: "'Inter', 'Helvetica Neue', Arial, sans-serif",
      font_size: '16px',
      text_color: '#2c3e50',
      heading_color: '#1a1a1a',
      background_color: '#ffffff',
      body_background: '#f4f4f4',
      muted_text_color: '#888888',
      border_color: '#e0e0e0',
      primary_button_color: '#3b82f6',
      primary_button_text_color: '#ffffff',
      secondary_button_color: '#6c757d',
      secondary_button_text_color: '#ffffff',
      dark_mode: false,
      dark_background_color: '#1a1a1a',
      dark_text_color: '#e0e0e0',
      dark_heading_color: '#ffffff',
      dark_muted_color: '#888888',
      dark_border_color: '#333333',
      dark_card_background: '#2a2a2a'
    },
    content: {
      en: 'Welcome to our platform!',
      es: '¡Bienvenido a nuestra plataforma!',
      fr: 'Bienvenue sur notre plateforme!'
    },
    custom_content: '<p>You can also render raw HTML content when needed.</p>'
  } as any;

  const data = {
    key,
    name: 'Showcase Template',
    description: 'Demonstrates all sections and options of the transactional template system',
    category: 'transactional',
    variableSchema,
    jsonStructure
  };

  if (exists) {
    await prisma.template.update({ where: { key }, data });
  } else {
    await prisma.template.create({ data });
  }

  // Ensure an English locale entry mirrors base structure for previewing
  const tmpl = await prisma.template.findUnique({ where: { key } });
  if (tmpl) {
    await prisma.templateLocale.upsert({
      where: { templateId_locale: { templateId: tmpl.id, locale: 'en' } },
      update: { jsonStructure },
      create: { templateId: tmpl.id, locale: 'en', jsonStructure }
    });
  }

  console.log('✅ Showcase template is ready.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
