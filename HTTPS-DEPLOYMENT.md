# HTTPS Deployment Guide for Amazon Lightsail

This guide explains how to deploy your application with HTTPS/SSL certificates on Amazon Lightsail.

## 🧪 Local Testing First

**Before deploying to production, test locally!** See `LOCAL-TESTING.md` for detailed instructions on testing HTTPS configuration locally using:

- Self-signed certificates
- mkcert for trusted local certificates
- HTTP-only testing for quick validation

## Prerequisites

- An Amazon Lightsail VPS instance running Ubuntu/Debian
- A domain name pointing to your Lightsail instance
- Docker and Docker Compose installed on the Lightsail instance

## DNS Configuration

Before deploying, configure your DNS records to point to your Lightsail instance:

```
A    unibet.richardeverley.com        →  YOUR_LIGHTSAIL_IP
A    api.unibet.richardeverley.com    →  YOUR_LIGHTSAIL_IP
A    ws.unibet.richardeverley.com     →  YOUR_LIGHTSAIL_IP
A    couchbase.unibet.richardeverley.com →  YOUR_LIGHTSAIL_IP
A    kowl.unibet.richardeverley.com   →  YOUR_LIGHTSAIL_IP
```

## Deployment Steps

### 1. Prepare the Server

Connect to your Lightsail instance:

```bash
ssh ubuntu@YOUR_LIGHTSAIL_IP
```

Install Docker and Docker Compose if not already installed:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
sudo usermod -aG docker $USER

# Docker Compose comes with Docker Engine by default now
# No separate installation needed

# Log out and back in for group changes to take effect
exit
```

### 2. Deploy the Application

Clone or upload your application code to the Lightsail instance:

```bash
# If using git
git clone https://github.com/your-username/scalable-kafka-mqtt-couchbase.git
cd scalable-kafka-mqtt-couchbase

# Or upload your code using scp
# scp -r ./scalable-kafka-mqtt-couchbase ubuntu@YOUR_LIGHTSAIL_IP:~/
```

### 3. Obtain SSL Certificates

Run the SSL certificate script to obtain Let's Encrypt certificates:

```bash
# Make the script executable (if not already)
chmod +x ./ssl/obtain-ssl-cert.sh

# Obtain certificates (replace with your domain and email)
./ssl/obtain-ssl-cert.sh -d unibet.richardeverley.com -e admin@unibet.richardeverley.com
```

For testing, use the staging server first:

```bash
./ssl/obtain-ssl-cert.sh -d unibet.richardeverley.com -e admin@unibet.richardeverley.com -s
```

### 4. Start the Services

After obtaining certificates, start all services:

```bash
docker compose -f docker-compose.production.yml up -d
```

### 5. Verify HTTPS Setup

Test your HTTPS endpoints:

```bash
# Main domain health check
curl https://unibet.richardeverley.com/health

# API endpoint
curl https://api.unibet.richardeverley.com/health

# Check other services
curl -k https://couchbase.unibet.richardeverley.com
curl -k https://kowl.unibet.richardeverley.com
```

## Service URLs (After Deployment)

| Service        | HTTPS URL                                     | Description                            |
| -------------- | --------------------------------------------- | -------------------------------------- |
| Health Check   | `https://unibet.richardeverley.com/health`    | Main service health status             |
| Betting API    | `https://api.unibet.richardeverley.com`       | REST API for betting operations        |
| MQTT WebSocket | `ws://ws.unibet.richardeverley.com`           | WebSocket for real-time updates        |
| Couchbase UI   | `https://couchbase.unibet.richardeverley.com` | Database administration                |
| Kafka UI       | `https://kowl.unibet.richardeverley.com`      | Kafka topic management                 |

## Certificate Renewal

SSL certificates from Let's Encrypt need to be renewed every 90 days. Set up automatic renewal:

### Manual Renewal

```bash
# Run the renewal script
./ssl/renew-ssl-cert.sh
```

### Automatic Renewal with Cron

Set up a cron job for automatic renewal:

```bash
# Edit crontab
crontab -e

# Add this line to run renewal check monthly (on the 1st at 2 AM)
0 2 1 * * /home/ubuntu/scalable-kafka-mqtt-couchbase/ssl/renew-ssl-cert.sh >> /var/log/ssl-renewal.log 2>&1
```

## Firewall Configuration

Ensure your Lightsail firewall allows the necessary ports:

- Port 80 (HTTP) - Required for Let's Encrypt validation and redirects
- Port 443 (HTTPS) - Main HTTPS traffic
- Port 22 (SSH) - For administration

Configure in the Lightsail console:

1. Go to Networking tab of your instance
2. Add these rules to the firewall:
   - HTTP (port 80)
   - HTTPS (port 443)
   - SSH (port 22)

## Monitoring and Logs

Monitor your services:

```bash
# Check all services status
docker compose -f docker-compose.production.yml ps

# Monitor logs
docker compose -f docker-compose.production.yml logs -f

# Check nginx logs specifically
docker compose -f docker-compose.production.yml logs -f nginx

# Check SSL certificate status
openssl x509 -in ./ssl/certs/fullchain.pem -text -noout | grep -A 2 "Validity"
```

## Troubleshooting

### Common Issues

1. **Certificate not found error:**
   - Ensure the SSL certificate script ran successfully
   - Check that certificate files exist in `./ssl/certs/`
   - Verify DNS records are pointing to your server

2. **Let's Encrypt rate limiting:**
   - Use staging server for testing: `-s` flag
   - Wait before retrying (rate limits reset hourly/daily)

3. **Port 80/443 already in use:**
   - Stop any existing nginx/apache services
   - Use `sudo netstat -tlnp | grep :80` to check what's using the port

4. **Certificate validation fails:**
   - Ensure DNS propagation is complete
   - Check firewall allows port 80
   - Verify domain name spelling

### Debug Commands

```bash
# Test certificate
openssl s509 -in ./ssl/certs/fullchain.pem -text -noout

# Check nginx configuration
docker compose -f docker-compose.production.yml exec nginx nginx -t

# View detailed logs
docker compose -f docker-compose.production.yml logs nginx --tail=50
```

## Security Considerations

- Keep your system updated: `sudo apt update && sudo apt upgrade`
- Regularly rotate certificates (automatic with Let's Encrypt)
- Monitor access logs for unusual activity
- Consider setting up fail2ban for additional security
- Use strong passwords for database access
- Restrict admin interface access if needed

## Cost Optimization

- Use Lightsail's smallest instance size that meets your performance needs
- Monitor bandwidth usage to avoid overage charges
- Consider using Lightsail load balancer for high availability (if needed)
- Set up CloudWatch alerts for resource usage monitoring
