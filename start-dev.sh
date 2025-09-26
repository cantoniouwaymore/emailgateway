#!/bin/bash

# Waymore Transactional Emails Service Development Startup Script
# This script starts both the API server and worker process

echo "🚀 Starting Waymore Transactional Emails Service Development Environment..."

# Check if required services are running
echo "📋 Checking prerequisites..."

# Check PostgreSQL
if ! pg_isready -q; then
    echo "❌ PostgreSQL is not running. Please start it first:"
    echo "   brew services start postgresql@15"
    echo "   or: docker run --name emailgateway-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=emailgateway -p 5432:5432 -d postgres:15"
    exit 1
fi

# Check Redis
if ! redis-cli ping > /dev/null 2>&1; then
    echo "❌ Redis is not running. Please start it first:"
    echo "   brew services start redis"
    echo "   or: docker run --name emailgateway-redis -p 6379:6379 -d redis:7-alpine"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Start API server in background
echo "🌐 Starting API Server on port 3000..."
npm run dev:api &
API_PID=$!

# Wait a moment for API server to start
sleep 3

# Start worker with different port
echo "⚙️  Starting Worker Process on port 3001..."
PORT=3001 npm run dev:worker &
WORKER_PID=$!

echo ""
echo "🎉 Waymore Transactional Emails Service is starting up!"
echo ""
echo "📊 Services:"
echo "   API Server:  http://localhost:3000"
echo "   Worker:      http://localhost:3001/healthz"
echo "   Admin Panel: http://localhost:3000/admin"
echo ""
echo "🔍 Health Checks:"
echo "   API:  curl http://localhost:3000/healthz"
echo "   Worker: curl http://localhost:3001/healthz"
echo ""
echo "📝 Logs:"
echo "   API Server PID: $API_PID"
echo "   Worker PID: $WORKER_PID"
echo ""
echo "🛑 To stop both processes:"
echo "   kill $API_PID $WORKER_PID"
echo "   or: pkill -f 'tsx.*waymore-transactional-emails-service'"
echo ""

# Wait for both processes
wait