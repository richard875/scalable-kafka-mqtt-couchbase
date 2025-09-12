# iGaming Demo — Development & Deployment Guide

This repository contains a small demo microservice platform used for onboarding and experimentation. It includes a React frontend, three Node.js microservices (betting, notification, audit), and supporting infrastructure (Kafka, FlashMQ for MQTT, Couchbase, and Nginx). This README consolidates local development instructions, production-like Docker deployment steps, troubleshooting tips, and the onboarding task checklist.

## Table of contents

- Introduction
- Quick start (development)
- Services & ports
- Local development (detailed)
- Production-like Docker deployment
- Nginx, DNS, and networking notes
- Tasks and onboarding checklist
- Troubleshooting & common commands
- Security & production checklist
- AWS Lightsail / container deployment notes
- File structure
- Support

## Introduction

This repo is intended to make it easy to spin up a realistic, containerized microservice stack locally or in a production-like environment. The main goals are:

- Let developers run the stack locally with minimal friction (Kafka, MQTT, Couchbase, services, and frontend).
- Provide a Docker-based production-like deployment with Nginx reverse proxy and subdomain routing.
- Provide simple exercises (send a message via Kafka, push MQTT messages to FlashMQ, inspect Couchbase) to understand the platform.

Assumptions/notes:

- The instructions below assume macOS or Linux with Docker and Docker Compose installed for Docker mode, and Node.js installed for local development mode.
- Port numbers referenced are the defaults used in this repository; change them in the compose files or service env files if needed.

## Quick start (development - recommended)

1. Start infrastructure (Kafka, MQTT, Couchbase):

   npm run infra:dev

2. Install dependencies:

   npm install

3. Build the shared package:

   npm run build:shared

4. Start all services and frontend:

   npm run dev

After these steps the main URLs are available on the local machine (see Services & ports below).

## Services & ports

Development mode (direct access):

- Frontend: http://localhost:5173
- Betting service (API): http://localhost:3000
- Notification service: http://localhost:3001
- Audit service: http://localhost:3002
- Kafka UI (Kowl/console): http://localhost:8080
- Couchbase UI: http://localhost:8091
- MQTT WebSocket (FlashMQ): ws://localhost:8081

Docker mode (via Nginx proxy + subdomains):

For subdomain access you can add entries to `/etc/hosts`:

127.0.0.1 api.localhost
127.0.0.1 ws.localhost
127.0.0.1 couchbase.localhost
127.0.0.1 kowl.localhost

Then:

- Betting API: http://api.localhost
- MQTT WebSocket: ws://ws.localhost
- Couchbase UI: http://couchbase.localhost
- Kafka UI: http://kowl.localhost
- Health check (root): http://localhost/health

## Local development (detailed)

This mode runs services directly on the host for fast edit–compile–run cycles.

### Infrastructure Commands

```bash
npm run infra:dev        # Start infrastructure
npm run infra:dev:down   # Stop infrastructure
```

### Development Commands

```bash
npm run dev:frontend             # Start frontend only
npm run dev:betting-service      # Start betting service only
npm run dev:notification-service # Start notification service only
npm run dev:audit-service       # Start audit service only
npm run dev                     # Start all services
```

### Building Commands

```bash
npm run build:shared            # Build shared package
npm run build:frontend          # Build frontend
npm run build:betting-service   # Build betting service
npm run build:notification-service # Build notification service
npm run build:audit-service     # Build audit service
npm run build                   # Build everything
```

### Docker Commands

```bash
npm run docker:build    # Build Docker images
npm run docker:up       # Start Docker services
npm run docker:down     # Stop Docker services
npm run docker:logs     # View Docker logs
npm run docker:deploy   # Full deployment script
npm run docker:stop     # Stop deployment script
```

### Development Workflow

1. **Start infrastructure**: `npm run infra:dev`
2. **Install deps**: `npm install`
3. **Build shared**: `npm run build:shared`
4. **Start services**: `npm run dev`
5. **Code changes**: Services auto-reload with `tsx watch`
6. **Test APIs**: Use the frontend or tools like Postman
7. **View messages**: Check Kafka UI at http://localhost:8080
8. **Monitor MQTT**: Check FlashMQ WebSocket at ws://localhost:8081

