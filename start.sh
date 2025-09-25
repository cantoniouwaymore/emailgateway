#!/bin/sh

# Wait for database to be ready
echo "Waiting for database to be ready..."
until npx prisma db push --accept-data-loss; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "Database is ready - running migrations..."
npx prisma migrate deploy

echo "Starting application..."
exec node dist/index.js
