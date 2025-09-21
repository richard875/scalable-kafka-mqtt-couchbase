# Local HTTPS Testing Guide

This guide shows you how to test the HTTPS configuration locally before deploying to production.

## Method 1: Self-Signed Certificates (Recommended for Testing)

### Step 1: Generate Local SSL Certificates

Run the local SSL setup script:

```bash
./ssl/local-ssl-setup.sh
```

This will:

- Create self-signed SSL certificates valid for localhost and \*.localhost domains
- Generate necessary SSL files (fullchain.pem, privkey.pem, dhparam.pem)
- Provide next steps for local testing

### Step 2: Configure Local DNS

Add local domain mappings to your `/etc/hosts` file:

```bash
sudo vim /etc/hosts
```

Add these lines:

```
127.0.0.1 localhost
127.0.0.1 api.localhost
127.0.0.1 ws.localhost
127.0.0.1 couchbase.localhost
127.0.0.1 redis.localhost
127.0.0.1 kowl.localhost
```

### Step 3: Start Services

```bash
docker compose -f docker-compose.production.yml up -d
```

### Step 4: Test HTTPS Endpoints

Open your browser and test these URLs (you'll need to accept the self-signed certificate warning):

- `https://localhost/health` - Main health check
- `https://api.localhost` - Betting API service
- `https://couchbase.localhost` - Couchbase admin interface
- `https://redis.localhost` - Redis UI
- `https://kowl.localhost` - Kafka UI
- `wss://ws.localhost` - WebSocket connection (test with browser dev tools)

**Note**: Your browser will show a security warning for self-signed certificates. This is normal for local testing. Click "Advanced" and "Proceed to localhost".

## Method 2: mkcert for Trusted Local Certificates

For a better local development experience without browser warnings, use `mkcert`:

### Install mkcert

**macOS:**

```bash
brew install mkcert
brew install nss # for Firefox support
```

**Linux:**

```bash
# Install mkcert using package manager or download binary
# Ubuntu/Debian:
sudo apt install libnss3-tools
wget https://github.com/FiloSottile/mkcert/releases/latest/download/mkcert-v1.4.4-linux-amd64
chmod +x mkcert-v1.4.4-linux-amd64
sudo mv mkcert-v1.4.4-linux-amd64 /usr/local/bin/mkcert
```

### Setup Local CA and Generate Certificates

```bash
# Create a local CA
mkcert -install

# Generate certificates for local domains
mkcert -cert-file ./ssl/certs/fullchain.pem -key-file ./ssl/certs/privkey.pem \
  localhost api.localhost ws.localhost couchbase.localhost redis.localhost kowl.localhost

# Generate dhparam
openssl dhparam -out ./ssl/certs/dhparam.pem 2048
```

### Configure /etc/hosts and Start Services

Same as Method 1:

```bash
# Add to /etc/hosts
sudo vim /etc/hosts

# Start services
docker compose -f docker-compose.production.yml up -d
```

Now you can access HTTPS URLs without browser warnings!

## Method 3: Test with HTTP Only (Quick Testing)

If you just want to test the basic functionality without HTTPS:

### Create a Local HTTP-Only Configuration

```bash
# Create a temporary nginx config for HTTP testing
cp nginx/conf.d/default.conf nginx/conf.d/default.conf.backup

# Create HTTP-only version
cat > nginx/conf.d/default-http.conf << 'EOF'
# Upstream definitions for load balancing and health checks
upstream betting_service {
    server betting-service:3000 max_fails=3 fail_timeout=30s;
}

upstream audit_service {
    server audit-service:3002 max_fails=3 fail_timeout=30s;
}

upstream notification_service {
    server notification-service:3001 max_fails=3 fail_timeout=30s;
}

upstream email_service {
    server email-service:3003 max_fails=3 fail_timeout=30s;
}

upstream kafka_ui {
    server kafka-ui:8080 max_fails=3 fail_timeout=30s;
}

upstream couchbase_ui {
    server couchbase:8091 max_fails=3 fail_timeout=30s;
}

upstream redis_ui {
    server redis-ui:5540 max_fails=3 fail_timeout=30s;
}

upstream flashmq_ws {
    server flashmq:8080 max_fails=3 fail_timeout=30s;
}

# Main server block - HTTP only for local testing
server {
    listen 80;
    server_name localhost;

    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }

    location / {
        return 200 "HTTP service running. Access services via subdomains.";
        add_header Content-Type text/plain;
    }
}

# API subdomain
server {
    listen 80;
    server_name api.localhost;

    location / {
        proxy_pass http://betting_service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # CORS headers
        add_header Access-Control-Allow-Origin "*" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Origin, Content-Type, Accept, Authorization" always;

        if ($request_method = 'OPTIONS') {
            return 204;
        }
    }
}

# WebSocket subdomain
server {
    listen 80;
    server_name ws.localhost;

    location / {
        proxy_pass http://flashmq_ws;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Couchbase subdomain
server {
    listen 80;
    server_name couchbase.localhost;

    location / {
        proxy_pass http://couchbase_ui;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Redis UI subdomain
server {
    listen 80;
    server_name redis.localhost;

    location / {
        proxy_pass http://redis_ui;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Kafka UI subdomain
server {
    listen 80;
    server_name kowl.localhost;

    location / {
        proxy_pass http://kafka_ui;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF
```

### Temporarily Switch to HTTP Config

```bash
# Backup HTTPS config
mv nginx/conf.d/default.conf nginx/conf.d/default-https.conf

# Use HTTP config
mv nginx/conf.d/default-http.conf nginx/conf.d/default.conf

# Start services
docker compose -f docker-compose.production.yml up -d
```

Test HTTP endpoints:

- `http://localhost/health`
- `http://api.localhost`
- `http://couchbase.localhost`
- `http://redis.localhost`
- `http://kowl.localhost`

### Switch Back to HTTPS Config

```bash
# Restore HTTPS config
mv nginx/conf.d/default.conf nginx/conf.d/default-http.conf
mv nginx/conf.d/default-https.conf nginx/conf.d/default.conf

# Restart nginx
docker compose -f docker-compose.production.yml restart nginx
```

## Testing WebSocket Connections

### Test WebSocket over WSS (HTTPS)

Create a simple HTML test file:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>WebSocket Test</title>
  </head>
  <body>
    <h1>WebSocket Test</h1>
    <div id="status">Connecting...</div>
    <div id="messages"></div>

    <script>
      const ws = new WebSocket("wss://ws.localhost");
      const status = document.getElementById("status");
      const messages = document.getElementById("messages");

      ws.onopen = function () {
        status.textContent = "Connected!";
        status.style.color = "green";
      };

      ws.onmessage = function (event) {
        const div = document.createElement("div");
        div.textContent = "Received: " + event.data;
        messages.appendChild(div);
      };

      ws.onerror = function (error) {
        status.textContent = "Error: " + error;
        status.style.color = "red";
      };

      ws.onclose = function () {
        status.textContent = "Disconnected";
        status.style.color = "orange";
      };
    </script>
  </body>
</html>
```

Save as `websocket-test.html` and open in browser.

## Troubleshooting Local Testing

### Common Issues

1. **Certificate errors**: Use `mkcert` for trusted local certificates
2. **Port conflicts**: Stop any existing web servers on ports 80/443
3. **DNS not resolving**: Verify `/etc/hosts` entries
4. **Services not starting**: Check logs with `docker compose logs`

### Debug Commands

```bash
# Check what's running on ports 80/443
sudo lsof -i :80
sudo lsof -i :443

# Test nginx configuration
docker compose -f docker-compose.production.yml exec nginx nginx -t

# View nginx logs
docker compose -f docker-compose.production.yml logs nginx

# Test certificate
openssl x509 -in ./ssl/certs/fullchain.pem -text -noout

# Check service status
docker compose -f docker-compose.production.yml ps
```

## Recommendations

- **For development**: Use Method 2 (mkcert) for trusted certificates
- **For quick testing**: Use Method 3 (HTTP only)
- **For production testing**: Use Method 1 (self-signed) to test the exact HTTPS configuration that will be used in production

This local testing ensures your HTTPS configuration works perfectly before deploying to Amazon Lightsail!