### Testing the Setup

#### Test Betting Service

```bash
# Development mode
curl http://localhost:3000/

# Docker mode (requires /etc/hosts entry)
curl http://api.localhost/
```

#### Test WebSocket Connection

Open browser console and run:

```javascript
// Development mode
const ws = new WebSocket("ws://localhost:8081");

// Docker mode (requires /etc/hosts entry)
const ws = new WebSocket("ws://ws.localhost");

ws.onopen = () => console.log("Connected");
ws.onmessage = msg => console.log("Message:", msg.data);
```

#### Test Kafka UI

- Development: http://localhost:8080
- Docker: http://kowl.localhost (requires /etc/hosts entry)

#### Test Couchbase UI

- Development: http://localhost:8091
- Docker: http://couchbase.localhost (requires /etc/hosts entry)
- Username: Administrator
- Password: password

## Production-like Docker deployment

This repository includes a production-like Docker Compose file and an Nginx reverse proxy to expose services on subdomains. Use this mode for end-to-end integration testing or demo deployments.

### Prerequisites

- Docker & Docker Compose installed
- At least 4GB RAM available
- Ports 80, 443 available (or configure different ports)

### Quick Deploy

```bash
# Deploy everything with Docker + Nginx
./deploy.sh

# Stop everything
./stop.sh
```

### Manual Docker Steps

If you prefer manual deployment:

1. Build shared package:

```bash
cd packages/shared
npm install
npm run build
cd ../..
```

2. Build Docker images from the root:

```bash
docker-compose -f docker-compose.production.yml build
```

3. Start services:

```bash
docker-compose -f docker-compose.production.yml up -d
```

4. Verify deployment:

```bash
# Check service status
docker-compose -f docker-compose.production.yml ps

# View logs
docker-compose -f docker-compose.production.yml logs -f [service-name]
```

### Configuration

#### Environment Variables

Each service has its own environment configuration:

- `packages/betting-service/.env.production`
- `packages/audit-service/.env.production`
- `packages/notification-service/.env.production`

#### Service Dependencies

Services start in this order:

1. Kafka
2. Couchbase, FlashMQ
3. Application services (betting, audit, notification)
4. Nginx

### Health Checks

- Main health check: `http://[domain]/health`
- Individual service health checks are available internally

### Monitoring

````bash
# Check all service status
docker-compose -f docker-compose.production.yml ps

# Monitor service logs
docker-compose -f docker-compose.production.yml logs -f

# Check specific service
docker-compose -f docker-compose.production.yml logs -f betting-service
```## Nginx, DNS, and routing notes

### Nginx Configuration

The Nginx configuration is located in:

- `nginx/nginx.conf` - Main configuration
- `nginx/conf.d/default.conf` - Service routing rules

### Local Development DNS Setup

For local testing with subdomains, add to `/etc/hosts`:

```bash
127.0.0.1 api.localhost
127.0.0.1 ws.localhost
127.0.0.1 couchbase.localhost
127.0.0.1 kowl.localhost
````

### Production DNS Configuration

For subdomain routing to work in production, you'll need to configure DNS records:

```
Type: A
Name: [domain]
Value: [server_ip]

Type: A (or CNAME)
Name: api.[domain]
Value: [server_ip]

Type: A (or CNAME)
Name: ws.[domain]
Value: [server_ip]

Type: A (or CNAME)
Name: couchbase.[domain]
Value: [server_ip]

Type: A (or CNAME)
Name: kowl.[domain]
Value: [server_ip]
```

Or use a wildcard DNS record:

```
Type: A
Name: *.[domain]
Value: [server_ip]
```

### Service Routing Table

| Service        | Local URL               | AWS URL                         | Description                     |
| -------------- | ----------------------- | ------------------------------- | ------------------------------- |
| Betting API    | `http://localhost:3000` | `http://api.[aws_domain]`       | REST API for betting operations |
| MQTT WebSocket | `ws://localhost:8081`   | `ws://ws.[aws_domain]`          | WebSocket for real-time updates |
| Couchbase UI   | `http://localhost:8091` | `http://couchbase.[aws_domain]` | Database administration         |
| Kafka UI       | `http://localhost:8080` | `http://kowl.[aws_domain]`      | Kafka topic management          |
| Health Check   | N/A                     | `http://[aws_domain]/health`    | Main service health status      |

