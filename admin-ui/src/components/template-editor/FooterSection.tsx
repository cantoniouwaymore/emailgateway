/**
 * Footer Section Component
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SocialLink {
  platform: string;
  url: string;
}

interface LegalLink {
  label: string;
  url: string;
}

interface FooterSectionProps {
  enabled: boolean;
  tagline: string;
  copyright: string;
  socialLinks: SocialLink[];
  legalLinks: LegalLink[];
  onToggle: () => void;
  onChange: (field: string, value: any) => void;
}

export function FooterSection(props: FooterSectionProps) {
  const { enabled, tagline, copyright, socialLinks, legalLinks, onToggle, onChange } = props;

  const updateSocialLink = (index: number, field: 'platform' | 'url', value: string) => {
    const newLinks = [...socialLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    onChange('socialLinks', newLinks);
  };

  const updateLegalLink = (index: number, field: 'label' | 'url', value: string) => {
    const newLinks = [...legalLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    onChange('legalLinks', newLinks);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Footer Section</CardTitle>
          <Button variant={enabled ? 'default' : 'outline'} size="sm" onClick={onToggle}>
            {enabled ? 'Enabled' : 'Disabled'}
          </Button>
        </div>
      </CardHeader>
      {enabled && (
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Tagline</Label>
            <Input
              value={tagline}
              onChange={(e) => onChange('tagline', e.target.value)}
              placeholder="Empowering your business"
            />
          </div>

          <div className="space-y-2">
            <Label>Copyright</Label>
            <Input
              value={copyright}
              onChange={(e) => onChange('copyright', e.target.value)}
              placeholder="© 2025 Your Company"
            />
          </div>

          <div className="space-y-2">
            <Label>Social Links (Optional)</Label>
            {socialLinks.map((link, index) => (
              <div key={index} className="grid grid-cols-2 gap-2">
                <Select
                  value={link.platform}
                  onValueChange={(value) => updateSocialLink(index, 'platform', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="github">GitHub</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  value={link.url}
                  onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                  placeholder="https://twitter.com/yourcompany"
                />
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onChange('socialLinks', [...socialLinks, { platform: 'twitter', url: '' }])}
            >
              + Add Social Link
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Legal Links (Optional)</Label>
            {legalLinks.map((link, index) => (
              <div key={index} className="grid grid-cols-2 gap-2">
                <Input
                  value={link.label}
                  onChange={(e) => updateLegalLink(index, 'label', e.target.value)}
                  placeholder="Privacy Policy"
                />
                <Input
                  value={link.url}
                  onChange={(e) => updateLegalLink(index, 'url', e.target.value)}
                  placeholder="https://example.com/privacy"
                />
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onChange('legalLinks', [...legalLinks, { label: '', url: '' }])}
            >
              + Add Legal Link
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

