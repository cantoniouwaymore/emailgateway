"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariableDetector = void 0;
class VariableDetector {
    static detectVariables(obj, path = '') {
        const variables = [];
        if (obj === null || obj === undefined) {
            return variables;
        }
        if (typeof obj === 'string') {
            const matches = obj.match(/\{\{([^}]+)\}\}/g);
            if (matches) {
                matches.forEach(match => {
                    const variableName = match.replace(/\{\{|\}\}/g, '').trim();
                    variables.push({
                        name: variableName,
                        context: path || 'root',
                        fallback: this.extractFallback(variableName)
                    });
                });
            }
            return variables;
        }
        if (Array.isArray(obj)) {
            obj.forEach((item, index) => {
                const itemPath = path ? `${path}[${index}]` : `[${index}]`;
                variables.push(...this.detectVariables(item, itemPath));
            });
        }
        else if (typeof obj === 'object') {
            Object.keys(obj).forEach(key => {
                const keyPath = path ? `${path}.${key}` : key;
                variables.push(...this.detectVariables(obj[key], keyPath));
            });
        }
        return variables;
    }
    static getUniqueVariableNames(variables) {
        const uniqueNames = new Set(variables.map(v => v.name));
        return Array.from(uniqueNames);
    }
    static extractFallback(variableName) {
        const parts = variableName.split('|');
        if (parts.length > 1) {
            return parts.slice(1).join('|').trim();
        }
        return undefined;
    }
    static cleanVariableName(variableName) {
        return variableName.split('|')[0].trim();
    }
    static getNestedValue(obj, path) {
        if (obj && obj.hasOwnProperty(path)) {
            return obj[path];
        }
        const parts = path.split('.');
        let current = obj;
        for (const part of parts) {
            if (current === null || current === undefined) {
                return undefined;
            }
            current = current[part];
        }
        return current;
    }
    static replaceVariables(text, variables) {
        return text.replace(/\{\{([^}]+)\}\}/g, (match, variableName) => {
            const cleanName = this.cleanVariableName(variableName);
            const fallback = this.extractFallback(variableName);
            const value = this.getNestedValue(variables, cleanName);
            const finalValue = value !== undefined
                ? value
                : (fallback !== undefined ? fallback : `{{${cleanName}}}`);
            return String(finalValue);
        });
    }
    static replaceVariablesInObject(obj, variables) {
        if (obj === null || obj === undefined) {
            return obj;
        }
        if (typeof obj === 'string') {
            return this.replaceVariables(obj, variables);
        }
        if (Array.isArray(obj)) {
            return obj.map(item => this.replaceVariablesInObject(item, variables));
        }
        if (typeof obj === 'object') {
            const result = {};
            Object.keys(obj).forEach(key => {
                result[key] = this.replaceVariablesInObject(obj[key], variables);
            });
            return result;
        }
        return obj;
    }
}
exports.VariableDetector = VariableDetector;
//# sourceMappingURL=variable-detector.js.map