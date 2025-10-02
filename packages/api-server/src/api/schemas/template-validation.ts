import { z } from 'zod';

// Template validation schemas
const templateSchema = z.object({
  key: z.string().min(1),
  locale: z.string().optional(),
  version: z.string().optional()
});

const factSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1)
});

const progressBarSchema = z.object({
  label: z.string().min(1),
  current: z.union([z.string(), z.number()]),
  max: z.union([z.string(), z.number()]),
  unit: z.string().min(1),
  percentage: z.union([z.string(), z.number()]),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  description: z.string().optional()
});

const ctaSchema = z.object({
  label: z.string().min(1),
  url: z.string().url()
});

const socialLinkSchema = z.object({
  platform: z.enum(['twitter', 'linkedin', 'github', 'facebook', 'instagram']),
  url: z.string().url()
});

const footerLinkSchema = z.object({
  label: z.string().min(1),
  url: z.string().url()
});

const countdownSchema = z.object({
  message: z.string().min(1),
  target_date: z.string().datetime(),
  show_days: z.boolean().optional(),
  show_hours: z.boolean().optional(),
  show_minutes: z.boolean().optional(),
  show_seconds: z.boolean().optional()
});

// Object-based section schemas
const headerSchema = z.object({
  logo_url: z.string().url().optional(),
  logo_alt: z.string().optional(),
  logo_width: z.string().optional(),
  tagline: z.string().optional(),
  show: z.boolean().optional(),
  padding: z.string().optional()
});

const heroSchema = z.object({
  type: z.enum(['none', 'image', 'icon']).optional(),
  image_url: z.string().url().optional(),
  image_alt: z.string().optional(),
  image_width: z.string().optional(),
  icon: z.string().optional(),
  icon_size: z.string().optional(),
  show: z.boolean().optional(),
  padding: z.string().optional()
});

const titleSchema = z.object({
  text: z.string().optional(),
  size: z.string().optional(),
  weight: z.string().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  align: z.string().optional(),
  line_height: z.string().optional(),
  show: z.boolean().optional(),
  padding: z.string().optional()
});

const bodySchema = z.object({
  paragraphs: z.array(z.string()).optional(),
  font_size: z.string().optional(),
  line_height: z.string().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  show: z.boolean().optional(),
  padding: z.string().optional()
});

const snapshotSchema = z.object({
  title: z.string().optional(),
  facts: z.array(factSchema).optional(),
  style: z.enum(['table', 'cards', 'list']).optional(),
  show: z.boolean().optional(),
  padding: z.string().optional()
});

const visualSchema = z.object({
  type: z.enum(['none', 'progress', 'countdown', 'badge']).optional(),
  progress_bars: z.array(progressBarSchema).optional(),
  countdown: countdownSchema.optional(),
  show: z.boolean().optional(),
  padding: z.string().optional()
});

const actionSchema = z.object({
  label: z.string().min(1),
  url: z.string().url(),
  style: z.enum(['button', 'link']).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  text_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  show: z.boolean().optional()
});

const actionsSchema = z.object({
  primary: actionSchema.optional(),
  secondary: actionSchema.optional(),
  show: z.boolean().optional(),
  padding: z.string().optional()
});

const supportSchema = z.object({
  title: z.string().optional(),
  links: z.array(footerLinkSchema).optional(),
  show: z.boolean().optional(),
  padding: z.string().optional()
});

const footerSchema = z.object({
  logo: z.object({
    url: z.string().url().optional(),
    alt: z.string().optional(),
    width: z.string().optional(),
    show: z.boolean().optional()
  }).optional(),
  tagline: z.string().optional(),
  social_links: z.array(socialLinkSchema).optional(),
  legal_links: z.array(footerLinkSchema).optional(),
  copyright: z.string().optional(),
  show: z.boolean().optional(),
  padding: z.string().optional()
});

const themeSchema = z.object({
  font_family: z.string().optional(),
  font_size: z.string().optional(),
  text_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  heading_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  background_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  body_background: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  muted_text_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  border_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  primary_button_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  primary_button_text_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  secondary_button_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  secondary_button_text_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  dark_mode: z.boolean().optional(),
  dark_background_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  dark_text_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  dark_heading_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  dark_muted_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  dark_border_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  dark_card_background: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional()
});

const contentSchema = z.record(z.string());

// Object-based variables schema
const objectBasedVariablesSchema = z.object({
  header: headerSchema.optional(),
  hero: heroSchema.optional(),
  title: titleSchema.optional(),
  body: bodySchema.optional(),
  snapshot: snapshotSchema.optional(),
  visual: visualSchema.optional(),
  actions: actionsSchema.optional(),
  support: supportSchema.optional(),
  footer: footerSchema.optional(),
  theme: themeSchema.optional()
});

export const templateValidationRequestSchema = z.object({
  template: templateSchema,
  variables: z.record(z.any()) // Simplified for Fastify compatibility
});

export const validationErrorSchema = z.object({
  type: z.enum([
    'missing_required_variable',
    'invalid_variable_type',
    'invalid_variable_format',
    'redundant_information',
    'invalid_progress_bar',
    'invalid_cta',
    'invalid_social_link',
    'invalid_footer_link',
    'invalid_countdown',
    'invalid_theme',
    'exceeds_limit',
    'invalid_url',
    'invalid_color',
    'invalid_date',
    'missing_object_structure'
  ]),
  field: z.string(),
  message: z.string(),
  suggestion: z.string().optional()
});

export const validationWarningSchema = z.object({
  type: z.enum([
    'missing_optional_variable',
    'best_practice_violation',
    'accessibility_concern',
    'performance_concern'
  ]),
  field: z.string(),
  message: z.string(),
  suggestion: z.string().optional()
});

export const templateValidationResponseSchema = z.object({
  valid: z.boolean(),
  errors: z.array(validationErrorSchema),
  warnings: z.array(validationWarningSchema),
  suggestions: z.array(z.string()).optional()
});

// Type exports
export type TemplateValidationRequest = z.infer<typeof templateValidationRequestSchema>;
export type TemplateValidationResponse = z.infer<typeof templateValidationResponseSchema>;
export type ValidationError = z.infer<typeof validationErrorSchema>;
export type ValidationWarning = z.infer<typeof validationWarningSchema>;
