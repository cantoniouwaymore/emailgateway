#!/usr/bin/env ts-node

/**
 * Template Migration Script
 * 
 * This script migrates the current file-based template system to the new database-driven system.
 * It extracts the template structure from the current transactional-en.mjml file and creates
 * the corresponding database records.
 */

import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

// Extract template structure from current MJML template
function extractTemplateStructure(): any {
  // This is the base structure that the current template expects
  // We'll use this as the default template structure
  return {
    header: {
      logo_url: "{{header.logo_url}}",
      logo_alt: "{{header.logo_alt}}",
      logo_width: "{{header.logo_width}}",
      tagline: "{{header.tagline}}",
      show: "{{header.show}}",
      padding: "{{header.padding}}"
    },
    hero: {
      type: "{{hero.type}}",
      image_url: "{{hero.image_url}}",
      image_alt: "{{hero.image_alt}}",
      image_width: "{{hero.image_width}}",
      icon: "{{hero.icon}}",
      icon_size: "{{hero.icon_size}}",
      show: "{{hero.show}}",
      padding: "{{hero.padding}}"
    },
    title: {
      text: "{{title.text}}",
      size: "{{title.size}}",
      weight: "{{title.weight}}",
      color: "{{title.color}}",
      align: "{{title.align}}",
      line_height: "{{title.line_height}}",
      show: "{{title.show}}",
      padding: "{{title.padding}}"
    },
    body: {
      paragraphs: "{{body.paragraphs}}",
      font_size: "{{body.font_size}}",
      line_height: "{{body.line_height}}",
      color: "{{body.color}}",
      show: "{{body.show}}",
      padding: "{{body.padding}}"
    },
    snapshot: {
      title: "{{snapshot.title}}",
      facts: "{{snapshot.facts}}",
      style: "{{snapshot.style}}",
      show: "{{snapshot.show}}",
      padding: "{{snapshot.padding}}"
    },
    visual: {
      type: "{{visual.type}}",
      progress_bars: "{{visual.progress_bars}}",
      countdown: "{{visual.countdown}}",
      show: "{{visual.show}}",
      padding: "{{visual.padding}}"
    },
    actions: {
      primary: "{{actions.primary}}",
      secondary: "{{actions.secondary}}",
      show: "{{actions.show}}",
      padding: "{{actions.padding}}"
    },
    support: {
      title: "{{support.title}}",
      links: "{{support.links}}",
      show: "{{support.show}}",
      padding: "{{support.padding}}"
    },
    footer: {
      logo: "{{footer.logo}}",
      tagline: "{{footer.tagline}}",
      social_links: "{{footer.social_links}}",
      legal_links: "{{footer.legal_links}}",
      copyright: "{{footer.copyright}}",
      show: "{{footer.show}}",
      padding: "{{footer.padding}}"
    },
    theme: {
      font_family: "{{theme.font_family}}",
      font_size: "{{theme.font_size}}",
      text_color: "{{theme.text_color}}",
      heading_color: "{{theme.heading_color}}",
      background_color: "{{theme.background_color}}",
      body_background: "{{theme.body_background}}",
      muted_text_color: "{{theme.muted_text_color}}",
      border_color: "{{theme.border_color}}",
      primary_button_color: "{{theme.primary_button_color}}",
      primary_button_text_color: "{{theme.primary_button_text_color}}",
      secondary_button_color: "{{theme.secondary_button_color}}",
      secondary_button_text_color: "{{theme.secondary_button_text_color}}"
    }
  };
}

