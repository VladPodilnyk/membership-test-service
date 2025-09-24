# Solution Documentation

## Folder Hierarchy

```
src/modern/
├── domain/           # Various functions related to the application domain
├── models/           # Types and entity definitions
├── repository/       # The db/repo layer
├── services/         # The app's business logic
└── routes/           # Controller/endpoint definitions
```

## Design Decisions

For this assignment, I chose a "functional approach" to keep the solution simple and avoid over-engineering.
I believe it really depends on the use-case, however, in larger applications/enterprise I'd prefer to structure everything with classes and then wire components together using DI or a common init file.

### Testing Strategy

Tests are collocated with their respective modules (e.g., `membership.routes.test.ts` next to `membership.routes.ts`).
However, in a production app, I'd prefer having a separate `tests/` folder to better organize test files and keep the source code clean.

## Improvements

- **Use Zod for validation**: Replace the custom validation functions with Zod schemas for better type safety and runtime validation
- **Integration with frameworks**: Consider using Zod with Hono or tRPC to have robust validation with middleware
- **Class-based approach for production**: For larger applications, consider structuring with classes and dependency injection (like NestJS) for better testability and maintainability (again, depends on the use-case and team preferences)

[A brief overview of the Taks2](./EXPORT.md)
