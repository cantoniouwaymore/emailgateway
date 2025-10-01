import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mail, Loader2, AlertCircle, Webhook } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function MessageDetails() {
  const { messageId } = useParams<{ messageId: string }>();
  const navigate = useNavigate();

  // Fetch message details
  const { data, isLoading, error } = useQuery({
    queryKey: ['message', messageId],
    queryFn: async () => {
      const response = await fetch(`/admin/api/messages/${messageId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch message details');
      }
      return response.json();
    },
    enabled: !!messageId,
  });

  const getStatusBadgeVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus === 'delivered' || lowerStatus === 'sent') return 'default';
    if (lowerStatus === 'queued' || lowerStatus === 'pending') return 'secondary';
    if (lowerStatus === 'failed' || lowerStatus === 'bounced') return 'destructive';
    return 'outline';
  };

  const getEventTypeBadgeVariant = (eventType: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    const lowerType = eventType.toLowerCase();
    if (lowerType === 'delivered') return 'default';
    if (lowerType === 'open' || lowerType === 'click') return 'secondary';
    if (lowerType === 'bounce' || lowerType === 'spam' || lowerType === 'reject') return 'destructive';
    return 'outline';
  };

  const getRecipientsList = (toJson: any): string => {
    try {
      const recipients = typeof toJson === 'string' ? JSON.parse(toJson) : toJson;
      if (!recipients || !Array.isArray(recipients)) {
        return 'N/A';
      }
      return recipients
        .map((r: any) => `${r.email}${r.name ? ` (${r.name})` : ''}`)
        .join(', ');
    } catch {
      return 'N/A';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading message details...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.message) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load message details. The message may not exist.
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate('/dashboard')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const message = data.message;
  const webhookEvents = data.webhookEvents || message.providerEvents || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Message Details</h1>
              <p className="text-sm text-gray-500">
                Detailed information about email message
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Message Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Message Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 py-3 border-b">
              <dt className="text-sm font-medium text-muted-foreground">Message ID</dt>
              <dd className="col-span-2 text-sm font-mono">{message.messageId}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4 py-3 border-b">
              <dt className="text-sm font-medium text-muted-foreground">Status</dt>
              <dd className="col-span-2">
                <Badge variant={getStatusBadgeVariant(message.status)}>
                  {message.status}
                </Badge>
              </dd>
            </div>
            <div className="grid grid-cols-3 gap-4 py-3 border-b">
              <dt className="text-sm font-medium text-muted-foreground">Attempts</dt>
              <dd className="col-span-2 text-sm">{message.attempts}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4 py-3 border-b">
              <dt className="text-sm font-medium text-muted-foreground">Provider</dt>
              <dd className="col-span-2 text-sm">{message.provider || 'N/A'}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4 py-3 border-b">
              <dt className="text-sm font-medium text-muted-foreground">Provider Message ID</dt>
              <dd className="col-span-2 text-sm font-mono">{message.providerMessageId || 'N/A'}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4 py-3 border-b">
              <dt className="text-sm font-medium text-muted-foreground">Template</dt>
              <dd className="col-span-2 text-sm">
                {message.templateKey ? (
                  <>
                    <span className="font-mono">{message.templateKey}</span>
                    {message.locale && <Badge variant="outline" className="ml-2">{message.locale}</Badge>}
                  </>
                ) : 'N/A'}
              </dd>
            </div>
            <div className="grid grid-cols-3 gap-4 py-3 border-b">
              <dt className="text-sm font-medium text-muted-foreground">Created At</dt>
              <dd className="col-span-2 text-sm">{new Date(message.createdAt).toLocaleString()}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4 py-3 border-b">
              <dt className="text-sm font-medium text-muted-foreground">Updated At</dt>
              <dd className="col-span-2 text-sm">{new Date(message.updatedAt).toLocaleString()}</dd>
            </div>
            {message.lastError && (
              <div className="grid grid-cols-3 gap-4 py-3 border-b bg-destructive/10">
                <dt className="text-sm font-medium text-destructive">Last Error</dt>
                <dd className="col-span-2 text-sm font-mono text-destructive">{message.lastError}</dd>
              </div>
            )}
            {message.failureReason && (
              <div className="grid grid-cols-3 gap-4 py-3 bg-destructive/10">
                <dt className="text-sm font-medium text-destructive">Failure Reason</dt>
                <dd className="col-span-2 text-sm text-destructive">{message.failureReason}</dd>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Email Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 py-3 border-b">
              <dt className="text-sm font-medium text-muted-foreground">Subject</dt>
              <dd className="col-span-2 text-sm">{message.subject}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4 py-3">
              <dt className="text-sm font-medium text-muted-foreground">Recipients</dt>
              <dd className="col-span-2 text-sm">{getRecipientsList(message.toJson)}</dd>
            </div>
          </CardContent>
        </Card>

        {/* Webhook Events */}
        {webhookEvents.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="h-5 w-5" />
                Webhook Events ({webhookEvents.length})
              </CardTitle>
              <CardDescription>
                Provider status updates and delivery notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {webhookEvents.map((event: any, index: number) => (
                  <div key={event.id || index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={getEventTypeBadgeVariant(event.eventType)}>
                        {event.eventType}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(event.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Provider: <span className="font-medium text-gray-900">{event.provider}</span>
                    </div>
                    {event.rawJson && (
                      <details className="mt-2">
                        <summary className="text-xs text-muted-foreground cursor-pointer hover:text-gray-900">
                          View Raw Data
                        </summary>
                        <pre className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                          {JSON.stringify(event.rawJson, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

