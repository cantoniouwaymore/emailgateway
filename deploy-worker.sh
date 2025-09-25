#!/bin/bash

# Railway Deployment Script for Email Gateway Worker Service
# This script deploys only the Worker service to Railway

set -e

echo "🚀 Railway Email Gateway Worker Deployment Script"
echo "================================================"

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

# Function to deploy Worker service
deploy_worker_service() {
    local service_name="email-gateway-worker"
    
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
    railway variables set SERVICE_MODE=worker --service "$service_name"
    railway variables set NODE_ENV=production --service "$service_name"
    railway variables set LOG_LEVEL=info --service "$service_name"
    railway variables set PORT=3000 --service "$service_name"
    railway variables set HOST=0.0.0.0 --service "$service_name"
    railway variables set WORKER_CONCURRENCY=5 --service "$service_name"
    
    echo "✅ $service_name service configured"
}

# Function to set up database and Redis for Worker service
setup_infrastructure() {
    echo ""
    echo "🗄️  Setting up infrastructure for Worker service..."
    
    # Add PostgreSQL if not exists
    if ! railway add postgresql --service email-gateway-worker 2>/dev/null; then
        echo "PostgreSQL already exists or added successfully"
    fi
    
    # Add Redis if not exists
    if ! railway add redis --service email-gateway-worker 2>/dev/null; then
        echo "Redis already exists or added successfully"
    fi
    
    echo "✅ Infrastructure setup complete"
}

# Function to set up email provider for Worker service
setup_email_provider() {
    echo ""
    echo "📧 Setting up email provider for Worker service..."
    
    echo "Please enter your Routee credentials:"
    read -p "Routee Client ID: " routee_client_id
    read -p "Routee Client Secret: " routee_client_secret
    
    # Set provider variables for Worker service
    railway variables set PROVIDERS_ENABLED=routee --service email-gateway-worker
    railway variables set ROUTEE_CLIENT_ID="$routee_client_id" --service email-gateway-worker
    railway variables set ROUTEE_CLIENT_SECRET="$routee_client_secret" --service email-gateway-worker
    railway variables set ROUTEE_BASE_URL=https://connect.routee.net --service email-gateway-worker
    
    echo "✅ Email provider configured for Worker service"
}

# Function to set up JWT for Worker service (needed for database access)
setup_jwt() {
    echo ""
    echo "🔐 Setting up JWT authentication for Worker service..."
    
    # Generate a random JWT secret (same as API service)
    jwt_secret=$(openssl rand -base64 32)
    
    railway variables set JWT_SECRET="$jwt_secret" --service email-gateway-worker
    railway variables set JWT_ISSUER=email-gateway --service email-gateway-worker
    railway variables set JWT_AUDIENCE=waymore-platform --service email-gateway-worker
    
    echo "✅ JWT authentication configured for Worker service"
    echo "🔑 JWT Secret: $jwt_secret"
    echo "   (This should match the API service secret)"
}

# Main deployment process
main() {
    echo ""
    echo "Starting Worker service deployment process..."
    
    # Deploy Worker service
    deploy_worker_service
    
    # Set up infrastructure
    setup_infrastructure
    
    # Set up email provider
    setup_email_provider
    
    # Set up JWT
    setup_jwt
    
    echo ""
    echo "🚀 Deploying Worker service..."
    
    # Deploy Worker service
    railway up --service email-gateway-worker
    
    echo ""
    echo "✅ Worker service deployment complete!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Check worker logs: railway logs --service email-gateway-worker"
    echo "2. Monitor worker health: railway logs --service email-gateway-worker | grep health"
    echo ""
    echo "🔧 To test worker functionality:"
    echo "1. Send an email through the API service"
    echo "2. Check worker logs to see email processing"
    echo ""
    echo "📚 For more information, see docs/RAILWAY_DEPLOYMENT.md"
}

# Run main function
main
