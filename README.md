# MERN Stack Application - Containerization and Deployment with Docker

## Overview

This guide outlines the process of containerizing and deploying a MERN stack application using Docker and Docker Compose. The application consists of a frontend (React), a backend (Node.js/Express), and a MongoDB database.

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

# Expose the port used by Vite (default: 5173)
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

## Running Containers Individually

### Step 1: Create a Docker Network

```sh
docker network create demo
```

### Step 2: Build and Run the Frontend

```sh
cd mern-project/client
docker build -t mern-frontend .
docker run --name frontend --network demo -d -p 5173:5173 mern-frontend
```

Verify by opening `http://localhost:5173` in a browser.

### Step 3: Run the MongoDB Container

```sh
docker run --network demo --name mongodb -d -p 27017:27017 -v ~/opt/data:/data/db mongodb:latest
```

### Step 4: Build and Run the Backend

```sh
cd mern-project/server
docker build -t mern-backend .
docker run --name backend --network demo -d -p 5000:5000 mern-backend
```

## Using Docker Compose for Simplified Deployment

Instead of running multiple commands, Docker Compose allows you to manage all services in a single file.

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
            - mern-network

    server:
        build: ./server
        ports:
            - '5000:5000'
        depends_on:
            - mongodb
        networks:
            - mern-network

    mongodb:
        image: mongodb:latest
        ports:
            - '27017:27017'
        volumes:
            - mongodb_data:/data/db
        networks:
            - mern-network

networks:
    mern-network:
        driver: bridge

volumes:
    mongodb_data:
```

### Running the Application with Docker Compose

```sh
docker compose up -d
```

This will start all services (frontend, backend, and database) in detached mode.

### Stopping the Containers

```sh
docker compose down
```

## Conclusion

You have successfully containerized and deployed a MERN stack application using Docker and Docker Compose. This setup ensures portability and ease of deployment across different environments.
