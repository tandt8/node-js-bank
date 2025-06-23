# Source Code Architecture

This document explains the clean architecture implementation of the Bank Reconciliation System.

## Architecture Overview

The project follows Clean Architecture principles with clear separation of concerns across four main layers:

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │   Controllers   │  │     Routes      │                  │
│  └─────────────────┘  └─────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer                         │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │   Use Cases     │  │    Services     │                  │
│  └─────────────────┘  └─────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Domain Layer                            │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │    Entities     │  │   Repositories  │                  │
│  └─────────────────┘  └─────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Infrastructure Layer                       │
│  ┌─────────────────┐  ┌─────────────────┐                  │
│  │   ORM Config    │  │   Repositories  │                  │
│  └─────────────────┘  └─────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
```

## Layer Details

### 1. Domain Layer (`/domain`)

The innermost layer containing business logic and entities.

#### Entities (`/domain/entities`)
- **Transaction.ts**: Core business entity representing a financial transaction
  - Properties: `date`, `content`, `amount`, `type`
  - Contains business rules and validation logic
  - Independent of any external framework

#### Repository Interfaces (`/domain/repositories`)
- **IImportBatchRepository.ts**: Defines contract for batch import operations
  - `create(fileName, recordCount, userId)`: Create new import batch
  - `markComplete(batchId)`: Mark batch as successfully completed
  - `markFailed(batchId, message)`: Mark batch as failed with error message

- **ITransactionRepository.ts**: Defines contract for transaction operations
  - `saveMany(transactions)`: Save multiple transactions in batch

**Key Principle**: Domain layer has no dependencies on external frameworks or databases.

### 2. Application Layer (`/application`)

Contains application-specific business logic and orchestrates domain objects.

#### Use Cases (`/application/use-cases`)
- **ImportTransactionsUseCase.ts**: Main business logic for importing transactions
  - Orchestrates the import process
  - Creates import batch
  - Calls import service
  - Handles success/failure states
  - Manages transaction rollback on errors

#### Services (`/application/services`)
- **StreamImportService.ts**: Handles streaming CSV import with batching
  - Processes gzipped CSV files
  - Implements batch processing for performance
  - Manages database transactions
  - Handles rollback on errors

- **csvRowGenerator.ts**: CSV parsing utilities
  - `parseCsvRowsFromStream()`: Parse CSV from gzipped stream
  - Handles data transformation (dates, amounts, types)
  - Supports comma and plus sign removal from amounts

**Key Principle**: Application layer orchestrates domain objects and implements application-specific business rules.

### 3. Infrastructure Layer (`/infrastructure`)

Handles external concerns like databases, file systems, and external APIs.

#### ORM Configuration (`/infrastructure/orm`)
- **ormconfig.ts**: TypeORM configuration
  - Database connection settings
  - Entity registration
  - Migration configuration
  - Environment-specific settings

#### Repository Implementations (`/infrastructure/orm`)
- **ImportBatchRepository.ts**: Concrete implementation of IImportBatchRepository
  - Uses TypeORM for database operations
  - Implements batch creation, status updates
  - Handles database-specific logic

- **TransactionRepository.ts**: Concrete implementation of ITransactionRepository
  - Batch transaction saving
  - TypeORM entity management
  - Transaction batching for performance

#### Entities (`/infrastructure/orm/entities`)
- **TransactionEntity.ts**: TypeORM entity mapping
  - Database table structure
  - Column mappings and constraints
  - Relationships with ImportBatchEntity

- **ImportBatchEntity.ts**: TypeORM entity for import batches
  - Batch metadata storage
  - Status tracking
  - User relationship

- **UserEntity.ts**: TypeORM entity for users
  - User authentication and authorization
  - Import tracking

**Key Principle**: Infrastructure layer implements interfaces defined in the domain layer.

### 4. Presentation Layer (`/presentation`)

Handles HTTP requests, responses, and user interface concerns.

#### Controllers (`/presentation/controllers`)
- **TransactionController.ts**: HTTP request handling
  - `list()`: Handle GET requests for transaction listing
  - `import()`: Handle POST requests for file imports
  - Request/response transformation
  - Error handling and status codes

#### Routes (`/presentation/routes`)
- **transactionRoutes.ts**: Express route definitions
  - RESTful API endpoints
  - Middleware configuration (multer for file uploads)
  - OpenAPI/Swagger documentation
  - Route-to-controller mapping

**Key Principle**: Presentation layer handles HTTP concerns and delegates business logic to application layer.

## Data Flow Example: Import Transaction

```
1. HTTP Request → Routes → Controller
   POST /api/transactions/import

2. Controller → Use Case
   TransactionController.import() → ImportTransactionsUseCase.execute()

3. Use Case → Domain + Infrastructure
   - Creates ImportBatch (via Repository)
   - Calls StreamImportService
   - Updates batch status

4. Service → Infrastructure
   - Parses CSV (csvRowGenerator)
   - Saves to database (TransactionRepository)
   - Manages transactions

5. Response flows back up the layers
   Infrastructure → Service → Use Case → Controller → HTTP Response
```

## Shared Utilities (`/shared`)

Common utilities used across layers:
- **chunkGenerator.ts**: Utility for processing data in batches
  - Async generator for memory-efficient processing
  - Configurable batch sizes

## Key Benefits of This Architecture

1. **Testability**: Each layer can be tested independently with mocks
2. **Maintainability**: Clear separation makes code easier to understand and modify
3. **Flexibility**: Easy to swap implementations (e.g., different databases)
4. **Scalability**: Services can be extracted to microservices later
5. **Dependency Direction**: Dependencies point inward, domain layer has no external dependencies

## Testing Strategy

- **Unit Tests**: Test each layer in isolation
- **Integration Tests**: Test layer interactions
- **End-to-End Tests**: Test complete workflows via HTTP API

## Adding New Features

1. **Domain Layer**: Define entities and repository interfaces
2. **Application Layer**: Create use cases and services
3. **Infrastructure Layer**: Implement repositories and external integrations
4. **Presentation Layer**: Add controllers and routes
5. **Tests**: Add corresponding tests for each layer

This architecture ensures that business logic remains independent of external concerns while providing a clean, maintainable codebase. 