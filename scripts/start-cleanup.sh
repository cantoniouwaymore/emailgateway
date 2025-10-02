#!/bin/bash

# Database Cleanup Worker Startup Script
# This script starts the database cleanup worker

echo "🧹 Starting Database Cleanup Worker..."

# Check if we're in development or production
if [ "$NODE_ENV" = "development" ]; then
    echo "🔧 Development mode - using tsx"
    cd packages/cleanup-worker
    npm run dev
else
    echo "🚀 Production mode - using compiled JavaScript"
    cd packages/cleanup-worker
    npm run start
fi
