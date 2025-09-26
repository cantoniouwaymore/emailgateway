import { FastifyInstance } from 'fastify';
import { AdminController } from '../controllers/admin';

// Markdown viewer function
function generateMarkdownViewer(filename: string, content: string): string {
  const title = filename.replace('.md', '').replace(/_/g, ' ');
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Documentation</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/marked/9.1.6/marked.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f8f9fa;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            background: white;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            border-left: 4px solid #007bff;
        }
        
        .header h1 {
            color: #2c3e50;
            margin-bottom: 10px;
            font-size: 2rem;
        }
        
        .header .meta {
            color: #6c757d;
            font-size: 0.9rem;
        }
        
        .content {
            background: white;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .markdown-body {
            font-size: 16px;
            line-height: 1.6;
        }
        
        .markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6 {
            margin-top: 2rem;
            margin-bottom: 1rem;
            font-weight: 600;
            line-height: 1.25;
            color: #2c3e50;
        }
        
        .markdown-body h1 {
            font-size: 2rem;
            border-bottom: 1px solid #eaecef;
            padding-bottom: 0.3rem;
        }
        
        .markdown-body h2 {
            font-size: 1.5rem;
            border-bottom: 1px solid #eaecef;
            padding-bottom: 0.3rem;
        }
        
        .markdown-body h3 {
            font-size: 1.25rem;
        }
        
        .markdown-body p {
            margin-bottom: 1rem;
        }
        
        .markdown-body code {
            background: #f6f8fa;
            padding: 0.2rem 0.4rem;
            border-radius: 3px;
            font-size: 0.85em;
            color: #d73a49;
        }
        
        .markdown-body pre {
            background: #f6f8fa;
            border-radius: 6px;
            padding: 16px;
            overflow-x: auto;
            margin: 1rem 0;
        }
        
        .markdown-body pre code {
            background: none;
            padding: 0;
            color: inherit;
        }
        
        .markdown-body blockquote {
            border-left: 4px solid #dfe2e5;
            padding: 0 1rem;
            margin: 1rem 0;
            color: #6a737d;
        }
        
        .markdown-body table {
            border-collapse: collapse;
            width: 100%;
            margin: 1rem 0;
        }
        
        .markdown-body th, .markdown-body td {
            border: 1px solid #dfe2e5;
            padding: 8px 12px;
            text-align: left;
        }
        
        .markdown-body th {
            background: #f6f8fa;
            font-weight: 600;
        }
        
        .markdown-body ul, .markdown-body ol {
            margin: 1rem 0;
            padding-left: 2rem;
        }
        
        .markdown-body li {
            margin: 0.25rem 0;
        }
        
        .markdown-body a {
            color: #0366d6;
            text-decoration: none;
        }
        
        .markdown-body a:hover {
            text-decoration: underline;
        }
        
        .markdown-body img {
            max-width: 100%;
            height: auto;
            border-radius: 4px;
        }
        
        .back-button {
            display: inline-flex;
            align-items: center;
            padding: 8px 16px;
            background: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-size: 0.9rem;
            margin-bottom: 20px;
            transition: background 0.2s;
        }
        
        .back-button:hover {
            background: #0056b3;
            color: white;
            text-decoration: none;
        }
        
        .back-button i {
            margin-right: 8px;
        }
        
        .toc {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
        }
        
        .toc h3 {
            margin-top: 0;
            color: #495057;
        }
        
        .toc ul {
            list-style: none;
            padding-left: 0;
        }
        
        .toc li {
            margin: 0.5rem 0;
        }
        
        .toc a {
            color: #6c757d;
            text-decoration: none;
        }
        
        .toc a:hover {
            color: #007bff;
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 10px;
            }
            
            .content {
                padding: 20px;
            }
            
            .markdown-body {
                font-size: 14px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <a href="/admin" class="back-button">
            <i class="fas fa-arrow-left"></i>
            Back to Admin Panel
        </a>
        
        <div class="header">
            <h1>${title}</h1>
            <div class="meta">
                <i class="fas fa-file-alt"></i> Documentation • 
                <i class="fas fa-clock"></i> Last updated: ${new Date().toLocaleDateString()}
            </div>
        </div>
        
        <div class="content">
            <div id="markdown-content" class="markdown-body"></div>
        </div>
    </div>
    
    <script>
        // Configure marked options
        marked.setOptions({
            highlight: function(code, lang) {
                if (lang && hljs.getLanguage(lang)) {
                    try {
                        return hljs.highlight(code, { language: lang }).value;
                    } catch (err) {}
                }
                return hljs.highlightAuto(code).value;
            },
            breaks: true,
            gfm: true
        });
        
        // Render markdown
        const markdownContent = \`${content.replace(/`/g, '\\`')}\`;
        const htmlContent = marked.parse(markdownContent);
        document.getElementById('markdown-content').innerHTML = htmlContent;
        
        // Generate table of contents
        function generateTOC() {
            const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            if (headings.length === 0) return;
            
            const toc = document.createElement('div');
            toc.className = 'toc';
            toc.innerHTML = '<h3><i class="fas fa-list"></i> Table of Contents</h3><ul></ul>';
            const tocList = toc.querySelector('ul');
            
            headings.forEach((heading, index) => {
                const id = 'heading-' + index;
                heading.id = id;
                
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = '#' + id;
                a.textContent = heading.textContent;
                a.style.paddingLeft = (parseInt(heading.tagName.charAt(1)) - 1) * 20 + 'px';
                li.appendChild(a);
                tocList.appendChild(li);
            });
            
            document.getElementById('markdown-content').insertBefore(toc, document.getElementById('markdown-content').firstChild);
        }
        
        // Generate TOC after content is loaded
        setTimeout(generateTOC, 100);
        
        // Smooth scrolling for anchor links
        document.addEventListener('click', function(e) {
            if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(e.target.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    </script>
    
    <!-- Font Awesome for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</body>
</html>`;
}