- Nginx binds ports 80 and 443 on the host in production mode. Ensure those ports are free or adjust the compose file.

## Onboarding task checklist (from `task.md`)

This checklist is a compact set of hands-on exercises useful for onboarding:

- Use Docker Compose to run Kafka and a Kafka UI (Kowl or similar).
- From Node.js, produce and consume a message using kafkajs.
- Spin up a Couchbase container and explore the web UI.
- Run FlashMQ (an MQTT broker) in a container and use MQTT.js from Node to publish a message.
- From the frontend, connect using MQTT.js over WebSocket to verify messages are routed to the client.

Notes and useful ports (development):

- MQTT WebSocket: ws://localhost:8081
- Betting API: http://localhost:3000
- Couchbase UI: http://localhost:8091
- Kafka UI: http://localhost:8080

This set of exercises covers a large portion of the demo stack (message broker, realtime push, persistence, and UI).

## Troubleshooting & common commands

### Check Service Status

```bash
# Development mode
ps aux | grep node

# Docker mode
docker-compose -f docker-compose.production.yml ps
```

### View Logs

```bash
# Development mode - logs appear in terminal

# Docker mode
npm run docker:logs
# or for specific service:
docker-compose -f docker-compose.production.yml logs -f betting-service
```

### Port Conflicts

```bash
# Check what's using a port
lsof -i :3000
lsof -i :80
```

### Memory Issues

```bash
# Check Docker memory usage
docker stats
```

### Clean Reset

```bash
# Stop everything
npm run infra:dev:down
./stop.sh

# Clear Docker cache
docker system prune -f

# Restart
npm run infra:dev
npm run dev
```

### Common Issues

1. **Port Conflicts**: Check what's using a port with `lsof -i :80`
2. **Service Not Starting**: Check service logs with `docker-compose logs service-name`
3. **Memory Issues**: Check Docker memory usage with `docker stats`

If a service fails to start, check its logs and verify that Kafka, FlashMQ, and Couchbase are healthy first — many services depend on them.## Security & production checklist

Before deploying to production consider the following:

- Change default Couchbase credentials and any default passwords.
- Enable SSL/TLS on Nginx and redirect HTTP to HTTPS.
- Use Docker secrets or a vault for sensitive environment variables.
- Restrict access to internal ports with firewall rules.
- Use network segmentation in Docker Compose or your orchestration platform.

Example: create a Docker secret for a password instead of env vars:

    echo "your-secret-password" | docker secret create couchbase_password -

## AWS Lightsail / container deployment notes

To deploy to a container service like AWS Lightsail:

1. Build and push container images to a registry (ECR, Docker Hub, or similar):

   docker tag fdj-betting-service:latest your-registry/fdj-betting-service:latest
   docker push your-registry/fdj-betting-service:latest

2. Create the container service and deploy using the production compose as a reference.

3. Ensure DNS records or wildcard DNS are configured for subdomain routing.

## Scaling considerations

- Services can be scaled horizontally; ensure Kafka topics and partitions are configured for throughput.
- Add load balancing in Nginx as needed and monitor resource usage.
- Minimum recommended resources for the full stack: 4GB RAM, 2 CPU; recommended for comfortable use: 8GB, 4 CPU.

## File structure (detailed overview)

The repository contains multiple packages and infra config. Key items:

```
├── deploy.sh                      # Deployment script
├── stop.sh                        # Stop script
├── docker-compose.production.yml   # Main deployment configuration
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
    ├── shared/
    │   ├── Dockerfile
    │   └── .dockerignore
    └── kafka-config/
        └── docker-compose.yml
```

For per-service details, see the `packages/*` directories.## Support

If you run into issues:

1. Check service logs first.
2. Verify dependencies (Kafka, FlashMQ, Couchbase) are running.
3. Check Docker resource allocation if containers fail to start.
4. If you need help, open an issue or contact the repository owner.