// Generate variable schema from template structure
function generateVariableSchema(): any {
  return {
    type: "object",
    properties: {
      workspace_name: {
        type: "string",
        description: "Name of the workspace/organization",
        required: true,
        example: "Acme Corp"
      },
      user_firstname: {
        type: "string",
        description: "First name of the user",
        required: true,
        example: "John"
      },
      dashboard_url: {
        type: "string",
        description: "URL to the user dashboard",
        required: true,
        format: "uri",
        example: "https://app.acme.com/dashboard"
      },
      docs_url: {
        type: "string",
        description: "URL to documentation",
        required: false,
        format: "uri",
        example: "https://docs.acme.com"
      },
      header: {
        type: "object",
        description: "Header section configuration",
        properties: {
          logo_url: {
            type: "string",
            description: "URL to company logo",
            format: "uri",
            example: "https://example.com/logo.png"
          },
          logo_alt: {
            type: "string",
            description: "Alt text for logo",
            example: "Company Logo"
          },
          logo_width: {
            type: "string",
            description: "Logo width",
            example: "180px"
          },
          tagline: {
            type: "string",
            description: "Company tagline",
            example: "Empowering your business"
          },
          show: {
            type: "boolean",
            description: "Whether to show header",
            default: true
          },
          padding: {
            type: "string",
            description: "Header padding",
            example: "40px 20px 20px 20px"
          }
        }
      },
      hero: {
        type: "object",
        description: "Hero section configuration",
        properties: {
          type: {
            type: "string",
            enum: ["none", "image", "icon"],
            description: "Hero section type"
          },
          image_url: {
            type: "string",
            description: "Hero image URL",
            format: "uri"
          },
          image_alt: {
            type: "string",
            description: "Hero image alt text"
          },
          image_width: {
            type: "string",
            description: "Hero image width",
            example: "400px"
          },
          icon: {
            type: "string",
            description: "Hero icon emoji or character"
          },
          icon_size: {
            type: "string",
            description: "Hero icon size",
            example: "48px"
          },
          show: {
            type: "boolean",
            description: "Whether to show hero section",
            default: true
          },
          padding: {
            type: "string",
            description: "Hero section padding",
            example: "20px 0px 30px 0px"
          }
        }
      },
      title: {
        type: "object",
        description: "Email title section",
        properties: {
          text: {
            type: "string",
            description: "Main title text",
            required: true,
            example: "Welcome to {{workspace_name}}!"
          },
          size: {
            type: "string",
            description: "Font size",
            enum: ["24px", "28px", "32px", "36px"],
            default: "28px"
          },
          weight: {
            type: "string",
            description: "Font weight",
            enum: ["400", "500", "600", "700", "800"],
            default: "700"
          },
          color: {
            type: "string",
            description: "Text color",
            pattern: "^#[0-9A-Fa-f]{6}$",
            default: "#1f2937"
          },
          align: {
            type: "string",
            enum: ["left", "center", "right"],
            default: "center"
          },
          line_height: {
            type: "string",
            description: "Line height",
            example: "36px"
          },
          show: {
            type: "boolean",
            description: "Whether to show title",
            default: true
          },
          padding: {
            type: "string",
            description: "Title padding",
            example: "40px 0px 20px 0px"
          }
        }
      },
      body: {
        type: "object",
        description: "Email body content",
        properties: {
          paragraphs: {
            type: "array",
            description: "Array of paragraph text",
            items: {
              type: "string"
            },
            example: ["Hello {{user_firstname}}!", "Welcome to our platform."]
          },
          font_size: {
            type: "string",
            description: "Font size for body text",
            example: "16px"
          },
          line_height: {
            type: "string",
            description: "Line height for body text",
            example: "26px"
          },
          color: {
            type: "string",
            description: "Body text color",
            pattern: "^#[0-9A-Fa-f]{6}$",
            default: "#374151"
          },
          show: {
            type: "boolean",
            description: "Whether to show body",
            default: true
          },
          padding: {
            type: "string",
            description: "Body padding",
            example: "0px 0px 30px 0px"
          }
        }
      },
      snapshot: {
        type: "object",
        description: "Facts/summary table section",
        properties: {
          title: {
            type: "string",
            description: "Table title",
            example: "Account Details"
          },
          facts: {
            type: "array",
            description: "Array of key-value pairs",
            items: {
              type: "object",
              properties: {
                label: {
                  type: "string",
                  description: "Fact label"
                },
                value: {
                  type: "string",
                  description: "Fact value"
                }
              },
              required: ["label", "value"]
            }
          },
          style: {
            type: "string",
            enum: ["table", "cards", "list"],
            default: "table"
          },
          show: {
            type: "boolean",
            description: "Whether to show snapshot",
            default: true
          },
          padding: {
            type: "string",
            description: "Snapshot padding",
            example: "0px 0px 30px 0px"
          }
        }
      },
      visual: {
        type: "object",
        description: "Visual elements section",
        properties: {
          type: {
            type: "string",
            enum: ["none", "progress", "countdown", "badge"],
            description: "Visual element type"
          },
          progress_bars: {
            type: "array",
            description: "Array of progress bars",
            items: {
              type: "object",
              properties: {
                label: {
                  type: "string",
                  description: "Progress bar label"
                },
                current: {
                  type: "number",
                  description: "Current value"
                },
                max: {
                  type: "number",
                  description: "Maximum value"
                },
                unit: {
                  type: "string",
                  description: "Unit of measurement",
                  example: "%"
                },
                color: {
                  type: "string",
                  description: "Progress bar color",
                  pattern: "^#[0-9A-Fa-f]{6}$"
                },
                description: {
                  type: "string",
                  description: "Progress bar description"
                }
              }
            }
          },
          countdown: {
            type: "object",
            description: "Countdown timer configuration",
            properties: {
              message: {
                type: "string",
                description: "Countdown message",
                example: "Offer expires in"
              },
              target_date: {
                type: "string",
                description: "Target date in ISO format",
                format: "date-time"
              },
              show_days: {
                type: "boolean",
                description: "Whether to show days",
                default: true
              },
              show_hours: {
                type: "boolean",
                description: "Whether to show hours",
                default: true
              }
            }
          },
          show: {
            type: "boolean",
            description: "Whether to show visual section",
            default: true
          },
          padding: {
            type: "string",
            description: "Visual section padding",
            example: "0px 0px 30px 0px"
          }
        }
      },
      actions: {
        type: "object",
        description: "Call-to-action buttons",
        properties: {
          primary: {
            type: "object",
            description: "Primary action button",
            properties: {
              label: {
                type: "string",
                description: "Button text",
                required: true
              },
              url: {
                type: "string",
                description: "Button URL",
                format: "uri",
                required: true
              },
              style: {
                type: "string",
                enum: ["button", "link"],
                default: "button"
              },
              color: {
                type: "string",
                description: "Button color",
                pattern: "^#[0-9A-Fa-f]{6}$",
                default: "#3b82f6"
              },
              text_color: {
                type: "string",
                description: "Button text color",
                pattern: "^#[0-9A-Fa-f]{6}$",
                default: "#ffffff"
              },
              show: {
                type: "boolean",
                description: "Whether to show primary button",
                default: true
              }
            }
          },
          secondary: {
            type: "object",
            description: "Secondary action button",
            properties: {
              label: {
                type: "string",
                description: "Button text"
              },
              url: {
                type: "string",
                description: "Button URL",
                format: "uri"
              },
              style: {
                type: "string",
                enum: ["button", "link"],
                default: "link"
              },
              color: {
                type: "string",
                description: "Button color",
                pattern: "^#[0-9A-Fa-f]{6}$",
                default: "#6b7280"
              },
              text_color: {
                type: "string",
                description: "Button text color",
                pattern: "^#[0-9A-Fa-f]{6}$",
                default: "#ffffff"
              },
              show: {
                type: "boolean",
                description: "Whether to show secondary button",
                default: false
              }
            }
          },
          show: {
            type: "boolean",
            description: "Whether to show actions section",
            default: true
          },
          padding: {
            type: "string",
            description: "Actions section padding",
            example: "0px 0px 40px 0px"
          }
        }
      },
      support: {
        type: "object",
        description: "Support section",
        properties: {
          title: {
            type: "string",
            description: "Support section title",
            example: "Need help?"
          },
          links: {
            type: "array",
            description: "Array of support links",
            items: {
              type: "object",
              properties: {
                label: {
                  type: "string",
                  description: "Link label"
                },
                url: {
                  type: "string",
                  description: "Link URL",
                  format: "uri"
                }
              },
              required: ["label", "url"]
            }
          },
          show: {
            type: "boolean",
            description: "Whether to show support section",
            default: true
          },
          padding: {
            type: "string",
            description: "Support section padding",
            example: "30px 0px 20px 0px"
          }
        }
      },
      footer: {
        type: "object",
        description: "Footer section",
        properties: {
          logo: {
            type: "object",
            description: "Footer logo configuration",
            properties: {
              url: {
                type: "string",
                description: "Logo URL",
                format: "uri"
              },
              alt: {
                type: "string",
                description: "Logo alt text"
              },
              width: {
                type: "string",
                description: "Logo width",
                example: "120px"
              },
              show: {
                type: "boolean",
                description: "Whether to show logo",
                default: true
              }
            }
          },
          tagline: {
            type: "string",
            description: "Footer tagline",
            example: "Empowering your business"
          },
          social_links: {
            type: "array",
            description: "Array of social media links",
            items: {
              type: "object",
              properties: {
                platform: {
                  type: "string",
                  enum: ["twitter", "linkedin", "github", "facebook", "instagram"],
                  description: "Social media platform"
                },
                url: {
                  type: "string",
                  description: "Social media URL",
                  format: "uri"
                }
              },
              required: ["platform", "url"]
            }
          },
          legal_links: {
            type: "array",
            description: "Array of legal links",
            items: {
              type: "object",
              properties: {
                label: {
                  type: "string",
                  description: "Link label"
                },
                url: {
                  type: "string",
                  description: "Link URL",
                  format: "uri"
                }
              },
              required: ["label", "url"]
            }
          },
          copyright: {
            type: "string",
            description: "Copyright text",
            example: "© 2024 {{company_name}}. All rights reserved."
          },
          show: {
            type: "boolean",
            description: "Whether to show footer",
            default: true
          },
          padding: {
            type: "string",
            description: "Footer padding",
            example: "40px 20px 60px 20px"
          }
        }
      },
      theme: {
        type: "object",
        description: "Theme configuration",
        properties: {
          font_family: {
            type: "string",
            description: "Font family",
            example: "'Roboto', 'Helvetica Neue', Arial, sans-serif"
          },
          font_size: {
            type: "string",
            description: "Base font size",
            example: "16px"
          },
          text_color: {
            type: "string",
            description: "Main text color",
            pattern: "^#[0-9A-Fa-f]{6}$",
            default: "#2c3e50"
          },
          heading_color: {
            type: "string",
            description: "Heading text color",
            pattern: "^#[0-9A-Fa-f]{6}$",
            default: "#1a1a1a"
          },
          background_color: {
            type: "string",
            description: "Section background color",
            pattern: "^#[0-9A-Fa-f]{6}$",
            default: "#ffffff"
          },
          body_background: {
            type: "string",
            description: "Email body background color",
            pattern: "^#[0-9A-Fa-f]{6}$",
            default: "#f4f4f4"
          },
          muted_text_color: {
            type: "string",
            description: "Muted text color",
            pattern: "^#[0-9A-Fa-f]{6}$",
            default: "#888888"
          },
          border_color: {
            type: "string",
            description: "Border color",
            pattern: "^#[0-9A-Fa-f]{6}$",
            default: "#e0e0e0"
          },
          primary_button_color: {
            type: "string",
            description: "Primary button background color",
            pattern: "^#[0-9A-Fa-f]{6}$",
            default: "#3b82f6"
          },
          primary_button_text_color: {
            type: "string",
            description: "Primary button text color",
            pattern: "^#[0-9A-Fa-f]{6}$",
            default: "#ffffff"
          },
          secondary_button_color: {
            type: "string",
            description: "Secondary button background color",
            pattern: "^#[0-9A-Fa-f]{6}$",
            default: "#6c757d"
          },
          secondary_button_text_color: {
            type: "string",
            description: "Secondary button text color",
            pattern: "^#[0-9A-Fa-f]{6}$",
            default: "#ffffff"
          }
        }
      }
    },
    required: ["workspace_name", "user_firstname", "dashboard_url"]
  };
}

