import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ExternalLink, ArrowRight, Code, Settings, Mail, Network, Package, Trash2, Plug, Github, Zap, Users, Shield } from 'lucide-react';

export function DocumentationTab() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-2xl border border-blue-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <BookOpen className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Documentation Center</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Everything you need to integrate, configure, and optimize your email gateway system. 
            Access our comprehensive guides, API reference, and best practices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
              onClick={() => window.open('http://localhost:5174/', '_blank')}
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Open Documentation
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-blue-200 text-blue-700 hover:bg-blue-50 px-8 py-3"
              onClick={() => window.open('http://localhost:5174/admin/', '_blank')}
            >
              <Settings className="h-5 w-5 mr-2" />
              Admin Dashboard Guide
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-blue-200 text-blue-700 hover:bg-blue-50 px-8 py-3"
              onClick={() => window.open('http://localhost:5174/quick-start', '_blank')}
            >
              <Zap className="h-5 w-5 mr-2" />
              Quick Start Guide
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* API Reference */}
        <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => window.open('http://localhost:5174/api/', '_blank')}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Code className="h-6 w-6 text-blue-600" />
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">API Reference</h3>
            <p className="text-gray-600 text-sm mb-4">Complete API documentation with examples, endpoints, and authentication details.</p>
            <div className="flex items-center text-blue-600 text-sm font-medium">
              View API Docs
              <ArrowRight className="h-4 w-4 ml-1" />
            </div>
          </CardContent>
        </Card>

        {/* Quick Start */}
        <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => window.open('http://localhost:5174/quick-start', '_blank')}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-green-600 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Start</h3>
            <p className="text-gray-600 text-sm mb-4">Get up and running in minutes with our step-by-step setup guide.</p>
            <div className="flex items-center text-green-600 text-sm font-medium">
              Start Here
              <ArrowRight className="h-4 w-4 ml-1" />
            </div>
          </CardContent>
        </Card>

        {/* Developer Guide */}
        <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => window.open('http://localhost:5174/guides/developer', '_blank')}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Settings className="h-6 w-6 text-purple-600" />
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Developer Guide</h3>
            <p className="text-gray-600 text-sm mb-4">Setup, configuration, and development best practices for integrating with our platform.</p>
            <div className="flex items-center text-purple-600 text-sm font-medium">
              Learn More
              <ArrowRight className="h-4 w-4 ml-1" />
            </div>
          </CardContent>
        </Card>

        {/* Template System */}
        <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => window.open('http://localhost:5174/guides/templates', '_blank')}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Mail className="h-6 w-6 text-orange-600" />
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-orange-600 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Template System</h3>
            <p className="text-gray-600 text-sm mb-4">Learn how to create, manage, and optimize email templates using our powerful template system.</p>
            <div className="flex items-center text-orange-600 text-sm font-medium">
              Explore Templates
              <ArrowRight className="h-4 w-4 ml-1" />
            </div>
          </CardContent>
        </Card>

        {/* Architecture */}
        <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => window.open('http://localhost:5174/guides/architecture', '_blank')}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Network className="h-6 w-6 text-indigo-600" />
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Architecture</h3>
            <p className="text-gray-600 text-sm mb-4">Understand the system architecture, design principles, and how all components work together.</p>
            <div className="flex items-center text-indigo-600 text-sm font-medium">
              View Architecture
              <ArrowRight className="h-4 w-4 ml-1" />
            </div>
          </CardContent>
        </Card>

        {/* Deployment */}
        <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => window.open('http://localhost:5174/guides/deployment', '_blank')}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-yellow-600" />
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-yellow-600 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Deployment</h3>
            <p className="text-gray-600 text-sm mb-4">Comprehensive deployment guides and best practices for production environments.</p>
            <div className="flex items-center text-yellow-600 text-sm font-medium">
              Deploy Now
              <ArrowRight className="h-4 w-4 ml-1" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Resources */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Additional Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => window.open('http://localhost:5174/guides/cleanup', '_blank')}>
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cleanup & Maintenance</h3>
              <p className="text-sm text-gray-600">Data cleanup and maintenance procedures</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => window.open('http://localhost:5174/guides/routee', '_blank')}>
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Plug className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Routee Integration</h3>
              <p className="text-sm text-gray-600">Detailed guide for Routee email provider</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => window.open('http://localhost:5174/guides/locale-system', '_blank')}>
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Locale System</h3>
              <p className="text-sm text-gray-600">Multi-language support and internationalization</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => window.open('http://localhost:5174/guides/monorepo-structure', '_blank')}>
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Monorepo Structure</h3>
              <p className="text-sm text-gray-600">Project organization and development workflow</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Can't find what you're looking for? Our comprehensive documentation has everything you need, 
          or reach out to our support team for personalized assistance.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="outline" 
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
            onClick={() => window.open('http://localhost:5174/', '_blank')}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Browse All Documentation
          </Button>
          <Button 
            variant="outline" 
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
            onClick={() => window.open('https://github.com/cantoniouwaymore/emailgateway/issues', '_blank')}
          >
            <Github className="h-4 w-4 mr-2" />
            GitHub Issues
          </Button>
        </div>
      </div>
    </div>
  );
}