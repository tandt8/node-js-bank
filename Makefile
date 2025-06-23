.PHONY: help build test test-unit test-coverage clean up down logs migration-generate migration-run migration-revert

# Default target
help:
	@echo "Available commands:"
	@echo "  build          - Build the Docker images"
	@echo "  up             - Start the application with database"
	@echo "  down           - Stop all services"
	@echo "  test           - Run all tests in Docker"
	@echo "  test-unit      - Run unit tests only"
	@echo "  test-coverage  - Run tests with coverage report"
	@echo "  logs           - Show logs from all services"
	@echo "  clean          - Remove all containers and volumes"
	@echo "  migration-generate - Generate a new migration"
	@echo "  migration-run  - Run pending migrations"
	@echo "  migration-revert - Revert last migration"

# Build Docker images
build:
	docker-compose --env-file .env.bank build

# Start the application
up:
	docker-compose --env-file .env.bank up --build

# Stop all services
down:
	docker-compose --env-file .env.bank down

# Run all tests
test:
	docker-compose --env-file .env.bank --profile test up --build test

# Run unit tests only
test-unit:
	docker-compose --env-file .env.bank --profile test up --build test-unit

# Run tests with coverage
test-coverage:
	docker-compose --env-file .env.bank --profile test up --build test-coverage

# Show logs
logs:
	docker-compose --env-file .env.bank logs -f

# Clean up containers and volumes
clean:
	docker-compose --env-file .env.bank down -v --remove-orphans
	docker system prune -f

# Database migrations
migration-generate:
	@read -p "Enter migration name: " name; \
	npm run migration:generate migrations/$$name

migration-run:
	npm run migration:run

migration-revert:
	npm run migration:revert

migration-show:
	npm run migration:show 