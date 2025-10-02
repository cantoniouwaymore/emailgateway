#!/bin/bash

# Individual service startup script for Waymore Transactional Emails Service
# Usage: ./scripts/start-service.sh <service-name>
# Services: api-server, email-worker, admin-ui, cleanup-worker

SERVICE=$1

if [ -z "$SERVICE" ]; then
    echo "❌ Error: Service name required"
    echo ""
    echo "Usage: ./scripts/start-service.sh <service-name>"
    echo ""
    echo "Available services:"
    echo "  api-server     - Main HTTP API server (port 3000)"
    echo "  email-worker   - Background email processing (port 3001)"
    echo "  admin-ui       - React frontend (port 5173)"
    echo "  cleanup-worker - Database maintenance"
    echo ""
    exit 1
fi

# Check if we're in the right directory
if [ ! -d "packages/$SERVICE" ]; then
    echo "❌ Error: Service '$SERVICE' not found"
    echo "   Available services:"
    ls packages/ | grep -v shared-types
    exit 1
fi

echo "🚀 Starting $SERVICE service..."

case $SERVICE in
    "api-server")
        echo "🌐 Starting API server on port 3000..."
        cd packages/api-server && npm run dev
        ;;
    "email-worker")
        echo "⚙️  Starting email worker on port 3001..."
        cd packages/email-worker && npm run dev
        ;;
    "admin-ui")
        echo "🎨 Starting admin UI on port 5173..."
        cd packages/admin-ui && npm run dev
        ;;
    "cleanup-worker")
        echo "🧹 Starting cleanup worker..."
        cd packages/cleanup-worker && npm run dev
        ;;
    *)
        echo "❌ Error: Unknown service '$SERVICE'"
        echo "   Available services: api-server, email-worker, admin-ui, cleanup-worker"
        exit 1
        ;;
esac
