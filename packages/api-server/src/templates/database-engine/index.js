"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseTemplateEngine = void 0;
const path_1 = require("path");
const logger_1 = require("../../utils/logger");
const template_loader_1 = require("./template-loader");
const variable_merger_1 = require("./variable-merger");
const template_renderer_1 = require("./template-renderer");
const handlebars_helpers_1 = require("./handlebars-helpers");
class DatabaseTemplateEngine {
    templatesPath;
    loader;
    merger;
    renderer;
    constructor(templatesPath) {
        this.templatesPath = templatesPath || (0, path_1.join)(__dirname, '..', 'templates');
        this.loader = new template_loader_1.TemplateLoader();
        this.merger = new variable_merger_1.VariableMerger();
        this.renderer = new template_renderer_1.TemplateRenderer(this.templatesPath);
        (0, handlebars_helpers_1.registerHandlebarsHelpers)();
        logger_1.logger.info('DatabaseTemplateEngine initialized with modular architecture');
    }
    setMockTemplate(template) {
        this.loader.setMockTemplate(template);
    }
    async getTemplateData(key) {
        const template = await this.loader.getTemplate(key);
        if (template) {
            const convertedStructure = this.merger.convertOldButtonStructure(template.jsonStructure);
            return {
                ...template,
                jsonStructure: convertedStructure
            };
        }
        return template;
    }
    async getTemplate(key) {
        return this.loader.getTemplate(key);
    }
    async renderTemplate(options) {
        const { key, locale = 'en', variables } = options;
        try {
            logger_1.logger.debug({ templateKey: key, locale }, 'Starting template rendering');
            console.log('🔧 DATABASE TEMPLATE ENGINE - Starting render:', { key, locale, variables });
            const template = await this.loader.loadTemplateFromDatabase(key, locale);
            console.log('🔧 DATABASE TEMPLATE ENGINE - Loading template with key:', key, 'locale:', locale);
            console.log('🔧 DATABASE TEMPLATE ENGINE - Loaded template:', JSON.stringify(template, null, 2));
            if (!template) {
                throw new Error(`Template not found: ${key}`);
            }
            const finalStructure = this.merger.mergeVariables(template.jsonStructure, variables);
            console.log('🔧 DATABASE TEMPLATE ENGINE - Final structure:', JSON.stringify(finalStructure, null, 2));
            console.log('🔧 DATABASE TEMPLATE ENGINE - Title text:', finalStructure.title?.text);
            console.log('🔧 DATABASE TEMPLATE ENGINE - Body paragraphs:', finalStructure.body?.paragraphs);
            console.log('🔧 DATABASE TEMPLATE ENGINE - Email title:', finalStructure.email_title);
            const result = await this.renderer.render(finalStructure);
            logger_1.logger.info({ templateKey: key, locale }, 'Template rendering completed successfully');
            return result;
        }
        catch (error) {
            logger_1.logger.error({ error, templateKey: key, locale }, 'Template rendering failed');
            throw error;
        }
    }
    async getAvailableTemplates() {
        return this.loader.getAvailableTemplates();
    }
    async getTemplateForCreation(key) {
        return this.loader.getTemplateForCreation(key);
    }
    async createTemplate(templateData) {
        return this.loader.createTemplate(templateData);
    }
    async createTemplateWithLocale(templateData, locale) {
        return this.loader.createTemplateWithLocale(templateData, locale);
    }
    async updateTemplate(key, templateData) {
        return this.loader.updateTemplate(key, templateData);
    }
    async deleteTemplate(key) {
        return this.loader.deleteTemplate(key);
    }
    async addLocale(templateKey, locale, jsonStructure) {
        return this.loader.addLocale(templateKey, locale, jsonStructure);
    }
    async updateLocale(templateKey, locale, jsonStructure) {
        return this.loader.updateLocale(templateKey, locale, jsonStructure);
    }
    async deleteLocale(templateKey, locale) {
        return this.loader.deleteLocale(templateKey, locale);
    }
    async validateTemplateVariables(templateKey, variables) {
        return this.loader.validateTemplateVariables(templateKey, variables);
    }
}
exports.DatabaseTemplateEngine = DatabaseTemplateEngine;
//# sourceMappingURL=index.js.map