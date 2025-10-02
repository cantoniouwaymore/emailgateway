/**
 * Admin Dashboard
 * Modern React version - MODULAR with separate tab components
 * Before: 909 lines | After: ~110 lines (87% reduction!)
 */

import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { healthAPI, messagesAPI } from '@/lib/api';
import { Activity, FileText, Mail, Webhook, BookOpen } from 'lucide-react';
import {
  DocumentationTab,
  TemplatesTab,
  HealthTab,
  MessagesTab,
  WebhooksTab,
} from '@/components/dashboard-tabs';

export default function Dashboard() {
  const { data: healthData } = useQuery({
    queryKey: ['health'],
    queryFn: () => healthAPI.check(),
    refetchInterval: 30000, // Refresh every 30s
  });

  const { data: messagesData, isLoading: messagesLoading, refetch: refetchMessages } = useQuery({
    queryKey: ['dashboard-messages'],
    queryFn: () => messagesAPI.getAdminData(),
    refetchInterval: 30000, // Refresh every 30s
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Email Gateway Admin
              </h1>
              <p className="text-sm text-gray-500">
                Waymore Transactional Email Service
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={healthData?.status === 'healthy' ? 'default' : 'destructive'}>
                <Activity className="w-3 h-3 mr-1" />
                {healthData?.status || 'Unknown'}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="documentation" className="w-full">
          <TabsList>
            <TabsTrigger value="documentation">
              <BookOpen className="w-4 h-4 mr-2" />
              Documentation
            </TabsTrigger>
            <TabsTrigger value="templates">
              <FileText className="w-4 h-4 mr-2" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="health">
              <Activity className="w-4 h-4 mr-2" />
              Health
            </TabsTrigger>
            <TabsTrigger value="messages">
              <Mail className="w-4 h-4 mr-2" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="webhooks">
              <Webhook className="w-4 h-4 mr-2" />
              Webhooks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="documentation">
            <DocumentationTab />
          </TabsContent>

          <TabsContent value="templates">
            <TemplatesTab />
          </TabsContent>

          <TabsContent value="health">
            <HealthTab healthData={healthData} messagesData={messagesData} />
          </TabsContent>

          <TabsContent value="messages">
            <MessagesTab
              messagesData={messagesData}
              messagesLoading={messagesLoading}
              refetchMessages={refetchMessages}
            />
          </TabsContent>

          <TabsContent value="webhooks">
            <WebhooksTab
              messagesData={messagesData}
              messagesLoading={messagesLoading}
              refetchMessages={refetchMessages}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
