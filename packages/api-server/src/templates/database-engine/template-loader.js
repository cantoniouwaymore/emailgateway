"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateLoader = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class TemplateLoader {
    mockTemplates = new Map();
    setMockTemplate(template) {
        this.mockTemplates.set(template.key, template);
    }
    async getTemplate(key) {
        const mockTemplate = this.mockTemplates.get(key);
        if (mockTemplate) {
            return mockTemplate;
        }
        const template = await prisma.template.findUnique({
            where: { key },
            include: {
                locales: true
            }
        });
        return template;
    }
    async loadTemplateFromDatabase(key, locale) {
        console.log('🔧 LOADING TEMPLATE FROM DATABASE:', { key, locale });
        const mockTemplate = this.mockTemplates.get(key);
        if (mockTemplate) {
            console.log('🔧 USING MOCK TEMPLATE FOR PREVIEW');
            return {
                jsonStructure: mockTemplate.jsonStructure
            };
        }
        let template;
        if (locale === '__base__') {
            template = await prisma.template.findUnique({
                where: { key }
            });
        }
        else {
            template = await prisma.template.findUnique({
                where: { key },
                include: {
                    locales: {
                        where: { locale }
                    }
                }
            });
        }
        console.log('🔧 DATABASE QUERY RESULT:', JSON.stringify(template, null, 2));
        if (!template) {
            console.log('🔧 TEMPLATE NOT FOUND IN DATABASE');
            return null;
        }
        if (locale === '__base__') {
            console.log('🔧 USING BASE TEMPLATE STRUCTURE (__base__ locale)');
            const baseStructure = template.jsonStructure;
            return {
                jsonStructure: baseStructure
            };
        }
        let localeOverrides;
        if ('locales' in template && Array.isArray(template.locales)) {
            localeOverrides = template.locales.find((l) => l.locale === locale);
        }
        const baseStructure = template.jsonStructure;
        const localeStructure = localeOverrides?.jsonStructure || {};
        const mergedStructure = localeOverrides ? this.deepMerge(baseStructure, localeStructure) : baseStructure;
        return {
            jsonStructure: mergedStructure
        };
    }
    deepMerge(base, override) {
        const result = { ...base };
        for (const key in override) {
            if (override[key] && typeof override[key] === 'object' && !Array.isArray(override[key])) {
                result[key] = this.deepMerge(result[key] || {}, override[key]);
            }
            else {
                result[key] = override[key];
            }
        }
        return result;
    }
    async getAvailableTemplates() {
        const templates = await prisma.template.findMany({
            include: {
                locales: {
                    select: { locale: true }
                }
            }
        });
        return templates.map(template => ({
            key: template.key,
            name: template.name,
            description: template.description,
            category: template.category,
            availableLocales: template.locales.map(l => l.locale),
            jsonStructure: template.jsonStructure,
            variableSchema: template.variableSchema,
            createdAt: template.createdAt,
            updatedAt: template.updatedAt
        }));
    }
    async getTemplateForCreation(key) {
        const template = await prisma.template.findUnique({
            where: { key },
            include: {
                locales: true
            }
        });
        if (!template) {
            return null;
        }
        return {
            key: template.key,
            name: template.name,
            description: template.description,
            category: template.category,
            variableSchema: template.variableSchema,
            jsonStructure: template.jsonStructure,
            locales: template.locales.map(locale => ({
                locale: locale.locale,
                jsonStructure: locale.jsonStructure
            }))
        };
    }
    async createTemplate(templateData) {
        const template = await prisma.template.create({
            data: {
                key: templateData.key,
                name: templateData.name,
                description: templateData.description,
                category: templateData.category,
                variableSchema: templateData.variableSchema,
                jsonStructure: templateData.jsonStructure
            }
        });
        return template;
    }
    async createTemplateWithLocale(templateData, locale) {
        const template = await prisma.template.create({
            data: {
                key: templateData.key,
                name: templateData.name,
                description: templateData.description,
                category: templateData.category,
                variableSchema: templateData.variableSchema,
                jsonStructure: templateData.jsonStructure,
                locales: {
                    create: {
                        locale: locale,
                        jsonStructure: templateData.jsonStructure
                    }
                }
            },
            include: {
                locales: true
            }
        });
        return template;
    }
    async updateTemplate(key, templateData) {
        const template = await prisma.template.update({
            where: { key },
            data: {
                name: templateData.name,
                description: templateData.description,
                category: templateData.category,
                variableSchema: templateData.variableSchema,
                jsonStructure: templateData.jsonStructure
            }
        });
        return template;
    }
    async deleteTemplate(key) {
        await prisma.template.delete({
            where: { key }
        });
    }
    async addLocale(templateKey, locale, jsonStructure) {
        const template = await prisma.template.findUnique({
            where: { key: templateKey }
        });
        if (!template) {
            throw new Error(`Template not found: ${templateKey}`);
        }
        const templateLocale = await prisma.templateLocale.create({
            data: {
                templateId: template.id,
                locale,
                jsonStructure
            }
        });
        return templateLocale;
    }
    async updateLocale(templateKey, locale, jsonStructure) {
        const template = await prisma.template.findUnique({
            where: { key: templateKey }
        });
        if (!template) {
            throw new Error(`Template not found: ${templateKey}`);
        }
        const templateLocale = await prisma.templateLocale.upsert({
            where: {
                templateId_locale: {
                    templateId: template.id,
                    locale
                }
            },
            update: {
                jsonStructure
            },
            create: {
                templateId: template.id,
                locale,
                jsonStructure
            }
        });
        return templateLocale;
    }
    async deleteLocale(templateKey, locale) {
        const template = await prisma.template.findUnique({
            where: { key: templateKey }
        });
        if (!template) {
            throw new Error(`Template not found: ${templateKey}`);
        }
        await prisma.templateLocale.deleteMany({
            where: {
                templateId: template.id,
                locale
            }
        });
    }
    async validateTemplateVariables(templateKey, variables) {
        const template = await prisma.template.findUnique({
            where: { key: templateKey }
        });
        if (!template) {
            throw new Error(`Template not found: ${templateKey}`);
        }
        const schema = template.variableSchema;
        const errors = [];
        const warnings = [];
        if (schema.required) {
            for (const field of schema.required) {
                if (!variables[field]) {
                    errors.push({
                        field,
                        message: `Required field '${field}' is missing`
                    });
                }
            }
        }
        if (schema.properties) {
            for (const [field, fieldSchema] of Object.entries(schema.properties)) {
                const value = variables[field];
                if (value !== undefined) {
                    const fieldDef = fieldSchema;
                    if (fieldDef.type === 'string' && typeof value !== 'string') {
                        errors.push({
                            field,
                            message: `Field '${field}' should be a string`
                        });
                    }
                    else if (fieldDef.type === 'number' && typeof value !== 'number') {
                        errors.push({
                            field,
                            message: `Field '${field}' should be a number`
                        });
                    }
                    else if (fieldDef.type === 'boolean' && typeof value !== 'boolean') {
                        errors.push({
                            field,
                            message: `Field '${field}' should be a boolean`
                        });
                    }
                }
            }
        }
        return {
            valid: errors.length === 0,
            errors,
            warnings
        };
    }
}
exports.TemplateLoader = TemplateLoader;
//# sourceMappingURL=template-loader.js.map