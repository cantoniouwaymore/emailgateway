/**
 * Snapshot Section Component (Facts Table)
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Fact {
  label: string;
  value: string;
}

interface SnapshotSectionProps {
  enabled: boolean;
  title: string;
  facts: Fact[];
  onToggle: () => void;
  onChange: (field: string, value: string | Fact[]) => void;
}

export function SnapshotSection({ enabled, title, facts, onToggle, onChange }: SnapshotSectionProps) {
  const updateFact = (index: number, field: 'label' | 'value', value: string) => {
    const newFacts = [...facts];
    newFacts[index] = { ...newFacts[index], [field]: value };
    onChange('facts', newFacts);
  };

  const addFact = () => {
    onChange('facts', [...facts, { label: '', value: '' }]);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Snapshot Section (Facts Table)</CardTitle>
          <Button variant={enabled ? 'default' : 'outline'} size="sm" onClick={onToggle}>
            {enabled ? 'Enabled' : 'Disabled'}
          </Button>
        </div>
      </CardHeader>
      {enabled && (
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Snapshot Title</Label>
            <Input
              value={title}
              onChange={(e) => onChange('title', e.target.value)}
              placeholder="Key Stats"
            />
          </div>

          <div className="space-y-2">
            <Label>Facts</Label>
            {facts.map((fact, index) => (
              <div key={index} className="grid grid-cols-2 gap-2">
                <Input
                  value={fact.label}
                  onChange={(e) => updateFact(index, 'label', e.target.value)}
                  placeholder="Label"
                />
                <Input
                  value={fact.value}
                  onChange={(e) => updateFact(index, 'value', e.target.value)}
                  placeholder="Value"
                />
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addFact}>
              + Add Fact
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

