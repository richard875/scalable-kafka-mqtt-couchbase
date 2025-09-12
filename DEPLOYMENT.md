# FDJ Demo - Docker Deployment Guide

This guide covers the Docker deployment setup for the FDJ Demo application, which includes three microservices and supporting infrastructure.

## 🏗️ Architecture Overview

### Services

- **Betting Service** (Port 3000) - Handles betting operations
- **Audit Service** (Port 3002) - Logs and audits system events
- **Notification Service** (Port 3001) - Manages real-time notifications via MQTT

### Infrastructure

- **Kafka** - Message broker for inter-service communication
- **Kafka UI (Redpanda Console)** - Web interface for Kafka management
- **FlashMQ** - MQTT broker for WebSocket communication
- **Couchbase** - NoSQL database
- **Nginx** - Reverse proxy for routing

## 🌐 Service Routing

When deployed, all services are accessible through a single entry point via Nginx:

| Service        | Local URL               | AWS URL                      | Description                     |
| -------------- | ----------------------- | ---------------------------- | ------------------------------- |
| Betting API    | `http://localhost:3000` | `http://[aws_url]/api`       | REST API for betting operations |
| MQTT WebSocket | `ws://localhost:8081`   | `ws://[aws_url]/ws`          | WebSocket for real-time updates |
| Couchbase UI   | `http://localhost:8091` | `http://[aws_url]/couchbase` | Database administration         |
| Kafka UI       | `http://localhost:8080` | `http://[aws_url]/kowl`      | Kafka topic management          |

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose installed
- At least 4GB RAM available
- Ports 80, 443 available (or configure different ports)

### Local Development

```bash
# Start all services for local development
docker-compose -f packages/kafka-config/docker-compose.yml up -d
```

### Production Deployment

```bash
# Deploy all services with Nginx proxy
./deploy.sh
```

### Stop Services

```bash
# Stop all services
./stop.sh
```

## 📋 Manual Deployment Steps

If you prefer manual deployment:

### 1. Build Shared Package

```bash
cd packages/shared
npm install
npm run build
cd ../..
```

### 2. Build and Start Services

```bash
# Build all Docker images
docker-compose -f docker-compose.production.yml build

# Start all services
docker-compose -f docker-compose.production.yml up -d
```

### 3. Verify Deployment

```bash
# Check service status
docker-compose -f docker-compose.production.yml ps

# View logs
docker-compose -f docker-compose.production.yml logs -f [service-name]
```

## 🔧 Configuration

### Environment Variables

Each service has its own environment configuration:

- `packages/betting-service/.env.production`
- `packages/audit-service/.env.production`
- `packages/notification-service/.env.production`

### Nginx Configuration

The Nginx configuration is located in:

- `nginx/nginx.conf` - Main configuration
- `nginx/conf.d/default.conf` - Service routing rules

## 🏥 Health Checks

### Service Health Endpoints

- Main health check: `http://localhost/health`
- Individual service health checks are available internally

### Monitoring

```bash
# Check all service status
docker-compose -f docker-compose.production.yml ps

# Monitor service logs
docker-compose -f docker-compose.production.yml logs -f

# Check specific service
docker-compose -f docker-compose.production.yml logs -f betting-service
```

## 🔒 Security Considerations

### Production Deployment

1. **Change Default Passwords**: Update Couchbase admin credentials
2. **SSL/TLS**: Enable HTTPS in Nginx configuration
3. **Firewall**: Restrict access to internal ports
4. **Secrets Management**: Use Docker secrets for sensitive data
5. **Network Isolation**: Services communicate through internal network

### Environment Security

```bash
# Example: Using Docker secrets instead of environment variables
echo "your-secret-password" | docker secret create couchbase_password -
```

## 🐋 AWS Lightsail Container Deployment

### Preparing for AWS Lightsail

1. **Build and push images to a registry**:

```bash
# Tag images for your registry
docker tag fdj-betting-service:latest your-registry/fdj-betting-service:latest
docker tag fdj-audit-service:latest your-registry/fdj-audit-service:latest
docker tag fdj-notification-service:latest your-registry/fdj-notification-service:latest

# Push to registry
docker push your-registry/fdj-betting-service:latest
docker push your-registry/fdj-audit-service:latest
docker push your-registry/fdj-notification-service:latest
```

2. **Create Lightsail container service**:

```bash
# Using AWS CLI
aws lightsail create-container-service \
  --service-name fdj-demo \
  --power small \
  --scale 1
```

3. **Deploy using the production compose file** as a reference for your Lightsail deployment configuration.

## 📊 Scaling Considerations

### Horizontal Scaling

- Each service can be scaled independently
- Kafka partitioning allows for parallel processing
- Load balancing configured in Nginx

### Resource Requirements

- **Minimum**: 4GB RAM, 2 CPU cores
- **Recommended**: 8GB RAM, 4 CPU cores
- **Storage**: 20GB minimum for logs and data

## 🛠️ Troubleshooting

### Common Issues

1. **Port Conflicts**:

```bash
# Check what's using a port
lsof -i :80
```

2. **Service Not Starting**:

```bash
# Check service logs
docker-compose -f docker-compose.production.yml logs service-name
```

3. **Memory Issues**:

```bash
# Check Docker memory usage
docker stats
```

### Service Dependencies

Services start in this order:

1. Kafka
2. Couchbase, FlashMQ
3. Application services (betting, audit, notification)
4. Nginx

## 📁 File Structure

```
├── docker-compose.production.yml   # Main deployment configuration
├── deploy.sh                      # Deployment script
├── stop.sh                        # Stop script
├── nginx/
│   ├── nginx.conf                 # Main Nginx config
│   └── conf.d/
│       └── default.conf           # Service routing
└── packages/
    ├── betting-service/
    │   ├── Dockerfile
    │   ├── .dockerignore
    │   └── .env.production
    ├── audit-service/
    │   ├── Dockerfile
    │   ├── .dockerignore
    │   └── .env.production
    ├── notification-service/
    │   ├── Dockerfile
    │   ├── .dockerignore
    │   └── .env.production
    └── shared/
        ├── Dockerfile
        └── .dockerignore
```

## 📞 Support

For issues or questions:

1. Check service logs first
2. Verify environment configuration
3. Ensure all dependencies are healthy
4. Check Docker and system resources

---

**Note**: This setup is designed for containerized deployment on AWS Lightsail or similar container platforms. For local development, use the existing `packages/kafka-config/docker-compose.yml` setup.
