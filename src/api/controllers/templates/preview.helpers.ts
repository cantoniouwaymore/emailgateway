/**
 * Helper functions for template preview generation
 */

/**
 * Generate template placeholders for preview
 */
export function generateTemplatePlaceholders(variableSchema: any): Record<string, any> {
  const placeholders: Record<string, any> = {};
  
  if (variableSchema?.properties) {
    for (const [key, schema] of Object.entries(variableSchema.properties)) {
      const fieldSchema = schema as any;
      
      if (fieldSchema.type === 'string') {
        placeholders[key] = getDemonstrationValue(key, 'string');
      } else if (fieldSchema.type === 'number') {
        placeholders[key] = getDemonstrationValue(key, 'number');
      } else if (fieldSchema.type === 'boolean') {
        placeholders[key] = getDemonstrationValue(key, 'boolean');
      } else if (fieldSchema.type === 'object') {
        // Recursively generate placeholders for nested objects
        placeholders[key] = generateTemplatePlaceholders(fieldSchema);
      } else if (fieldSchema.type === 'array') {
        // Generate demonstration values for arrays
        placeholders[key] = getDemonstrationArray(key);
      }
    }
  }
  
  return placeholders;
}

/**
 * Get demonstration value for a field
 */
export function getDemonstrationValue(key: string, type: string): any {
  // Create meaningful demonstration values that show what the template can do
  const demonstrations: Record<string, any> = {
    // Header values
    'logo_url': 'https://example.com/your-logo.png',
    'logo_alt': 'Your Company Logo',
    'tagline': 'Your Company Tagline',
    
    // Title values
    'text': 'Your Email Title Here',
    'size': '32px',
    'weight': '700',
    'title_color': '#1f2937',
    'align': 'center',
    
    // Body values
    'font_size': '16px',
    'line_height': '26px',
    'body_color': '#374151',
    
    // Button values
    'label': 'Your Button Text',
    'url': 'https://example.com/your-link',
    'style': 'button',
    'button_color': '#3b82f6',
    'text_color': '#ffffff',
    
    // Snapshot values
    'snapshot_title': 'Your Section Title',
    'snapshot_style': 'table',
    
    // Countdown values
    'message': 'Your Countdown Message',
    'target_date': new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    'show_days': true,
    'show_hours': true,
    'show_minutes': true,
    'show_seconds': false,
    
    // Support values
    'support_title': 'Need Help?',
    
    // Footer values
    'width': '120px',
    'alt': 'Your Company Logo',
    'footer_tagline': 'Your Company Tagline',
    'copyright': '© 2024 Your Company. All rights reserved.',
    
    // Theme values
    'font_family': "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    'theme_font_size': '16px',
    'theme_text_color': '#374151',
    'heading_color': '#1f2937',
    'background_color': '#ffffff',
    'body_background': '#f8fafc',
    'border_color': '#e5e7eb',
    'muted_text_color': '#6b7280',
    'primary_button_color': '#3b82f6',
    'primary_button_text_color': '#ffffff',
    'secondary_button_color': '#6b7280',
    'secondary_button_text_color': '#ffffff'
  };

  if (demonstrations[key]) {
    return demonstrations[key];
  }

  // Fallback based on type
  switch (type) {
    case 'string':
      return `Your ${key.replace(/_/g, ' ')} here`;
    case 'number':
      return 0;
    case 'boolean':
      return true;
    default:
      return `{{${key}}}`;
  }
}

/**
 * Get demonstration array for a field
 */
export function getDemonstrationArray(key: string): any[] {
  const arrayDemonstrations: Record<string, any[]> = {
    'paragraphs': [
      'This is your first paragraph. Replace this with your actual content.',
      'This is your second paragraph. You can customize the text, styling, and layout.',
      'Add as many paragraphs as needed to tell your story effectively.'
    ],
    'facts': [
      { label: 'Feature 1', value: 'Your Value Here' },
      { label: 'Feature 2', value: 'Another Value' },
      { label: 'Feature 3', value: 'Third Value' }
    ],
    'links': [
      { label: 'Documentation', url: 'https://example.com/docs' },
      { label: 'Support', url: 'https://example.com/support' },
      { label: 'Contact', url: 'mailto:support@example.com' }
    ],
    'social_links': [
      { platform: 'twitter', url: 'https://twitter.com/yourcompany' },
      { platform: 'linkedin', url: 'https://linkedin.com/company/yourcompany' },
      { platform: 'facebook', url: 'https://facebook.com/yourcompany' }
    ],
    'legal_links': [
      { label: 'Privacy Policy', url: 'https://example.com/privacy' },
      { label: 'Terms of Service', url: 'https://example.com/terms' },
      { label: 'Unsubscribe', url: 'https://example.com/unsubscribe' }
    ],
    'progress_bars': [
      {
        label: 'Project Progress',
        current: 75,
        max: 100,
        unit: '%',
        percentage: 75,
        color: '#10b981',
        description: '75% complete'
      }
    ]
  };

  return arrayDemonstrations[key] || [
    { label: 'Item 1', value: 'Value 1' },
    { label: 'Item 2', value: 'Value 2' }
  ];
}

