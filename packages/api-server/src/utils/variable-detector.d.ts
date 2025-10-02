export interface DetectedVariable {
    name: string;
    context: string;
    fallback?: string;
}
export declare class VariableDetector {
    static detectVariables(obj: any, path?: string): DetectedVariable[];
    static getUniqueVariableNames(variables: DetectedVariable[]): string[];
    private static extractFallback;
    static cleanVariableName(variableName: string): string;
    private static getNestedValue;
    static replaceVariables(text: string, variables: Record<string, any>): string;
    static replaceVariablesInObject(obj: any, variables: Record<string, any>): any;
}
//# sourceMappingURL=variable-detector.d.ts.map