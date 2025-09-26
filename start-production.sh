#!/bin/sh

# Production startup script for Waymore Transactional Emails Service
# This script starts both the API server and worker with proper port separation

echo "🚀 Starting Waymore Transactional Emails Service in Production Mode..."

# Wait for database to be ready
echo "Waiting for database to be ready..."
until npx prisma db push --accept-data-loss; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "Database is ready - running migrations..."
npx prisma migrate deploy

# Start API server in background
echo "🌐 Starting API server on port 3000..."
PORT=3000 npm run start:api &
API_PID=$!

# Start worker in background
echo "⚙️  Starting email worker on port 3001..."
PORT=3001 npm run start:worker &
WORKER_PID=$!

# Function to handle cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down services..."
    kill $API_PID 2>/dev/null
    kill $WORKER_PID 2>/dev/null
    echo "✅ Services stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

echo ""
echo "🎉 Services started successfully!"
echo "   📡 API Server: http://localhost:3000"
echo "   ⚙️  Worker Health: http://localhost:3001/healthz"
echo "   📊 Metrics: http://localhost:3000/metrics"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for background processes
wait
