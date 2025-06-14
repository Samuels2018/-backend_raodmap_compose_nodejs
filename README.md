# Microservices Architecture - Backend Roadmap

This repository implements a microservices architecture with four independent Node.js/TypeScript services, each serving distinct business domains and utilizing specialized database technologies.

## Table of Contents
- [System Architecture](#system-architecture)
- [Service Inventory](#service-inventory)
- [API Endpoints](#api-endpoints)
- [Database Architecture](#database-architecture)
- [Development Configuration](#development-configuration)
- [Getting Started](#getting-started)

## System Architecture

![Microservices Architecture Diagram](diagram-url-here) *(Consider adding a diagram)*

The system consists of four microservices orchestrated via Docker Compose, each with its own dedicated database:

```mermaid
graph TD
    A[weather-api] --> B[Redis]
    C[todo-api] --> D[PostgreSQL]
    E[url-shortener] --> F[MongoDB]
    G[markdown-notes] --> F[MongoDB]


Key Features:

    Independent services with clear domain boundaries

    Specialized database technologies for each use case

    Health-check dependencies between services and databases

    Persistent data storage using Docker volumes

Service Inventory
Service	Port	Technology	Database	Primary Function
weather-api	5000	Node.js/Express	Redis	Weather data caching and retrieval
todo-api	5001	TypeScript/Express	PostgreSQL	Task management with authentication
url-shortener	5002	Node.js/Express	MongoDB	URL shortening with statistics
markdown-notes	5003	Node.js/Express	MongoDB	Markdown processing and file management
API Endpoints
todo-api Service

    POST /api/v1/auth/register - User registration

    POST /api/v1/auth/login - User authentication

    GET /api/v1/todos - Todo operations (authenticated)

url-shortener Service

    POST /api/shorten - Create short URL

    GET /api/shorten/:shortCode - Retrieve original URL

    PUT /api/shorten/:shortCode - Update URL

    DELETE /api/shorten/:shortCode - Delete short URL

    GET /api/shorten/:shortCode/stats - Access statistics

Database Architecture
Database	Container	Port	Volume	Use Case
PostgreSQL	dbPostgres	5432	db_data	Relational data for todos and users
MongoDB	dbMongo	27017	db_mongo_data	Document storage for URLs and notes
Redis	dbRedis	6379	redis_data	Caching layer for weather data

Database Health Checks:

    PostgreSQL: pg_isready -U postgres

    MongoDB: mongo --eval db.adminCommand('ping')

    Redis: redis-cli ping

Development Configuration

services:
  weather-api:
    volumes:
      - ./weather-api:/app
  todo-api:
    volumes:
      - ./todo-api:/app
  url-shortener:
    volumes:
      - ./url-shortener:/app
  markdown-notes:
    volumes:
      - ./markdown-notes:/app


Key Development Features:

    Hot-reloading enabled via mounted volumes

    Service health checks ensure proper startup order

    Environment variables for configuration

    Isolated development environments

Getting Started

    Prerequisites:

        Docker and Docker Compose installed

        Node.js (for local development without Docker)

Start the system:
docker-compose up -d


Verify services are running:
docker-compose ps

Access services:

    weather-api: http://localhost:5000

    todo-api: http://localhost:5001

    url-shortener: http://localhost:5002

    markdown-notes: http://localhost:5003


Run database migrations (if applicable):

docker-compose exec todo-api npm run migrate




This README provides:
1. Clear overview of the architecture
2. Visual representation (placeholder for diagram)
3. Detailed service inventory
4. API endpoint documentation
5. Database configuration
6. Development setup instructions
7. Getting started guide

You may want to add:
- Environment variable requirements
- Testing instructions
- Production deployment notes
- Monitoring setup
- Logging configuration
- API documentation links (Swagger/OpenAPI if available)