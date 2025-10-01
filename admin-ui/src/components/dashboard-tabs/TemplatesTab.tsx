import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { templatesAPI } from '@/lib/api';
import { Template } from '@/types';
import { Plus, RefreshCw, FileText, CheckCircle, Globe, TrendingUp, ChevronLeft, ChevronRight, Eye, Wand2, Code2, Trash2, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function TemplatesTab() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [jsonDialogOpen, setJsonDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [previewHtml, setPreviewHtml] = useState('');

  const { data: templatesData, refetch } = useQuery({
    queryKey: ['templates'],
    queryFn: () => templatesAPI.getAll(),
  });

  const templates = templatesData?.templates || [];

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (key: string) => templatesAPI.delete(key),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      toast({
        title: 'Template deleted',
        description: 'Template has been successfully deleted',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Delete failed',
        description: error.message || 'Failed to delete template',
        variant: 'destructive',
      });
    },
  });

  // Calculate statistics
  const stats = useMemo(() => {
    const totalTemplates = templates.length;
    const activeTemplates = templates.length; // All templates are active
    const totalLocales = templates.reduce((sum, t) => sum + (t.availableLocales?.length || 0), 0);
    const categories = new Set(templates.map(t => t.category)).size;
    return { totalTemplates, activeTemplates, totalLocales, categories };
  }, [templates]);

  // Get unique categories
  const categories = useMemo(() => {
    return Array.from(new Set(templates.map(t => t.category))).sort();
  }, [templates]);

  // Filter and sort templates
  const filteredAndSortedTemplates = useMemo(() => {
    let filtered = templates;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.key.toLowerCase().includes(query) ||
        (t.description && t.description.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (categoryFilter && categoryFilter !== 'all') {
      filtered = filtered.filter(t => t.category === categoryFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'key':
          return a.key.localeCompare(b.key);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'created':
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        case 'updated':
          return new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [templates, searchQuery, categoryFilter, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedTemplates.length / itemsPerPage);
  const paginatedTemplates = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedTemplates.slice(start, start + itemsPerPage);
  }, [filteredAndSortedTemplates, currentPage, itemsPerPage]);

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  // Handle preview
  const handlePreview = async (template: Template) => {
    try {
      const html = await templatesAPI.preview(template.key);
      setPreviewHtml(html);
      setSelectedTemplate(template);
      setPreviewDialogOpen(true);
    } catch (error) {
      toast({
        title: 'Preview failed',
        description: 'Failed to generate preview',
        variant: 'destructive',
      });
    }
  };

  // Handle view JSON
  const handleViewJSON = (template: Template) => {
    setSelectedTemplate(template);
    setJsonDialogOpen(true);
  };

  // Copy to clipboard
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: `${label} copied to clipboard`,
    });
  };

  // Generate send email request example with actual template variables
  const generateSendEmailRequest = (template: Template) => {
    // Extract variables from variableSchema
    const variables: Record<string, any> = {};
    
    if (template.variableSchema?.properties) {
      Object.keys(template.variableSchema.properties).forEach(key => {
        const prop = template.variableSchema!.properties[key];
        if (prop.example !== undefined) {
          variables[key] = prop.example;
        } else if (prop.type === 'string') {
          variables[key] = `example_${key}`;
        } else if (prop.type === 'number') {
          variables[key] = 100;
        } else if (prop.type === 'boolean') {
          variables[key] = true;
        } else if (prop.type === 'object' && prop.properties) {
          // Recursively generate nested object
          variables[key] = {};
          Object.keys(prop.properties).forEach(nestedKey => {
            const nestedProp = prop.properties[nestedKey];
            if (nestedProp.example !== undefined) {
              variables[key][nestedKey] = nestedProp.example;
            } else if (nestedProp.type === 'string') {
              variables[key][nestedKey] = `example_${nestedKey}`;
            } else if (nestedProp.type === 'number') {
              variables[key][nestedKey] = 100;
            }
          });
        }
      });
    }
    
    return {
      to: [{ email: 'user@example.com', name: 'John Doe' }],
      subject: template.description || 'Email Subject',
      template: {
        key: template.key,
        locale: 'en'
      },
      variables: Object.keys(variables).length > 0 ? variables : { example_variable: 'example_value' },
      metadata: {
        tenantId: 'your-tenant-id',
        source: 'your-application'
      }
    };
  };

  // Handle delete
  const handleDelete = (template: Template) => {
    if (confirm(`Are you sure you want to delete template "${template.name}" (${template.key})?\n\nThis action cannot be undone.`)) {
      deleteMutation.mutate(template.key);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Template Management</h2>
          <p className="text-sm text-gray-500">
            Manage database-driven email templates with full CRUD operations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Link to="/templates/editor">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Visual Builder
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Templates</p>
                <p className="text-2xl font-bold">{stats.totalTemplates}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Templates</p>
                <p className="text-2xl font-bold">{stats.activeTemplates}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Globe className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Locales</p>
                <p className="text-2xl font-bold">{stats.totalLocales}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold">{stats.categories}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Templates</label>
              <Input
                placeholder="Search by name, key, or description..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleFilterChange();
                }}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={categoryFilter} onValueChange={(value) => {
                setCategoryFilter(value);
                handleFilterChange();
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sort By</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="key">Key</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                  <SelectItem value="created">Created Date</SelectItem>
                  <SelectItem value="updated">Updated Date</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Results per Page</label>
              <Select value={String(itemsPerPage)} onValueChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Templates Table */}
      <Card>
        <CardHeader>
          <CardTitle>Templates</CardTitle>
          <CardDescription>
            Showing {paginatedTemplates.length} of {filteredAndSortedTemplates.length} templates
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredAndSortedTemplates.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || categoryFilter ? 'Try adjusting your filters' : 'Get started by creating your first template'}
              </p>
              <Link to="/templates/editor">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Template
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Template</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Locales</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTemplates.map((template: Template) => (
                      <TableRow key={template.key}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{template.name}</div>
                            <div className="text-xs text-muted-foreground font-mono">{template.key}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{template.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {template.availableLocales?.map((locale) => (
                              <Badge key={locale} variant="secondary" className="text-xs">
                                {locale}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {template.updatedAt ? new Date(template.updatedAt).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePreview(template)}
                              title="Preview"
                            >
                              <Eye className="h-4 w-4 text-blue-600" />
                            </Button>
                            <Link to={`/templates/editor/${template.key}`}>
                              <Button variant="ghost" size="sm" title="Edit in Visual Builder">
                                <Wand2 className="h-4 w-4 text-green-600" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewJSON(template)}
                              title="View JSON"
                            >
                              <Code2 className="h-4 w-4 text-purple-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(template)}
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    
                    {/* Page numbers */}
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                            className="w-10"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* JSON View Dialog */}
      <Dialog open={jsonDialogOpen} onOpenChange={setJsonDialogOpen}>
        <DialogContent className="max-w-[95vw] w-[1600px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Developer JSON - {selectedTemplate?.name}</DialogTitle>
            <DialogDescription>
              Template structure, variable schema, and API usage example
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="structure" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="structure">Template Structure</TabsTrigger>
              <TabsTrigger value="request">Send Email Request</TabsTrigger>
              <TabsTrigger value="schema">Variable Schema</TabsTrigger>
            </TabsList>
            
            <TabsContent value="structure" className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">JSON structure for this template</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(JSON.stringify(selectedTemplate?.jsonStructure, null, 2), 'Template structure')}
                >
                  <Copy className="h-3 w-3 mr-2" />
                  Copy
                </Button>
              </div>
              <div className="max-h-[600px] overflow-y-auto">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs whitespace-pre">
                  {JSON.stringify(selectedTemplate?.jsonStructure, null, 2)}
                </pre>
              </div>
            </TabsContent>
            
            <TabsContent value="request" className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">Complete request format for sending emails with this template</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => selectedTemplate && copyToClipboard(JSON.stringify(generateSendEmailRequest(selectedTemplate), null, 2), 'Email request')}
                >
                  <Copy className="h-3 w-3 mr-2" />
                  Copy
                </Button>
              </div>
              <div className="max-h-[600px] overflow-y-auto">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs whitespace-pre">
{`// POST /api/v1/emails
${selectedTemplate ? JSON.stringify(generateSendEmailRequest(selectedTemplate), null, 2) : ''}`}
                </pre>
              </div>
              <p className="text-xs text-muted-foreground">Use this JSON format to send emails with the template via the API</p>
            </TabsContent>
            
            <TabsContent value="schema" className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">Variable schema and type definitions</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(JSON.stringify(selectedTemplate?.variableSchema, null, 2), 'Variable schema')}
                >
                  <Copy className="h-3 w-3 mr-2" />
                  Copy
                </Button>
              </div>
              <div className="max-h-[600px] overflow-y-auto">
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs whitespace-pre">
                  {JSON.stringify(selectedTemplate?.variableSchema, null, 2)}
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-[90vw] w-[1200px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Template Preview - {selectedTemplate?.name}</DialogTitle>
            <DialogDescription>
              Email preview with example data
            </DialogDescription>
          </DialogHeader>
          <div className="border rounded-lg overflow-hidden">
            <iframe
              srcDoc={previewHtml}
              className="w-full h-[700px]"
              title="Template Preview"
              sandbox="allow-same-origin"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
