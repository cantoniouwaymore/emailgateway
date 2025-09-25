# Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY src ./src/
COPY tsconfig.json ./

# Build the project
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Install OpenSSL and other required libraries for Prisma
RUN apk add --no-cache openssl openssl-dev

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist/

# Copy startup scripts
COPY start.sh ./start.sh
COPY start-railway.sh ./start-railway.sh
COPY start-api.sh ./start-api.sh
COPY start-worker.sh ./start-worker.sh
RUN chmod +x ./start.sh ./start-railway.sh ./start-api.sh ./start-worker.sh

# Generate Prisma client
RUN npx prisma generate

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/healthz', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
# Use Railway script if RAILWAY environment is set, otherwise use regular start script
CMD ["sh", "-c", "if [ -n \"$RAILWAY\" ]; then ./start-railway.sh; else ./start.sh; fi"]
