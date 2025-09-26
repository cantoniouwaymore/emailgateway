#!/bin/sh

# Production startup script for Waymore Transactional Emails Service Worker
# This script runs the email worker

echo "🚀 Starting Waymore Transactional Emails Service Worker..."

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
