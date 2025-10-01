/**
 * Preview Panel Component
 * Shows live preview of email template with variable substitution
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { templatesAPI } from '@/lib/api';

interface PreviewPanelProps {
  templateStructure: Record<string, any>;
  variables: Record<string, any>;
  autoUpdate?: boolean;
}

export function PreviewPanel({ templateStructure, variables, autoUpdate = true }: PreviewPanelProps) {
  const [preview, setPreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Generate preview
  const generatePreview = async () => {
    if (Object.keys(templateStructure).length === 0) {
      setPreview('');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('🎨 Calling preview API with:', {
        templateStructure,
        variables,
        variableCount: Object.keys(variables).length
      });
      
      const result = await templatesAPI.generatePreview(templateStructure, variables);
      
      console.log('🎨 Preview API response:', {
        hasHtml: !!result.html,
        hasPreview: !!result.preview,
        htmlLength: result.html?.length || result.preview?.length || 0
      });
      
      setPreview(result.html || result.preview);
      setLastUpdate(new Date());
    } catch (err: any) {
      setError(err.message || 'Failed to generate preview');
      console.error('Preview generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-update when structure or variables change
  useEffect(() => {
    if (autoUpdate && Object.keys(templateStructure).length > 0) {
      console.log('🔄 Preview auto-update triggered', { 
        structureKeys: Object.keys(templateStructure),
        variableCount: Object.keys(variables).length,
        variables 
      });
      
      const timeoutId = setTimeout(() => {
        console.log('🔄 Generating preview after debounce...');
        generatePreview();
      }, 500); // Debounce for 500ms

      return () => clearTimeout(timeoutId);
    }
  }, [templateStructure, variables, autoUpdate]);

  // Initial load
  useEffect(() => {
    if (Object.keys(templateStructure).length > 0) {
      generatePreview();
    }
  }, []);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>Live Preview</CardTitle>
            {isLoading && (
              <Badge variant="secondary" className="text-xs">
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Updating...
              </Badge>
            )}
            {lastUpdate && !isLoading && (
              <Badge variant="outline" className="text-xs">
                Updated {lastUpdate.toLocaleTimeString()}
              </Badge>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={generatePreview}
            disabled={isLoading || Object.keys(templateStructure).length === 0}
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : Object.keys(templateStructure).length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Enable sections to see preview</p>
              <p className="text-sm mt-2">Turn on at least one section to generate a preview</p>
            </div>
          </div>
        ) : isLoading && !preview ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Generating preview...</p>
            </div>
          </div>
        ) : preview ? (
          <div className="h-full overflow-auto border rounded-lg bg-white">
            <iframe
              key={preview.substring(0, 100)} // Force re-render when preview changes
              srcDoc={preview}
              className="w-full h-full min-h-[600px]"
              title="Email Preview"
              sandbox="allow-same-origin allow-scripts"
              style={{ border: 'none' }}
            />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Click Refresh to generate preview</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

