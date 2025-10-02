export declare class TemplateRenderer {
    private templatesPath;
    constructor(templatesPath?: string);
    render(finalStructure: Record<string, any>): Promise<{
        html: string;
        text?: string;
        subject?: string;
    }>;
    private generatePlainText;
}
//# sourceMappingURL=template-renderer.d.ts.map