#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}===========================================${NC}"
echo -e "${YELLOW}      Cleaning Auth Microservice           ${NC}"
echo -e "${YELLOW}===========================================${NC}"

echo -e "${YELLOW}Stopping Docker containers...${NC}"
docker-compose down -v
echo -e "${GREEN}✓ Docker containers stopped and volumes removed${NC}"

echo -e "${YELLOW}Removing node_modules...${NC}"
rm -rf node_modules
echo -e "${GREEN}✓ node_modules removed${NC}"

echo -e "${YELLOW}Removing dist folder...${NC}"
rm -rf dist
echo -e "${GREEN}✓ dist folder removed${NC}"

echo -e "${YELLOW}Removing coverage folder...${NC}"
rm -rf coverage
echo -e "${GREEN}✓ coverage folder removed${NC}"

echo -e "${YELLOW}Removing log files...${NC}"
rm -f *.log
echo -e "${GREEN}✓ Log files removed${NC}"

echo -e "${GREEN}===========================================${NC}"
echo -e "${GREEN}        Cleanup completed!                 ${NC}"
echo -e "${GREEN}===========================================${NC}"
echo ""
echo -e "${YELLOW}To start fresh, run:${NC}"
echo -e "  ${GREEN}./scripts/setup-dev.sh${NC}"