#!/bin/bash

# Railway Deployment Script for Email Gateway
# This script helps deploy both API and Worker services to Railway

set -e

echo "🚀 Railway Email Gateway Deployment Script"
echo "=========================================="

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

# Function to deploy a service
deploy_service() {
    local service_name=$1
    local service_mode=$2
    
    echo ""
    echo "🔧 Deploying $service_name service..."
    
    # Create service if it doesn't exist
    if ! railway service list | grep -q "$service_name"; then
        echo "Creating service: $service_name"
        railway service create "$service_name"
    else
        echo "Service $service_name already exists"
    fi
    
    # Set service mode
    railway variables set SERVICE_MODE="$service_mode" --service "$service_name"
    
    # Set common environment variables
    railway variables set NODE_ENV=production --service "$service_name"
    railway variables set LOG_LEVEL=info --service "$service_name"
    
    # Set API-specific variables
    if [ "$service_mode" = "api" ]; then
        railway variables set PORT=3000 --service "$service_name"
        railway variables set HOST=0.0.0.0 --service "$service_name"
        railway variables set RATE_GLOBAL_RPS=1000 --service "$service_name"
        railway variables set RATE_TENANT_DEFAULT_RPS=100 --service "$service_name"
    fi
    
    # Set worker-specific variables
    if [ "$service_mode" = "worker" ]; then
        railway variables set WORKER_CONCURRENCY=5 --service "$service_name"
    fi
    
    echo "✅ $service_name service configured"
}

# Function to set up database and Redis
setup_infrastructure() {
    echo ""
    echo "🗄️  Setting up infrastructure..."
    
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

# Function to set up email provider
setup_email_provider() {
    echo ""
    echo "📧 Setting up email provider..."
    
    echo "Please enter your Routee credentials:"
    read -p "Routee Client ID: " routee_client_id
    read -p "Routee Client Secret: " routee_client_secret
    
    # Set provider variables for both services
    railway variables set PROVIDERS_ENABLED=routee --service email-gateway-api
    railway variables set ROUTEE_CLIENT_ID="$routee_client_id" --service email-gateway-api
    railway variables set ROUTEE_CLIENT_SECRET="$routee_client_secret" --service email-gateway-api
    railway variables set ROUTEE_BASE_URL=https://connect.routee.net --service email-gateway-api
    
    railway variables set PROVIDERS_ENABLED=routee --service email-gateway-worker
    railway variables set ROUTEE_CLIENT_ID="$routee_client_id" --service email-gateway-worker
    railway variables set ROUTEE_CLIENT_SECRET="$routee_client_secret" --service email-gateway-worker
    railway variables set ROUTEE_BASE_URL=https://connect.routee.net --service email-gateway-worker
    
    echo "✅ Email provider configured"
}

# Function to set up JWT
setup_jwt() {
    echo ""
    echo "🔐 Setting up JWT authentication..."
    
    # Generate a random JWT secret
    jwt_secret=$(openssl rand -base64 32)
    
    railway variables set JWT_SECRET="$jwt_secret" --service email-gateway-api
    railway variables set JWT_ISSUER=email-gateway --service email-gateway-api
    railway variables set JWT_AUDIENCE=waymore-platform --service email-gateway-api
    
    echo "✅ JWT authentication configured"
    echo "🔑 JWT Secret: $jwt_secret"
    echo "   (Save this secret for your applications)"
}

# Main deployment process
main() {
    echo ""
    echo "Starting deployment process..."
    
    # Deploy API service
    deploy_service "email-gateway-api" "api"
    
    # Deploy Worker service
    deploy_service "email-gateway-worker" "worker"
    
    # Set up infrastructure
    setup_infrastructure
    
    # Set up email provider
    setup_email_provider
    
    # Set up JWT
    setup_jwt
    
    echo ""
    echo "🚀 Deploying services..."
    
    # Deploy both services
    railway up --service email-gateway-api
    railway up --service email-gateway-worker
    
    echo ""
    echo "✅ Deployment complete!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Get your API URL: railway domain --service email-gateway-api"
    echo "2. Test the API: curl https://your-domain.railway.app/healthz"
    echo "3. Check logs: railway logs --service email-gateway-api"
    echo "4. Check worker logs: railway logs --service email-gateway-worker"
    echo ""
    echo "🔧 To test email sending:"
    echo "1. Get a test token: curl https://your-domain.railway.app/test-token"
    echo "2. Send a test email using the API"
    echo ""
    echo "📚 For more information, see docs/RAILWAY_DEPLOYMENT.md"
}

# Run main function
main
