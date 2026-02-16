# Build stage
FROM node:20-slim AS builder

# Set working directory
WORKDIR /app

# Install build dependencies for native modules (like sqlite3)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Production stage
FROM node:20-slim

# Set working directory
WORKDIR /app

# Create a non-root user
RUN groupadd --gid 1001 nodejs && \
    useradd --uid 1001 --gid nodejs --shell /bin/bash --create-home nodejs

# Copy dependencies from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy application code
COPY . .

# Change ownership to non-root user
RUN chown -R nodejs:nodejs /app

USER nodejs

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
