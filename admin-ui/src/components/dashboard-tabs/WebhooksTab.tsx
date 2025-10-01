import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Webhook, Eye, RefreshCw, Loader2 } from 'lucide-react';

interface WebhooksTabProps {
  messagesData: any;
  messagesLoading: boolean;
  refetchMessages: () => void;
}

export function WebhooksTab({ messagesData, messagesLoading, refetchMessages }: WebhooksTabProps) {
  const navigate = useNavigate();
  const webhookEvents = messagesData?.recentWebhookEvents || [];

  const getEventTypeBadgeVariant = (eventType: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    const lowerType = eventType.toLowerCase();
    if (lowerType === 'delivered') return 'default';
    if (lowerType === 'open' || lowerType === 'click') return 'secondary';
    if (lowerType === 'bounce' || lowerType === 'spam' || lowerType === 'reject') return 'destructive';
    return 'outline';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Provider Status Updates</CardTitle>
          <CardDescription>
            Latest webhook events from email providers (delivery status, bounces, opens, etc.)
          </CardDescription>
        </div>
        <Button onClick={() => refetchMessages()} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {messagesLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : webhookEvents.length === 0 ? (
          <div className="text-center py-12">
            <Webhook className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              No webhook events received yet. Events will appear here when providers send status updates.
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event Type</TableHead>
                  <TableHead className="w-[200px]">Message ID</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Received</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {webhookEvents.map((event: any) => (
                  <TableRow key={event.id} className="hover:bg-muted/50">
                    <TableCell>
                      <Badge variant={getEventTypeBadgeVariant(event.eventType)}>
                        {event.eventType}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {event.messageId}
                    </TableCell>
                    <TableCell className="text-sm">
                      {event.provider}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(event.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/messages/${event.messageId}`)}
                      >
                        <Eye className="mr-1 h-4 w-4" />
                        View Message
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

