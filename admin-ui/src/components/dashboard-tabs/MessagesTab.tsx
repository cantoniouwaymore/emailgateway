import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { messagesAPI } from '@/lib/api';
import { Mail, Eye, RefreshCw, Search, Loader2 } from 'lucide-react';

interface MessagesTabProps {
  messagesData: any;
  messagesLoading: boolean;
  refetchMessages: () => void;
}

export function MessagesTab({ messagesData, messagesLoading, refetchMessages }: MessagesTabProps) {
  const navigate = useNavigate();
  const [searchEmail, setSearchEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[] | null>(null);

  const messages = searchResults !== null ? searchResults : (messagesData?.recentMessages || []);

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

  const handleSearch = async () => {
    if (!searchEmail.trim()) return;
    
    setIsSearching(true);
    try {
      const result = await messagesAPI.searchByRecipient(searchEmail.trim());
      setSearchResults(result.messages || []);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    }
  };

  const handleClearSearch = () => {
    setSearchEmail('');
    setSearchResults(null);
    setIsSearching(false);
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <Card>
        <CardHeader>
          <CardTitle>Search Messages</CardTitle>
          <CardDescription>
            {searchResults !== null 
              ? `Found ${searchResults.length} message(s) for "${searchEmail}"`
              : 'Search messages by recipient email address'
            }
          </CardDescription>
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
            <Button onClick={handleSearch} disabled={!searchEmail.trim() || isSearching}>
              <Search className="mr-2 h-4 w-4" />
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
            {searchResults !== null && (
              <Button onClick={handleClearSearch} variant="outline">
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Messages Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>
              {searchResults !== null ? 'Search Results' : 'Recent Messages'}
            </CardTitle>
            <CardDescription>
              {searchResults !== null 
                ? `Showing ${searchResults.length} message(s) matching your search`
                : 'Latest email messages and their delivery status'
              }
            </CardDescription>
          </div>
          {searchResults === null && (
            <Button onClick={() => refetchMessages()} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {messagesLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No messages found</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Message ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead className="max-w-[250px]">Subject</TableHead>
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
                      <TableCell className="text-sm truncate max-w-[250px]">
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
                          onClick={() => navigate(`/messages/${message.messageId}`)}
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
    </div>
  );
}

