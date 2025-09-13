#!/bin/bash

# Build and deploy script for FDJ Demo application

set -e

echo "🚀 Starting FDJ Demo deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

print_status "Docker is running ✓"

# Check if docker compose is available
if ! docker compose version &> /dev/null; then
    print_error "Docker Compose is not available. Please install Docker Compose and try again."
    exit 1
fi

print_status "Docker Compose is available ✓"

# Use the modern docker compose command
COMPOSE_CMD="docker compose"

print_status "Using compose command: $COMPOSE_CMD"

# Build shared package first (needed by all services)
print_status "Building shared package..."
cd packages/shared
npm install
npm run build
cd ../..

# Build and start services
print_status "Building and starting all services..."
$COMPOSE_CMD -f docker-compose.production.yml build --no-cache

print_status "Starting services..."
$COMPOSE_CMD -f docker-compose.production.yml up -d

# Wait for services to be healthy
print_status "Waiting for services to be healthy..."
sleep 30

# Check service health
print_status "Checking service health..."

services=("betting-service" "audit-service" "notification-service" "kafka" "kafka-ui" "flashmq" "couchbase" "nginx-proxy")

for service in "${services[@]}"; do
    if $COMPOSE_CMD -f docker-compose.production.yml ps | grep -q "$service.*Up"; then
        print_status "$service is running ✓"
    else
        print_warning "$service is not running properly"
    fi
done

print_status "Deployment completed!"
print_status ""
print_status "🎉 Your services are now available at:"
print_status ""
print_status "🌐 SUBDOMAIN ACCESS (requires DNS/hosts setup):"
print_status "  📊 Kafka UI (Kowl): https://kowl.unibet.richardeverley.com"
print_status "  🗄️ Couchbase UI: https://couchbase.unibet.richardeverley.com"
print_status "  🔔 WebSocket (MQTT): ws://ws.unibet.richardeverley.com"
print_status "  🎲 Betting API: https://api.unibet.richardeverley.com"
print_status ""
print_status "🏥 MAIN DOMAIN:"
print_status "  💓 Health Check: https://unibet.richardeverley.com/health"
print_status ""
print_status "⚙️  DIRECT PORT ACCESS (development):"
print_status "  📊 Kafka UI: http://localhost:8080"
print_status "  🗄️ Couchbase UI: http://localhost:8091"
print_status "  🔔 MQTT WebSocket: ws://localhost:8081"
print_status ""

# Check if hosts entries already exist
if ! grep -q "api.localhost ws.localhost couchbase.localhost kowl.localhost" /etc/hosts; then
    print_warning "For subdomain access, add to /etc/hosts:"
    print_warning "127.0.0.1 api.localhost ws.localhost couchbase.localhost kowl.localhost"
    print_status ""
    print_status "You can run this command to add them automatically:"
    print_status "sudo sh -c 'echo \"127.0.0.1 api.localhost ws.localhost couchbase.localhost kowl.localhost\" >> /etc/hosts'"
else
    print_status "✓ Subdomain entries are already configured in /etc/hosts"
fi
print_status ""
print_status "To view logs: $COMPOSE_CMD -f docker-compose.production.yml logs -f [service-name]"
print_status "To stop services: $COMPOSE_CMD -f docker-compose.production.yml down"
