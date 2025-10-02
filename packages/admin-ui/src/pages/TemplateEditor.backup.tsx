/**
 * Template Editor
 * Modern React version replacing template-editor.html.ts (2,168 lines)
 */

import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { templatesAPI } from '@/lib/api';
import { PreviewPanel } from '@/components/PreviewPanel';
import { VariablesPanel } from '@/components/VariablesPanel';
import { LocaleManager } from '@/components/LocaleManager';
import { DeleteTemplateDialog } from '@/components/DeleteTemplateDialog';
import { ArrowLeft, Save, Loader2, Trash2 } from 'lucide-react';

export default function TemplateEditor() {
  const { templateKey } = useParams<{ templateKey: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!templateKey;

  // Form state
  const [formData, setFormData] = useState({
    key: '',
    name: '',
    description: '',
    category: '',
  });

  // Locale state
  const [currentLocale, setCurrentLocale] = useState('__base__');
  const [availableLocales, setAvailableLocales] = useState<string[]>(['__base__']);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [sections, setSections] = useState({
    header: { enabled: false, logoUrl: '', logoAlt: 'Company Logo', tagline: '' },
    hero: { enabled: false, type: 'none', icon: '🎨', iconSize: '48px', imageUrl: '', imageAlt: '', imageWidth: '600px' },
    title: { enabled: false, text: '', size: '28px', weight: '700', color: '#1f2937', align: 'left' },
    body: { enabled: false, paragraphs: [''], fontSize: '16px', lineHeight: '26px' },
    snapshot: { enabled: false, title: '', facts: [{ label: '', value: '' }] },
    visual: { enabled: false, type: 'none', progressBars: [] as any[], countdown: { message: '', targetDate: '', showDays: true, showHours: true, showMinutes: true, showSeconds: false } },
    actions: { enabled: false, primaryLabel: '', primaryUrl: '', primaryColor: '#3b82f6', primaryTextColor: '#ffffff', secondaryLabel: '', secondaryUrl: '', secondaryColor: '#6b7280' },
    support: { enabled: false, title: '', links: [{ label: '', url: '' }] },
    footer: { enabled: false, tagline: '', copyright: '', socialLinks: [] as Array<{platform: string; url: string}>, legalLinks: [] as Array<{label: string; url: string}> },
  });

  // Variables state for preview
  const [variableValues, setVariableValues] = useState<Record<string, any>>({});

  // Build template structure for preview
  const templateStructure = useMemo(() => {
    const structure: Record<string, any> = {};

    if (sections.header.enabled) {
      structure.header = {
        logo_url: sections.header.logoUrl,
        logo_alt: sections.header.logoAlt,
        tagline: sections.header.tagline,
      };
    }

    if (sections.hero.enabled && sections.hero.type !== 'none') {
      structure.hero = { type: sections.hero.type };
      if (sections.hero.type === 'icon') {
        structure.hero.icon = sections.hero.icon;
        structure.hero.icon_size = sections.hero.iconSize;
      } else if (sections.hero.type === 'image') {
        structure.hero.image_url = sections.hero.imageUrl;
        structure.hero.image_alt = sections.hero.imageAlt;
        structure.hero.image_width = sections.hero.imageWidth;
      }
    }

    if (sections.title.enabled) {
      structure.title = {
        text: sections.title.text,
        size: sections.title.size,
        weight: sections.title.weight,
        color: sections.title.color,
        align: sections.title.align,
      };
    }

    if (sections.body.enabled) {
      structure.body = {
        paragraphs: sections.body.paragraphs.filter(p => p.trim()),
        font_size: sections.body.fontSize,
        line_height: sections.body.lineHeight,
      };
    }

    if (sections.snapshot.enabled) {
      structure.snapshot = {
        title: sections.snapshot.title,
        style: 'table',
        facts: sections.snapshot.facts.filter(f => f.label && f.value),
      };
    }

    if (sections.visual.enabled && sections.visual.type !== 'none') {
      structure.visual = { type: sections.visual.type };
      if (sections.visual.type === 'progress') {
        structure.visual.progress_bars = sections.visual.progressBars;
      } else if (sections.visual.type === 'countdown') {
        structure.visual.countdown = sections.visual.countdown;
      }
    }

    if (sections.actions.enabled) {
      structure.actions = {};
      if (sections.actions.primaryLabel && sections.actions.primaryUrl) {
        structure.actions.primary = {
          label: sections.actions.primaryLabel,
          url: sections.actions.primaryUrl,
          style: 'button',
          color: sections.actions.primaryColor,
          text_color: sections.actions.primaryTextColor,
        };
      }
      if (sections.actions.secondaryLabel && sections.actions.secondaryUrl) {
        structure.actions.secondary = {
          label: sections.actions.secondaryLabel,
          url: sections.actions.secondaryUrl,
          style: 'button',
          color: sections.actions.secondaryColor,
          text_color: '#ffffff',
        };
      }
    }

    if (sections.support.enabled) {
      structure.support = {
        title: sections.support.title,
        links: sections.support.links.filter(l => l.label && l.url),
      };
    }

    if (sections.footer.enabled) {
      structure.footer = {
        tagline: sections.footer.tagline,
        copyright: sections.footer.copyright,
      };
      if (sections.footer.socialLinks.length > 0) {
        structure.footer.social_links = sections.footer.socialLinks;
      }
      if (sections.footer.legalLinks.length > 0) {
        structure.footer.legal_links = sections.footer.legalLinks;
      }
    }

    return structure;
  }, [sections]);

  // Load template if editing
  const { data: templateData, isLoading } = useQuery({
    queryKey: ['template', templateKey],
    queryFn: () => templatesAPI.getOne(templateKey!),
    enabled: isEditing,
  });

  useEffect(() => {
    if (templateData?.template) {
      const template = templateData.template;
      setFormData({
        key: template.key,
        name: template.name,
        description: template.description || '',
        category: template.category,
      });

      // Set available locales
      const locales = ['__base__', ...(template.availableLocales || [])];
      setAvailableLocales(locales);

      // Load template structure for current locale
      loadLocaleStructure(template, currentLocale);
    }
  }, [templateData]);

  // Load locale structure when locale changes
  // Function to load locale-specific structure
  const loadLocaleStructure = (template: any, locale: string) => {
    let structure = template.jsonStructure || {};
    
    // If not base locale, try to load locale-specific structure
    if (locale !== '__base__' && template.locales) {
      const localeData = template.locales.find((l: any) => l.locale === locale);
      if (localeData && localeData.jsonStructure) {
        structure = localeData.jsonStructure;
      }
    }

    // Load structure into sections
    setSections({
      header: {
        enabled: !!structure.header,
        logoUrl: structure.header?.logo_url || '',
        logoAlt: structure.header?.logo_alt || 'Company Logo',
        tagline: structure.header?.tagline || '',
      },
      hero: {
        enabled: !!structure.hero,
        type: structure.hero?.type || 'none',
        icon: structure.hero?.icon || '🎨',
        iconSize: structure.hero?.icon_size || '48px',
        imageUrl: structure.hero?.image_url || '',
        imageAlt: structure.hero?.image_alt || '',
        imageWidth: structure.hero?.image_width || '600px',
      },
      title: {
        enabled: !!structure.title,
        text: structure.title?.text || '',
        size: structure.title?.size || '28px',
        weight: structure.title?.weight || '700',
        color: structure.title?.color || '#1f2937',
        align: structure.title?.align || 'left',
      },
      body: {
        enabled: !!structure.body,
        paragraphs: structure.body?.paragraphs || [''],
        fontSize: structure.body?.font_size || '16px',
        lineHeight: structure.body?.line_height || '26px',
      },
      snapshot: {
        enabled: !!structure.snapshot,
        title: structure.snapshot?.title || '',
        facts: structure.snapshot?.facts || [{ label: '', value: '' }],
      },
      visual: {
        enabled: !!structure.visual,
        type: structure.visual?.type || 'none',
        progressBars: structure.visual?.progress_bars || [],
        countdown: structure.visual?.countdown || {
          message: '',
          targetDate: '',
          showDays: true,
          showHours: true,
          showMinutes: true,
          showSeconds: false,
        },
      },
      actions: {
        enabled: !!structure.actions,
        primaryLabel: structure.actions?.primary?.label || '',
        primaryUrl: structure.actions?.primary?.url || '',
        primaryColor: structure.actions?.primary?.color || '#3b82f6',
        primaryTextColor: structure.actions?.primary?.text_color || '#ffffff',
        secondaryLabel: structure.actions?.secondary?.label || '',
        secondaryUrl: structure.actions?.secondary?.url || '',
        secondaryColor: structure.actions?.secondary?.color || '#6b7280',
      },
      support: {
        enabled: !!structure.support,
        title: structure.support?.title || '',
        links: structure.support?.links || [{ label: '', url: '' }],
      },
      footer: {
        enabled: !!structure.footer,
        tagline: structure.footer?.tagline || '',
        copyright: structure.footer?.copyright || '',
        socialLinks: structure.footer?.social_links || [],
        legalLinks: structure.footer?.legal_links || [],
      },
    });
  };

  useEffect(() => {
    if (templateData?.template) {
      loadLocaleStructure(templateData.template, currentLocale);
    }
  }, [currentLocale, templateData]);

  // Handle locale change
  const handleLocaleChange = (locale: string) => {
    setCurrentLocale(locale);
  };

  // Create locale mutation
  const createLocaleMutation = useMutation({
    mutationFn: async (locale: string) => {
      if (!isEditing) throw new Error('Cannot create locale for unsaved template');
      
      // Create locale with current structure
      await templatesAPI.addLocale(formData.key, locale, templateStructure);
      
      // Refresh template data
      await queryClient.invalidateQueries({ queryKey: ['template', templateKey] });
      
      // Switch to new locale
      setCurrentLocale(locale);
    },
    onSuccess: () => {
      alert('Locale created successfully!');
    },
    onError: (error: Error) => {
      throw error;
    },
  });

  // Delete locale mutation
  const deleteLocaleMutation = useMutation({
    mutationFn: async (locale: string) => {
      if (!isEditing) throw new Error('Cannot delete locale from unsaved template');
      
      await templatesAPI.deleteLocale(formData.key, locale);
      
      // Refresh template data
      await queryClient.invalidateQueries({ queryKey: ['template', templateKey] });
      
      // Switch to base locale
      setCurrentLocale('__base__');
    },
    onSuccess: () => {
      alert('Locale deleted successfully!');
    },
    onError: (error: Error) => {
      throw error;
    },
  });

  // Delete template mutation
  const deleteTemplateMutation = useMutation({
    mutationFn: async () => {
      if (!isEditing) throw new Error('Cannot delete unsaved template');
      await templatesAPI.delete(formData.key);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      alert('Template deleted successfully!');
      navigate('/dashboard');
    },
    onError: (error: Error) => {
      alert(`Error: ${error.message}`);
    },
  });

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (isEditing) {
        // Update existing template
        if (currentLocale === '__base__') {
          // Update base template
          return templatesAPI.update(formData.key, {
            name: formData.name,
            description: formData.description,
            category: formData.category,
            jsonStructure: templateStructure,
          });
        } else {
          // Update locale
          return templatesAPI.updateLocale(formData.key, currentLocale, templateStructure);
        }
      } else {
        // Create new template
        return templatesAPI.create({
          ...formData,
          jsonStructure: templateStructure,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      alert('Template saved successfully!');
    },
    onError: (error: Error) => {
      alert(`Error: ${error.message}`);
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditing ? `Edit: ${formData.name}` : 'Create New Template'}
              </h1>
              <p className="text-sm text-gray-500">
                {isEditing ? `Editing ${formData.key}` : 'Build a new email template'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              {isEditing && (
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              )}
              <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
                {saveMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Editor */}
      <div className="max-w-[2000px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Left: Template Form */}
          <div className="space-y-6">
            {/* Basic Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Template Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="key">Template Key</Label>
                    <Input
                      id="key"
                      value={formData.key}
                      onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                      placeholder="unique-template-key"
                      disabled={isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="transactional"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Template Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="My Email Template"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe what this template is used for..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Template Sections */}
            <Tabs defaultValue="header" className="w-full">
              <TabsList className="grid w-full grid-cols-9 text-xs">
                <TabsTrigger value="header">Header</TabsTrigger>
                <TabsTrigger value="hero">Hero</TabsTrigger>
                <TabsTrigger value="title">Title</TabsTrigger>
                <TabsTrigger value="body">Body</TabsTrigger>
                <TabsTrigger value="snapshot">Snapshot</TabsTrigger>
                <TabsTrigger value="visual">Visual</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
                <TabsTrigger value="support">Support</TabsTrigger>
                <TabsTrigger value="footer">Footer</TabsTrigger>
              </TabsList>

              {/* Header Section */}
              <TabsContent value="header">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Header Section</CardTitle>
                      <Button
                        variant={sections.header.enabled ? 'default' : 'outline'}
                        size="sm"
                        onClick={() =>
                          setSections({
                            ...sections,
                            header: { ...sections.header, enabled: !sections.header.enabled },
                          })
                        }
                      >
                        {sections.header.enabled ? 'Enabled' : 'Disabled'}
                      </Button>
                    </div>
                  </CardHeader>
                  {sections.header.enabled && (
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Logo URL</Label>
                        <Input
                          value={sections.header.logoUrl}
                          onChange={(e) =>
                            setSections({
                              ...sections,
                              header: { ...sections.header, logoUrl: e.target.value },
                            })
                          }
                          placeholder="https://example.com/logo.png"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Logo Alt Text</Label>
                        <Input
                          value={sections.header.logoAlt}
                          onChange={(e) =>
                            setSections({
                              ...sections,
                              header: { ...sections.header, logoAlt: e.target.value },
                            })
                          }
                          placeholder="Company Logo"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Tagline</Label>
                        <Input
                          value={sections.header.tagline}
                          onChange={(e) =>
                            setSections({
                              ...sections,
                              header: { ...sections.header, tagline: e.target.value },
                            })
                          }
                          placeholder="Your company tagline"
                        />
                      </div>
                    </CardContent>
                  )}
                </Card>
              </TabsContent>

              {/* Hero Section */}
              <TabsContent value="hero">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Hero Section</CardTitle>
                      <Button
                        variant={sections.hero.enabled ? 'default' : 'outline'}
                        size="sm"
                        onClick={() =>
                          setSections({
                            ...sections,
                            hero: { ...sections.hero, enabled: !sections.hero.enabled },
                          })
                        }
                      >
                        {sections.hero.enabled ? 'Enabled' : 'Disabled'}
                      </Button>
                    </div>
                  </CardHeader>
                  {sections.hero.enabled && (
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Hero Type</Label>
                        <Select
                          value={sections.hero.type}
                          onValueChange={(value) =>
                            setSections({
                              ...sections,
                              hero: { ...sections.hero, type: value },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="icon">Icon/Emoji</SelectItem>
                            <SelectItem value="image">Image</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {sections.hero.type === 'icon' && (
                        <>
                          <div className="space-y-2">
                            <Label>Icon/Emoji</Label>
                            <Input
                              value={sections.hero.icon}
                              onChange={(e) =>
                                setSections({
                                  ...sections,
                                  hero: { ...sections.hero, icon: e.target.value },
                                })
                              }
                              placeholder="🎨"
                            />
                            <p className="text-xs text-muted-foreground">
                              Use an emoji or icon character
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Label>Icon Size</Label>
                            <Input
                              value={sections.hero.iconSize}
                              onChange={(e) =>
                                setSections({
                                  ...sections,
                                  hero: { ...sections.hero, iconSize: e.target.value },
                                })
                              }
                              placeholder="48px"
                            />
                          </div>
                        </>
                      )}

                      {sections.hero.type === 'image' && (
                        <>
                          <div className="space-y-2">
                            <Label>Image URL</Label>
                            <Input
                              value={sections.hero.imageUrl}
                              onChange={(e) =>
                                setSections({
                                  ...sections,
                                  hero: { ...sections.hero, imageUrl: e.target.value },
                                })
                              }
                              placeholder="https://example.com/hero.jpg"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Image Alt Text</Label>
                            <Input
                              value={sections.hero.imageAlt}
                              onChange={(e) =>
                                setSections({
                                  ...sections,
                                  hero: { ...sections.hero, imageAlt: e.target.value },
                                })
                              }
                              placeholder="Hero Image"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Image Width</Label>
                            <Input
                              value={sections.hero.imageWidth}
                              onChange={(e) =>
                                setSections({
                                  ...sections,
                                  hero: { ...sections.hero, imageWidth: e.target.value },
                                })
                              }
                              placeholder="600px"
                            />
                          </div>
                        </>
                      )}
                    </CardContent>
                  )}
                </Card>
              </TabsContent>

              {/* Title Section */}
              <TabsContent value="title">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Title Section</CardTitle>
                      <Button
                        variant={sections.title.enabled ? 'default' : 'outline'}
                        size="sm"
                        onClick={() =>
                          setSections({
                            ...sections,
                            title: { ...sections.title, enabled: !sections.title.enabled },
                          })
                        }
                      >
                        {sections.title.enabled ? 'Enabled' : 'Disabled'}
                      </Button>
                    </div>
                  </CardHeader>
                  {sections.title.enabled && (
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Title Text</Label>
                        <Input
                          value={sections.title.text}
                          onChange={(e) =>
                            setSections({
                              ...sections,
                              title: { ...sections.title, text: e.target.value },
                            })
                          }
                          placeholder="Your email title"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Size</Label>
                          <Input
                            value={sections.title.size}
                            onChange={(e) =>
                              setSections({
                                ...sections,
                                title: { ...sections.title, size: e.target.value },
                              })
                            }
                            placeholder="28px"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Color</Label>
                          <Input
                            type="color"
                            value={sections.title.color}
                            onChange={(e) =>
                              setSections({
                                ...sections,
                                title: { ...sections.title, color: e.target.value },
                              })
                            }
                          />
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </TabsContent>

              {/* Body Section */}
              <TabsContent value="body">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Body Section</CardTitle>
                      <Button
                        variant={sections.body.enabled ? 'default' : 'outline'}
                        size="sm"
                        onClick={() =>
                          setSections({
                            ...sections,
                            body: { ...sections.body, enabled: !sections.body.enabled },
                          })
                        }
                      >
                        {sections.body.enabled ? 'Enabled' : 'Disabled'}
                      </Button>
                    </div>
                  </CardHeader>
                  {sections.body.enabled && (
                    <CardContent className="space-y-4">
                      {sections.body.paragraphs.map((paragraph, index) => (
                        <div key={index} className="space-y-2">
                          <Label>Paragraph {index + 1}</Label>
                          <Textarea
                            value={paragraph}
                            onChange={(e) => {
                              const newParagraphs = [...sections.body.paragraphs];
                              newParagraphs[index] = e.target.value;
                              setSections({
                                ...sections,
                                body: { ...sections.body, paragraphs: newParagraphs },
                              });
                            }}
                            placeholder="Enter paragraph text..."
                            rows={3}
                          />
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setSections({
                            ...sections,
                            body: { ...sections.body, paragraphs: [...sections.body.paragraphs, ''] },
                          })
                        }
                      >
                        + Add Paragraph
                      </Button>
                    </CardContent>
                  )}
                </Card>
              </TabsContent>

              {/* Actions Section */}
              <TabsContent value="actions">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Actions Section</CardTitle>
                      <Button
                        variant={sections.actions.enabled ? 'default' : 'outline'}
                        size="sm"
                        onClick={() =>
                          setSections({
                            ...sections,
                            actions: { ...sections.actions, enabled: !sections.actions.enabled },
                          })
                        }
                      >
                        {sections.actions.enabled ? 'Enabled' : 'Disabled'}
                      </Button>
                    </div>
                  </CardHeader>
                  {sections.actions.enabled && (
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Primary Button</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Label</Label>
                            <Input
                              value={sections.actions.primaryLabel}
                              onChange={(e) =>
                                setSections({
                                  ...sections,
                                  actions: { ...sections.actions, primaryLabel: e.target.value },
                                })
                              }
                              placeholder="Click Here"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>URL</Label>
                            <Input
                              value={sections.actions.primaryUrl}
                              onChange={(e) =>
                                setSections({
                                  ...sections,
                                  actions: { ...sections.actions, primaryUrl: e.target.value },
                                })
                              }
                              placeholder="https://example.com"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Secondary Button (Optional)</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Label</Label>
                            <Input
                              value={sections.actions.secondaryLabel}
                              onChange={(e) =>
                                setSections({
                                  ...sections,
                                  actions: { ...sections.actions, secondaryLabel: e.target.value },
                                })
                              }
                              placeholder="Learn More"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>URL</Label>
                            <Input
                              value={sections.actions.secondaryUrl}
                              onChange={(e) =>
                                setSections({
                                  ...sections,
                                  actions: { ...sections.actions, secondaryUrl: e.target.value },
                                })
                              }
                              placeholder="https://example.com/learn"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </TabsContent>

              {/* Snapshot Section */}
              <TabsContent value="snapshot">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Snapshot Section (Facts Table)</CardTitle>
                      <Button
                        variant={sections.snapshot.enabled ? 'default' : 'outline'}
                        size="sm"
                        onClick={() =>
                          setSections({
                            ...sections,
                            snapshot: { ...sections.snapshot, enabled: !sections.snapshot.enabled },
                          })
                        }
                      >
                        {sections.snapshot.enabled ? 'Enabled' : 'Disabled'}
                      </Button>
                    </div>
                  </CardHeader>
                  {sections.snapshot.enabled && (
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Snapshot Title</Label>
                        <Input
                          value={sections.snapshot.title}
                          onChange={(e) =>
                            setSections({
                              ...sections,
                              snapshot: { ...sections.snapshot, title: e.target.value },
                            })
                          }
                          placeholder="Key Stats"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Facts</Label>
                        {sections.snapshot.facts.map((fact, index) => (
                          <div key={index} className="grid grid-cols-2 gap-2">
                            <Input
                              value={fact.label}
                              onChange={(e) => {
                                const newFacts = [...sections.snapshot.facts];
                                newFacts[index] = { ...newFacts[index], label: e.target.value };
                                setSections({
                                  ...sections,
                                  snapshot: { ...sections.snapshot, facts: newFacts },
                                });
                              }}
                              placeholder="Label"
                            />
                            <Input
                              value={fact.value}
                              onChange={(e) => {
                                const newFacts = [...sections.snapshot.facts];
                                newFacts[index] = { ...newFacts[index], value: e.target.value };
                                setSections({
                                  ...sections,
                                  snapshot: { ...sections.snapshot, facts: newFacts },
                                });
                              }}
                              placeholder="Value"
                            />
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setSections({
                              ...sections,
                              snapshot: { 
                                ...sections.snapshot, 
                                facts: [...sections.snapshot.facts, { label: '', value: '' }] 
                              },
                            })
                          }
                        >
                          + Add Fact
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </TabsContent>

              {/* Visual Section */}
              <TabsContent value="visual">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Visual Section</CardTitle>
                      <Button
                        variant={sections.visual.enabled ? 'default' : 'outline'}
                        size="sm"
                        onClick={() =>
                          setSections({
                            ...sections,
                            visual: { ...sections.visual, enabled: !sections.visual.enabled },
                          })
                        }
                      >
                        {sections.visual.enabled ? 'Enabled' : 'Disabled'}
                      </Button>
                    </div>
                  </CardHeader>
                  {sections.visual.enabled && (
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Visual Type</Label>
                        <Select
                          value={sections.visual.type}
                          onValueChange={(value) =>
                            setSections({
                              ...sections,
                              visual: { ...sections.visual, type: value },
                            })
                          }
                        >
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

                      {sections.visual.type === 'countdown' && (
                        <>
                          <div className="space-y-2">
                            <Label>Countdown Message</Label>
                            <Input
                              value={sections.visual.countdown.message}
                              onChange={(e) =>
                                setSections({
                                  ...sections,
                                  visual: {
                                    ...sections.visual,
                                    countdown: { ...sections.visual.countdown, message: e.target.value },
                                  },
                                })
                              }
                              placeholder="Offer ends in:"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Target Date</Label>
                            <Input
                              type="datetime-local"
                              value={sections.visual.countdown.targetDate}
                              onChange={(e) =>
                                setSections({
                                  ...sections,
                                  visual: {
                                    ...sections.visual,
                                    countdown: { ...sections.visual.countdown, targetDate: e.target.value },
                                  },
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Display Options</Label>
                            <div className="grid grid-cols-2 gap-2">
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={sections.visual.countdown.showDays}
                                  onChange={(e) =>
                                    setSections({
                                      ...sections,
                                      visual: {
                                        ...sections.visual,
                                        countdown: { ...sections.visual.countdown, showDays: e.target.checked },
                                      },
                                    })
                                  }
                                  className="rounded"
                                />
                                <span className="text-sm">Days</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={sections.visual.countdown.showHours}
                                  onChange={(e) =>
                                    setSections({
                                      ...sections,
                                      visual: {
                                        ...sections.visual,
                                        countdown: { ...sections.visual.countdown, showHours: e.target.checked },
                                      },
                                    })
                                  }
                                  className="rounded"
                                />
                                <span className="text-sm">Hours</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={sections.visual.countdown.showMinutes}
                                  onChange={(e) =>
                                    setSections({
                                      ...sections,
                                      visual: {
                                        ...sections.visual,
                                        countdown: { ...sections.visual.countdown, showMinutes: e.target.checked },
                                      },
                                    })
                                  }
                                  className="rounded"
                                />
                                <span className="text-sm">Minutes</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={sections.visual.countdown.showSeconds}
                                  onChange={(e) =>
                                    setSections({
                                      ...sections,
                                      visual: {
                                        ...sections.visual,
                                        countdown: { ...sections.visual.countdown, showSeconds: e.target.checked },
                                      },
                                    })
                                  }
                                  className="rounded"
                                />
                                <span className="text-sm">Seconds</span>
                              </label>
                            </div>
                          </div>
                        </>
                      )}

                      {sections.visual.type === 'progress' && (
                        <div className="space-y-2">
                          <Label>Progress Bars</Label>
                          <p className="text-sm text-muted-foreground">
                            Progress bars feature coming soon. Use variables like {'{{current}}'} and {'{{max}}'} in your template.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              </TabsContent>

              {/* Support Section */}
              <TabsContent value="support">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Support Section</CardTitle>
                      <Button
                        variant={sections.support.enabled ? 'default' : 'outline'}
                        size="sm"
                        onClick={() =>
                          setSections({
                            ...sections,
                            support: { ...sections.support, enabled: !sections.support.enabled },
                          })
                        }
                      >
                        {sections.support.enabled ? 'Enabled' : 'Disabled'}
                      </Button>
                    </div>
                  </CardHeader>
                  {sections.support.enabled && (
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Support Title</Label>
                        <Input
                          value={sections.support.title}
                          onChange={(e) =>
                            setSections({
                              ...sections,
                              support: { ...sections.support, title: e.target.value },
                            })
                          }
                          placeholder="Need Help?"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Support Links</Label>
                        {sections.support.links.map((link, index) => (
                          <div key={index} className="grid grid-cols-2 gap-2">
                            <Input
                              value={link.label}
                              onChange={(e) => {
                                const newLinks = [...sections.support.links];
                                newLinks[index] = { ...newLinks[index], label: e.target.value };
                                setSections({
                                  ...sections,
                                  support: { ...sections.support, links: newLinks },
                                });
                              }}
                              placeholder="Help Center"
                            />
                            <Input
                              value={link.url}
                              onChange={(e) => {
                                const newLinks = [...sections.support.links];
                                newLinks[index] = { ...newLinks[index], url: e.target.value };
                                setSections({
                                  ...sections,
                                  support: { ...sections.support, links: newLinks },
                                });
                              }}
                              placeholder="https://help.example.com"
                            />
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setSections({
                              ...sections,
                              support: { 
                                ...sections.support, 
                                links: [...sections.support.links, { label: '', url: '' }] 
                              },
                            })
                          }
                        >
                          + Add Link
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </TabsContent>

              {/* Footer Section */}
              <TabsContent value="footer">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Footer Section</CardTitle>
                      <Button
                        variant={sections.footer.enabled ? 'default' : 'outline'}
                        size="sm"
                        onClick={() =>
                          setSections({
                            ...sections,
                            footer: { ...sections.footer, enabled: !sections.footer.enabled },
                          })
                        }
                      >
                        {sections.footer.enabled ? 'Enabled' : 'Disabled'}
                      </Button>
                    </div>
                  </CardHeader>
                  {sections.footer.enabled && (
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label>Tagline</Label>
                        <Input
                          value={sections.footer.tagline}
                          onChange={(e) =>
                            setSections({
                              ...sections,
                              footer: { ...sections.footer, tagline: e.target.value },
                            })
                          }
                          placeholder="Empowering your business"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Copyright</Label>
                        <Input
                          value={sections.footer.copyright}
                          onChange={(e) =>
                            setSections({
                              ...sections,
                              footer: { ...sections.footer, copyright: e.target.value },
                            })
                          }
                          placeholder="© 2025 Your Company"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Social Links (Optional)</Label>
                        {sections.footer.socialLinks.map((link: any, index: number) => (
                          <div key={index} className="grid grid-cols-2 gap-2">
                            <Select
                              value={link.platform || 'twitter'}
                              onValueChange={(value) => {
                                const newLinks = [...sections.footer.socialLinks];
                                newLinks[index] = { ...newLinks[index], platform: value };
                                setSections({
                                  ...sections,
                                  footer: { ...sections.footer, socialLinks: newLinks },
                                });
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="facebook">Facebook</SelectItem>
                                <SelectItem value="twitter">Twitter</SelectItem>
                                <SelectItem value="linkedin">LinkedIn</SelectItem>
                                <SelectItem value="instagram">Instagram</SelectItem>
                                <SelectItem value="youtube">YouTube</SelectItem>
                                <SelectItem value="github">GitHub</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input
                              value={link.url || ''}
                              onChange={(e) => {
                                const newLinks = [...sections.footer.socialLinks];
                                newLinks[index] = { ...newLinks[index], url: e.target.value };
                                setSections({
                                  ...sections,
                                  footer: { ...sections.footer, socialLinks: newLinks },
                                });
                              }}
                              placeholder="https://twitter.com/yourcompany"
                            />
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setSections({
                              ...sections,
                              footer: { 
                                ...sections.footer, 
                                socialLinks: [...sections.footer.socialLinks, { platform: 'twitter', url: '' }] 
                              },
                            })
                          }
                        >
                          + Add Social Link
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Label>Legal Links (Optional)</Label>
                        {sections.footer.legalLinks.map((link: any, index: number) => (
                          <div key={index} className="grid grid-cols-2 gap-2">
                            <Input
                              value={link.label || ''}
                              onChange={(e) => {
                                const newLinks = [...sections.footer.legalLinks];
                                newLinks[index] = { ...newLinks[index], label: e.target.value };
                                setSections({
                                  ...sections,
                                  footer: { ...sections.footer, legalLinks: newLinks },
                                });
                              }}
                              placeholder="Privacy Policy"
                            />
                            <Input
                              value={link.url || ''}
                              onChange={(e) => {
                                const newLinks = [...sections.footer.legalLinks];
                                newLinks[index] = { ...newLinks[index], url: e.target.value };
                                setSections({
                                  ...sections,
                                  footer: { ...sections.footer, legalLinks: newLinks },
                                });
                              }}
                              placeholder="https://example.com/privacy"
                            />
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setSections({
                              ...sections,
                              footer: { 
                                ...sections.footer, 
                                legalLinks: [...sections.footer.legalLinks, { label: '', url: '' }] 
                              },
                            })
                          }
                        >
                          + Add Legal Link
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right: Preview & Variables */}
          <div className="space-y-6">
            {/* Locale Manager */}
            {isEditing && (
              <LocaleManager
                currentLocale={currentLocale}
                availableLocales={availableLocales}
                onLocaleChange={handleLocaleChange}
                onCreateLocale={(locale) => createLocaleMutation.mutateAsync(locale)}
                onDeleteLocale={(locale) => deleteLocaleMutation.mutateAsync(locale)}
                isCreating={createLocaleMutation.isPending}
                isDeleting={deleteLocaleMutation.isPending}
              />
            )}

            {/* Live Preview Panel */}
            <PreviewPanel
              templateStructure={templateStructure}
              variables={variableValues}
              autoUpdate={true}
            />

            {/* Variables Panel */}
            <VariablesPanel
              templateKey={templateKey}
              templateStructure={templateStructure}
              onVariablesChange={setVariableValues}
            />
          </div>
        </div>
      </div>

      {/* Delete Template Dialog */}
      <DeleteTemplateDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => deleteTemplateMutation.mutateAsync()}
        templateKey={formData.key}
        templateName={formData.name}
        isDeleting={deleteTemplateMutation.isPending}
      />
    </div>
  );
}

