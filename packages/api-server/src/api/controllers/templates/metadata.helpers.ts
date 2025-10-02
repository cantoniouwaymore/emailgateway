/**
 * Helper functions for template metadata and documentation generation
 */

/**
 * Generate example variables from schema
 */
export function generateExampleVariables(variableSchema: any): Record<string, any> {
  const example: Record<string, any> = {};
  
  if (variableSchema?.properties) {
    for (const [key, schema] of Object.entries(variableSchema.properties)) {
      const fieldSchema = schema as any;
      if (fieldSchema.example) {
        example[key] = fieldSchema.example;
      } else if (fieldSchema.default !== undefined) {
        example[key] = fieldSchema.default;
      } else if (fieldSchema.type === 'string') {
        example[key] = `{{${key}}}`;
      } else if (fieldSchema.type === 'number') {
        example[key] = 0;
      } else if (fieldSchema.type === 'boolean') {
        example[key] = true;
      } else if (fieldSchema.type === 'object') {
        // Recursively generate example variables for nested objects
        example[key] = generateExampleVariables(fieldSchema);
        
        // Add specific examples for known object types
        if (key === 'primary' && example[key]) {
          example[key] = {
            label: "Update Payment Method",
            url: "https://app.waymore.io/billing/payment-methods",
            style: "solid",
            color: "#dc2626",
            text_color: "#ffffff"
          };
        } else if (key === 'secondary' && example[key]) {
          example[key] = {
            label: "Contact Support",
            url: "mailto:billing@waymore.io",
            style: "outline",
            color: "#6b7280",
            text_color: "#6b7280"
          };
        } else if (key === 'countdown' && example[key]) {
          // Use the schema defaults for countdown instead of hardcoded values
          example[key] = generateExampleVariables(fieldSchema);
        }
      } else if (fieldSchema.type === 'array') {
        // Generate example content for arrays based on the field name
        example[key] = getExampleArray(key);
      }
    }
  }
  
  return example;
}

/**
 * Get example array based on field name
 */
function getExampleArray(key: string): any[] {
  const examples: Record<string, any[]> = {
    'paragraphs': [
      "Your payment has failed and requires immediate attention.",
      "We were unable to process your payment for the Pro plan subscription.",
      "Please update your payment method to avoid service interruption."
    ],
    'facts': [
      {"label": "Transaction ID", "value": "TXN-12345"},
      {"label": "Amount", "value": "$29.99"},
      {"label": "Plan", "value": "Pro Monthly"}
    ],
    'links': [
      {"label": "Payment FAQ", "url": "https://waymore.io/payment-faq"},
      {"label": "Contact Support", "url": "https://waymore.io/support"}
    ],
    'progress_bars': [
      {
        "label": "Account Status",
        "current": 7,
        "max": 7,
        "unit": "days",
        "percentage": 100,
        "color": "#ef4444",
        "description": "Grace period remaining"
      }
    ],
    'social_links': [
      {"platform": "twitter", "url": "https://twitter.com/waymore"},
      {"platform": "linkedin", "url": "https://linkedin.com/company/waymore"}
    ],
    'legal_links': [
      {"label": "Privacy Policy", "url": "https://waymore.io/privacy"},
      {"label": "Terms of Service", "url": "https://waymore.io/terms"}
    ]
  };

  return examples[key] || [];
}

/**
 * Extract required variables from schema
 */
export function extractRequiredVariables(schema: any): any[] {
  if (!schema?.required) return [];
  
  return schema.required.map((field: string) => {
    const fieldSchema = schema.properties?.[field];
    return {
      name: field,
      type: fieldSchema?.type || 'string',
      description: fieldSchema?.description || '',
      example: fieldSchema?.example || ''
    };
  });
}

/**
 * Extract optional variables from schema
 */
export function extractOptionalVariables(schema: any): any[] {
  if (!schema?.properties) return [];
  
  const required = schema.required || [];
  return Object.entries(schema.properties)
    .filter(([key]) => !required.includes(key))
    .map(([key, fieldSchema]) => {
      const field = fieldSchema as any;
      return {
        name: key,
        type: field.type || 'string',
        description: field.description || '',
        example: field.example || ''
      };
    });
}

/**
 * Extract sections from template structure
 */
export function extractSections(jsonStructure: any): any[] {
  if (!jsonStructure || typeof jsonStructure !== 'object') return [];
  
  return Object.entries(jsonStructure).map(([key, value]) => ({
    name: key,
    type: typeof value,
    description: getSectionDescription(key),
    required: false
  }));
}

/**
 * Get section description
 */
function getSectionDescription(sectionName: string): string {
  const descriptions: Record<string, string> = {
    header: 'Header section with logo and tagline',
    hero: 'Hero section with image or icon',
    title: 'Email title section',
    body: 'Main body content with paragraphs',
    snapshot: 'Facts/summary table section',
    visual: 'Visual elements like progress bars or countdowns',
    actions: 'Call-to-action buttons',
    support: 'Support links and FAQ',
    footer: 'Footer with social links and legal information',
    theme: 'Complete theme customization'
  };
  
  return descriptions[sectionName] || 'Template section';
}

/**
 * Generate template documentation
 */
export function generateTemplateDocumentation(template: any): any {
  return {
    overview: template.description || `Template: ${template.name}`,
    requiredVariables: extractRequiredVariables(template.variableSchema),
    optionalVariables: extractOptionalVariables(template.variableSchema),
    examples: [
      {
        name: 'Basic Example',
        variables: generateExampleVariables(template.variableSchema)
      },
      {
        name: 'Full Featured Example',
        variables: {
          ...generateExampleVariables(template.variableSchema),
          header: {
            logo_url: 'https://example.com/logo.png',
            tagline: 'Your Company Tagline'
          },
          title: {
            text: 'Welcome to {{workspace_name}}!',
            color: '#1f2937'
          },
          body: {
            paragraphs: [
              'Hello {{user_firstname}}, welcome to {{workspace_name}}!',
              'Your account is ready to use.'
            ]
          }
        }
      }
    ],
    sections: extractSections(template.jsonStructure)
  };
}

