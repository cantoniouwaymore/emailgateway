/**
 * Variables Panel Component
 * Shows detected variables and allows testing with custom values
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Sparkles } from 'lucide-react';

interface DetectedVariable {
  name: string;
  fallback: string | null;
  full: string;
}

interface VariablesPanelProps {
  templateKey?: string; // Reserved for future use (fetching from API)
  templateStructure: Record<string, any>;
  onVariablesChange: (variables: Record<string, any>) => void;
}

export function VariablesPanel({ templateStructure, onVariablesChange }: VariablesPanelProps) {
  const [detectedVariables, setDetectedVariables] = useState<DetectedVariable[]>([]);
  const [variableValues, setVariableValues] = useState<Record<string, any>>({});
  const [isDetecting, setIsDetecting] = useState(false);

  // Detect variables from template structure
  const detectVariables = () => {
    setIsDetecting(true);
    
    const variables: DetectedVariable[] = [];
    const detectInObject = (obj: any, path: string = '') => {
      if (typeof obj === 'string') {
        // Match {{variable}} or {{variable|fallback}}
        const regex = /\{\{([^}|]+)(\|([^}]+))?\}\}/g;
        let match;
        while ((match = regex.exec(obj)) !== null) {
          const varName = match[1].trim();
          const fallback = match[3] ? match[3].trim() : null;
          
          if (!variables.find(v => v.name === varName)) {
            variables.push({
              name: varName,
              fallback,
              full: match[0]
            });
          }
        }
      } else if (typeof obj === 'object' && obj !== null) {
        Object.entries(obj).forEach(([key, value]) => {
          detectInObject(value, path ? `${path}.${key}` : key);
        });
      }
    };

    detectInObject(templateStructure);
    setDetectedVariables(variables);
    setIsDetecting(false);
  };

  // Detect variables when template structure changes
  useEffect(() => {
    if (Object.keys(templateStructure).length > 0) {
      detectVariables();
    }
  }, [templateStructure]);

  // Fill with example data
  const fillWithExamples = () => {
    console.log('✨ Filling with example data for', detectedVariables.length, 'variables');
    const examples: Record<string, any> = {};
    
    detectedVariables.forEach(variable => {
      const name = variable.name.toLowerCase();
      
      // Generate smart example data based on variable name
      if (name.includes('name') || name === 'user' || name === 'customer') {
        examples[variable.name] = 'John Doe';
      } else if (name.includes('email')) {
        examples[variable.name] = 'john.doe@example.com';
      } else if (name.includes('company') || name.includes('organization')) {
        examples[variable.name] = 'Acme Corporation';
      } else if (name.includes('date')) {
        examples[variable.name] = new Date().toLocaleDateString();
      } else if (name.includes('amount') || name.includes('price') || name.includes('cost')) {
        examples[variable.name] = '$99.00';
      } else if (name.includes('url') || name.includes('link')) {
        examples[variable.name] = 'https://example.com';
      } else if (name.includes('count') || name.includes('number') || name.includes('limit')) {
        examples[variable.name] = '100';
      } else if (name.includes('percent') || name.includes('percentage')) {
        examples[variable.name] = '80%';
      } else if (variable.fallback) {
        examples[variable.name] = variable.fallback;
      } else {
        examples[variable.name] = `Example ${variable.name}`;
      }
    });

    console.log('✨ Generated examples:', examples);
    setVariableValues(examples);
    onVariablesChange(examples);
    console.log('✨ Examples filled and callback triggered');
  };

  // Clear all values
  const clearAll = () => {
    setVariableValues({});
    onVariablesChange({});
  };

  // Update single variable
  const updateVariable = (name: string, value: string) => {
    const newValues = { ...variableValues, [name]: value };
    setVariableValues(newValues);
    onVariablesChange(newValues);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Variables</CardTitle>
            <CardDescription>
              {detectedVariables.length} variable{detectedVariables.length !== 1 ? 's' : ''} detected
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={detectVariables}
              disabled={isDetecting}
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${isDetecting ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={fillWithExamples}
              disabled={detectedVariables.length === 0}
            >
              <Sparkles className="w-4 h-4 mr-1" />
              Examples
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {detectedVariables.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No variables detected in template</p>
            <p className="text-xs mt-1">Use {'{{variable}}'} syntax to add variables</p>
          </div>
        ) : (
          <div className="space-y-4">
            {detectedVariables.map((variable) => (
              <div key={variable.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`var-${variable.name}`} className="font-mono text-sm">
                    {variable.name}
                  </Label>
                  {variable.fallback && (
                    <Badge variant="secondary" className="text-xs">
                      Default: {variable.fallback}
                    </Badge>
                  )}
                </div>
                <Input
                  id={`var-${variable.name}`}
                  value={variableValues[variable.name] || ''}
                  onChange={(e) => updateVariable(variable.name, e.target.value)}
                  placeholder={variable.fallback || `Enter ${variable.name}...`}
                  className="font-mono text-sm"
                />
              </div>
            ))}
            
            {detectedVariables.length > 0 && (
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAll}
                  className="flex-1"
                >
                  Clear All
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

