#!/bin/sh

# Production startup script for Email Gateway API Service
# This script runs the web server

echo "🚀 Starting Email Gateway API Server..."

# Wait for database to be ready
echo "Waiting for database to be ready..."
until npx prisma db push --accept-data-loss; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "Database is ready - running migrations..."
npx prisma migrate deploy

echo "Starting API server..."
exec node dist/index.js
