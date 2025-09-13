#!/bin/bash

# Local HTTPS Testing Script
# This script creates self-signed certificates for local testing

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Local HTTPS Testing Setup ===${NC}"
echo ""

# Create SSL directories if they don't exist
echo -e "${GREEN}Creating SSL directories for local testing...${NC}"
mkdir -p ./ssl/certs
mkdir -p ./ssl/local

# Generate self-signed certificate for local testing
echo -e "${GREEN}Generating self-signed SSL certificate for local testing...${NC}"

# Create certificate configuration
cat > ./ssl/local/cert.conf << EOF
[req]
default_bits = 2048
prompt = no
default_md = sha256
distinguished_name = dn
req_extensions = v3_req

[dn]
C=US
ST=CA
L=San Francisco
O=Local Development
OU=IT Department
CN=localhost

[v3_req]
basicConstraints = CA:FALSE
keyUsage = nonRepudiation, digitalSignature, keyEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
DNS.2 = *.localhost
DNS.3 = api.localhost
DNS.4 = ws.localhost
DNS.5 = couchbase.localhost
DNS.6 = kowl.localhost
IP.1 = 127.0.0.1
IP.2 = ::1
EOF

# Generate private key and certificate
openssl req -new -x509 -days 365 -nodes \
    -out ./ssl/certs/fullchain.pem \
    -keyout ./ssl/certs/privkey.pem \
    -config ./ssl/local/cert.conf

# Generate dhparam for nginx
echo -e "${GREEN}Generating Diffie-Hellman parameters...${NC}"
openssl dhparam -out ./ssl/certs/dhparam.pem 2048

echo ""
echo -e "${GREEN}=== Local SSL Certificate Generated! ===${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo -e "1. Add local domains to your /etc/hosts file:"
echo -e "   ${YELLOW}sudo vim /etc/hosts${NC}"
echo ""
echo -e "   Add these lines:"
echo -e "   ${YELLOW}127.0.0.1 localhost${NC}"
echo -e "   ${YELLOW}127.0.0.1 api.localhost${NC}"
echo -e "   ${YELLOW}127.0.0.1 ws.localhost${NC}"
echo -e "   ${YELLOW}127.0.0.1 couchbase.localhost${NC}"
echo -e "   ${YELLOW}127.0.0.1 kowl.localhost${NC}"
echo ""
echo -e "2. Start the services with:"
echo -e "   ${YELLOW}docker compose -f docker-compose.production.yml up -d${NC}"
echo ""
echo -e "3. Test HTTPS endpoints (accept the self-signed certificate warning):"
echo -e "   ${YELLOW}https://localhost/health${NC}"
echo -e "   ${YELLOW}https://api.localhost${NC}"
echo -e "   ${YELLOW}https://couchbase.localhost${NC}"
echo -e "   ${YELLOW}https://kowl.localhost${NC}"
echo ""
echo -e "${RED}Note: Your browser will show a security warning for self-signed certificates.${NC}"
echo -e "${RED}This is normal for local testing. Click 'Advanced' and 'Proceed to localhost'.${NC}"
