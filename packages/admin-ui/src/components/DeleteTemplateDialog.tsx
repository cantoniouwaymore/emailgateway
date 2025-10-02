/**
 * Delete Template Dialog Component
 * Confirmation dialog for deleting templates
 */

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Trash2 } from 'lucide-react';

interface DeleteTemplateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  templateKey: string;
  templateName: string;
  isDeleting?: boolean;
}

export function DeleteTemplateDialog({
  isOpen,
  onClose,
  onConfirm,
  templateKey,
  templateName,
  isDeleting = false,
}: DeleteTemplateDialogProps) {
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (confirmText !== templateKey) {
      setError('Template key does not match');
      return;
    }

    try {
      await onConfirm();
      setConfirmText('');
      setError(null);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to delete template');
    }
  };

  const handleClose = () => {
    setConfirmText('');
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="w-5 h-5" />
            Delete Template
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the template and all its locales.
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
            <p className="text-sm">
              You are about to delete: <strong>{templateName}</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              Type <code className="bg-muted px-1 py-0.5 rounded font-mono text-xs">{templateKey}</code> to confirm:
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-delete">Template Key</Label>
            <Input
              id="confirm-delete"
              value={confirmText}
              onChange={(e) => {
                setConfirmText(e.target.value);
                setError(null);
              }}
              placeholder={templateKey}
              className="font-mono"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={confirmText !== templateKey || isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Template'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

