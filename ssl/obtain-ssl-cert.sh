#!/bin/bash

# SSL Certificate Management Script for Lightsail Deployment
# This script obtains and manages Let's Encrypt SSL certificates for all subdomains

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN=""
EMAIL=""
STAGING=false
FORCE_RENEWAL=false

# Function to display usage
usage() {
    echo "Usage: $0 -d DOMAIN -e EMAIL [OPTIONS]"
    echo ""
    echo "Required:"
    echo "  -d DOMAIN     Primary domain (e.g., unibet.richardeverley.com)"
    echo "  -e EMAIL      Email for Let's Encrypt registration"
    echo ""
    echo "Options:"
    echo "  -s            Use Let's Encrypt staging server (for testing)"
    echo "  -f            Force certificate renewal"
    echo "  -h            Show this help message"
    echo ""
    echo "Example:"
    echo "  $0 -d unibet.richardeverley.com -e admin@unibet.richardeverley.com"
    echo "  $0 -d unibet.richardeverley.com -e admin@unibet.richardeverley.com -s  # staging"
    exit 1
}

# Parse command line arguments
while getopts "d:e:sfh" opt; do
    case $opt in
        d)
            DOMAIN="$OPTARG"
            ;;
        e)
            EMAIL="$OPTARG"
            ;;
        s)
            STAGING=true
            ;;
        f)
            FORCE_RENEWAL=true
            ;;
        h)
            usage
            ;;
        \?)
            echo "Invalid option: -$OPTARG" >&2
            usage
            ;;
    esac
done

# Validate required arguments
if [[ -z "$DOMAIN" || -z "$EMAIL" ]]; then
    echo -e "${RED}Error: Domain and email are required${NC}"
    usage
fi

echo -e "${BLUE}=== SSL Certificate Management Script ===${NC}"
echo -e "${BLUE}Domain: ${YELLOW}$DOMAIN${NC}"
echo -e "${BLUE}Email: ${YELLOW}$EMAIL${NC}"
echo -e "${BLUE}Staging: ${YELLOW}$STAGING${NC}"
echo -e "${BLUE}Force Renewal: ${YELLOW}$FORCE_RENEWAL${NC}"
echo ""

# Define all subdomains
SUBDOMAINS=(
    "$DOMAIN"
    "api.$DOMAIN"
    "ws.$DOMAIN"
    "couchbase.$DOMAIN"
    "redis.$DOMAIN"
    "kowl.$DOMAIN"
)

# Create necessary directories
echo -e "${GREEN}Creating SSL directories...${NC}"
mkdir -p ./ssl/certs
mkdir -p ./ssl/certbot/conf
mkdir -p ./ssl/certbot/www

# Build domain arguments for certbot
DOMAIN_ARGS=""
for subdomain in "${SUBDOMAINS[@]}"; do
    DOMAIN_ARGS="$DOMAIN_ARGS -d $subdomain"
done

# Set certbot server (staging or production)
if [[ "$STAGING" == true ]]; then
    CERTBOT_SERVER="--server https://acme-staging-v02.api.letsencrypt.org/directory"
    echo -e "${YELLOW}Using Let's Encrypt STAGING server${NC}"
else
    CERTBOT_SERVER=""
    echo -e "${GREEN}Using Let's Encrypt PRODUCTION server${NC}"
fi

# Set force renewal flag
if [[ "$FORCE_RENEWAL" == true ]]; then
    FORCE_FLAG="--force-renewal"
    echo -e "${YELLOW}Force renewal enabled${NC}"
else
    FORCE_FLAG=""
fi

echo -e "${GREEN}Requesting SSL certificate for:${NC}"
for subdomain in "${SUBDOMAINS[@]}"; do
    echo -e "  - ${YELLOW}$subdomain${NC}"
done
echo ""

# Stop nginx container if running (to free port 80)
echo -e "${BLUE}Stopping nginx container if running...${NC}"
docker compose -f docker-compose.production.yml stop nginx || true

# Run certbot to obtain certificates
echo -e "${GREEN}Running certbot to obtain SSL certificates...${NC}"
docker run --rm \
    -v "$(pwd)/ssl/certbot/conf:/etc/letsencrypt" \
    -v "$(pwd)/ssl/certbot/www:/var/www/certbot" \
    -p 80:80 \
    certbot/certbot \
    certonly \
    --standalone \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    $CERTBOT_SERVER \
    $FORCE_FLAG \
    $DOMAIN_ARGS

# Copy certificates to nginx directory
echo -e "${GREEN}Copying certificates to nginx directory...${NC}"
sudo cp -r ./ssl/certbot/conf/live/"$DOMAIN"/ ./ssl/certs/
sudo cp -r ./ssl/certbot/conf/archive/"$DOMAIN"/ ./ssl/certs/archive/ || true
sudo chown -R $(whoami):$(whoami) ./ssl/certs/

# Create dhparam if it doesn't exist
if [[ ! -f "./ssl/certs/dhparam.pem" ]]; then
    echo -e "${GREEN}Generating Diffie-Hellman parameters (this may take a while)...${NC}"
    docker run --rm -v "$(pwd)/ssl/certs:/certs" nginx:alpine \
        sh -c "openssl dhparam -out /certs/dhparam.pem 2048"
fi

# Create certificate renewal script
echo -e "${GREEN}Creating certificate renewal script...${NC}"
cat > ./ssl/renew-ssl-cert.sh << EOF
#!/bin/bash

# SSL Certificate Renewal Script
# Run this script periodically to renew certificates (recommended: monthly)

set -e

echo "Renewing SSL certificates..."

# Stop nginx
docker compose -f docker-compose.production.yml stop nginx

# Renew certificates
docker run --rm \\
    -v "\$(pwd)/ssl/certbot/conf:/etc/letsencrypt" \\
    -v "\$(pwd)/ssl/certbot/www:/var/www/certbot" \\
    -p 80:80 \\
    certbot/certbot \\
    renew \\
    --standalone

# Copy renewed certificates
sudo cp -r ./ssl/certbot/conf/live/"$DOMAIN"/ ./ssl/certs/
sudo cp -r ./ssl/certbot/conf/archive/"$DOMAIN"/ ./ssl/certs/archive/ || true
sudo chown -R \$(whoami):\$(whoami) ./ssl/certs/

# Restart nginx
docker compose -f docker-compose.production.yml start nginx

echo "Certificate renewal completed!"
EOF

chmod +x ./ssl/renew-ssl-cert.sh

echo ""
echo -e "${GREEN}=== SSL Certificate Setup Complete! ===${NC}"
echo -e "${GREEN}Certificates obtained for all subdomains.${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo -e "1. Update your DNS records to point all subdomains to this server"
echo -e "2. Run: ${YELLOW}docker compose -f docker-compose.production.yml up -d${NC}"
echo -e "3. Test HTTPS access: ${YELLOW}https://$DOMAIN/health${NC}"
echo ""
echo -e "${BLUE}Certificate renewal:${NC}"
echo -e "Run ${YELLOW}./ssl/renew-ssl-cert.sh${NC} monthly to renew certificates"
echo ""
echo -e "${BLUE}DNS Records needed:${NC}"
for subdomain in "${SUBDOMAINS[@]}"; do
    echo -e "  A    ${YELLOW}$subdomain${NC}  →  YOUR_SERVER_IP"
done
