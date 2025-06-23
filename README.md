# Bank Reconciliation System - Final

## Introduction

This project is a robust, test-driven bank reconciliation system built with Node.js, TypeScript, Express, TypeORM, and PostgreSQL. It features:
- Clean architecture (domain, application, infrastructure, presentation layers)
- Streaming CSV import and batch processing
- Full test coverage (unit and integration)
- Dockerized for easy development and deployment
- Database migrations and schema management

## Overview

Clean architecture, TypeORM, Express.js, TypeScript, Unit of Work, TDD (Jest). Streaming CSV import using async generators.

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in your DB credentials
3. `npm run dev` to run locally
4. `npm run test` to run all tests

## API

Upload CSV to `/api/transactions/import`

## Database Migrations

This project uses [TypeORM](https://typeorm.io/) for database migrations. You can manage your PostgreSQL schema using migration scripts, either locally or via Docker Compose.

### **Running Migrations with Docker Compose**

1. **Start the database:**
   ```sh
   docker-compose --env-file .env.bank up -d db
   ```
2. **Run migrations in a one-off container:**
   ```sh
   docker-compose --env-file .env.bank run --rm test npm run migration:run
   ```
   Or, using the Makefile shortcut:
   ```sh
   make migration-run
   ```

### **Generating a New Migration**

1. **Make changes to your entities.**
2. **Generate a migration:**
   ```sh
   make migration-generate
   ```
   You will be prompted for a migration name. This will create a new migration file in the `migrations/` directory.

### **Other Migration Commands**

- **Revert the last migration:**
  ```sh
  make migration-revert
  ```
- **Show migration status:**
  ```sh
  make migration-show
  ```

### **Best Practices**
- Always run migrations before starting the app in a new environment.
- Use the Makefile or npm scripts for consistency.
- For production, run migrations as a separate step before starting the app container.
