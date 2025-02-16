# MERN Stack Application - Containerization and Deployment with Docker & Nginx

## Overview

This guide outlines the process of containerizing and deploying a MERN stack application using Docker and Docker Compose. The application consists of a frontend (React), a backend (Node.js/Express), and a MongoDB database.

Users can deploy the application with or without Nginx. If you want to include Nginx as a reverse proxy for better performance and security, follow the additional guidelines provided.

## Prerequisites

-   Install [Docker](https://docs.docker.com/get-docker/)
-   Install [Docker Compose](https://docs.docker.com/compose/install/)

## Project Structure

```
mern-project/
│── client/         # React frontend
│   ├── Dockerfile  # Dockerfile for frontend
│── server/         # Node.js backend
│   ├── Dockerfile  # Dockerfile for backend
│── docker-compose.yml # Docker Compose configuration file
│── dockerfile.nginx # Dockerfile for Nginx (if using Nginx)
│── nginx.conf       # Nginx configuration file (if using Nginx)
```

## Containerizing the Application

### Frontend (Client) Dockerfile

```dockerfile
# Use the official Node.js image
FROM node:18.9.1

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json .
RUN npm install

# Copy application files
COPY . .

# Build the frontend
RUN npm run build

# Expose port 5173 (for development mode)
EXPOSE 5173

# Start the frontend application
CMD ["npm", "run", "dev"]
```

### Backend (Server) Dockerfile

```dockerfile
# Use the official Node.js image
FROM node:18.9.1

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json .
RUN npm install

# Copy application files
COPY . .

# Expose the backend port
EXPOSE 5000

# Start the backend application
CMD ["npm", "start"]
```

## Running Containers Individually (Without Docker Compose)

### Step 1: Create a Docker Network

```sh
docker network create mern
```

### Step 2: Build and Run the Frontend

```sh
cd mern-project/client
docker build -t mern-client .
docker run --name client --network mern -d -p 5173:5173 mern-client
```

Verify by opening `http://localhost:5173` in a browser.

### Step 3: Run the MongoDB Container

```sh
docker run --network mern --name mongodb -d -p 27017:27017 -v ~/opt/data:/data/db mongo:latest
```

### Step 4: Build and Run the Backend

```sh
cd mern-project/server
docker build -t mern-server .
docker run --name server --network mern -d -p 5000:5000 mern-server
```

Verify by opening `http://localhost:5000` in a browser.

## Using Docker Compose for Simplified Deployment

### Docker Compose Configuration (`docker-compose.yml`)

```yaml
version: '3.8'

services:
    client:
        build: ./client
        ports:
            - '5173:5173'
        depends_on:
            - server
        networks:
            - mern

    server:
        build: ./server
        ports:
            - '5000:5000'
        depends_on:
            - mongo
        networks:
            - mern

    mongo:
        image: mongo:latest
        ports:
            - '27017:27017'
        volumes:
            - mongo-data:/data/db
        networks:
            - mern

networks:
    mern:
        driver: bridge

volumes:
    mongo-data:
```

### Running the Application with Docker Compose

```sh
docker compose up -d
```

Verify by opening `http://localhost:5173` (frontend) and `http://localhost:5000` (backend) in a browser.

### Stopping the Containers

```sh
docker compose down
```

### Running Without Building Again

```sh
docker compose up -d --no-build
```

### Stopping Without Removing Containers

```sh
docker compose stop
```

## Adding Nginx as a Reverse Proxy (Optional)

If you want to serve the frontend using Nginx and proxy API requests to the backend, follow these additional steps.

### Nginx Dockerfile (`dockerfile.nginx`)

```dockerfile
# Use official Nginx image
FROM nginx:latest

# Copy our Nginx configuration file to Nginx container
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built frontend files to Nginx’s web directory
COPY client/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration (`nginx.conf`)

```nginx
server {
    listen 80;

    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://server:5000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Updating `docker-compose.yml` to Include Nginx

```yaml
services:
    nginx:
        build:
            context: .
            dockerfile: dockerfile.nginx
        ports:
            - '80:80'
        depends_on:
            - server
        networks:
            - mern

    client:
        build: ./client
        networks:
            - mern
        volumes:
            - ./client/dist:/app/dist

    server:
        build: ./server
        ports:
            - '5000:5000'
        networks:
            - mern
        depends_on:
            - mongo

    mongo:
        image: mongo:latest
        ports:
            - '27017:27017'
        networks:
            - mern
        volumes:
            - mongo-data:/data/db
```

### Running with Nginx

```sh
docker compose up -d --build
```

Verify by opening `http://localhost` in a browser.

## Conclusion

With this setup, you can deploy the MERN stack application with or without Nginx. Using Nginx improves security, performance, and simplifies frontend deployment. Choose the method that best fits your needs!
