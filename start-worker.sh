#!/bin/sh

# Railway startup script for Email Gateway Worker Service
# This script runs the email worker

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
exec node dist/queue/worker.js
