import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function isTemplateVar(value: unknown): boolean {
  return typeof value === 'string' && value.includes('{{') && value.includes('}}');
}

function orVar(value: any, variableExpr: string) {
  return isTemplateVar(value) ? value : variableExpr;
}

function variableizeStructure(structure: any): any {
  if (!structure || typeof structure !== 'object') return structure;

  const s = JSON.parse(JSON.stringify(structure));

  // Header
  if (s.header) {
    s.header.tagline = orVar(s.header.tagline, '{{companyTagline}}');
    s.header.logoUrl = orVar(s.header.logoUrl || s.header.logo_url, '{{logoUrl}}');
    s.header.logo_alt = orVar(s.header.logoAlt || s.header.logo_alt, '{{logoAlt}}');
  }

  // Hero
  if (s.hero) {
    if (s.hero.type === 'icon') {
      s.hero.icon = orVar(s.hero.icon, '{{heroIcon}}');
      s.hero.iconSize = orVar(s.hero.iconSize || s.hero.icon_size, '{{heroIconSize}}');
    }
    if (s.hero.type === 'image') {
      s.hero.imageUrl = orVar(s.hero.imageUrl || s.hero.image_url, '{{heroImageUrl}}');
      s.hero.imageAlt = orVar(s.hero.imageAlt || s.hero.image_alt, '{{heroImageAlt}}');
      s.hero.imageWidth = orVar(s.hero.imageWidth || s.hero.image_width, '{{heroImageWidth}}');
    }
  }

  // Title
  if (s.title) {
    s.title.text = orVar(s.title.text, '{{title}}');
    s.title.size = orVar(s.title.size, '{{titleSize|28px}}');
    s.title.weight = orVar(s.title.weight, '{{titleWeight|700}}');
    s.title.color = orVar(s.title.color, '{{titleColor|#1f2937}}');
    s.title.align = orVar(s.title.align, '{{titleAlign|left}}');
  }

  // Body
  if (s.body) {
    if (Array.isArray(s.body.paragraphs)) {
      s.body.paragraphs = s.body.paragraphs.map((p: any, i: number) => orVar(p, `{{bodyParagraph${i+1}}}`));
    }
    s.body.fontSize = orVar(s.body.fontSize || s.body.font_size, '{{bodyFontSize|16px}}');
    s.body.lineHeight = orVar(s.body.lineHeight || s.body.line_height, '{{bodyLineHeight|26px}}');
  }

  // Snapshot
  if (s.snapshot) {
    s.snapshot.title = orVar(s.snapshot.title, '{{snapshotTitle}}');
    if (Array.isArray(s.snapshot.facts)) {
      s.snapshot.facts = s.snapshot.facts.map((f: any, i: number) => ({
        label: orVar(f?.label, `{{snapshotLabel${i+1}}}`),
        value: orVar(f?.value, `{{snapshotValue${i+1}}}`)
      }));
    }
    s.snapshot.style = orVar(s.snapshot.style, '{{snapshotStyle|table}}');
  }

  // Visual
  if (s.visual) {
    if (s.visual.type === 'progress') {
      const bars = s.visual.progressBars || s.visual.progress_bars;
      if (Array.isArray(bars)) {
        s.visual.progressBars = bars.map((b: any, i: number) => ({
          label: orVar(b?.label, `{{progressLabel${i+1}}}`),
          currentValue: orVar(b?.currentValue ?? b?.current, `{{currentValue${i+1}}}`),
          maxValue: orVar(b?.maxValue ?? b?.max, `{{maxValue${i+1}}}`),
          unit: orVar(b?.unit, `{{unit${i+1}}}`),
          percentage: 0,
          color: orVar(b?.color, '{{progressColor|#3b82f6}}'),
          description: orVar(b?.description, `{{progressDescription${i+1}}}`)
        }));
      } else {
        s.visual.progressBars = [];
      }
    }
    if (s.visual.type === 'countdown') {
      const cd = s.visual.countdown || {};
      s.visual.countdown = {
        message: orVar(cd.message, '{{countdownMessage}}'),
        targetDate: orVar(cd.targetDate || cd.target_date, '{{targetDate}}'),
        showDays: cd.showDays ?? cd.show_days ?? true,
        showHours: cd.showHours ?? cd.show_hours ?? true,
        showMinutes: cd.showMinutes ?? cd.show_minutes ?? true,
        showSeconds: cd.showSeconds ?? cd.show_seconds ?? false,
      };
    }
  }

  // Actions
  if (s.actions) {
    if (s.actions.primary) {
      s.actions.primary.label = orVar(s.actions.primary.label, '{{primaryButtonLabel}}');
      s.actions.primary.url = orVar(s.actions.primary.url, '{{primaryButtonUrl}}');
      s.actions.primary.color = orVar(s.actions.primary.color, '{{primaryButtonColor|#3b82f6}}');
      s.actions.primary.text_color = orVar(s.actions.primary.text_color, '{{primaryButtonTextColor|#ffffff}}');
    }
    if (s.actions.secondary) {
      s.actions.secondary.label = orVar(s.actions.secondary.label, '{{secondaryButtonLabel}}');
      s.actions.secondary.url = orVar(s.actions.secondary.url, '{{secondaryButtonUrl}}');
      s.actions.secondary.color = orVar(s.actions.secondary.color, '{{secondaryButtonColor|#6b7280}}');
      s.actions.secondary.text_color = orVar(s.actions.secondary.text_color, '{{secondaryButtonTextColor|#ffffff}}');
    }
  }

  // Support
  if (s.support) {
    if (Array.isArray(s.support.links)) {
      s.support.links = s.support.links.map((l: any, i: number) => ({
        label: orVar(l?.label, `{{supportLabel${i+1}}}`),
        url: orVar(l?.url, `{{supportUrl${i+1}}}`)
      }));
    }
    s.support.note = orVar(s.support.note, '{{supportNote}}');
  }

  // Footer
  if (s.footer) {
    s.footer.copyright = orVar(s.footer.copyright, '{{copyright}}');
    if (Array.isArray(s.footer.social_links || s.footer.socialLinks)) {
      const links = s.footer.social_links || s.footer.socialLinks;
      s.footer.social_links = links.map((l: any, i: number) => ({
        label: orVar(l?.label, `{{socialLabel${i+1}}}`),
        url: orVar(l?.url, `{{socialUrl${i+1}}}`)
      }));
    }
    if (Array.isArray(s.footer.legal_links || s.footer.legalLinks)) {
      const links = s.footer.legal_links || s.footer.legalLinks;
      s.footer.legal_links = links.map((l: any, i: number) => ({
        label: orVar(l?.label, `{{legalLabel${i+1}}}`),
        url: orVar(l?.url, `{{legalUrl${i+1}}}`)
      }));
    }
  }

  return s;
}

async function main() {
  const key = 'showcase';

  const template = await prisma.template.findUnique({
    where: { key },
    include: { locales: true },
  });

  if (!template) {
    console.error(`Template ${key} not found`);
    process.exit(1);
  }

  const base = variableizeStructure(template.jsonStructure as any);

  await prisma.template.update({
    where: { id: template.id },
    data: {
      jsonStructure: base,
      updatedAt: new Date(),
    },
  });

  for (const locale of template.locales) {
    const varLocale = variableizeStructure(locale.jsonStructure as any);
    await prisma.templateLocale.update({
      where: { id: locale.id },
      data: { jsonStructure: varLocale, updatedAt: new Date() },
    });
  }

  console.log('Showcase template and locales updated to variable placeholders.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
