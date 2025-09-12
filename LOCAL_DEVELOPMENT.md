# FDJ Demo - Local Development Quick Reference

## 🚀 Quick Start Commands

### Development Mode (Recommended)

```bash
# 1. Start infrastructure (Kafka, MQTT, Couchbase)
npm run infra:dev

# 2. Install dependencies
npm install

# 3. Build shared package
npm run build:shared

# 4. Start all services
npm run dev
```

### Production-like Docker Mode

```bash
# Deploy everything with Docker + Nginx
./deploy.sh

# Stop everything
./stop.sh
```

## 🌐 Service URLs

### Development Mode

- Frontend: http://localhost:5173
- Betting Service: http://localhost:3000
- Notification Service: http://localhost:3001
- Audit Service: http://localhost:3002
- Kafka UI: http://localhost:8080
- Couchbase UI: http://localhost:8091
- MQTT WebSocket: ws://localhost:8081

### Docker Mode (with Nginx)

- Betting API: http://localhost/api
- MQTT WebSocket: ws://localhost/ws
- Kafka UI: http://localhost/kowl
- Couchbase UI: http://localhost/couchbase
- Health Check: http://localhost/health

## 🛠️ Individual Service Commands

### Infrastructure

```bash
npm run infra:dev        # Start infrastructure
npm run infra:dev:down   # Stop infrastructure
```

### Development

```bash
npm run dev:frontend             # Start frontend only
npm run dev:betting-service      # Start betting service only
npm run dev:notification-service # Start notification service only
npm run dev:audit-service       # Start audit service only
npm run dev                     # Start all services
```

### Building

```bash
npm run build:shared            # Build shared package
npm run build:frontend          # Build frontend
npm run build:betting-service   # Build betting service
npm run build:notification-service # Build notification service
npm run build:audit-service     # Build audit service
npm run build                   # Build everything
```

### Docker

```bash
npm run docker:build    # Build Docker images
npm run docker:up       # Start Docker services
npm run docker:down     # Stop Docker services
npm run docker:logs     # View Docker logs
npm run docker:deploy   # Full deployment script
npm run docker:stop     # Stop deployment script
```

## 🔍 Troubleshooting

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

## 📝 Development Workflow

1. **Start infrastructure**: `npm run infra:dev`
2. **Install deps**: `npm install`
3. **Build shared**: `npm run build:shared`
4. **Start services**: `npm run dev`
5. **Code changes**: Services auto-reload with `tsx watch`
6. **Test APIs**: Use the frontend or tools like Postman
7. **View messages**: Check Kafka UI at http://localhost:8080
8. **Monitor MQTT**: Check FlashMQ WebSocket at ws://localhost:8081

## 🎯 Testing the Setup

### Test Betting Service

```bash
curl http://localhost:3000/
# or with Docker: curl http://localhost/api/
```

### Test WebSocket Connection

Open browser console and run:

```javascript
const ws = new WebSocket("ws://localhost:8081");
// or with Docker: new WebSocket('ws://localhost/ws');
ws.onopen = () => console.log("Connected");
ws.onmessage = msg => console.log("Message:", msg.data);
```

### Test Kafka UI

Visit http://localhost:8080 (or http://localhost/kowl with Docker)

### Test Couchbase UI

Visit http://localhost:8091 (or http://localhost/couchbase with Docker)

- Username: Administrator
- Password: password
