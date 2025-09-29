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
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.min.js"></script>
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
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
            display: flex;
            gap: 20px;
        }
        
        .sidebar {
            width: 280px;
            flex-shrink: 0;
            position: sticky;
            top: 20px;
            height: fit-content;
            max-height: calc(100vh - 40px);
            overflow-y: auto;
        }
        
        .main-content {
            flex: 1;
            min-width: 0;
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
        
        .markdown-body .mermaid {
            text-align: center;
            margin: 2rem 0;
            padding: 1rem;
            background: #f8f9fa;
            border-radius: 8px;
            border: 1px solid #e9ecef;
        }
        
        .code-block-wrapper {
            position: relative;
            margin: 1.5rem 0;
        }
        
        .code-block-header {
            position: absolute;
            top: 8px;
            right: 8px;
            z-index: 10;
            opacity: 0;
            transition: opacity 0.2s ease;
        }
        
        .code-block-wrapper:hover .code-block-header {
            opacity: 1;
        }
        
        .copy-button {
            background: rgba(255, 255, 255, 0.9);
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-radius: 4px;
            padding: 6px;
            color: #666;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(4px);
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .copy-button:hover {
            background: rgba(255, 255, 255, 1);
            border-color: rgba(0, 0, 0, 0.2);
            color: #333;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
        }
        
        .copy-button.copied {
            background: rgba(34, 197, 94, 0.1);
            border-color: rgba(34, 197, 94, 0.3);
            color: #16a34a;
        }
        
        .copy-button i {
            font-size: 14px;
        }
        
        .code-block-wrapper pre {
            margin: 0;
            border-radius: 6px;
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
            background: white;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .toc h3 {
            margin-top: 0;
            margin-bottom: 16px;
            color: #2c3e50;
            font-size: 1.1rem;
            font-weight: 600;
            border-bottom: 1px solid #e9ecef;
            padding-bottom: 8px;
        }
        
        .toc ul {
            list-style: none;
            padding-left: 0;
            margin: 0;
        }
        
        .toc li {
            margin: 0;
        }
        
        .toc a {
            display: block;
            color: #6c757d;
            text-decoration: none;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 0.9rem;
            line-height: 1.4;
            transition: all 0.2s ease;
        }
        
        .toc a:hover {
            color: #007bff;
            background: #f8f9fa;
        }
        
        .toc a.active {
            color: #007bff;
            background: #e3f2fd;
            font-weight: 500;
        }
        
        .toc .toc-level-1 a {
            padding-left: 12px;
            font-weight: 500;
        }
        
        .toc .toc-level-2 a {
            padding-left: 24px;
            font-size: 0.85rem;
        }
        
        .toc .toc-level-3 a {
            padding-left: 36px;
            font-size: 0.8rem;
        }
        
        .toc .toc-level-4 a {
            padding-left: 48px;
            font-size: 0.8rem;
        }
        
        .toc-toggle {
            background: none;
            border: none;
            color: #6c757d;
            cursor: pointer;
            padding: 2px 4px;
            margin-right: 4px;
            font-size: 0.8rem;
            transition: transform 0.2s ease;
        }
        
        .toc-toggle:hover {
            color: #007bff;
        }
        
        .toc-toggle.collapsed {
            transform: rotate(-90deg);
        }
        
        .toc-section {
            transition: all 0.3s ease;
        }
        
        .toc-section.collapsed {
            display: none;
        }
        
        .toc-section-header {
            display: flex;
            align-items: center;
            cursor: pointer;
            user-select: none;
        }
        
        .toc-section-header:hover {
            background: #f8f9fa;
            border-radius: 4px;
        }
        
        .toc-section-header a {
            flex: 1;
        }
        
        @media (max-width: 1024px) {
            .container {
                flex-direction: column;
                padding: 10px;
            }
            
            .sidebar {
                width: 100%;
                position: static;
                max-height: none;
                margin-bottom: 20px;
            }
            
            .toc {
                position: sticky;
                top: 10px;
            }
        }
        
        @media (max-width: 768px) {
            .content {
                padding: 20px;
            }
            
            .markdown-body {
                font-size: 14px;
            }
            
            .toc {
                padding: 15px;
            }
            
            .toc h3 {
                font-size: 1rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="sidebar">
            <div id="table-of-contents" class="toc">
                <h3><i class="fas fa-list"></i> Table of Contents</h3>
                <a href="/admin#documentation" class="back-button" style="margin-bottom: 16px; display: inline-flex; align-items: center; padding: 8px 16px; background: #007bff; color: white; text-decoration: none; border-radius: 6px; font-size: 0.9rem; transition: background 0.2s;">
                    <i class="fas fa-arrow-left" style="margin-right: 8px;"></i>
                    Back to Documentation
                </a>
                <ul id="toc-list"></ul>
            </div>
        </div>
        
        <div class="main-content">
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
    </div>
    
    <script>
        // Initialize Mermaid
        mermaid.initialize({
            startOnLoad: false,
            theme: 'default',
            securityLevel: 'loose',
            fontFamily: 'inherit'
        });
        
        // Configure marked options with custom renderer for Mermaid
        const renderer = new marked.Renderer();
        
        // Override code block rendering to handle Mermaid and add copy buttons
        renderer.code = function(code, language) {
            if (language === 'mermaid') {
                // Generate unique ID for this diagram
                const id = 'mermaid-' + Math.random().toString(36).substr(2, 9);
                return \`<div class="mermaid" id="\${id}">\${code}</div>\`;
            }
            
            // Generate unique ID for copy button
            const copyId = 'copy-' + Math.random().toString(36).substr(2, 9);
            const lang = language || 'text';
            
            // Default code highlighting for other languages
            let highlightedCode;
            if (language && hljs.getLanguage(language)) {
                try {
                    highlightedCode = hljs.highlight(code, { language: language }).value;
                } catch (err) {
                    highlightedCode = hljs.highlightAuto(code).value;
                }
            } else {
                highlightedCode = hljs.highlightAuto(code).value;
            }
            
            return \`
                <div class="code-block-wrapper">
                    <div class="code-block-header">
                        <button class="copy-button" onclick="copyCode('\${copyId}')" data-copy-id="\${copyId}">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                    <pre><code class="hljs language-\${lang}" id="\${copyId}">\${highlightedCode}</code></pre>
                </div>
            \`;
        };
        
        marked.setOptions({
            renderer: renderer,
            breaks: true,
            gfm: true
        });
        
        // Render markdown
        const markdownContent = ${JSON.stringify(content)};
        const htmlContent = marked.parse(markdownContent);
        document.getElementById('markdown-content').innerHTML = htmlContent;
        
        // Render Mermaid diagrams after markdown is processed
        mermaid.run();
        
        // Copy code functionality
        window.copyCode = function(copyId) {
            const codeElement = document.getElementById(copyId);
            if (!codeElement) return;
            
            // Get the raw text content (without HTML tags)
            const text = codeElement.textContent || codeElement.innerText;
            
            // Copy to clipboard
            navigator.clipboard.writeText(text).then(function() {
                // Find the copy button and update its state
                const copyButton = document.querySelector(\`[data-copy-id="\${copyId}"]\`);
                if (copyButton) {
                    const icon = copyButton.querySelector('i');
                    
                    // Update button appearance
                    copyButton.classList.add('copied');
                    if (icon) icon.className = 'fas fa-check';
                    
                    // Reset after 2 seconds
                    setTimeout(function() {
                        copyButton.classList.remove('copied');
                        if (icon) icon.className = 'fas fa-copy';
                    }, 2000);
                }
            }).catch(function(err) {
                console.error('Failed to copy text: ', err);
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    // Show success feedback even for fallback
                    const copyButton = document.querySelector(\`[data-copy-id="\${copyId}"]\`);
                    if (copyButton) {
                        const icon = copyButton.querySelector('i');
                        copyButton.classList.add('copied');
                        if (icon) icon.className = 'fas fa-check';
                        setTimeout(function() {
                            copyButton.classList.remove('copied');
                            if (icon) icon.className = 'fas fa-copy';
                        }, 2000);
                    }
                } catch (fallbackErr) {
                    console.error('Fallback copy failed: ', fallbackErr);
                }
                document.body.removeChild(textArea);
            });
        };
        
        // Generate table of contents
        function generateTOC() {
            const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            if (headings.length === 0) return;
            
            const tocList = document.getElementById('toc-list');
            if (!tocList) return;
            
            // Group headings by sections (H1 and H2 create new sections)
            const sections = [];
            let currentSection = null;
            
            headings.forEach((heading, index) => {
                // Generate ID from heading text (convert to lowercase, replace spaces with hyphens, remove special chars)
                const text = heading.textContent || '';
                let id = text.toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except letters, numbers, spaces and hyphens
                    .replace(/\s+/g, '-') // Replace spaces with hyphens
                    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
                    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
                
                // Special handling for common patterns
                if (id === 'dk-andexample') {
                    id = 'sdks-and-examples';
                } else if (id === 'endemail') {
                    id = 'send-email';
                } else if (id === 'getme-age-tatu') {
                    id = 'get-message-status';
                } else if (id === 'reque-tbody') {
                    id = 'request-body';
                } else if (id === 'reque-t-chema') {
                    id = 'request-schema';
                } else if (id === 'templateobject') {
                    id = 'template-object';
                } else if (id === 'templatevariable') {
                    id = 'template-variables';
                } else if (id === 'corevariable') {
                    id = 'core-variables';
                } else if (id === 'imagevariable') {
                    id = 'image-variables';
                } else if (id === 'contentvariable') {
                    id = 'content-variables';
                } else if (id === 'call-to-actionvariable') {
                    id = 'call-to-action-variables';
                } else if (id === 'ocialmediavariable') {
                    id = 'social-media-variables';
                } else if (id === 'themevariable') {
                    id = 'theme-variables';
                } else if (id === 'themeobject') {
                    id = 'theme-object';
                } else if (id === 'fact-array') {
                    id = 'facts-array';
                } else if (id === 'ociallink-array') {
                    id = 'social-links-array';
                } else if (id === 'multi-languagecontent') {
                    id = 'multi-language-content';
                } else if (id === 'recipientobject') {
                    id = 'recipient-object';
                } else if (id === 'attachmentobject') {
                    id = 'attachment-object';
                } else if (id === 'ucce-re-pon-e202') {
                    id = 'success-response-202';
                } else if (id === 'errorre-pon-e') {
                    id = 'error-responses';
                } else if (id === '400badreque-t') {
                    id = '400-bad-request';
                } else if (id === '401unauthorized') {
                    id = '401-unauthorized';
                } else if (id === '409conflictidempotency') {
                    id = '409-conflict-idempotency';
                } else if (id === '429ratelimited') {
                    id = '429-rate-limited';
                } else if (id === 'getme-age-tatu') {
                    id = 'get-message-status';
                } else if (id === 'pathparameter') {
                    id = 'path-parameters';
                } else if (id === 'ucce-re-pon-e200') {
                    id = 'success-response-200';
                } else if (id === 'me-age-tatu-value') {
                    id = 'message-status-values';
                } else if (id === '404notfound') {
                    id = '404-not-found';
                } else if (id === 'healthcheckendpoint') {
                    id = 'health-check-endpoints';
                } else if (id === 'livene-probe') {
                    id = 'liveness-probe';
                } else if (id === 'readine-probe') {
                    id = 'readiness-probe';
                } else if (id === 'detailedhealthcheck') {
                    id = 'detailed-health-check';
                } else if (id === 'metric-endpoint') {
                    id = 'metrics-endpoint';
                } else if (id === 'errorhandling') {
                    id = 'error-handling';
                } else if (id === 'errorre-pon-eformat') {
                    id = 'error-response-format';
                } else if (id === 'errorcode') {
                    id = 'error-codes';
                } else if (id === 'ratelimiting') {
                    id = 'rate-limiting';
                } else if (id === 'idempotency') {
                    id = 'idempotency';
                } else if (id === 'example') {
                    id = 'example';
                } else if (id === 'webhook') {
                    id = 'webhooks';
                } else if (id === 'clientwebhook-outgoing') {
                    id = 'client-webhooks-outgoing';
                } else if (id === 'webhookpayload') {
                    id = 'webhook-payload';
                } else if (id === 'eventtype') {
                    id = 'event-types';
                } else if (id === 'providerwebhook-incoming') {
                    id = 'provider-webhooks-incoming';
                } else if (id === 'routeewebhookendpoint') {
                    id = 'routee-webhook-endpoint';
                } else if (id === 'webhook-ecurity') {
                    id = 'webhook-security';
                } else if (id === 'java-criptnodej') {
                    id = 'javascript-nodejs';
                } else if (id === 'python') {
                    id = 'python';
                } else if (id === 'curlexample') {
                    id = 'curl-examples';
                } else if (id === 'changelog') {
                    id = 'changelog';
                } else if (id === 'v1102025-09-26') {
                    id = 'v1-1-0-2025-09-26';
                } else if (id === 'v1002024-01-01') {
                    id = 'v1-0-0-2024-01-01';
                } else if (id === 'adminda-hboard') {
                    id = 'admin-dashboard';
                } else if (id === 'webinterface') {
                    id = 'web-interface';
                } else if (id === 'adminapidata') {
                    id = 'admin-api-data';
                } else if (id === 'webhookintegration') {
                    id = 'webhook-integration';
                } else if (id === 'routeewebhook') {
                    id = 'routee-webhook';
                } else if (id === 'webhookeventtype') {
                    id = 'webhook-event-types';
                } else if (id === 'routeecallbackconfiguration') {
                    id = 'routee-callback-configuration';
                } else if (id === 'webhook-etupfordevelopment') {
                    id = 'webhook-setup-for-development';
                } else if (id === 'teamintegration') {
                    id = 'team-integration';
                } else if (id === 'po-tmancollection') {
                    id = 'postman-collection';
                } else if (id === 'u-ageexample') {
                    id = 'usage-examples';
                }
                
                // If ID is empty or too short, use index-based fallback
                if (!id || id.length < 2) {
                    id = 'heading-' + index;
                }
                
                // Ensure unique ID
                let finalId = id;
                let counter = 1;
                while (document.getElementById(finalId)) {
                    finalId = id + '-' + counter;
                    counter++;
                }
                
                heading.id = finalId;
                
                const level = parseInt(heading.tagName.charAt(1));
                const headingData = {
                    id: finalId,
                    level: level,
                    text: heading.textContent,
                    element: heading
                };
                
                // H1 and H2 create new sections
                if (level <= 2) {
                    currentSection = {
                        header: headingData,
                        children: [],
                        collapsed: true
                    };
                    sections.push(currentSection);
                } else if (currentSection) {
                    // H3+ go under the current section
                    currentSection.children.push(headingData);
                }
            });
            
            // Render sections
            sections.forEach(section => {
                // Section header
                const sectionHeader = document.createElement('li');
                sectionHeader.className = 'toc-section-header';
                
                const toggle = document.createElement('button');
                toggle.className = 'toc-toggle';
                toggle.innerHTML = '<i class="fas fa-chevron-down"></i>';
                
                // Hide toggle if no children
                if (section.children.length === 0) {
                    toggle.style.display = 'none';
                }
                
                const headerLink = document.createElement('a');
                headerLink.href = '#' + section.header.id;
                headerLink.textContent = section.header.text;
                headerLink.className = 'toc-level-' + section.header.level;
                
                // Combined click handler for both navigation and expansion
                const handleSectionClick = function(e) {
                    e.preventDefault();
                    
                    // Update URL
                    window.location.hash = '#' + section.header.id;
                    
                    // Scroll to the target element
                    const targetElement = document.getElementById(section.header.id);
                    if (targetElement) {
                        const targetScroll = targetElement.offsetTop - 100;
                        const currentScroll = window.pageYOffset;
                        const distance = Math.abs(targetScroll - currentScroll);
                        
                        if (distance > 500) {
                            window.scrollTo({ top: targetScroll, behavior: 'auto' });
                        } else {
                            window.scrollTo({ top: targetScroll, behavior: 'smooth' });
                        }
                        
                        // Update active state
                        updateActiveState(section.header.id);
                    }
                    
                    // Expand/collapse the section if it has children
                    if (section.children.length > 0) {
                        toggleSection(section, toggle);
                    }
                };
                
                // Add click handlers to both toggle and header link
                toggle.addEventListener('click', handleSectionClick);
                headerLink.addEventListener('click', handleSectionClick);
                
                sectionHeader.appendChild(toggle);
                sectionHeader.appendChild(headerLink);
                tocList.appendChild(sectionHeader);
                
                // Section children
                if (section.children.length > 0) {
                    const childrenContainer = document.createElement('ul');
                    childrenContainer.className = 'toc-section collapsed';
                    
                    section.children.forEach(child => {
                        const childLi = document.createElement('li');
                        childLi.className = 'toc-level-' + child.level;
                        
                        const childLink = document.createElement('a');
                        childLink.href = '#' + child.id;
                        childLink.textContent = child.text;
                        childLink.addEventListener('click', function(e) {
                            e.preventDefault();
                            
                            // Update URL
                            window.location.hash = '#' + child.id;
                            
                            // Scroll to the target element
                            const targetElement = document.getElementById(child.id);
                            if (targetElement) {
                                const targetScroll = targetElement.offsetTop - 100;
                                const currentScroll = window.pageYOffset;
                                const distance = Math.abs(targetScroll - currentScroll);
                                
                                if (distance > 500) {
                                    window.scrollTo({ top: targetScroll, behavior: 'auto' });
                                } else {
                                    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
                                }
                                
                                // Update active state
                                updateActiveState(child.id);
                            }
                        });
                        
                        childLi.appendChild(childLink);
                        childrenContainer.appendChild(childLi);
                    });
                    
                    tocList.appendChild(childrenContainer);
                    
                    // Set toggle to collapsed state
                    toggle.classList.add('collapsed');
                }
            });
        }
        
        // Toggle section visibility
        function toggleSection(section, toggle) {
            const childrenContainer = toggle.parentElement.nextElementSibling;
            if (childrenContainer && childrenContainer.classList.contains('toc-section')) {
                const isCollapsed = childrenContainer.classList.contains('collapsed');
                
                if (isCollapsed) {
                    childrenContainer.classList.remove('collapsed');
                    toggle.classList.remove('collapsed');
                    section.collapsed = false;
                } else {
                    childrenContainer.classList.add('collapsed');
                    toggle.classList.add('collapsed');
                    section.collapsed = true;
                }
            }
        }
        
        // Update active state
        function updateActiveState(activeId) {
            document.querySelectorAll('.toc a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + activeId) {
                    link.classList.add('active');
                }
            });
        }
        
        // Update active TOC item based on scroll position
        function updateActiveTOCItem() {
            const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            const tocLinks = document.querySelectorAll('.toc a');
            
            let current = '';
            headings.forEach(heading => {
                const rect = heading.getBoundingClientRect();
                if (rect.top <= 100) {
                    current = heading.id;
                }
            });
            
            updateActiveState(current);
        }
        
        // Generate TOC after content is loaded
        setTimeout(generateTOC, 100);
        
        // Add scroll listener to update active TOC item
        window.addEventListener('scroll', updateActiveTOCItem);
        
        // Initialize active state on page load
        setTimeout(updateActiveTOCItem, 200);
        
        // Simple hash navigation - let browser handle it naturally
        function handleHashNavigation() {
            const startTime = performance.now();
            const hash = window.location.hash;
            console.log('Hash navigation triggered, hash:', hash, 'Time:', startTime);
            if (hash) {
                const targetId = hash.substring(1);
                console.log('Looking for element with ID:', targetId);
                const targetElement = document.getElementById(targetId);
                console.log('Target element found:', targetElement);
                
                if (targetElement) {
                    console.log('Scrolling to element');
                    const targetScroll = targetElement.offsetTop - 100;
                    const currentScroll = window.pageYOffset;
                    const distance = Math.abs(targetScroll - currentScroll);
                    
                    console.log('Target scroll:', targetScroll, 'Current scroll:', currentScroll, 'Distance:', distance);
                    
                    const scrollStartTime = performance.now();
                    if (distance > 500) {
                        window.scrollTo({ top: targetScroll, behavior: 'auto' });
                        console.log('Instant scroll completed in:', performance.now() - scrollStartTime, 'ms');
                    } else {
                        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
                        console.log('Smooth scroll initiated in:', performance.now() - scrollStartTime, 'ms');
                    }
                    
                    // Update active state
                    const activeStateStartTime = performance.now();
                    updateActiveState(targetId);
                    console.log('Active state updated in:', performance.now() - activeStateStartTime, 'ms');
                    
                    console.log('Total hash navigation time:', performance.now() - startTime, 'ms');
                } else {
                    console.log('Element not found, retrying...');
                    // If element not found, retry after a delay
                    setTimeout(handleHashNavigation, 200);
                }
            }
        }
        
        // Handle hash navigation after TOC is generated
        const tocStartTime = performance.now();
        console.log('Setting up TOC hash navigation timer at:', tocStartTime);
        setTimeout(() => {
            console.log('TOC hash navigation timer fired after:', performance.now() - tocStartTime, 'ms');
            handleHashNavigation();
        }, 1000);
        
        // Handle hash changes
        window.addEventListener('hashchange', handleHashNavigation);
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

  // Template editor page
  fastify.get('/admin/template-editor', async (request, reply) => {
    const { generateTemplateEditorHTML } = await import('../../templates/admin/template-editor.html');
    const html = generateTemplateEditorHTML();
    return reply.type('text/html').send(html);
  });

  // Template editor static assets
  fastify.get('/admin/template-editor/styles.css', async (request, reply) => {
    const fs = require('fs');
    const path = require('path');
    const cssPath = path.join(__dirname, '../../templates/admin/components/template-editor/editor-styles.css');
    try {
      const css = fs.readFileSync(cssPath, 'utf8');
      return reply.type('text/css').send(css);
    } catch (error) {
      return reply.code(404).send('CSS file not found');
    }
  });

  fastify.get('/admin/template-editor/scripts.js', async (request, reply) => {
    const fs = require('fs');
    const path = require('path');
    const jsPath = path.join(__dirname, '../../templates/admin/components/template-editor/editor-scripts.js');
    try {
      const js = fs.readFileSync(jsPath, 'utf8');
      return reply.type('application/javascript').send(js);
    } catch (error) {
      return reply.code(404).send('JavaScript file not found');
    }
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

  // Postman collection download route
  fastify.get('/Email-Gateway-API.postman_collection.json', async (request, reply) => {
    const fs = require('fs');
    const path = require('path');
    
    try {
      const filePath = path.join(process.cwd(), 'Email-Gateway-API.postman_collection.json');
      const content = fs.readFileSync(filePath, 'utf8');
      
      return reply
        .type('application/json')
        .header('Content-Disposition', 'attachment; filename="Email-Gateway-API.postman_collection.json"')
        .send(content);
    } catch (error) {
      return reply.code(404).send('Postman collection not found');
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
      console.log('📧 Admin Test Email Received:', JSON.stringify(emailData, null, 2));
      
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
      
      // Import required modules
      const { EmailQueueProducer } = await import('../../queue/producer');
      const { prisma } = await import('../../db/client');
      const { v4: uuidv4 } = await import('uuid');
      
      const queueProducer = new EmailQueueProducer();
      
      // Generate a unique message ID for the test email
      const messageId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Extract metadata
      const tenantId = emailData.metadata?.tenantId || 'admin_test';
      
      // Store message in database first (like the main email controller does)
      await prisma.message.create({
        data: {
          messageId,
          tenantId,
          toJson: emailData.to,
          subject: emailData.subject,
          templateKey: emailData.template.key,
          locale: emailData.template.locale,
          variablesJson: emailData.variables || {},
          status: 'QUEUED',
          webhookUrl: undefined,
          attempts: 0
        }
      });
      
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
        webhookUrl: process.env.WEBHOOK_BASE_URL ? `${process.env.WEBHOOK_BASE_URL}/webhooks/routee` : undefined,
        tenantId,
        attempts: 0
      };
      
      console.log('📧 Final Test Email Data for Queue:', JSON.stringify(testEmailData, null, 2));
      
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
