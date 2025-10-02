import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { messagesAPI } from '@/lib/api';
import { Loader2, Mail, Search, RefreshCw, Eye, FileText, ExternalLink } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function Messages() {
  const navigate = useNavigate();
  const [searchEmail, setSearchEmail] = useState('');

  // Fetch messages data
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['messages'],
    queryFn: () => messagesAPI.getAdminData(),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const getRecipientEmail = (toJson: any): string => {
    try {
      const recipients = typeof toJson === 'string' ? JSON.parse(toJson) : toJson;
      if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
        return 'N/A';
      }
      return recipients[0].email || 'N/A';
    } catch {
      return 'N/A';
    }
  };

  const getStatusBadgeVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus === 'delivered' || lowerStatus === 'sent') return 'default';
    if (lowerStatus === 'queued' || lowerStatus === 'pending') return 'secondary';
    if (lowerStatus === 'failed' || lowerStatus === 'bounced') return 'destructive';
    return 'outline';
  };

  const handleSearch = () => {
    if (searchEmail.trim()) {
      navigate(`/admin/react/messages/search?email=${encodeURIComponent(searchEmail)}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-destructive">Failed to load messages</p>
          <Button onClick={() => refetch()} variant="outline" className="mt-4">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const messages = data?.recentMessages || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Mail className="h-6 w-6 text-primary" />
                Recent Messages
              </h1>
              <p className="text-sm text-gray-500">
                View and manage your recent email messages with delivery status and details
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <a
                href="http://localhost:5174/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <FileText className="w-4 h-4 mr-2" />
                Documentation
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Search Bar */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Messages</CardTitle>
          <CardDescription>Search messages by recipient email address</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="recipient@example.com"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={!searchEmail.trim()}>
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Messages Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Messages</CardTitle>
            <CardDescription>
              Latest email messages and their delivery status
            </CardDescription>
          </div>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No messages found</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Message ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead className="max-w-[300px]">Subject</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.map((message: any) => (
                    <TableRow key={message.messageId} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-xs">
                        {message.messageId}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(message.status)}>
                          {message.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {getRecipientEmail(message.toJson)}
                      </TableCell>
                      <TableCell className="text-sm truncate max-w-[300px]">
                        {message.subject}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {message.provider || 'N/A'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(message.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/admin/react/messages/${message.messageId}`)}
                        >
                          <Eye className="mr-1 h-4 w-4" />
                          View
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
      </main>
    </div>
  );
}

