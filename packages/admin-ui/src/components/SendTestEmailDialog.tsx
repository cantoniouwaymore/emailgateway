import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Send, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { templatesAPI } from '@/lib/api';

interface SendTestEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templateKey: string;
  templateName: string;
  currentLocale: string;
  templateStructure: any;
  variables: Record<string, any>;
}

export function SendTestEmailDialog({
  open,
  onOpenChange,
  templateKey,
  templateName,
  currentLocale,
  templateStructure,
  variables,
}: SendTestEmailDialogProps) {
  const [email, setEmail] = useState('test@example.com');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSend = async () => {
    setError(null);
    setSuccess(null);

    // Validate email
    if (!email || !validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!templateKey) {
      setError('Template key is required for testing');
      return;
    }

    setLoading(true);

    try {
      console.log('📧 Sending test email...', {
        templateKey,
        currentLocale,
        email,
        variableCount: Object.keys(variables).length
      });

      // Step 1: Save current locale structure first
      try {
        if (currentLocale === '__base__') {
          // For base template, update the main template structure
          await templatesAPI.update(templateKey, {
            jsonStructure: templateStructure
          });
          console.log('💾 Base template saved before test');
        } else {
          // For specific locales, update the locale structure
          await templatesAPI.updateLocale(templateKey, currentLocale, templateStructure);
          console.log('💾 Locale template saved before test');
        }
      } catch (saveError: any) {
        console.error('Failed to save template before test:', saveError);
        setError(`Failed to save template: ${saveError.message || 'Unknown error'}`);
        setLoading(false);
        return;
      }

      // Step 2: Filter variables to only include simple values (not nested objects)
      const testVariables: Record<string, any> = {};
      for (const [key, value] of Object.entries(variables)) {
        // Only include simple variables like userFirstName, planName, etc.
        // Skip nested objects like actions, header, footer which are database values
        if (typeof value !== 'object' || value === null) {
          testVariables[key] = value;
        }
      }

      console.log('📧 Test variables:', testVariables);

      // Step 3: Prepare test email data
      // Use 'en' as default if base is selected (backend doesn't understand '__base__')
      const emailLocale = currentLocale === '__base__' ? 'en' : currentLocale;
      
      const testEmailData = {
        to: [{ email, name: 'Test User' }],
        from: {
          email: 'marketing@waymore.io',
          name: 'Waymore'
        },
        subject: `Test: ${templateName || 'Template Test'}`,
        template: {
          key: templateKey,
          locale: emailLocale
        },
        variables: testVariables,
        metadata: {
          tenantId: 'admin_test',
          source: 'template_editor_react'
        }
      };

      console.log('📧 Sending test email to:', email);
      console.log('📧 Test email data:', testEmailData);

      // Step 4: Send test email using Admin API (no authentication required)
      const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:3000';
      const response = await fetch(`${API_BASE_URL}/admin/send-test-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testEmailData)
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new Error(errorText || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('📧 Test email sent successfully:', result);

      setSuccess(`Test email sent successfully to ${email}! Message ID: ${result.messageId}`);
      
      // Close dialog after 3 seconds
      setTimeout(() => {
        onOpenChange(false);
        setSuccess(null);
        setEmail('test@example.com');
      }, 3000);
    } catch (error: any) {
      console.error('Failed to send test email:', error);
      setError(error.message || 'Failed to send test email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-blue-600" />
            Send Test Email
          </DialogTitle>
          <DialogDescription>
            Send a test email using the current template to verify it looks correct.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="test-email">Test Email Address</Label>
            <Input
              id="test-email"
              type="email"
              placeholder="test@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !loading) {
                  handleSend();
                }
              }}
            />
            <p className="text-xs text-muted-foreground">
              The email will be sent with the current template structure and variable values
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-1">
            <p className="text-sm font-medium text-gray-700">Test Details:</p>
            <p className="text-xs text-gray-600">
              Template: <span className="font-mono">{templateKey}</span>
            </p>
            <p className="text-xs text-gray-600">
              Locale: <span className="font-mono">
                {currentLocale === '__base__' ? '__base__ (will send as "en")' : currentLocale}
              </span>
            </p>
            <p className="text-xs text-gray-600">
              Variables: <span className="font-mono">{Object.keys(variables).length} detected</span>
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500 bg-green-50">
              <AlertDescription className="text-green-700">
                {success}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Test Email
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