export async function adminRoutes(fastify: FastifyInstance) {
  const adminController = new AdminController();

  // Admin dashboard - return HTML directly
  fastify.get<{ Querystring: { page?: string; limit?: string; search?: string; email?: string; searchPage?: string; searchLimit?: string } }>('/admin', async (request, reply) => {
    return adminController.getDashboardHTML(request, reply);
  });
  
  // Message details page
  fastify.get<{ Params: { messageId: string } }>('/admin/messages/:messageId', async (request, reply) => {
    return adminController.getMessageDetailsHTML(request, reply);
  });

  // Documentation viewer route
  fastify.get('/docs/:filename', async (request, reply) => {
    const fs = require('fs');
    const path = require('path');
    const { filename } = request.params as { filename: string };
    
    try {
      const filePath = path.join(process.cwd(), 'docs', filename);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Generate HTML with markdown viewer
      const html = generateMarkdownViewer(filename, content);
      return reply.type('text/html').send(html);
    } catch (error) {
      return reply.code(404).send('Documentation not found');
    }
  });
  
  // API endpoint for real-time data
  fastify.get('/admin/api/data', adminController.getApiData.bind(adminController));
  
  // Webhook events endpoints
  fastify.get<{ Params: { messageId: string } }>('/admin/api/webhooks/:messageId', adminController.getWebhookEvents.bind(adminController));
  fastify.get('/admin/api/webhooks', adminController.getRecentWebhookEvents.bind(adminController));
  
  // Search by recipient endpoint
  fastify.get<{ Querystring: { email: string; page?: string; limit?: string } }>('/admin/search', adminController.searchByRecipient.bind(adminController));
  

  // Send test email endpoint (no authentication required for admin testing)
  fastify.post('/admin/send-test-email', async (request, reply) => {
    try {
      const emailData = request.body as any;
      
      // Validate required fields
      if (!emailData.to || !Array.isArray(emailData.to) || emailData.to.length === 0) {
        return reply.code(400).send({ error: 'Missing or invalid "to" field' });
      }
      
      if (!emailData.subject) {
        return reply.code(400).send({ error: 'Missing "subject" field' });
      }
      
      if (!emailData.template) {
        return reply.code(400).send({ error: 'Missing "template" field' });
      }
      
      // Import the email controller to use the queue
      const { EmailQueueProducer } = await import('../../queue/producer');
      const queueProducer = new EmailQueueProducer();
      
      // Generate a unique message ID for the test email
      const messageId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Transform data to match EmailJobData interface
      const testEmailData = {
        messageId,
        templateKey: emailData.template.key,
        locale: emailData.template.locale,
        version: emailData.template.version,
        variables: emailData.variables || {},
        to: emailData.to,
        cc: emailData.cc,
        bcc: emailData.bcc,
        from: emailData.from,
        replyTo: emailData.replyTo,
        subject: emailData.subject,
        attachments: emailData.attachments,
        webhookUrl: emailData.webhookUrl,
        tenantId: emailData.metadata?.tenantId,
        attempts: 3
      };
      
      // Send to queue
      await queueProducer.addEmailJob(testEmailData);
      
      return reply.send({ 
        success: true, 
        messageId,
        message: 'Test email queued successfully' 
      });
      
    } catch (error) {
      console.error('Error sending test email:', error);
      return reply.code(500).send({ 
        error: 'Failed to send test email',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
}
