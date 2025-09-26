#!/bin/bash

# Database Cleanup Worker Startup Script
# This script starts the database cleanup worker

echo "🧹 Starting Database Cleanup Worker..."

# Check if we're in development or production
if [ "$NODE_ENV" = "development" ]; then
    echo "🔧 Development mode - using tsx"
    npm run cleanup
else
    echo "🚀 Production mode - using compiled JavaScript"
    npm run start:cleanup
fi
