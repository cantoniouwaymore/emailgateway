"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateEngine = void 0;
const handlebars_1 = __importDefault(require("handlebars"));
const mjml_1 = __importDefault(require("mjml"));
const fs_1 = require("fs");
const path_1 = require("path");
const logger_1 = require("../utils/logger");
const database_engine_1 = require("./database-engine");
class TemplateEngine {
    templatesPath;
    databaseEngine;
    useDatabase;
    fallbackToFiles;
    constructor(templatesPath = (0, path_1.join)(process.cwd(), 'src', 'templates')) {
        this.templatesPath = templatesPath;
        this.useDatabase = process.env.USE_DATABASE_TEMPLATES === 'true';
        this.fallbackToFiles = process.env.TEMPLATE_FALLBACK_TO_FILES === 'true';
        this.databaseEngine = new database_engine_1.DatabaseTemplateEngine(templatesPath);
        this.registerHelpers();
        logger_1.logger.info('TemplateEngine initialized', {
            useDatabase: this.useDatabase,
            fallbackToFiles: this.fallbackToFiles
        });
    }
    registerHelpers() {
        handlebars_1.default.registerHelper('eq', function (a, b) {
            return a === b;
        });
        handlebars_1.default.registerHelper('ne', function (a, b) {
            return a !== b;
        });
        handlebars_1.default.registerHelper('gt', function (a, b) {
            return Number(a) > Number(b);
        });
        handlebars_1.default.registerHelper('lt', function (a, b) {
            return Number(a) < Number(b);
        });
        handlebars_1.default.registerHelper('formatDate', function (date, format) {
            const d = new Date(date);
            if (format === 'short') {
                return d.toLocaleDateString();
            }
            return d.toLocaleString();
        });
        handlebars_1.default.registerHelper('countdown', function (targetDate, unit) {
            try {
                const target = new Date(targetDate);
                const now = new Date();
                const diff = target.getTime() - now.getTime();
                if (diff <= 0) {
                    return '0';
                }
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                switch (unit.toLowerCase()) {
                    case 'days':
                        return days.toString();
                    case 'hours':
                        return hours.toString();
                    case 'minutes':
                        return minutes.toString();
                    case 'seconds':
                        return seconds.toString();
                    default:
                        return '0';
                }
            }
            catch (error) {
                logger_1.logger.warn({ error, targetDate, unit }, 'Countdown calculation failed');
                return '0';
            }
        });
        handlebars_1.default.registerHelper('countdownExpired', function (targetDate) {
            try {
                const target = new Date(targetDate);
                const now = new Date();
                return target.getTime() <= now.getTime();
            }
            catch (error) {
                logger_1.logger.warn({ error, targetDate }, 'Countdown expiry check failed');
                return true;
            }
        });
    }
    async renderTemplate(options) {
        const { key, locale = 'en', version, variables } = options;
        const actualLocale = locale === '__base__' ? 'en' : locale;
        try {
            if (this.useDatabase) {
                console.log('🔧 TEMPLATE ENGINE - Using database engine for:', { key, locale, variables });
                try {
                    const result = await this.databaseEngine.renderTemplate({
                        key,
                        locale: locale,
                        variables
                    });
                    console.log('🔧 TEMPLATE ENGINE - Database rendering successful:', { templateKey: key, locale, source: 'database' });
                    logger_1.logger.info({ templateKey: key, locale, source: 'database' }, 'Template rendered from database');
                    return result;
                }
                catch (dbError) {
                    console.log('🔧 TEMPLATE ENGINE - Database rendering failed:', { templateKey: key, error: dbError instanceof Error ? dbError.message : 'Unknown error' });
                    logger_1.logger.warn({ templateKey: key, error: dbError instanceof Error ? dbError.message : 'Unknown error' }, 'Database template rendering failed, falling back to file system');
                    if (!this.fallbackToFiles) {
                        throw dbError;
                    }
                }
            }
            console.log('🔧 TEMPLATE ENGINE - Falling back to file system rendering:', { templateKey: key, locale, source: 'filesystem' });
            logger_1.logger.info({ templateKey: key, locale, source: 'filesystem' }, 'Rendering template from file system');
            const processedVariables = { ...variables };
            if (processedVariables.custom_content && typeof processedVariables.custom_content === 'string') {
                const customContentTemplate = handlebars_1.default.compile(processedVariables.custom_content);
                processedVariables.custom_content = customContentTemplate(variables);
                logger_1.logger.debug({ templateKey: key }, 'Custom content processed with Handlebars variables');
            }
            const templatePath = this.getTemplatePath(key, actualLocale, version);
            const mjmlTemplate = this.loadTemplate(templatePath, 'mjml');
            const compiledTemplate = handlebars_1.default.compile(mjmlTemplate);
            const renderedMjml = compiledTemplate(processedVariables);
            const mjmlResult = (0, mjml_1.default)(renderedMjml, {
                validationLevel: 'soft',
                minify: true
            });
            if (mjmlResult.errors.length > 0) {
                logger_1.logger.warn({ errors: mjmlResult.errors }, 'MJML compilation warnings');
            }
            const result = {
                html: mjmlResult.html
            };
            try {
                const textTemplate = this.loadTemplate(templatePath, 'txt');
                const compiledTextTemplate = handlebars_1.default.compile(textTemplate);
                result.text = compiledTextTemplate(processedVariables);
            }
            catch {
            }
            try {
                const subjectTemplate = this.loadTemplate(templatePath, 'subject');
                const compiledSubjectTemplate = handlebars_1.default.compile(subjectTemplate);
                result.subject = compiledSubjectTemplate(processedVariables);
                logger_1.logger.info({ templateKey: key, renderedSubject: result.subject }, 'Subject template rendered successfully');
            }
            catch (error) {
                logger_1.logger.debug({ templateKey: key, error: error instanceof Error ? error.message : 'Unknown error' }, 'Subject template not found or error');
            }
            logger_1.logger.info({ templateKey: key, locale, source: 'filesystem' }, 'Template rendered successfully');
            return result;
        }
        catch (error) {
            logger_1.logger.error({ error, templateKey: key, locale }, 'Failed to render template');
            throw new Error(`Template rendering failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    getTemplatePath(key, locale, version) {
        const parts = key.split('/');
        const templateName = parts[parts.length - 1];
        const cleanParts = parts[0] === 'templates' ? parts.slice(1) : parts;
        const templateDir = (0, path_1.join)(this.templatesPath, ...cleanParts.slice(0, -1));
        if (version) {
            return (0, path_1.join)(templateDir, `${templateName}-${version}-${locale}`);
        }
        return (0, path_1.join)(templateDir, `${templateName}-${locale}`);
    }
    loadTemplate(templatePath, extension) {
        const filePath = `${templatePath}.${extension}`;
        try {
            return (0, fs_1.readFileSync)(filePath, 'utf-8');
        }
        catch (error) {
            throw new Error(`Template file not found: ${filePath}`);
        }
    }
    async previewTemplate(options) {
        const result = await this.renderTemplate(options);
        return result;
    }
    async getAvailableTemplates() {
        if (this.useDatabase) {
            return await this.databaseEngine.getAvailableTemplates();
        }
        return [];
    }
    async getTemplate(key) {
        if (this.useDatabase) {
            return await this.databaseEngine.getTemplate(key);
        }
        return null;
    }
    async getTemplateForCreation(key) {
        if (this.useDatabase) {
            return await this.databaseEngine.getTemplateForCreation(key);
        }
        return null;
    }
    async createTemplate(templateData) {
        if (this.useDatabase) {
            return await this.databaseEngine.createTemplate(templateData);
        }
        throw new Error('Database engine not enabled');
    }
    async createTemplateWithLocale(templateData, locale) {
        if (this.useDatabase) {
            return await this.databaseEngine.createTemplateWithLocale(templateData, locale);
        }
        throw new Error('Database engine not enabled');
    }
    async updateTemplate(key, templateData) {
        if (this.useDatabase) {
            return await this.databaseEngine.updateTemplate(key, templateData);
        }
        throw new Error('Database engine not enabled');
    }
    async deleteTemplate(key) {
        if (this.useDatabase) {
            return await this.databaseEngine.deleteTemplate(key);
        }
        throw new Error('Database engine not enabled');
    }
    async addLocale(templateKey, locale, jsonStructure) {
        if (this.useDatabase) {
            return await this.databaseEngine.addLocale(templateKey, locale, jsonStructure);
        }
        throw new Error('Database engine not enabled');
    }
    async updateLocale(templateKey, locale, jsonStructure) {
        if (this.useDatabase) {
            return await this.databaseEngine.updateLocale(templateKey, locale, jsonStructure);
        }
        throw new Error('Database engine not enabled');
    }
    async deleteLocale(templateKey, locale) {
        if (this.useDatabase) {
            return await this.databaseEngine.deleteLocale(templateKey, locale);
        }
        throw new Error('Database engine not enabled');
    }
    async validateTemplateVariables(templateKey, variables) {
        if (this.useDatabase) {
            return await this.databaseEngine.validateTemplateVariables(templateKey, variables);
        }
        return { valid: true, errors: [], warnings: [] };
    }
}
exports.TemplateEngine = TemplateEngine;
//# sourceMappingURL=engine.js.map