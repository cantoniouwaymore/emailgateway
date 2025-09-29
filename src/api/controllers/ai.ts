import { FastifyRequest, FastifyReply } from 'fastify';
import OpenAI from 'openai';
import { verifyJWT, extractTokenFromRequest, requireScope } from '../../utils/auth';
import { logger, createTraceId } from '../../utils/logger';
import { VectorStore } from '../../services/vector-store';

interface GenerateTemplateRequest {
  description: string;
  workspaceName: string;
  productName: string;
  userName: string;
}

interface GenerateTemplateResponse {
  template: {
    template: {
      key: string;
      locale: string;
    };
    variables: {
      workspace_name: string;
      user_firstname: string;
      product_name: string;
      support_email: string;
      email_title: string;
      custom_content?: string;
      facts?: Array<{ label: string; value: string }>;
      cta_primary?: { label: string; url: string };
      cta_secondary?: { label: string; url: string };
      social_links?: Array<{ platform: string; url: string }>;
      theme?: Record<string, string>;
    };
  };
}

export class AIController {
  private openai: OpenAI | null = null;
  private vectorStore: VectorStore | null = null;

  constructor() {
    // Initialize OpenAI client if API key is available
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey && apiKey !== 'your-openai-api-key') {
      this.openai = new OpenAI({
        apiKey: apiKey,
      });
      this.vectorStore = new VectorStore();
    }
  }

  async initialize(): Promise<void> {
    if (this.vectorStore) {
      try {
        await this.vectorStore.initialize();
      } catch (error) {
        logger.warn({ error: error instanceof Error ? error.message : 'Unknown error' }, 'Vector store initialization failed, continuing without RAG');
        this.vectorStore = null;
      }
    }
  }

  async generateTemplate(request: FastifyRequest<{ Body: GenerateTemplateRequest }>, reply: FastifyReply): Promise<GenerateTemplateResponse> {
    const traceId = createTraceId();

    try {
      // Extract and verify JWT
      const token = extractTokenFromRequest(request);
      const payload = verifyJWT(token);
      requireScope('emails:send')(payload);

      const { description, workspaceName, productName, userName } = request.body;

      if (!description || !workspaceName || !productName || !userName) {
        reply.code(400);
        return {
          error: {
            code: 'MISSING_REQUIRED_FIELDS',
            message: 'Description, workspace name, product name, and user name are required',
            traceId
          }
        } as any;
      }

      // Generate template using AI
      const template = await this.generateTemplateFromDescription(description, workspaceName, productName, userName);

      logger.info({
        traceId,
        description,
        workspaceName,
        productName,
        userName
      }, 'AI template generated successfully');

      return { template };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      logger.error({
        traceId,
        error: errorMessage
      }, 'AI template generation failed');

      if (errorMessage.includes('JWT') || errorMessage.includes('scope')) {
        reply.code(401);
        return {
          error: {
            code: 'UNAUTHORIZED',
            message: 'Invalid or insufficient permissions',
            traceId
          }
        } as any;
      }

      reply.code(500);
      return {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error',
          traceId
        }
      } as any;
    }
  }

  private async generateTemplateFromDescription(
    description: string, 
    workspaceName: string, 
    productName: string, 
    userName: string
  ): Promise<GenerateTemplateResponse['template']> {
    // Use OpenAI if available, otherwise fall back to pattern-based generation
    if (this.openai) {
      return await this.generateWithOpenAI(description, workspaceName, productName, userName);
    } else {
      return await this.generateWithPatterns(description, workspaceName, productName, userName);
    }
  }

  private async generateWithOpenAI(
    description: string, 
    workspaceName: string, 
    productName: string, 
    userName: string
  ): Promise<GenerateTemplateResponse['template']> {
    try {
      // Search for relevant documentation chunks using RAG
      let relevantContext = '';
      if (this.vectorStore) {
        const searchQuery = `${description} ${workspaceName} ${productName} email template`;
        const relevantChunks = await this.vectorStore.search(searchQuery, 3);
        
        if (relevantChunks.length > 0) {
          relevantContext = '\n\n## RELEVANT DOCUMENTATION:\n' + 
            relevantChunks.map(chunk => `### ${chunk.metadata.section}\n${chunk.content}`).join('\n\n');
        }
      }

      const systemPrompt = `You are an expert email template generator for the Waymore Transactional Email System. Generate JSON templates that follow the EXACT object-based structure documented in the Waymore Transactional Template Guide.

## TEMPLATE STRUCTURE (REQUIRED)
{
  "template": {
    "key": "transactional",
    "locale": "en"
  },
  "variables": {
    "header": {
      "logo_url": "string" (optional - company logo URL, PNG/JPG only),
      "logo_alt": "string" (optional - logo alt text),
      "tagline": "string" (optional - company tagline)
    },
    "hero": {
      "type": "none|icon|image" (optional - hero section type),
      "icon": "string" (optional - emoji or icon, e.g., "🚀"),
      "icon_size": "string" (optional - e.g., "48px"),
      "image_url": "string" (optional - hero image URL, PNG/JPG only),
      "image_alt": "string" (optional - image alt text)
    },
    "title": {
      "text": "string" (optional - main email heading),
      "size": "string" (optional - e.g., "28px"),
      "weight": "string" (optional - e.g., "700"),
      "color": "string" (optional - hex color, e.g., "#1f2937"),
      "align": "string" (optional - e.g., "center")
    },
    "body": {
      "paragraphs": ["string"] (optional - array of paragraph text),
      "font_size": "string" (optional - e.g., "16px"),
      "line_height": "string" (optional - e.g., "26px")
    },
    "snapshot": {
      "title": "string" (optional - facts section title),
      "facts": [{"label": "string", "value": "string"}] (optional - key-value data, 2-4 items max),
      "style": "table|cards|list" (optional - display style)
    },
    "visual": {
      "type": "none|progress|countdown|badge" (optional - visual element type),
      "progress_bars": [{"label": "string", "current": number, "total": number, "color": "string"}] (optional - progress bars),
      "countdown": {"message": "string", "target_date": "string", "show_days": boolean, "show_hours": boolean} (optional - countdown timer)
    },
    "actions": {
      "primary": {"label": "string", "url": "string", "style": "button|link", "color": "string", "text_color": "string"} (optional - primary button),
      "secondary": {"label": "string", "url": "string", "style": "button|link", "color": "string", "text_color": "string"} (optional - secondary button)
    },
    "support": {
      "title": "string" (optional - support section title),
      "links": [{"label": "string", "url": "string"}] (optional - support links)
    },
    "footer": {
      "tagline": "string" (optional - footer tagline),
      "social_links": [{"platform": "twitter|linkedin|github|facebook|instagram", "url": "string"}] (optional - social media links, 2-4 platforms max),
      "legal_links": [{"label": "string", "url": "string"}] (optional - legal links),
      "copyright": "string" (optional - copyright text)
    },
    "theme": {
      "font_family": "string" (optional - e.g., "'Inter', 'Helvetica Neue', Arial, sans-serif"),
      "font_size": "string" (optional - e.g., "16px"),
      "text_color": "string" (optional - hex color, e.g., "#2c3e50"),
      "heading_color": "string" (optional - hex color, e.g., "#1a1a1a"),
      "background_color": "string" (optional - hex color, e.g., "#ffffff"),
      "body_background": "string" (optional - hex color, e.g., "#f4f4f4"),
      "muted_text_color": "string" (optional - hex color, e.g., "#888888"),
      "border_color": "string" (optional - hex color, e.g., "#e0e0e0"),
      "primary_button_color": "string" (optional - hex color, e.g., "#007bff"),
      "primary_button_text_color": "string" (optional - hex color, e.g., "#ffffff"),
      "secondary_button_color": "string" (optional - hex color, e.g., "#6c757d"),
      "secondary_button_text_color": "string" (optional - hex color, e.g., "#ffffff")
    }
  }
}

## WAYMORE TEMPLATE FEATURES (from documentation)

### Visual Features
- Dynamic Logo: Custom logo in header section (header.logo_url + header.logo_alt)
- Hero Section: Icon or image hero elements (hero.type, hero.icon, hero.image_url)
- Multi-Button Layout: Primary and secondary action buttons (actions.primary + actions.secondary)
- Social Media Links: Built-in social media integration (footer.social_links array)
- Facts Table: Structured data display (snapshot.facts array)
- Progress Bars: Visual progress indicators (visual.progress_bars array)
- Countdown Timers: Time-sensitive countdown displays (visual.countdown object)
- Custom Themes: Complete visual customization (theme object)

### Content Features
- Structured Sections: Organized content sections (header, hero, title, body, snapshot, visual, actions, support, footer)
- Dynamic Headings: Customizable email titles (title.text)
- Paragraph Content: Multi-paragraph body text (body.paragraphs array)
- Personalization: User-specific content throughout all sections

## EMAIL TYPE PATTERNS

### Welcome Emails
- Title: "Welcome to [Product]!"
- Body: Account setup, getting started steps
- Actions: "Get Started", "View Dashboard"
- Theme: Blue/primary brand colors

### Order Confirmations
- Title: "Order Confirmation - #[ORDER_ID]"
- Body: Thank you message, order details
- Snapshot: Order ID, Items, Delivery Date, Status
- Actions: "Track Order", "View Details"
- Theme: Soft pastel colors

### Payment Emails
- Title: "Payment Successful - Receipt #[ID]"
- Body: Transaction confirmation
- Snapshot: Transaction ID, Amount, Date, Status
- Actions: "Download Receipt", "View Account"
- Theme: Green success colors

### Password Reset
- Title: "Reset Your Password"
- Body: Security instructions, reset link
- Actions: "Reset Password"
- Theme: Orange/alert colors

### Reports/Analytics
- Title: "Your [Period] Report"
- Body: Data summary, insights
- Snapshot: Metrics, percentages, counts
- Actions: "View Full Report", "Export Data"
- Theme: Blue/info colors

## IMAGE GUIDELINES (from documentation)
- Use PNG/JPG images only (NO SVG - poor email client support)
- Good sources: Unsplash (https://images.unsplash.com), Pexels
- Use descriptive alt text for accessibility
- Choose professional, business-appropriate imagery
- Examples: company logos, product screenshots, success icons, welcome graphics
- For logos: simple, clean designs that work in emails
- For illustrations: professional, business-appropriate imagery
- Ensure images are publicly accessible

## BEST PRACTICES (from documentation)

### DO's
1. Use structured sections (header, hero, title, body, snapshot, visual, actions, support, footer)
2. Use PNG/JPG images for better email client compatibility
3. Provide meaningful content in each section
4. Use consistent branding with theme colors
5. Use realistic URLs and data
6. Keep sections focused and relevant
7. Use appropriate icons and colors for email type

### DON'Ts
1. Don't use SVG images (poor email client support)
2. Don't use external CSS (email clients strip external stylesheets)
3. Don't use complex layouts (keep it simple for compatibility)
4. Don't forget alt text (important for accessibility)
5. Don't use too many buttons (max 2 buttons for better UX)
6. Don't use long URLs (shorten URLs for better display)
7. Don't use too many social links (3-5 links maximum)

## COLOR SCHEMES BY EMAIL TYPE
- Success/Payment: Green (#28a745, #2ecc71)
- Info/Reports: Blue (#007bff, #3498db)
- Alerts/Warnings: Orange (#fd7e14, #f39c12)
- Order/Shipping: Soft pastels (#6c5ce7, #a29bfe)
- Welcome/Onboarding: Primary brand colors

## EXAMPLE TEMPLATES (from documentation)

### Basic Welcome Email
{
  "template": {"key": "transactional", "locale": "en"},
  "variables": {
    "header": {
      "logo_url": "https://i.ibb.co/8LfvqPk7/Waymore-logo-Colour.png",
      "logo_alt": "Waymore",
      "tagline": "Empowering your business"
    },
    "title": {
      "text": "Welcome to Waymore!",
      "size": "28px",
      "weight": "700",
      "color": "#1f2937",
      "align": "center"
    },
    "body": {
      "paragraphs": [
        "Hello John, welcome to Waymore Platform!",
        "Your account is ready to use. Here are some tips to get started:",
        "• Explore your dashboard\n• Set up your profile\n• Connect your first integration"
      ]
    },
    "actions": {
      "primary": {
        "label": "Get Started",
        "url": "https://app.waymore.io/dashboard",
        "style": "button",
        "color": "#3b82f6",
        "text_color": "#ffffff"
      }
    },
    "footer": {
      "tagline": "Empowering your business",
      "social_links": [
        {"platform": "twitter", "url": "https://twitter.com/waymore"},
        {"platform": "linkedin", "url": "https://linkedin.com/company/waymore"}
      ],
      "copyright": "© 2024 Waymore Technologies Inc. All rights reserved."
    }
  }
}

### Themed Email with Facts
{
  "template": {"key": "transactional", "locale": "en"},
  "variables": {
    "header": {
      "logo_url": "https://i.ibb.co/8LfvqPk7/Waymore-logo-Colour.png",
      "logo_alt": "Waymore"
    },
    "title": {
      "text": "Your Monthly Report",
      "size": "28px",
      "weight": "700",
      "color": "#1f2937",
      "align": "center"
    },
    "body": {
      "paragraphs": [
        "Hello John, here's your monthly activity summary.",
        "You've been making great progress with your email campaigns."
      ]
    },
    "snapshot": {
      "title": "Monthly Statistics",
      "facts": [
        {"label": "Emails Sent", "value": "1,247"},
        {"label": "Open Rate", "value": "23.4%"},
        {"label": "Click Rate", "value": "5.2%"}
      ],
      "style": "table"
    },
    "actions": {
      "primary": {
        "label": "View Full Report",
        "url": "https://app.waymore.io/reports",
        "style": "button",
        "color": "#28a745",
        "text_color": "#ffffff"
      }
    },
    "theme": {
      "font_family": "'Inter', 'Helvetica Neue', Arial, sans-serif",
      "text_color": "#2c3e50",
      "heading_color": "#1a1a1a",
      "primary_button_color": "#28a745",
      "background_color": "#f8f9fa"
    }
  }
}

### Social Media Email
{
  "template": {"key": "transactional", "locale": "en"},
  "variables": {
    "header": {
      "logo_url": "https://i.ibb.co/8LfvqPk7/Waymore-logo-Colour.png",
      "logo_alt": "Waymore"
    },
    "title": {
      "text": "Follow Us for Updates",
      "size": "28px",
      "weight": "700",
      "color": "#1f2937",
      "align": "center"
    },
    "body": {
      "paragraphs": [
        "Hello John, stay connected with us on social media for the latest updates and news.",
        "Follow us for tips, insights, and exclusive content."
      ]
    },
    "footer": {
      "tagline": "Empowering your business",
      "social_links": [
        {"platform": "twitter", "url": "https://twitter.com/waymore"},
        {"platform": "linkedin", "url": "https://linkedin.com/company/waymore"},
        {"platform": "github", "url": "https://github.com/waymore"}
      ],
      "copyright": "© 2024 Waymore Technologies Inc. All rights reserved."
    }
  }
}

## CRITICAL REQUIREMENTS
1. ALWAYS use object-based structure with structured sections (header, hero, title, body, snapshot, visual, actions, support, footer)
2. Generate appropriate content for each section based on email type
3. Use meaningful facts in snapshot section (2-4 items max)
4. Add relevant actions based on email purpose (1-2 buttons max)
5. Include social links in footer for engagement emails (2-4 platforms max)
6. Apply theme customization for branded emails
7. Use realistic URLs and professional content
8. Follow color schemes based on email type
9. Use public PNG/JPG images when requested
10. Return ONLY valid JSON, no explanations or markdown formatting${relevantContext}`;

      const userPrompt = `Generate a transactional email template for:
- Description: ${description}
- Workspace: ${workspaceName}
- Product: ${productName}
- User: ${userName}

Create an appropriate email template with relevant content, facts, and CTAs based on the description.`;

      const completion = await this.openai!.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS || '2000'),
        temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      // Parse the JSON response
      const template = JSON.parse(response);
      
      // Validate and ensure required fields
      if (!template.template || !template.variables) {
        throw new Error('Invalid template structure from AI');
      }

      // Ensure required variables are present in object-based structure
      if (!template.variables.header) template.variables.header = {};
      if (!template.variables.title) template.variables.title = {};
      if (!template.variables.body) template.variables.body = {};
      if (!template.variables.footer) template.variables.footer = {};
      
      // Set default values for key sections
      template.variables.header.logo_alt = workspaceName;
      template.variables.title.text = template.variables.title.text || `Welcome to ${workspaceName}!`;
      template.variables.footer.tagline = `Empowering your business`;

      return template;

    } catch (error) {
      logger.error({
        error: error instanceof Error ? error.message : 'Unknown error',
        description,
        workspaceName,
        productName,
        userName
      }, 'OpenAI template generation failed, falling back to pattern-based generation');

      // Fall back to pattern-based generation
      return await this.generateWithPatterns(description, workspaceName, productName, userName);
    }
  }

  private async generateWithPatterns(
    description: string, 
    workspaceName: string, 
    productName: string, 
    userName: string
  ): Promise<GenerateTemplateResponse['template']> {
    // Fallback pattern-based generation (original logic)
    const lowerDescription = description.toLowerCase();
    
    // Determine email type and generate appropriate content
    let emailTitle = 'Welcome to ' + productName + '!';
    let customContent = `Hello ${userName},<br><br>Welcome to ${productName}!`;
    let facts: Array<{ label: string; value: string }> = [];
    let ctaPrimary: { label: string; url: string } | undefined;
    let ctaSecondary: { label: string; url: string } | undefined;
    let socialLinks: Array<{ platform: string; url: string }> | undefined;

    // Welcome/Onboarding emails
    if (lowerDescription.includes('welcome') || lowerDescription.includes('onboard')) {
      emailTitle = `Welcome to ${productName}!`;
      customContent = `Hello ${userName},<br><br>🎉 <strong>Welcome to ${productName}!</strong><br><br>We're excited to have you on board. Here are some quick tips to get you started:<br><br>• <strong>Explore the dashboard</strong> to see your workspace overview<br>• <strong>Invite team members</strong> to collaborate on your projects<br>• <strong>Check out our documentation</strong> for detailed guides<br><br>If you have any questions, don't hesitate to reach out to our support team.`;
      
      facts = [
        { label: 'Account Type', value: 'Pro Plan' },
        { label: 'Workspace', value: workspaceName },
        { label: 'Setup Status', value: 'Complete' }
      ];
      
      ctaPrimary = {
        label: 'Get Started',
        url: 'https://app.waymore.io/dashboard'
      };
      
      ctaSecondary = {
        label: 'View Documentation',
        url: 'https://docs.waymore.io'
      };
    }
    
    // Order confirmation emails
    else if (lowerDescription.includes('order') || lowerDescription.includes('confirmation') || lowerDescription.includes('shipped') || lowerDescription.includes('delivery')) {
      emailTitle = 'Order Confirmation - #ORD-2024-001';
      customContent = `Hello ${userName},<br><br>🎉 <strong>Thank you for your purchase!</strong><br><br>Your order has been confirmed and is being prepared for shipment. We'll send you a tracking number once your order ships.<br><br>Here are your order details:`;
      
      facts = [
        { label: 'Order ID', value: '#ORD-2024-001' },
        { label: 'Items', value: '2 items' },
        { label: 'Estimated Delivery', value: '3-5 business days' },
        { label: 'Status', value: 'Processing' }
      ];
      
      ctaPrimary = {
        label: 'Track Order',
        url: 'https://app.waymore.io/track/ORD-2024-001'
      };
      
      ctaSecondary = {
        label: 'View Order Details',
        url: 'https://app.waymore.io/orders/ORD-2024-001'
      };
    }
    
    // Payment/Transaction emails
    else if (lowerDescription.includes('payment') || lowerDescription.includes('transaction') || lowerDescription.includes('receipt')) {
      emailTitle = 'Payment Successful - Receipt #12345';
      customContent = `Hello ${userName},<br><br>✅ <strong>Payment Successful!</strong><br><br>Thank you for your payment. Your transaction has been processed successfully.<br><br>You can download your receipt and view your account details below.`;
      
      facts = [
        { label: 'Transaction ID', value: '#12345' },
        { label: 'Amount', value: '$99.00' },
        { label: 'Date', value: new Date().toLocaleDateString() },
        { label: 'Status', value: 'Completed' }
      ];
      
      ctaPrimary = {
        label: 'Download Receipt',
        url: 'https://app.waymore.io/receipt/12345'
      };
      
      ctaSecondary = {
        label: 'View Account',
        url: 'https://app.waymore.io/account'
      };
    }
    
    // Password reset emails
    else if (lowerDescription.includes('password') || lowerDescription.includes('reset') || lowerDescription.includes('security')) {
      emailTitle = 'Reset Your Password';
      customContent = `Hello ${userName},<br><br>🔐 <strong>Password Reset Request</strong><br><br>We received a request to reset your password for your ${productName} account.<br><br>Click the button below to reset your password. This link will expire in 24 hours for security reasons.<br><br>If you didn't request this password reset, please ignore this email.`;
      
      ctaPrimary = {
        label: 'Reset Password',
        url: 'https://app.waymore.io/reset-password?token=abc123'
      };
    }
    
    // Report/Analytics emails
    else if (lowerDescription.includes('report') || lowerDescription.includes('analytics') || lowerDescription.includes('metrics')) {
      emailTitle = 'Your Monthly Report - ' + new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      customContent = `Hello ${userName},<br><br>📊 <strong>Your Monthly Report</strong><br><br>Here's a summary of your activity and key metrics for this month.<br><br>Keep up the great work!`;
      
      facts = [
        { label: 'Emails Sent', value: '1,247' },
        { label: 'Open Rate', value: '23.4%' },
        { label: 'Click Rate', value: '5.2%' },
        { label: 'New Users', value: '89' }
      ];
      
      ctaPrimary = {
        label: 'View Full Report',
        url: 'https://app.waymore.io/reports'
      };
      
      ctaSecondary = {
        label: 'Export Data',
        url: 'https://app.waymore.io/export'
      };
    }
    
    // Notification/Alert emails
    else if (lowerDescription.includes('notification') || lowerDescription.includes('alert') || lowerDescription.includes('reminder')) {
      emailTitle = 'Important Update';
      customContent = `Hello ${userName},<br><br>🔔 <strong>Important Update</strong><br><br>We have an important update regarding your ${productName} account.<br><br>Please review the information below and take any necessary action.`;
      
      facts = [
        { label: 'Update Type', value: 'Account Status' },
        { label: 'Priority', value: 'High' },
        { label: 'Action Required', value: 'Yes' }
      ];
      
      ctaPrimary = {
        label: 'View Details',
        url: 'https://app.waymore.io/notifications'
      };
    }
    
    // Social media emails
    else if (lowerDescription.includes('social') || lowerDescription.includes('follow') || lowerDescription.includes('connect')) {
      emailTitle = 'Follow Us for Updates';
      customContent = `Hello ${userName},<br><br>📱 <strong>Stay Connected</strong><br><br>Follow us on social media for the latest updates, news, and community discussions.<br><br>Join our growing community and never miss an update!`;
      
      socialLinks = [
        { platform: 'twitter', url: 'https://twitter.com/waymore_io' },
        { platform: 'linkedin', url: 'https://linkedin.com/company/waymore' },
        { platform: 'github', url: 'https://github.com/waymore' }
      ];
      
      ctaPrimary = {
        label: 'Follow Us',
        url: 'https://twitter.com/waymore_io'
      };
    }
    
    // Default/Generic email
    else {
      emailTitle = 'Update from ' + productName;
      customContent = `Hello ${userName},<br><br>We have an update for you regarding your ${productName} account.<br><br>Thank you for being a valued user!`;
      
      ctaPrimary = {
        label: 'Learn More',
        url: 'https://app.waymore.io'
      };
    }

    // Add social links for most email types (except password reset)
    if (!lowerDescription.includes('password') && !lowerDescription.includes('reset') && !socialLinks) {
      socialLinks = [
        { platform: 'twitter', url: 'https://twitter.com/waymore_io' },
        { platform: 'linkedin', url: 'https://linkedin.com/company/waymore' }
      ];
    }

    // Add theme customization based on email type
    let theme: any = undefined;
    let imageUrl: string | undefined = undefined;
    let imageAlt: string | undefined = undefined;
    
    if (lowerDescription.includes('order') || lowerDescription.includes('confirmation') || lowerDescription.includes('shipped')) {
      // Soft pastel theme for order confirmations with shipping illustration
      theme = {
        primary_button_color: '#6c5ce7',
        text_color: '#2d3436',
        heading_color: '#2d3436',
        background_color: '#f8f9fa',
        body_background: '#f1f2f6'
      };
      imageUrl = 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop&auto=format';
      imageAlt = 'Order shipped illustration';
    } else if (lowerDescription.includes('payment') || lowerDescription.includes('success')) {
      // Green theme for success/payment emails
      theme = {
        primary_button_color: '#28a745',
        text_color: '#2c3e50',
        heading_color: '#1a1a1a'
      };
    } else if (lowerDescription.includes('alert') || lowerDescription.includes('warning')) {
      // Orange theme for alerts
      theme = {
        primary_button_color: '#fd7e14',
        text_color: '#2c3e50',
        heading_color: '#1a1a1a'
      };
    } else if (lowerDescription.includes('report') || lowerDescription.includes('analytics')) {
      // Blue theme for reports
      theme = {
        primary_button_color: '#007bff',
        text_color: '#2c3e50',
        heading_color: '#1a1a1a',
        background_color: '#f8f9fa'
      };
    }

    return {
      template: {
        key: 'transactional',
        locale: 'en'
      },
      variables: {
        workspace_name: workspaceName,
        user_firstname: userName,
        product_name: productName,
        support_email: 'support@waymore.io',
        email_title: emailTitle,
        custom_content: customContent,
        ...(facts.length > 0 && { facts }),
        ...(ctaPrimary && { cta_primary: ctaPrimary }),
        ...(ctaSecondary && { cta_secondary: ctaSecondary }),
        ...(socialLinks && { social_links: socialLinks }),
        ...(theme && { theme }),
        ...(imageUrl && { image_url: imageUrl }),
        ...(imageAlt && { image_alt: imageAlt })
      }
    };
  }
}
