# Multi-stage build for audit-service
FROM node:20-alpine AS shared-builder

WORKDIR /app

# Copy shared package and build it
COPY packages/shared ./shared
WORKDIR /app/shared
RUN npm install && npm run build

# Build audit service
FROM node:20-alpine AS builder

WORKDIR /app

# Copy the built shared package
COPY --from=shared-builder /app/shared ./shared

# Copy audit service
COPY packages/audit-service ./audit-service

# Install dependencies and build audit service
WORKDIR /app/audit-service
RUN npm install && npm run build

# Production stage
FROM node:20-alpine AS runtime

WORKDIR /app

# Copy built shared package
COPY --from=shared-builder /app/shared ./node_modules/@fdj/shared

# Copy built audit service
COPY --from=builder /app/audit-service/dist ./dist
COPY --from=builder /app/audit-service/node_modules ./node_modules
COPY --from=builder /app/audit-service/package.json ./package.json

# Create a non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S audit -u 1001

# Change ownership of the app directory
RUN chown -R audit:nodejs /app
USER audit

# Expose port
EXPOSE 3002

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "http.get('http://localhost:3002/', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Start the application
CMD ["npm", "start"]
