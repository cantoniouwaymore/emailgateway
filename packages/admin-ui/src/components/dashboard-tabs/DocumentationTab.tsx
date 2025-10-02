import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Rocket, Clock, Code, CheckCircle, ArrowRight, Settings, Mail, Network, Package, Trash2, Plug, BookOpen, Github, Key, ExternalLink } from 'lucide-react';

export function DocumentationTab() {
  const [copied, setCopied] = useState(false);

  const codeSample = `// Send email with template
const response = await fetch('/api/v1/emails', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_JWT_TOKEN',
    'Idempotency-Key': 'unique-key-123'
  },
  body: JSON.stringify({
    to: [{ email: 'user@example.com', name: 'John Doe' }],
    subject: 'Welcome to Waymore!',
    template: { key: 'transactional', locale: 'en' },
    variables: {
      workspace_name: 'Waymore',
      user_firstname: 'John',
      dashboard_url: 'https://app.waymore.io/dashboard'
    }
  })
});

const result = await response.json();
console.log('Message ID:', result.messageId);`;

  const copyCode = () => {
    navigator.clipboard.writeText(codeSample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Email Gateway Documentation</h1>
        <p className="text-lg text-gray-600">Complete developer resources and guides for our email gateway system</p>
      </div>

      {/* Quick Start Guide */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Rocket className="h-5 w-5 text-blue-600" />
                Quick Start Guide
              </h2>
              <p className="text-gray-700 mb-4">Get up and running with our email gateway in minutes. Send your first email with just a few lines of code.</p>
              <div className="flex items-center text-sm text-gray-600 gap-2">
                <Clock className="h-4 w-4" />
                <span>5 minutes to complete</span>
              </div>
            </div>
            <a href="/docs/API.md" target="_blank" rel="noopener noreferrer">
              <Button className="ml-4">
                View Full Guide
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </div>
          
          {/* Code Example */}
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
              <span className="text-sm text-gray-300">JavaScript</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyCode}
                className="text-gray-400 hover:text-white h-8"
              >
                {copied ? <CheckCircle className="h-4 w-4 text-green-400" /> : <Code className="h-4 w-4" />}
              </Button>
            </div>
            <div className="p-4 overflow-x-auto">
              <pre className="text-sm text-gray-100"><code>{codeSample}</code></pre>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documentation Cards */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Browse Documentation</h2>
          <a href="/docs/API.md" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
            View all guides
            <ArrowRight className="h-3 w-3" />
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <a href="/docs/API.md" target="_blank" rel="noopener noreferrer" className="group">
            <Card className="h-full hover:border-blue-300 hover:shadow-md transition-all duration-200">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Code className="h-6 w-6 text-blue-600" />
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">API Reference</h3>
                <p className="text-gray-600 text-sm">Complete API documentation with examples, endpoints, and authentication details.</p>
              </CardContent>
            </Card>
          </a>
          
          <a href="/docs/DEVELOPER.md" target="_blank" rel="noopener noreferrer" className="group">
            <Card className="h-full hover:border-blue-300 hover:shadow-md transition-all duration-200">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Settings className="h-6 w-6 text-green-600" />
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Developer Guide</h3>
                <p className="text-gray-600 text-sm">Setup, configuration, and development best practices for integrating with our platform.</p>
              </CardContent>
            </Card>
          </a>
          
          <a href="/docs/TRANSACTIONAL_TEMPLATE_GUIDE.md" target="_blank" rel="noopener noreferrer" className="group">
            <Card className="h-full hover:border-blue-300 hover:shadow-md transition-all duration-200">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Mail className="h-6 w-6 text-purple-600" />
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Template Guide</h3>
                <p className="text-gray-600 text-sm">Create and customize email templates with our comprehensive template system.</p>
              </CardContent>
            </Card>
          </a>
        </div>
      </div>

      {/* Getting Started */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Getting Started</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center mb-4 gap-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Key className="h-5 w-5 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Authentication</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">All requests require JWT authentication with required scopes.</p>
              <div className="bg-gray-50 rounded p-3 mb-4">
                <code className="text-sm text-gray-800">Authorization: Bearer YOUR_JWT_TOKEN</code>
              </div>
              <a href="/docs/API.md#authentication" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                Learn more
                <ArrowRight className="h-3 w-3" />
              </a>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center mb-4 gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Template Validation</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">Validate templates before sending to ensure proper formatting.</p>
              <div className="bg-gray-50 rounded p-3 mb-4">
                <code className="text-sm text-gray-800">POST /api/v1/templates/validate</code>
              </div>
              <a href="/docs/API.md#template-validation" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                Learn more
                <ArrowRight className="h-3 w-3" />
              </a>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Resources */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Additional Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <a href="/docs/ARCHITECTURE.md" target="_blank" rel="noopener noreferrer">
            <Card className="h-full hover:border-blue-300 hover:shadow-md transition-all duration-200 text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Network className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Architecture</h3>
                <p className="text-sm text-gray-600">System architecture and design principles</p>
              </CardContent>
            </Card>
          </a>
          
          <a href="/docs/DEPLOYMENT.md" target="_blank" rel="noopener noreferrer">
            <Card className="h-full hover:border-blue-300 hover:shadow-md transition-all duration-200 text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Package className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Deployment</h3>
                <p className="text-sm text-gray-600">Deployment guides and best practices</p>
              </CardContent>
            </Card>
          </a>
          
          <a href="/docs/CLEANUP.md" target="_blank" rel="noopener noreferrer">
            <Card className="h-full hover:border-blue-300 hover:shadow-md transition-all duration-200 text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Cleanup</h3>
                <p className="text-sm text-gray-600">Data cleanup and maintenance procedures</p>
              </CardContent>
            </Card>
          </a>
          
          <a href="/docs/ROUTEE_INTEGRATION.md" target="_blank" rel="noopener noreferrer">
            <Card className="h-full hover:border-blue-300 hover:shadow-md transition-all duration-200 text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Plug className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Routee Integration</h3>
                <p className="text-sm text-gray-600">Routee SMS provider integration guide</p>
              </CardContent>
            </Card>
          </a>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 pt-8">
        <div className="text-center">
          <p className="text-gray-600 text-sm mb-4">Need help? Have questions?</p>
          <div className="flex justify-center gap-6">
            <a href="mailto:cantoniou@waymore.io" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Contact Support
            </a>
            <a href="https://github.com/cantoniouwaymore/emailgateway" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-2">
              <Github className="h-4 w-4" />
              GitHub
            </a>
            <a href="/docs/README.md" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Full Documentation
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

