#!/bin/bash

# Railway Deployment Script for Email Gateway API Service
# This script deploys only the API service to Railway

set -e

echo "🚀 Railway Email Gateway API Deployment Script"
echo "=============================================="

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI is not installed. Please install it first:"
    echo "   npm install -g @railway/cli"
    exit 1
fi

# Check if user is logged in
if ! railway whoami &> /dev/null; then
    echo "❌ Not logged in to Railway. Please run:"
    echo "   railway login"
    exit 1
fi

echo "✅ Railway CLI is installed and you're logged in"

# Function to deploy API service
deploy_api_service() {
    local service_name="email-gateway-api"
    
    echo ""
    echo "🔧 Deploying $service_name service..."
    
    # Create service if it doesn't exist
    if ! railway service list | grep -q "$service_name"; then
        echo "Creating service: $service_name"
        railway service create "$service_name"
    else
        echo "Service $service_name already exists"
    fi
    
    # Set service-specific environment variables
    railway variables set SERVICE_MODE=api --service "$service_name"
    railway variables set NODE_ENV=production --service "$service_name"
    railway variables set LOG_LEVEL=info --service "$service_name"
    railway variables set PORT=3000 --service "$service_name"
    railway variables set HOST=0.0.0.0 --service "$service_name"
    railway variables set RATE_GLOBAL_RPS=1000 --service "$service_name"
    railway variables set RATE_TENANT_DEFAULT_RPS=100 --service "$service_name"
    
    echo "✅ $service_name service configured"
}

# Function to set up database and Redis for API service
setup_infrastructure() {
    echo ""
    echo "🗄️  Setting up infrastructure for API service..."
    
    # Add PostgreSQL if not exists
    if ! railway add postgresql --service email-gateway-api 2>/dev/null; then
        echo "PostgreSQL already exists or added successfully"
    fi
    
    # Add Redis if not exists
    if ! railway add redis --service email-gateway-api 2>/dev/null; then
        echo "Redis already exists or added successfully"
    fi
    
    echo "✅ Infrastructure setup complete"
}

# Function to set up email provider for API service
setup_email_provider() {
    echo ""
    echo "📧 Setting up email provider for API service..."
    
    echo "Please enter your Routee credentials:"
    read -p "Routee Client ID: " routee_client_id
    read -p "Routee Client Secret: " routee_client_secret
    
    # Set provider variables for API service
    railway variables set PROVIDERS_ENABLED=routee --service email-gateway-api
    railway variables set ROUTEE_CLIENT_ID="$routee_client_id" --service email-gateway-api
    railway variables set ROUTEE_CLIENT_SECRET="$routee_client_secret" --service email-gateway-api
    railway variables set ROUTEE_BASE_URL=https://connect.routee.net --service email-gateway-api
    
    echo "✅ Email provider configured for API service"
}

# Function to set up JWT for API service
setup_jwt() {
    echo ""
    echo "🔐 Setting up JWT authentication for API service..."
    
    # Generate a random JWT secret
    jwt_secret=$(openssl rand -base64 32)
    
    railway variables set JWT_SECRET="$jwt_secret" --service email-gateway-api
    railway variables set JWT_ISSUER=email-gateway --service email-gateway-api
    railway variables set JWT_AUDIENCE=waymore-platform --service email-gateway-api
    
    echo "✅ JWT authentication configured for API service"
    echo "🔑 JWT Secret: $jwt_secret"
    echo "   (Save this secret for your applications)"
}

# Main deployment process
main() {
    echo ""
    echo "Starting API service deployment process..."
    
    # Deploy API service
    deploy_api_service
    
    # Set up infrastructure
    setup_infrastructure
    
    # Set up email provider
    setup_email_provider
    
    # Set up JWT
    setup_jwt
    
    echo ""
    echo "🚀 Deploying API service..."
    
    # Deploy API service
    railway up --service email-gateway-api
    
    echo ""
    echo "✅ API service deployment complete!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Get your API URL: railway domain --service email-gateway-api"
    echo "2. Test the API: curl https://your-domain.railway.app/healthz"
    echo "3. Check logs: railway logs --service email-gateway-api"
    echo ""
    echo "🔧 To test email sending:"
    echo "1. Get a test token: curl https://your-domain.railway.app/test-token"
    echo "2. Send a test email using the API"
    echo ""
    echo "📚 For more information, see docs/RAILWAY_DEPLOYMENT.md"
}

# Run main function
main
