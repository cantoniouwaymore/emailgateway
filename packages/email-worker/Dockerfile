FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/shared-types/package*.json ./packages/shared-types/
COPY packages/email-worker/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY packages/shared-types/ ./packages/shared-types/
COPY packages/email-worker/ ./packages/email-worker/

# Build the application
WORKDIR /app/packages/email-worker
RUN npm run build

# Expose port
EXPOSE 3001

# Start the application
CMD ["npm", "run", "start"]
