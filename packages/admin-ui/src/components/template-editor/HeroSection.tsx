/**
 * Hero Section Component
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface HeroSectionProps {
  enabled: boolean;
  type: string;
  icon: string;
  iconSize: string;
  imageUrl: string;
  imageAlt: string;
  imageWidth: string;
  onToggle: () => void;
  onChange: (field: string, value: string) => void;
}

export function HeroSection(props: HeroSectionProps) {
  const { enabled, type, icon, iconSize, imageUrl, imageAlt, imageWidth, onToggle, onChange } = props;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Hero Section</CardTitle>
          <Button variant={enabled ? 'default' : 'outline'} size="sm" onClick={onToggle}>
            {enabled ? 'Enabled' : 'Disabled'}
          </Button>
        </div>
      </CardHeader>
      {enabled && (
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Hero Type</Label>
            <Select value={type} onValueChange={(value) => onChange('type', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="icon">Icon/Emoji</SelectItem>
                <SelectItem value="image">Image</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {type === 'icon' && (
            <>
              <div className="space-y-2">
                <Label>Icon/Emoji</Label>
                <Input
                  value={icon}
                  onChange={(e) => onChange('icon', e.target.value)}
                  placeholder="🎨"
                />
                <p className="text-xs text-muted-foreground">Use an emoji or icon character</p>
              </div>
              <div className="space-y-2">
                <Label>Icon Size</Label>
                <Input
                  value={iconSize}
                  onChange={(e) => onChange('iconSize', e.target.value)}
                  placeholder="48px"
                />
              </div>
            </>
          )}

          {type === 'image' && (
            <>
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input
                  value={imageUrl}
                  onChange={(e) => onChange('imageUrl', e.target.value)}
                  placeholder="https://example.com/hero.jpg"
                />
              </div>
              <div className="space-y-2">
                <Label>Image Alt Text</Label>
                <Input
                  value={imageAlt}
                  onChange={(e) => onChange('imageAlt', e.target.value)}
                  placeholder="Hero Image"
                />
              </div>
              <div className="space-y-2">
                <Label>Image Width</Label>
                <Input
                  value={imageWidth}
                  onChange={(e) => onChange('imageWidth', e.target.value)}
                  placeholder="600px"
                />
              </div>
            </>
          )}
        </CardContent>
      )}
    </Card>
  );
}

