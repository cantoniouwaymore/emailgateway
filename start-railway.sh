#!/bin/sh

# Railway startup script for Email Gateway
# This script can run in two modes:
# 1. API mode (default) - runs the web server
# 2. Worker mode - runs the email worker

# Debug: Print environment variables
echo "🔍 Debug: RAILWAY_SERVICE_NAME=$RAILWAY_SERVICE_NAME"
echo "🔍 Debug: SERVICE_MODE=$SERVICE_MODE"
echo "🔍 Debug: RAILWAY_START_COMMAND=$RAILWAY_START_COMMAND"

# Check if we should run in worker mode
if [ "$RAILWAY_SERVICE_NAME" = "email-gateway-worker" ] || [ "$SERVICE_MODE" = "worker" ] || [ "$RAILWAY_START_COMMAND" = "npm run worker" ]; then
  echo "🚀 Starting Email Gateway Worker..."
  
  # Wait for database to be ready
  echo "Waiting for database to be ready..."
  until npx prisma db push --accept-data-loss; do
    echo "Database is unavailable - sleeping"
    sleep 2
  done
  
  echo "Database is ready - running migrations..."
  npx prisma migrate deploy
  
  echo "Starting email worker..."
  exec npm run worker
else
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
fi
