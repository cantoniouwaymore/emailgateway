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
cd packages/api-server && PORT=3000 npm run dev &
API_PID=$!

# Start worker in background  
echo "⚙️  Starting email worker on port 3001..."
cd packages/email-worker && PORT=3001 npm run dev &
WORKER_PID=$!

# Start admin UI dev server in background
echo "🎨 Starting admin UI dev server on port 5173..."
cd packages/admin-ui && npm run dev &
ADMIN_PID=$!

# Start admin server in background (serves built admin UI)
echo "🎨 Starting admin server on port 5175..."
cd packages/admin-server && npm run dev &
ADMIN_SERVER_PID=$!

# Start docs site in background
echo "📚 Starting docs site on port 5174..."
cd docs-site && npm run dev &
DOCS_PID=$!

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
    kill $ADMIN_PID 2>/dev/null
    kill $ADMIN_SERVER_PID 2>/dev/null
    kill $DOCS_PID 2>/dev/null
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
echo "   🎨 Admin UI (Dev): http://localhost:5173"
echo "   🎨 Admin Server: http://localhost:5175"
echo "   📚 Docs Site: http://localhost:5174"
echo "   📊 Metrics: http://localhost:3000/metrics"
echo "   🌐 ngrok Dashboard: http://localhost:4040"
echo "   🔗 Public Webhook URL: $NGROK_URL/webhooks/routee"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for background processes
wait