/**
 * Support Section Component
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Link {
  label: string;
  url: string;
}

interface SupportSectionProps {
  enabled: boolean;
  title: string;
  links: Link[];
  onToggle: () => void;
  onChange: (field: string, value: string | Link[]) => void;
}

export function SupportSection({ enabled, title, links, onToggle, onChange }: SupportSectionProps) {
  const updateLink = (index: number, field: 'label' | 'url', value: string) => {
    const newLinks = [...links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    onChange('links', newLinks);
  };

  const addLink = () => {
    onChange('links', [...links, { label: '', url: '' }]);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Support Section</CardTitle>
          <Button variant={enabled ? 'default' : 'outline'} size="sm" onClick={onToggle}>
            {enabled ? 'Enabled' : 'Disabled'}
          </Button>
        </div>
      </CardHeader>
      {enabled && (
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Support Title</Label>
            <Input
              value={title}
              onChange={(e) => onChange('title', e.target.value)}
              placeholder="Need Help?"
            />
          </div>

          <div className="space-y-2">
            <Label>Support Links</Label>
            {links.map((link, index) => (
              <div key={index} className="grid grid-cols-2 gap-2">
                <Input
                  value={link.label}
                  onChange={(e) => updateLink(index, 'label', e.target.value)}
                  placeholder="Help Center"
                />
                <Input
                  value={link.url}
                  onChange={(e) => updateLink(index, 'url', e.target.value)}
                  placeholder="https://help.example.com"
                />
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addLink}>
              + Add Link
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

