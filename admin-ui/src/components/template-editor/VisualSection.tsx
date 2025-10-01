/**
 * Visual Section Component (Progress/Countdown)
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProgressBar {
  label: string;
  currentValue: string | number;
  maxValue: string | number;
  unit: string;
  color: string;
  description: string;
}

interface VisualSectionProps {
  enabled: boolean;
  type: string;
  progressBars: ProgressBar[];
  countdown: {
    message: string;
    targetDate: string;
    showDays: boolean;
    showHours: boolean;
    showMinutes: boolean;
    showSeconds: boolean;
  };
  onToggle: () => void;
  onChange: (field: string, value: any) => void;
}

export function VisualSection({ enabled, type, progressBars, countdown, onToggle, onChange }: VisualSectionProps) {
  const updateProgressBar = (index: number, field: keyof ProgressBar, value: any) => {
    const newBars = [...progressBars];
    newBars[index] = { ...newBars[index], [field]: value };
    onChange('progressBars', newBars);
  };

  const addProgressBar = () => {
    onChange('progressBars', [
      ...progressBars,
      { label: '', currentValue: '', maxValue: '', unit: '', color: '#3b82f6', description: '' }
    ]);
  };

  const removeProgressBar = (index: number) => {
    const newBars = progressBars.filter((_, i) => i !== index);
    onChange('progressBars', newBars);
  };
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Visual Section</CardTitle>
          <Button variant={enabled ? 'default' : 'outline'} size="sm" onClick={onToggle}>
            {enabled ? 'Enabled' : 'Disabled'}
          </Button>
        </div>
      </CardHeader>
      {enabled && (
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Visual Type</Label>
            <Select value={type} onValueChange={(value) => onChange('type', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="progress">Progress Bars</SelectItem>
                <SelectItem value="countdown">Countdown Timer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {type === 'countdown' && (
            <>
              <div className="space-y-2">
                <Label>Countdown Message</Label>
                <Input
                  value={countdown.message}
                  onChange={(e) => onChange('countdown', { ...countdown, message: e.target.value })}
                  placeholder="Offer ends in:"
                />
              </div>
              <div className="space-y-2">
                <Label>Target Date</Label>
                <Input
                  type="datetime-local"
                  value={countdown.targetDate}
                  onChange={(e) => onChange('countdown', { ...countdown, targetDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Display Options</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: 'showDays', label: 'Days' },
                    { key: 'showHours', label: 'Hours' },
                    { key: 'showMinutes', label: 'Minutes' },
                    { key: 'showSeconds', label: 'Seconds' },
                  ].map(({ key, label }) => (
                    <label key={key} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={countdown[key as keyof typeof countdown] as boolean}
                        onChange={(e) => onChange('countdown', { ...countdown, [key]: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {type === 'progress' && (
            <div className="space-y-3">
              <Label>Progress Bars</Label>
              {progressBars.map((bar, index) => (
                <Card key={index} className="p-4 bg-gray-50">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Progress Bar {index + 1}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeProgressBar(index)}
                        className="h-6 w-6 p-0 text-destructive"
                      >
                        ×
                      </Button>
                    </div>
                    
                    <Input
                      value={bar.label}
                      onChange={(e) => updateProgressBar(index, 'label', e.target.value)}
                      placeholder="Storage Usage"
                      className="font-medium"
                    />
                    
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Current</Label>
                        <Input
                          value={bar.currentValue}
                          onChange={(e) => updateProgressBar(index, 'currentValue', e.target.value)}
                          placeholder="80 or {{used}}"
                          className="text-sm font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Max</Label>
                        <Input
                          value={bar.maxValue}
                          onChange={(e) => updateProgressBar(index, 'maxValue', e.target.value)}
                          placeholder="100 or {{limit}}"
                          className="text-sm font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Unit</Label>
                        <Input
                          value={bar.unit}
                          onChange={(e) => updateProgressBar(index, 'unit', e.target.value)}
                          placeholder="GB"
                          className="text-sm"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-xs">Bar Color</Label>
                        <Input
                          type="color"
                          value={bar.color}
                          onChange={(e) => updateProgressBar(index, 'color', e.target.value)}
                          className="h-9"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Description</Label>
                        <Input
                          value={bar.description}
                          onChange={(e) => updateProgressBar(index, 'description', e.target.value)}
                          placeholder="Optional context"
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              <Button variant="outline" size="sm" onClick={addProgressBar}>
                + Add Progress Bar
              </Button>
              <p className="text-xs text-muted-foreground">
                💡 Tip: Use variables like {'{{currentUsage}}'} and {'{{maxLimit}}'} for dynamic values
              </p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

