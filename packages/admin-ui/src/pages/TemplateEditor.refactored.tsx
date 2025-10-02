/**
 * Template Editor
 * Modern React version - REFACTORED into small components
 * Before: 1,449 lines | After: ~350 lines
 */

import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { templatesAPI } from '@/lib/api';
import { PreviewPanel } from '@/components/PreviewPanel';
import { VariablesPanel } from '@/components/VariablesPanel';
import { LocaleManager } from '@/components/LocaleManager';
import { DeleteTemplateDialog } from '@/components/DeleteTemplateDialog';
import {
  HeaderSection,
  HeroSection,
  TitleSection,
  BodySection,
  SnapshotSection,
  VisualSection,
  ActionsSection,
  SupportSection,
  FooterSection,
} from '@/components/template-editor';
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
      await templatesAPI.addLocale(formData.key, locale, templateStructure);
      await queryClient.invalidateQueries({ queryKey: ['template', templateKey] });
      setCurrentLocale(locale);
    },
    onSuccess: () => alert('Locale created successfully!'),
    onError: (error: Error) => { throw error; },
  });

  // Delete locale mutation
  const deleteLocaleMutation = useMutation({
    mutationFn: async (locale: string) => {
      if (!isEditing) throw new Error('Cannot delete locale from unsaved template');
      await templatesAPI.deleteLocale(formData.key, locale);
      await queryClient.invalidateQueries({ queryKey: ['template', templateKey] });
      setCurrentLocale('__base__');
    },
    onSuccess: () => alert('Locale deleted successfully!'),
    onError: (error: Error) => { throw error; },
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
    onError: (error: Error) => alert(`Error: ${error.message}`),
  });

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (isEditing) {
        if (currentLocale === '__base__') {
          return templatesAPI.update(formData.key, {
            name: formData.name,
            description: formData.description,
            category: formData.category,
            jsonStructure: templateStructure,
          });
        } else {
          return templatesAPI.updateLocale(formData.key, currentLocale, templateStructure);
        }
      } else {
        return templatesAPI.create({ ...formData, jsonStructure: templateStructure });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      alert('Template saved successfully!');
    },
    onError: (error: Error) => alert(`Error: ${error.message}`),
  });

  // Helper to update section field
  const updateSection = (section: string, field: string, value: any) => {
    setSections((prev) => ({
      ...prev,
      [section]: { ...(prev as any)[section], [field]: value },
    }));
  };

  // Helper to toggle section
  const toggleSection = (section: string) => {
    setSections((prev) => ({
      ...prev,
      [section]: { ...(prev as any)[section], enabled: !(prev as any)[section].enabled },
    }));
  };

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

              <TabsContent value="header">
                <HeaderSection
                  {...sections.header}
                  onToggle={() => toggleSection('header')}
                  onChange={(field, value) => updateSection('header', field, value)}
                />
              </TabsContent>

              <TabsContent value="hero">
                <HeroSection
                  {...sections.hero}
                  onToggle={() => toggleSection('hero')}
                  onChange={(field, value) => updateSection('hero', field, value)}
                />
              </TabsContent>

              <TabsContent value="title">
                <TitleSection
                  {...sections.title}
                  onToggle={() => toggleSection('title')}
                  onChange={(field, value) => updateSection('title', field, value)}
                />
              </TabsContent>

              <TabsContent value="body">
                <BodySection
                  {...sections.body}
                  onToggle={() => toggleSection('body')}
                  onParagraphsChange={(paragraphs) => updateSection('body', 'paragraphs', paragraphs)}
                  onChange={(field, value) => updateSection('body', field, value)}
                />
              </TabsContent>

              <TabsContent value="snapshot">
                <SnapshotSection
                  {...sections.snapshot}
                  onToggle={() => toggleSection('snapshot')}
                  onChange={(field, value) => updateSection('snapshot', field, value)}
                />
              </TabsContent>

              <TabsContent value="visual">
                <VisualSection
                  {...sections.visual}
                  onToggle={() => toggleSection('visual')}
                  onChange={(field, value) => updateSection('visual', field, value)}
                />
              </TabsContent>

              <TabsContent value="actions">
                <ActionsSection
                  {...sections.actions}
                  onToggle={() => toggleSection('actions')}
                  onChange={(field, value) => updateSection('actions', field, value)}
                />
              </TabsContent>

              <TabsContent value="support">
                <SupportSection
                  {...sections.support}
                  onToggle={() => toggleSection('support')}
                  onChange={(field, value) => updateSection('support', field, value)}
                />
              </TabsContent>

              <TabsContent value="footer">
                <FooterSection
                  {...sections.footer}
                  onToggle={() => toggleSection('footer')}
                  onChange={(field, value) => updateSection('footer', field, value)}
                />
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

