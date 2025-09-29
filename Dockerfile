# Antes: FROM node:18-alpine
FROM node:20-alpine 

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build  # Asume que tienes "build": "nest build" en package.json
CMD ["npm", "run", "start:prod"]
EXPOSE 3000