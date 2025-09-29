#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}===========================================${NC}"
echo -e "${GREEN}   Auth Microservice Development Setup     ${NC}"
echo -e "${GREEN}===========================================${NC}"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js 20.x or higher.${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 1: Creating .env file...${NC}"
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✓ .env file created${NC}"
else
    echo -e "${YELLOW}! .env file already exists${NC}"
fi

echo -e "${YELLOW}Step 2: Installing dependencies...${NC}"
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}"

echo -e "${YELLOW}Step 3: Starting Docker containers...${NC}"
docker-compose down
docker-compose up -d postgres
echo -e "${GREEN}✓ PostgreSQL container started${NC}"

# Wait for PostgreSQL to be ready
echo -e "${YELLOW}Step 4: Waiting for PostgreSQL to be ready...${NC}"
sleep 5

# Check if PostgreSQL is ready
until docker exec auth_postgres_db pg_isready -U authuser -d auth_db > /dev/null 2>&1; do
    echo -e "${YELLOW}Waiting for PostgreSQL...${NC}"
    sleep 2
done
echo -e "${GREEN}✓ PostgreSQL is ready${NC}"

echo -e "${YELLOW}Step 5: Running migrations...${NC}"
npm run migration:run
echo -e "${GREEN}✓ Migrations completed${NC}"

echo -e "${YELLOW}Step 6: Seeding database...${NC}"
npm run seed
echo -e "${GREEN}✓ Database seeded${NC}"

echo -e "${YELLOW}Step 7: Starting the application...${NC}"
echo -e "${GREEN}===========================================${NC}"
echo -e "${GREEN}Setup completed successfully!${NC}"
echo -e "${GREEN}===========================================${NC}"
echo ""
echo -e "${YELLOW}You can now start the application with:${NC}"
echo -e "  ${GREEN}npm run start:dev${NC} - For development mode"
echo -e "  ${GREEN}npm run docker:up${NC} - To run everything in Docker"
echo ""
echo -e "${YELLOW}Default users created:${NC}"
echo -e "  Admin: username=${GREEN}admin${NC}, password=${GREEN}Admin@123456${NC}"
echo -e "  Client: username=${GREEN}johndoe${NC}, password=${GREEN}Client@123456${NC}"
echo -e "  Teller: username=${GREEN}teller1${NC}, password=${GREEN}Teller@123456${NC}"
echo ""
echo -e "${YELLOW}API available at:${NC} ${GREEN}http://localhost:3000${NC}"
echo -e "${YELLOW}PostgreSQL available at:${NC} ${GREEN}localhost:5432${NC}"