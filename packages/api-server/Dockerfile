FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/shared-types/package*.json ./packages/shared-types/
COPY packages/api-server/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY packages/shared-types/ ./packages/shared-types/
COPY packages/api-server/ ./packages/api-server/

# Build the application
WORKDIR /app/packages/api-server
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:api"]
