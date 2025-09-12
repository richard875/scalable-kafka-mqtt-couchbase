#!/bin/bash

# Stop and cleanup script for FDJ Demo application

set -e

echo "🛑 Stopping FDJ Demo application..."

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

# Determine the compose command
if command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
else
    COMPOSE_CMD="docker compose"
fi

# Stop services
print_status "Stopping all services..."
$COMPOSE_CMD -f docker-compose.production.yml down

# Optional: Remove volumes (uncomment if you want to reset all data)
# print_warning "Removing volumes..."
# $COMPOSE_CMD -f docker-compose.production.yml down -v

# Optional: Remove images (uncomment if you want to remove built images)
# print_warning "Removing built images..."
# docker rmi $(docker images | grep fdj | awk '{print $3}') 2>/dev/null || true

print_status "✅ All services stopped successfully!"
print_status ""
print_status "ℹ️  To restart services:"
print_status "  ./deploy.sh"
print_status ""
print_status "ℹ️  Previously running services were accessible at:"
print_status "  🌐 Subdomains: api.localhost, ws.localhost, couchbase.localhost, kowl.localhost"
print_status "  🏥 Health: http://localhost/health"
