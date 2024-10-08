# Dockerized Movie Database

## Overview
The Movie Database Project is a full-stack web application that allows users to browse, search, and manage a collection of movies. It's designed to be scalable and user-friendly, with a secure authentication system.

![assess3-frontend](https://github.com/user-attachments/assets/a21e7f37-1a51-40b4-9d4a-34c0a000f884)

![assess3-db-endpoint](https://github.com/user-attachments/assets/50deaee5-aa4e-4e3b-b19b-b697c98cdbbf)



## Table of Contents

1. [Project Structure](#project-structure)
2. [Docker Compose Configuration](#docker-compose-configuration)
3. [Dockerfiles](#dockerfiles)
4. [GitHub Actions CI/CD](#github-actions-cicd)
5. [Running the Application](#running-the-application)
6. [Building and Pushing Images](#building-and-pushing-images)
7. [Environment Variables](#environment-variables)
8. [Documentation](#documentation)

## Project Structure

- **Backend**: A Node.js application serving the API.
- **Frontend**: A web application built with React or similar technologies.
- **Database**: A PostgreSQL database for data persistence.
- **Docker Compose**: Orchestrates the application's services.
- **GitHub Actions**: Automates the building and pushing of Docker images.

## Docker Compose Configuration (`docker-compose.yml`)

```yaml
version: "3.8"
services:
  db:
    image: postgres:11.2-alpine
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "${DB_PORT}:5432"
    volumes:
      - db-data:/var/lib/postgresql/data
      - ./init_sql_scripts:/docker-entrypoint-initdb.d
  backend:
    build: ./backend
    ports:
      - "${PORT_BACKEND}:3001"
    environment:
      DATABASE_URL: postgres://${DB_USER}:${DB_PASSWORD}@db:${DB_PORT}/${DB_NAME}
      PORT: ${PORT_BACKEND}
    depends_on:
      - db
  frontend:
    build: ./frontend
    ports:
      - "${PORT_FRONTEND}:3000"
    environment:
      REST_API_URL: http://backend:${PORT_BACKEND}/data
      PORT: ${PORT_FRONTEND}
    depends_on:
      - backend
volumes:
  db-data:
```

## Dockerfiles

### Backend Dockerfile

```Dockerfile
FROM node:12
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE ${PORT_BACKEND}
CMD ["node", "index.js"]
```

### Frontend Dockerfile

```Dockerfile
FROM node:12
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE ${FRONTEND_PORT}
CMD ["npm", "start"]
```

## GitHub Actions CI/CD (`ci.yml`)

```yaml
name: CI/CD Pipeline
on:
  push:
    branches:
      - main
jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: docker/login-action@v1
        with:
          username: ${{ secrets.DOCKER_NAME }}
          password: ${{ secrets.DOCKER_TOKEN }}
      - uses: docker/build-push-action@v2
        with:
          context: ./backend
          file: ./backend/Dockerfile
          push: true
          tags: nekadev/backend:latest
      - uses: docker/build-push-action@v2
        with:
          context: ./frontend
          file: ./frontend/Dockerfile
          push: true
          tags: nekadev/frontend:latest
```

## Running the Application

1. **Start the Application**:
   ```bash
   docker-compose up -d
   ```
2. **Access the Application**:
   - Frontend at `http://localhost:${PORT_FRONTEND}`
   - Backend at `http://localhost:${PORT_BACKEND}/data`
3. **Stop the Application**:
   ```bash
   docker-compose down
   ```

## Building and Pushing Images

### Manual Process

- **Build Images**:
  ```bash
  docker-compose build
  ```
- **Push Images to Docker Hub**:
  ```bash
  docker login --username your-username
  docker-compose push
  ```

### Automated Process with GitHub Actions

- Set up a CI/CD pipeline in `.github/workflows/ci.yml` for automated build and push upon code pushes to the repository.

## Environment Variables

- Ensure environment variables are correctly set in `docker-compose.yml` and used in Dockerfiles and application code.

## Documentation

- Detailed documentation is provided for each step of the setup and deployment process.
- Comments included in code to explain the purpose of environment variables and Dockerfile instructions.

---
---
