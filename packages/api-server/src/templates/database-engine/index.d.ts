export interface TemplateRenderOptions {
    key: string;
    locale?: string;
    variables: Record<string, unknown>;
}
export interface RenderedTemplate {
    html: string;
    text?: string;
    subject?: string;
}
export declare class DatabaseTemplateEngine {
    private templatesPath;
    private loader;
    private merger;
    private renderer;
    constructor(templatesPath?: string);
    setMockTemplate(template: any): void;
    getTemplateData(key: string): Promise<any>;
    getTemplate(key: string): Promise<any>;
    renderTemplate(options: TemplateRenderOptions): Promise<RenderedTemplate>;
    getAvailableTemplates(): Promise<any[]>;
    getTemplateForCreation(key: string): Promise<any>;
    createTemplate(templateData: any): Promise<any>;
    createTemplateWithLocale(templateData: any, locale: string): Promise<any>;
    updateTemplate(key: string, templateData: any): Promise<any>;
    deleteTemplate(key: string): Promise<void>;
    addLocale(templateKey: string, locale: string, jsonStructure: any): Promise<any>;
    updateLocale(templateKey: string, locale: string, jsonStructure: any): Promise<any>;
    deleteLocale(templateKey: string, locale: string): Promise<void>;
    validateTemplateVariables(templateKey: string, variables: Record<string, any>): Promise<any>;
}
//# sourceMappingURL=index.d.ts.map