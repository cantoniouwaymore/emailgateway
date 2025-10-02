"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateRenderer = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const handlebars_1 = __importDefault(require("handlebars"));
const mjml_1 = __importDefault(require("mjml"));
const logger_1 = require("../../utils/logger");
class TemplateRenderer {
    templatesPath;
    constructor(templatesPath) {
        this.templatesPath = templatesPath || (0, path_1.join)(__dirname, '..', 'templates');
    }
    async render(finalStructure) {
        let mainTemplatePath = (0, path_1.join)(this.templatesPath, 'transactional-en.mjml');
        let mjmlTemplate;
        try {
            mjmlTemplate = (0, fs_1.readFileSync)(mainTemplatePath, 'utf8');
        }
        catch (error) {
            const srcTemplatePath = (0, path_1.join)(process.cwd(), 'src', 'templates', 'transactional-en.mjml');
            mjmlTemplate = (0, fs_1.readFileSync)(srcTemplatePath, 'utf8');
            mainTemplatePath = srcTemplatePath;
        }
        console.log('🔧 DATABASE TEMPLATE ENGINE - Using main MJML template from:', mainTemplatePath);
        const handlebarsTemplate = handlebars_1.default.compile(mjmlTemplate);
        const processedMJML = handlebarsTemplate(finalStructure);
        console.log('🔧 DATABASE TEMPLATE ENGINE - Processed MJML length:', processedMJML.length);
        console.log('🔧 DATABASE TEMPLATE ENGINE - First 500 chars of MJML:', processedMJML.substring(0, 500));
        const mjmlResult = (0, mjml_1.default)(processedMJML, {
            minify: false,
            validationLevel: 'soft'
        });
        if (mjmlResult.errors.length > 0) {
            console.error('🔧 MJML ERRORS:', mjmlResult.errors);
            logger_1.logger.warn({ errors: mjmlResult.errors }, 'MJML rendering produced errors');
        }
        console.log('🔧 DATABASE TEMPLATE ENGINE - Rendered HTML length:', mjmlResult.html.length);
        console.log('🔧 DATABASE TEMPLATE ENGINE - Rendering successful');
        return {
            html: mjmlResult.html,
            text: this.generatePlainText(finalStructure),
            subject: finalStructure.email_title || finalStructure.title?.text
        };
    }
    generatePlainText(structure) {
        let text = '';
        if (structure.title && structure.title.text) {
            text += `${structure.title.text}\n\n`;
        }
        if (structure.body && structure.body.paragraphs) {
            if (Array.isArray(structure.body.paragraphs)) {
                text += structure.body.paragraphs.join('\n\n') + '\n\n';
            }
        }
        if (structure.actions && structure.actions.primary) {
            text += `${structure.actions.primary.label}: ${structure.actions.primary.url}\n\n`;
        }
        if (structure.actions && structure.actions.secondary) {
            text += `${structure.actions.secondary.label}: ${structure.actions.secondary.url}\n\n`;
        }
        if (structure.footer) {
            if (structure.footer.tagline) {
                text += `\n${structure.footer.tagline}\n`;
            }
            if (structure.footer.copyright) {
                text += `${structure.footer.copyright}\n`;
            }
        }
        return text.trim();
    }
}
exports.TemplateRenderer = TemplateRenderer;
//# sourceMappingURL=template-renderer.js.map