# Multi-stage build for notification-service
FROM node:20-alpine AS shared-builder

WORKDIR /app

# Copy shared package and build it
COPY packages/shared ./shared
WORKDIR /app/shared
RUN npm install && npm run build

# Build notification service
FROM node:20-alpine AS builder

WORKDIR /app

# Copy the built shared package to the correct relative location
COPY --from=shared-builder /app/shared ./packages/shared

# Copy notification service
COPY packages/notification-service ./packages/notification-service

# Install dependencies and build notification service
WORKDIR /app/packages/notification-service
RUN npm install && npm run build

# Production stage
FROM node:20-alpine AS runtime

WORKDIR /app

# Copy built notification service first
COPY --from=builder /app/packages/notification-service/dist ./dist
COPY --from=builder /app/packages/notification-service/package.json ./package.json

# Copy node_modules (excluding @fdj/shared which we'll replace)
COPY --from=builder /app/packages/notification-service/node_modules ./node_modules

# Replace with our built shared package
COPY --from=shared-builder /app/shared ./node_modules/@fdj/shared

# Create a non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S notification -u 1001

# Change ownership of the app directory
RUN chown -R notification:nodejs /app
USER notification

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "http.get('http://localhost:3001/', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Start the application
CMD ["npm", "start"]