async function migrateTemplates() {
  try {
    console.log('🚀 Starting template migration...');

    // Check if template already exists
    const existingTemplate = await prisma.template.findUnique({
      where: { key: 'transactional' }
    });

    if (existingTemplate) {
      console.log('⚠️  Template "transactional" already exists. Skipping migration.');
      return;
    }

    // Extract template structure
    const jsonStructure = extractTemplateStructure();
    const variableSchema = generateVariableSchema();

    // Create the main template
    const template = await prisma.template.create({
      data: {
        key: 'transactional',
        name: 'Transactional Email Template',
        description: 'Universal transactional email template with object-based structure',
        category: 'transactional',
        isActive: true,
        variableSchema,
        jsonStructure
      }
    });

    console.log('✅ Created template:', template.key);

    // Create English locale (default)
    const englishLocale = await prisma.templateLocale.create({
      data: {
        templateId: template.id,
        locale: 'en',
        jsonStructure: {
          // English-specific overrides can be added here
          // For now, we'll use the base structure
        }
      }
    });

    console.log('✅ Created English locale:', englishLocale.locale);

    // Create Spanish locale as an example
    const spanishLocale = await prisma.templateLocale.create({
      data: {
        templateId: template.id,
        locale: 'es',
        jsonStructure: {
          title: {
            text: "¡Bienvenido a {{workspace_name}}!"
          },
          body: {
            paragraphs: [
              "Hola {{user_firstname}}, ¡bienvenido a {{workspace_name}}!",
              "Tu cuenta está lista para usar. Aquí tienes algunos consejos para empezar:",
              "• Explora tu panel de control\n• Configura tu perfil\n• Conecta tu primera integración"
            ]
          },
          actions: {
            primary: {
              label: "Comenzar"
            },
            secondary: {
              label: "Saber Más"
            }
          },
          footer: {
            tagline: "Empoderando tu negocio",
            copyright: "© 2024 {{company_name}}. Todos los derechos reservados.",
            legal_links: [
              { "label": "Política de Privacidad", "url": "{{privacy_url}}" },
              { "label": "Términos de Servicio", "url": "{{terms_url}}" }
            ]
          }
        }
      }
    });

    console.log('✅ Created Spanish locale:', spanishLocale.locale);

    console.log('🎉 Template migration completed successfully!');
    console.log(`📊 Created template: ${template.key}`);
    console.log(`🌍 Created locales: en, es`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateTemplates()
    .then(() => {
      console.log('✅ Migration completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    });
}

export { migrateTemplates };
