import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function forceFallback(expr: any, fallback: string) {
  if (typeof expr !== 'string') return expr;
  if (!expr.startsWith('{{') || !expr.endsWith('}}')) return expr;
  const inner = expr.slice(2, -2).trim();
  const name = inner.split('|')[0].trim();
  return `{{${name}|${fallback}}}`;
}

function setFallbacks(structure: any): any {
  if (!structure || typeof structure !== 'object') return structure;
  const s = JSON.parse(JSON.stringify(structure));

  // Header
  if (s.header) {
    if (s.header.tagline) s.header.tagline = forceFallback(s.header.tagline, 'Your Company Tagline');
    if (s.header.logoUrl || s.header.logo_url) s.header.logoUrl = forceFallback(s.header.logoUrl || s.header.logo_url, 'https://example.com/logo.png');
    if (s.header.logoAlt || s.header.logo_alt) s.header.logo_alt = forceFallback(s.header.logoAlt || s.header.logo_alt, 'Company Logo');
  }

  // Hero
  if (s.hero) {
    if (s.hero.type === 'icon') {
      if (s.hero.icon) s.hero.icon = forceFallback(s.hero.icon, '🎨');
      if (s.hero.iconSize || s.hero.icon_size) s.hero.iconSize = forceFallback(s.hero.iconSize || s.hero.icon_size, '48px');
    } else if (s.hero.type === 'image') {
      if (s.hero.imageUrl || s.hero.image_url) s.hero.imageUrl = forceFallback(s.hero.imageUrl || s.hero.image_url, 'https://example.com/hero.png');
      if (s.hero.imageAlt || s.hero.image_alt) s.hero.imageAlt = forceFallback(s.hero.imageAlt || s.hero.image_alt, 'Hero Image');
      if (s.hero.imageWidth || s.hero.image_width) s.hero.imageWidth = forceFallback(s.hero.imageWidth || s.hero.image_width, '600px');
    }
  }

  // Title
  if (s.title) {
    if (s.title.text) s.title.text = forceFallback(s.title.text, 'Your Email Title');
    if (s.title.size) s.title.size = forceFallback(s.title.size, '28px');
    if (s.title.weight) s.title.weight = forceFallback(s.title.weight, '700');
    if (s.title.color) s.title.color = forceFallback(s.title.color, '#1f2937');
    if (s.title.align) s.title.align = forceFallback(s.title.align, 'center');
  }

  // Body
  if (s.body) {
    if (Array.isArray(s.body.paragraphs)) {
      s.body.paragraphs = s.body.paragraphs.map((p: any, i: number) => forceFallback(p, i === 0 ? 'Hello there!' : 'Add your content here.'));
    }
    if (s.body.fontSize || s.body.font_size) s.body.fontSize = forceFallback(s.body.fontSize || s.body.font_size, '16px');
    if (s.body.lineHeight || s.body.line_height) s.body.lineHeight = forceFallback(s.body.lineHeight || s.body.line_height, '26px');
  }

  // Snapshot
  if (s.snapshot) {
    if (s.snapshot.title) s.snapshot.title = forceFallback(s.snapshot.title, 'Account Snapshot');
    if (s.snapshot.style) s.snapshot.style = forceFallback(s.snapshot.style, 'table');
    if (Array.isArray(s.snapshot.facts)) {
      s.snapshot.facts = s.snapshot.facts.map((f: any, i: number) => ({
        label: forceFallback(f?.label, ['Plan','User ID','Created','Status'][i] || 'Label'),
        value: forceFallback(f?.value, ['Pro Plan','USR-123456','2024-06-01','Active'][i] || 'Value')
      }));
    }
  }

  // Visual
  if (s.visual) {
    if (s.visual.type === 'progress') {
      const bars = s.visual.progressBars || s.visual.progress_bars || [];
      s.visual.progressBars = bars.map((b: any, i: number) => ({
        label: forceFallback(b?.label, ['Storage Used','Tasks Complete','Profile Setup'][i] || 'Progress'),
        currentValue: forceFallback(b?.currentValue ?? b?.current, String([50, 8, 3][i] ?? 25)),
        maxValue: forceFallback(b?.maxValue ?? b?.max, String([100, 10, 5][i] ?? 100)),
        unit: forceFallback(b?.unit, ['%','items','steps'][i] || '%'),
        percentage: 0,
        color: forceFallback(b?.color, ['#10b981','#3b82f6','#f59e0b'][i] || '#3b82f6'),
        description: forceFallback(b?.description, ['Overall usage','Completed tasks','Onboarding'][i] || 'Progress description')
      }));
    } else if (s.visual.type === 'countdown') {
      const cd = s.visual.countdown || {};
      s.visual.countdown = {
        message: forceFallback(cd.message, 'Offer ends soon!'),
        targetDate: forceFallback(cd.targetDate || cd.target_date, new Date(Date.now() + 7*24*3600*1000).toISOString()),
        showDays: cd.showDays ?? cd.show_days ?? true,
        showHours: cd.showHours ?? cd.show_hours ?? true,
        showMinutes: cd.showMinutes ?? cd.show_minutes ?? true,
        showSeconds: cd.showSeconds ?? cd.show_seconds ?? false
      };
    }
  }

  // Actions
  if (s.actions) {
    if (s.actions.primary) {
      s.actions.primary.label = forceFallback(s.actions.primary.label, 'View Account');
      s.actions.primary.url = forceFallback(s.actions.primary.url, 'https://example.com/account');
      s.actions.primary.color = forceFallback(s.actions.primary.color, '#3b82f6');
      s.actions.primary.text_color = forceFallback(s.actions.primary.text_color, '#ffffff');
    }
    if (s.actions.secondary) {
      s.actions.secondary.label = forceFallback(s.actions.secondary.label, 'Contact Support');
      s.actions.secondary.url = forceFallback(s.actions.secondary.url, 'mailto:support@example.com');
      s.actions.secondary.color = forceFallback(s.actions.secondary.color, '#6b7280');
      s.actions.secondary.text_color = forceFallback(s.actions.secondary.text_color, '#ffffff');
    }
  }

  // Support
  if (s.support) {
    if (Array.isArray(s.support.links)) {
      s.support.links = s.support.links.map((l: any, i: number) => ({
        label: forceFallback(l?.label, ['Documentation','FAQ','Contact'][i] || 'Help'),
        url: forceFallback(l?.url, ['https://example.com/docs','https://example.com/faq','mailto:support@example.com'][i] || 'https://example.com/help')
      }));
    }
    if (s.support.title) s.support.title = forceFallback(s.support.title, 'Need Help?');
    if (s.support.note) s.support.note = forceFallback(s.support.note, 'We are here to help.');
  }

  // Footer
  if (s.footer) {
    if (s.footer.tagline) s.footer.tagline = forceFallback(s.footer.tagline, 'Empowering your business');
    if (s.footer.copyright) s.footer.copyright = forceFallback(s.footer.copyright, '© 2024 Your Company. All rights reserved.');
    if (Array.isArray(s.footer.legal_links || s.footer.legalLinks)) {
      const links = s.footer.legal_links || s.footer.legalLinks;
      s.footer.legal_links = links.map((l: any, i: number) => ({
        label: forceFallback(l?.label, ['Privacy Policy','Terms of Service'][i] || 'Legal'),
        url: forceFallback(l?.url, ['https://example.com/privacy','https://example.com/terms'][i] || 'https://example.com/legal')
      }));
    }
    if (Array.isArray(s.footer.social_links || s.footer.socialLinks)) {
      const links = s.footer.social_links || s.footer.socialLinks;
      s.footer.social_links = links.map((l: any, i: number) => ({
        platform: l?.platform || ['twitter','linkedin','github'][i] || 'twitter',
        url: forceFallback(l?.url, ['https://twitter.com/yourcompany','https://linkedin.com/company/yourcompany','https://github.com/yourcompany'][i] || 'https://example.com/social')
      }));
    }
  }

  return s;
}

async function main() {
  const key = 'showcase';
  const template = await prisma.template.findUnique({ where: { key }, include: { locales: true } });
  if (!template) { console.error('Template not found'); process.exit(1); }

  const updatedBase = setFallbacks(template.jsonStructure as any);
  await prisma.template.update({ where: { id: template.id }, data: { jsonStructure: updatedBase } });

  for (const loc of template.locales) {
    const updatedLoc = setFallbacks(loc.jsonStructure as any);
    await prisma.templateLocale.update({ where: { id: loc.id }, data: { jsonStructure: updatedLoc } });
  }

  console.log('Sensible fallbacks applied to showcase template and locales.');
}

main().catch((e)=>{ console.error(e); process.exit(1); }).finally(async ()=>{ await prisma.$disconnect(); });
