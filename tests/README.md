# Test Suite Documentation

This directory contains comprehensive tests for the Bank Reconciliation system.

## Test Structure

```
tests/
├── setup.ts                           # Global test setup and configuration
├── unit/                              # Unit tests for individual components
│   ├── domain/
│   │   └── entities/
│   │       └── Transaction.test.ts    # Transaction entity tests
│   ├── shared/
│   │   └── utils/
│   │       └── chunkGenerator.test.ts # Utility function tests
│   ├── application/
│   │   ├── services/
│   │   │   └── csvRowGenerator.test.ts # CSV parsing service tests
│   │   └── use-cases/
│   │       └── ImportTransactionsUseCase.test.ts # Use case tests
│   ├── presentation/
│   │   └── controllers/
│   │       └── TransactionController.test.ts # Controller tests
│   └── infrastructure/
│       └── orm/
│           ├── TransactionRepository.test.ts # Repository tests
│           └── ImportBatchRepository.test.ts # Repository tests
└── integration/
    └── routes/
        └── transactionRoutes.test.ts  # API route integration tests
```

## Running Tests

### All Tests
```bash
npm test
```

### Watch Mode (for development)
```bash
npm run test:watch
```

### With Coverage Report
```bash
npm run test:coverage
```

### Unit Tests Only
```bash
npm run test:unit
```

### Integration Tests Only
```bash
npm run test:integration
```

## Test Categories

### Unit Tests
- **Domain Entities**: Test business logic and data validation
- **Shared Utils**: Test utility functions and helpers
- **Application Services**: Test business logic services
- **Use Cases**: Test application use cases and workflows
- **Controllers**: Test HTTP request/response handling
- **Repositories**: Test data access layer

### Integration Tests
- **API Routes**: Test complete HTTP endpoints with mocked dependencies

## Test Coverage

The test suite covers:
- ✅ Domain entities and business logic
- ✅ Application services and use cases
- ✅ HTTP controllers and request handling
- ✅ Data access layer (repositories)
- ✅ Utility functions
- ✅ API endpoints (with mocked dependencies)
- ✅ Error handling and edge cases
- ✅ Type safety and validation

## Mocking Strategy

- **Database**: All database operations are mocked to avoid external dependencies
- **File System**: File operations are mocked for unit tests
- **External Services**: Any external API calls are mocked
- **Streams**: File streams are mocked with in-memory buffers

## Best Practices

1. **Isolation**: Each test is independent and doesn't rely on other tests
2. **Descriptive Names**: Test names clearly describe what is being tested
3. **Arrange-Act-Assert**: Tests follow the AAA pattern
4. **Edge Cases**: Tests include error conditions and boundary cases
5. **Type Safety**: All tests use proper TypeScript types
6. **Cleanup**: Tests clean up after themselves

## Adding New Tests

When adding new functionality:

1. **Unit Tests First**: Write unit tests for the core logic
2. **Integration Tests**: Add integration tests for API endpoints
3. **Update Coverage**: Ensure new code is covered by tests
4. **Documentation**: Update this README if adding new test categories

## Troubleshooting

### Common Issues

1. **Database Connection Errors**: Make sure database mocks are properly set up
2. **Type Errors**: Ensure all mocks have proper TypeScript types
3. **Async/Await**: Use proper async/await patterns in tests
4. **Cleanup**: Ensure tests don't leave side effects

### Debug Mode

Run tests with verbose output:
```bash
npm test -- --verbose
```

### Single Test File

Run a specific test file:
```bash
npm test -- --testPathPattern=Transaction.test.ts
``` 