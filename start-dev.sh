#!/bin/sh

# Development startup script for Waymore Transactional Emails Service
# This script starts both the API server and worker with proper port separation

echo "🚀 Starting Waymore Transactional Emails Service in Development Mode..."

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

# Start API server in background
echo "🌐 Starting API server on port 3000..."
PORT=3000 npm run dev:api &
API_PID=$!

# Start worker in background  
echo "⚙️  Starting email worker on port 3001..."
PORT=3001 npm run dev:worker &
WORKER_PID=$!

# Start ngrok tunnel for webhook development
echo "🌐 Starting ngrok tunnel for webhook development..."
ngrok http 3000 --log=stdout > /tmp/ngrok.log 2>&1 &
NGROK_PID=$!

# Wait a moment for ngrok to start
sleep 3

# Get ngrok public URL
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | jq -r '.tunnels[0].public_url' 2>/dev/null || echo "https://your-ngrok-url.ngrok.io")

# Function to handle cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down services..."
    kill $API_PID 2>/dev/null
    kill $WORKER_PID 2>/dev/null
    kill $NGROK_PID 2>/dev/null
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
echo "   🌐 ngrok Dashboard: http://localhost:4040"
echo "   🔗 Public Webhook URL: $NGROK_URL/webhooks/routee"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for background processes
wait