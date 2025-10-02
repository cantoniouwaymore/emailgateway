/**
 * Locale Manager Component
 * Handles locale selection, creation, and deletion
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Globe, Plus, Trash2, AlertCircle } from 'lucide-react';

interface LocaleManagerProps {
  currentLocale: string;
  availableLocales: string[];
  onLocaleChange: (locale: string) => void;
  onCreateLocale: (locale: string) => Promise<void>;
  onDeleteLocale: (locale: string) => Promise<void>;
  isCreating?: boolean;
  isDeleting?: boolean;
}

const COMMON_LOCALES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish (Español)' },
  { code: 'fr', name: 'French (Français)' },
  { code: 'de', name: 'German (Deutsch)' },
  { code: 'it', name: 'Italian (Italiano)' },
  { code: 'pt', name: 'Portuguese (Português)' },
  { code: 'el', name: 'Greek (Ελληνικά)' },
  { code: 'ru', name: 'Russian (Русский)' },
  { code: 'zh', name: 'Chinese (中文)' },
  { code: 'ja', name: 'Japanese (日本語)' },
  { code: 'ko', name: 'Korean (한국어)' },
  { code: 'ar', name: 'Arabic (العربية)' },
];

export function LocaleManager({
  currentLocale,
  availableLocales,
  onLocaleChange,
  onCreateLocale,
  onDeleteLocale,
  isCreating = false,
  isDeleting = false,
}: LocaleManagerProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newLocale, setNewLocale] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleCreateLocale = async () => {
    if (!newLocale.trim()) {
      setError('Please enter a locale code');
      return;
    }

    if (availableLocales.includes(newLocale)) {
      setError('This locale already exists');
      return;
    }

    try {
      await onCreateLocale(newLocale);
      setIsCreateDialogOpen(false);
      setNewLocale('');
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to create locale');
    }
  };

  const handleDeleteLocale = async () => {
    if (currentLocale === '__base__') {
      setError('Cannot delete base locale');
      return;
    }

    try {
      await onDeleteLocale(currentLocale);
      setIsDeleteDialogOpen(false);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete locale');
    }
  };

  const getLocaleName = (code: string) => {
    if (code === '__base__') return 'Base Template';
    const locale = COMMON_LOCALES.find(l => l.code === code);
    return locale ? `${locale.name} (${code})` : code;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            <CardTitle>Locale Management</CardTitle>
          </div>
          <Badge variant="secondary">
            {availableLocales.length} locale{availableLocales.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Locale Selector */}
        <div className="space-y-2">
          <Label>Current Locale</Label>
          <Select value={currentLocale} onValueChange={onLocaleChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableLocales.map((locale) => (
                <SelectItem key={locale} value={locale}>
                  {getLocaleName(locale)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {/* Create Locale Dialog */}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1">
                <Plus className="w-4 h-4 mr-2" />
                Add Locale
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Locale</DialogTitle>
                <DialogDescription>
                  Create a new language version of this template
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="locale-code">Locale Code</Label>
                  <Input
                    id="locale-code"
                    value={newLocale}
                    onChange={(e) => {
                      setNewLocale(e.target.value.toLowerCase());
                      setError(null);
                    }}
                    placeholder="e.g., en, es, fr, el"
                    className="font-mono"
                  />
                  <p className="text-sm text-muted-foreground">
                    Use 2-letter ISO language codes (e.g., en for English, el for Greek)
                  </p>
                </div>

                {/* Common Locales Suggestions */}
                <div className="space-y-2">
                  <Label>Common Locales</Label>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_LOCALES.filter(l => !availableLocales.includes(l.code)).slice(0, 6).map((locale) => (
                      <Button
                        key={locale.code}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setNewLocale(locale.code);
                          setError(null);
                        }}
                      >
                        {locale.code}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateLocale} disabled={isCreating || !newLocale.trim()}>
                  {isCreating ? 'Creating...' : 'Create Locale'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Locale Dialog */}
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                disabled={currentLocale === '__base__' || availableLocales.length <= 1}
                className="flex-1"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Locale</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete the <strong>{getLocaleName(currentLocale)}</strong> locale?
                  This action cannot be undone.
                </DialogDescription>
              </DialogHeader>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteLocale} disabled={isDeleting}>
                  {isDeleting ? 'Deleting...' : 'Delete Locale'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Info */}
        {currentLocale === '__base__' && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This is the base template. Changes here will be used as fallback for all locales.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

