/**
 * Actions Section Component (Buttons)
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ActionsSectionProps {
  enabled: boolean;
  primaryLabel: string;
  primaryUrl: string;
  secondaryLabel: string;
  secondaryUrl: string;
  onToggle: () => void;
  onChange: (field: string, value: string) => void;
}

export function ActionsSection(props: ActionsSectionProps) {
  const { enabled, primaryLabel, primaryUrl, secondaryLabel, secondaryUrl, onToggle, onChange } = props;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Actions Section</CardTitle>
          <Button variant={enabled ? 'default' : 'outline'} size="sm" onClick={onToggle}>
            {enabled ? 'Enabled' : 'Disabled'}
          </Button>
        </div>
      </CardHeader>
      {enabled && (
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Primary Button</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Label</Label>
                <Input
                  value={primaryLabel}
                  onChange={(e) => onChange('primaryLabel', e.target.value)}
                  placeholder="Click Here"
                />
              </div>
              <div className="space-y-2">
                <Label>URL</Label>
                <Input
                  value={primaryUrl}
                  onChange={(e) => onChange('primaryUrl', e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Secondary Button (Optional)</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Label</Label>
                <Input
                  value={secondaryLabel}
                  onChange={(e) => onChange('secondaryLabel', e.target.value)}
                  placeholder="Learn More"
                />
              </div>
              <div className="space-y-2">
                <Label>URL</Label>
                <Input
                  value={secondaryUrl}
                  onChange={(e) => onChange('secondaryUrl', e.target.value)}
                  placeholder="https://example.com/learn"
                />
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
