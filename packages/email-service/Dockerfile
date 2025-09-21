# Multi-stage build for email-service
FROM node:20-alpine AS shared-builder

WORKDIR /app

# Copy shared package and build it
COPY packages/shared ./shared
WORKDIR /app/shared
RUN npm install && npm run build

# Build email service
FROM node:20-alpine AS builder

WORKDIR /app

# Copy the built shared package to the correct relative location
COPY --from=shared-builder /app/shared ./packages/shared

# Copy email service
COPY packages/email-service ./packages/email-service

# Install dependencies and build email service
WORKDIR /app/packages/email-service
RUN npm install && npm run build

# Production stage
FROM node:20-alpine AS runtime

WORKDIR /app

# Copy built email service first
COPY --from=builder /app/packages/email-service/dist ./dist
COPY --from=builder /app/packages/email-service/package.json ./package.json

# Copy node_modules (excluding @fdj/shared which we'll replace)
COPY --from=builder /app/packages/email-service/node_modules ./node_modules

# Replace with our built shared package
COPY --from=shared-builder /app/shared ./node_modules/@fdj/shared

# Create a non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S email -u 1001

# Change ownership of the app directory
RUN chown -R email:nodejs /app
USER email

# Expose port
EXPOSE 3003

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "http.get('http://localhost:3003/', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Start the application
CMD ["npm", "start"]
