#!/bin/bash

echo "🚀 Starting Email Gateway Development Environment"
echo "================================================"

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Copying from env.example..."
    cp env.example .env
    echo "✅ Created .env file. Please edit it with your configuration."
fi

# Start dependencies
echo "📦 Starting dependencies (PostgreSQL + Redis)..."
docker-compose up -d postgres redis

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 5

# Check if database is ready
echo "🔍 Checking database connection..."
until docker-compose exec postgres pg_isready -U postgres > /dev/null 2>&1; do
    echo "   Waiting for PostgreSQL..."
    sleep 2
done
echo "✅ PostgreSQL is ready"

# Check if Redis is ready
echo "🔍 Checking Redis connection..."
until docker-compose exec redis redis-cli ping > /dev/null 2>&1; do
    echo "   Waiting for Redis..."
    sleep 2
done
echo "✅ Redis is ready"

# Run database migrations
echo "🗄️  Running database migrations..."
npm run migrate

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run generate

echo ""
echo "🎉 Setup complete! You can now:"
echo ""
echo "   Start the API server:"
echo "   npm run dev"
echo ""
echo "   Start the worker (in another terminal):"
echo "   npm run worker"
echo ""
echo "   Test the API:"
echo "   node test-api.js"
echo ""
echo "   View logs:"
echo "   docker-compose logs -f"
echo ""
