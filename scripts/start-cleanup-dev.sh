#!/bin/bash

# Development startup script for Database Cleanup Worker
# This script starts the cleanup worker in development mode

echo "🧹 Starting Database Cleanup Worker in Development Mode..."

# Check if we're in the right directory
if [ ! -d "packages/cleanup-worker" ]; then
    echo "❌ Error: This script must be run from the project root directory"
    echo "   Current directory: $(pwd)"
    echo "   Expected: emailgateway/"
    exit 1
fi

# Check if required services are running
echo "Checking dependencies..."

# Check if Redis is running
if ! redis-cli ping > /dev/null 2>&1; then
    echo "❌ Redis is not running. Please start Redis first."
    echo "   You can start it with: redis-server"
    exit 1
fi

# Check if PostgreSQL is running (if using local DB)
if ! pg_isready > /dev/null 2>&1; then
    echo "⚠️  PostgreSQL is not running. Make sure your database is accessible."
fi

echo "✅ Dependencies checked"

# Start cleanup worker
echo "🧹 Starting cleanup worker..."
cd packages/cleanup-worker && npm run dev
