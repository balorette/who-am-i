---
title: "FastAPI Boilerplate"
date: "2025-10-15"
excerpt: "Beyond the typical Boilerplate, enterprise requirements built in. A grab and go FastAPI based backend"
coverImage: "/images/projects/fast-api.jpg"
tags: ["FastAPI", "Python", "Rest", "Pydantic"]
githubUrl: "https://github.com/balorette/python-fastapi-boilerplate"
status: "in-progress"
featured: true
published: true
---

## Overview

As many say, doing is the best way to learn. I have been utilizing AI pair coders and agents for a while now and wanted to see what some of the effective methods are. To try this out I took a common pattern of building out a boilerplate for rapid development. In this case, FastAPI. The caveat though was I wanted to bake in as much Enterprise based requirements as possible. Things like Auth, Audit, Observability, etc. Normally something that would just grow over time with functionality built into a boilerplate.


## Features

- **Production-Ready FastAPI**: Modern Python 3.12 REST API scaffold with sane defaults
- **Fully Async Stack**: FastAPI + SQLAlchemy async with SQLite/PostgreSQL
- **Flexible Database**: SQLite for dev, PostgreSQL for prod, Alembic migrations
- **Authentication**: JWT + OAuth2 with Google sign-in
- **Auto API Docs**: Swagger UI, ReDoc, and OpenAPI JSON out of the box
- **Containerized Setup**: Dockerfile and docker-compose for dev/prod workflows
- **Quality & Tests**: pytest suite, coverage, Ruff lint/format, pre-commit hooks
- **Observability**: Structured JSON logs, health/liveness/readiness, optional Prometheus
- **Security Baseline**: CORS, Pydantic validation, SQLAlchemy ORM protections
- **Redis-Ready**: Hooks for future caching and session features

## Tech Stack

- FastAPI
- Pydantic
- SQLAlchemy
- Alembic

## Architectural Principles

### 1. Separation of Concerns
Each layer has a single, well-defined responsibility:
- **API Layer**: HTTP handling, request/response transformation
- **Service Layer**: Business logic, orchestration
- **Repository Layer**: Data access, query building
- **Model Layer**: Data structure definitions

### 2. Dependency Inversion
- Higher layers depend on abstractions, not concrete implementations
- Dependency injection for loose coupling
- Testability through interface design

### 3. Async-First Design
- Async/await throughout the stack
- Non-blocking I/O operations
- Efficient resource utilization

### 4. Domain-Driven Design
- Business logic in service layer
- Domain models separate from database models
- Rich domain objects with behavior

## Layer Architecture

### API Layer (Presentation)

**Responsibilities:**
- HTTP request handling
- Input validation
- Response formatting
- Authentication/authorization
- Error handling
- API documentation