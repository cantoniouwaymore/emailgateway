import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function hasFallback(expr: string): boolean {
  if (typeof expr !== 'string') return false;
  if (!expr.startsWith('{{') || !expr.endsWith('}}')) return false;
  const inner = expr.slice(2, -2).trim();
  return inner.includes('|');
}

function addFallback(expr: string, fallback: string): string {
  if (typeof expr !== 'string') return expr as any;
  if (!expr.startsWith('{{') || !expr.endsWith('}}')) return expr as any;
  const inner = expr.slice(2, -2).trim();
  if (inner.includes('|')) return expr; // already has fallback
  return `{{${inner}|${fallback}}}`;
}

function randomHexColor() {
  const v = Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
  return `#${v}`;
}

function randomFrom<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

function randomString(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function randomUrl(path = '') {
  return `https://example.com/${path || randomString('go')}`;
}

function randomDateISO(daysAhead = 7) {
  const d = new Date(Date.now() + Math.floor(Math.random()*daysAhead+1)*24*3600*1000);
  return d.toISOString();
}

function guessFallbackByName(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('color')) return randomHexColor();
  if (lower.includes('date')) return randomDateISO();
  if (lower.includes('url') || lower.includes('link')) return randomUrl();
  if (lower.includes('label') || lower.includes('title') || lower.includes('name')) return randomString('text');
  if (lower.includes('id')) return randomString('id');
  if (lower.includes('message') || lower.includes('description') || lower.includes('tagline')) return randomString('msg');
  if (lower.includes('unit')) return randomFrom(['%', 'pts', 'items', 'GB']);
  if (lower.includes('icon')) return '🎯';
  if (lower.includes('width')) return randomFrom(['600px','480px','320px']);
  if (lower.includes('size')) return randomFrom(['12px','14px','16px','20px','28px']);
  if (lower.includes('weight')) return randomFrom(['400','600','700']);
  if (lower.includes('align')) return randomFrom(['left','center','right']);
  if (lower.includes('current')) return String(Math.floor(Math.random()*50)+10);
  if (lower.includes('max')) return String(Math.floor(Math.random()*50)+60);
  return randomString('val');
}

function addFallbacksDeep(obj: any): any {
  if (obj == null) return obj;
  if (typeof obj === 'string') {
    if (obj.startsWith('{{') && obj.endsWith('}}') && !hasFallback(obj)) {
      const inner = obj.slice(2, -2).trim();
      const varName = inner.split('|')[0].trim();
      const fb = guessFallbackByName(varName);
      return addFallback(obj, fb);
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(addFallbacksDeep);
  }
  if (typeof obj === 'object') {
    const out: any = {};
    for (const k of Object.keys(obj)) {
      out[k] = addFallbacksDeep(obj[k]);
    }
    return out;
  }
  return obj;
}

async function main() {
  const key = 'showcase';
  const template = await prisma.template.findUnique({ where: { key }, include: { locales: true } });
  if (!template) {
    console.error('Showcase template not found');
    process.exit(1);
  }

  const updatedBase = addFallbacksDeep(template.jsonStructure as any);
  await prisma.template.update({ where: { id: template.id }, data: { jsonStructure: updatedBase } });

  for (const loc of template.locales) {
    const updatedLoc = addFallbacksDeep(loc.jsonStructure as any);
    await prisma.templateLocale.update({ where: { id: loc.id }, data: { jsonStructure: updatedLoc } });
  }

  console.log('Random fallbacks added to showcase template and locales.');
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
