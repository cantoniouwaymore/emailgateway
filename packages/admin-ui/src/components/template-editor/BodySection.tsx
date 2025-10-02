/**
 * Body Section Component
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface BodySectionProps {
  enabled: boolean;
  paragraphs: string[];
  fontSize: string;
  lineHeight: string;
  onToggle: () => void;
  onParagraphsChange: (paragraphs: string[]) => void;
  onChange: (field: string, value: string) => void;
}

export function BodySection(props: BodySectionProps) {
  const { enabled, paragraphs, fontSize, lineHeight, onToggle, onParagraphsChange, onChange } = props;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Body Section</CardTitle>
          <Button variant={enabled ? 'default' : 'outline'} size="sm" onClick={onToggle}>
            {enabled ? 'Enabled' : 'Disabled'}
          </Button>
        </div>
      </CardHeader>
      {enabled && (
        <CardContent className="space-y-4">
          {paragraphs.map((paragraph, index) => (
            <div key={index} className="space-y-2">
              <Label>Paragraph {index + 1}</Label>
              <Textarea
                value={paragraph}
                onChange={(e) => {
                  const newParagraphs = [...paragraphs];
                  newParagraphs[index] = e.target.value;
                  onParagraphsChange(newParagraphs);
                }}
                placeholder="Enter paragraph text..."
                rows={3}
              />
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onParagraphsChange([...paragraphs, ''])}
          >
            + Add Paragraph
          </Button>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <Label>Font Size</Label>
              <Input value={fontSize} onChange={(e) => onChange('fontSize', e.target.value)} placeholder="16px" />
            </div>
            <div className="space-y-2">
              <Label>Line Height</Label>
              <Input value={lineHeight} onChange={(e) => onChange('lineHeight', e.target.value)} placeholder="26px" />
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

