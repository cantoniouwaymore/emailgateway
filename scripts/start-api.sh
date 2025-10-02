#!/bin/sh

# Production startup script for Waymore Transactional Emails Service API
# This script runs the web server

echo "🚀 Starting Waymore Transactional Emails Service API Server..."

# Wait for database to be ready
echo "Waiting for database to be ready..."
cd packages/api-server
until npx prisma db push --accept-data-loss; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "Database is ready - running migrations..."
npx prisma migrate deploy

echo "Starting API server on port 3000..."
PORT=3000 exec node dist/index.js
