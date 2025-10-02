/**
 * Header Section Component
 * Extracted from TemplateEditor.tsx to follow Single Responsibility Principle
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface HeaderSectionProps {
  enabled: boolean;
  logoUrl: string;
  logoAlt: string;
  tagline: string;
  onToggle: () => void;
  onChange: (field: string, value: string) => void;
}

export function HeaderSection({ enabled, logoUrl, logoAlt, tagline, onToggle, onChange }: HeaderSectionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Header Section</CardTitle>
          <Button variant={enabled ? 'default' : 'outline'} size="sm" onClick={onToggle}>
            {enabled ? 'Enabled' : 'Disabled'}
          </Button>
        </div>
      </CardHeader>
      {enabled && (
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Logo URL</Label>
            <Input
              value={logoUrl}
              onChange={(e) => onChange('logoUrl', e.target.value)}
              placeholder="https://example.com/logo.png"
            />
          </div>
          <div className="space-y-2">
            <Label>Logo Alt Text</Label>
            <Input
              value={logoAlt}
              onChange={(e) => onChange('logoAlt', e.target.value)}
              placeholder="Company Logo"
            />
          </div>
          <div className="space-y-2">
            <Label>Tagline</Label>
            <Input
              value={tagline}
              onChange={(e) => onChange('tagline', e.target.value)}
              placeholder="Your company tagline"
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
}

