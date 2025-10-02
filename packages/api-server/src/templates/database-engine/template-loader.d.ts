export declare class TemplateLoader {
    private mockTemplates;
    setMockTemplate(template: any): void;
    getTemplate(key: string): Promise<any>;
    loadTemplateFromDatabase(key: string, locale: string): Promise<any>;
    private deepMerge;
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
//# sourceMappingURL=template-loader.d.ts.map