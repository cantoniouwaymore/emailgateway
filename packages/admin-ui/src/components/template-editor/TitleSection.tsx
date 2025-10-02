/**
 * Title Section Component
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TitleSectionProps {
  enabled: boolean;
  text: string;
  size: string;
  weight: string;
  color: string;
  align: string;
  onToggle: () => void;
  onChange: (field: string, value: string) => void;
}

export function TitleSection(props: TitleSectionProps) {
  const { enabled, text, size, weight, color, align, onToggle, onChange } = props;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Title Section</CardTitle>
          <Button variant={enabled ? 'default' : 'outline'} size="sm" onClick={onToggle}>
            {enabled ? 'Enabled' : 'Disabled'}
          </Button>
        </div>
      </CardHeader>
      {enabled && (
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Title Text</Label>
            <Input
              value={text}
              onChange={(e) => onChange('text', e.target.value)}
              placeholder="Your email title"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Size</Label>
              <Input value={size} onChange={(e) => onChange('size', e.target.value)} placeholder="28px" />
            </div>
            <div className="space-y-2">
              <Label>Weight</Label>
              <Select value={weight} onValueChange={(value) => onChange('weight', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="400">Normal (400)</SelectItem>
                  <SelectItem value="500">Medium (500)</SelectItem>
                  <SelectItem value="600">Semibold (600)</SelectItem>
                  <SelectItem value="700">Bold (700)</SelectItem>
                  <SelectItem value="800">Extra Bold (800)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Color</Label>
              <Input type="color" value={color} onChange={(e) => onChange('color', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Alignment</Label>
              <Select value={align} onValueChange={(value) => onChange('align', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

