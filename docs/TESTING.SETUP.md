# End-to-End Testing Infrastructure Setup

This document provides a comprehensive deep-dive into the architectural decisions, configuration details, and implementation patterns of the testing infrastructure for **NeuroDev.API**. 

Our setup is built on **Vitest**, a modern, high-performance testing framework that leverages the existing Vite development ecosystem to provide sub-second test execution and advanced features like UI-reporting and coverage analysis.

---

## 🛠️ The Tech Stack

| Tool | Purpose | Rationale |
| :--- | :--- | :--- |
| **Vitest** | Test Runner | Lightning-fast, natively handles TypeScript, and supports standard Jest-like expect syntaxes. |
| **Supertest** | HTTP Assertions | The industry standard for testing REST APIs. It allows for fluent API testing by spinning up the app in-memory. |
| **MongoDB Memory Server** | DB Isolation | Spawns a real, isolated MongoDB instance in memory for *each* test worker. This ensures tests are truly unit-atomic and don't require an external DB. |
| **Faker.js** | Data Generation | Generates realistic mock data (emails, names, passwords) to ensure diverse testing scenarios. |
| **V8 Coverage** | Metrics | Modern coverage provider specifically optimized for Node.js environments. |

---

## ⚙️ Core Configuration (`vitest.config.ts`)

The configuration file is the "brain" of the testing environment. It defines how Vitest discovers, executes, and analyzes your tests.

```typescript
export default defineConfig({
  test: {
    globals: true,           // Allows using describe/expect without explicit imports.
    environment: 'node',     // Sets the execution context to Node.js (API focus).
    setupFiles: ['./tests/setup.ts'], // The initialization script for the test environment.
    clearMocks: true,        // Automatically clear mock call history between tests.
    restoreMocks: true,      // Automatically restore original implementations between tests.
    alias: {
      '@': path.resolve(__dirname, './src'), // Standardize path imports for @/
      '@tests': path.resolve(__dirname, './tests')
    },
    coverage: {
      thresholds: {
        lines: 80, // Enforces quality by failing builds if coverage drops below 80%.
        // ...
      }
    }
  }
});
```

---

## 🚀 Environment Initialization (`tests/setup.ts`)

This file is the **entry point** for every test execution. It handles critical initialization logic before any application code is loaded.

### 1. Environment Variable Injection
We override the `process.env` immediately. This is crucial because many configurations (like Passport or Database connections) read from the environment at the moment they are imported. By setting them here, we ensure that no real production/staging secrets are ever leaked into the test run.

### 2. Global Strategy Mocking
We mock heavy dependencies like **Passport** globally. This allows us to simulate authentication without needing to interact with real Google OAuth providers.
```typescript
vi.mock('@/config/passport', () => ({
  default: {
    initialize: vi.fn(() => (req, res, next) => next()),
    authenticate: vi.fn(() => (req, res, next) => next()),
    // ...
  }
}));
```

### 3. Lifecycle Hooks ⚓
- `beforeAll`: Establishes the connection to the In-Memory MongoDB.
- `afterEach`: Clears all data from the database and resets all mocks. This ensures test isolation—no test can "poison" the next test's environment.
- `afterAll`: Gracefully closes the database connection and stops the `MongoMemoryServer` daemon to prevent memory leaks and zombie processes.

---

## 🎭 Advanced Mocking Strategy

Mocking is the key to decoupling tests from external systems.

### Module Mocking vs. Dependency Injection
In this project, we primarily use **Vitest Module Mocking** (`vi.mock()`).
- **Why?** It intercepts the `import` statement itself. This is powerful because it works even for side-effect-heavy modules like `passport` or `express-session` without needing to refactor the entire codebase for Dependency Injection.

### Mocking Example: Passport OAuth
By mocking the `authenticate` middleware, we can "pre-approve" requests in tests:
```typescript
vi.mock('@/config/passport', () => ({
  default: {
    // We return a "Pass-Through" middleware
    authenticate: vi.fn(() => (req, res, next) => {
      req.user = mockedUser; // Fake the user session
      next();
    }),
  }
}));
```
This turns a complex 3rd-party OAuth redirect flow into a simple, synchronous function call.

---

## 🏢 Database Isolation (`tests/utils/dbHandler.ts`)

To ensure tests are independent and reproducible, we use **MongoDB Memory Server**.

- **Why it matters?** 
  - **Speed**: In-memory operations are significantly faster than disk-based ones.
  - **Isolation**: Each developer or CI runner gets their own completely unique database instance.
  - **Safety**: There is zero risk of deleting or corrupting actual development or production data.

---

## 📈 Monitoring Quality: Code Coverage

We utilize `@vitest/coverage-v8` to track which parts of the codebase are actually being executed during tests.

### Threshold Enforcement
As configured in `vitest.config.ts`, we require **80% coverage** across lines, functions, and branches. If a developer pushes code without sufficient tests, the CI/CD pipeline will automatically fail.

### Exclusion Strategy
We exclude files that are purely boilerplate or configuration:
- `src/server.ts` (Entry point bootstrap)
- `src/config/**` (Configuration/Secret mapping)
- `node_modules` and `dist`

---

## ⌨️ Available Scripts

Execute these commands from the project root:

| Command | Action |
| :--- | :--- |
| `npm run test` | Executes all tests once and exits. |
| `npm run test:watch` | Starts Vitest in watch mode (interactive). |
| `npm run test:ui` | Opens a beautiful browser-based UI for visualizing test results. |
| `npm run test:coverage` | Generates a full HTML coverage report in the `/coverage` directory. |
| `npm run test:ci` | Optimized runner for GitHub Actions/CI (generates JUnit XML reports). |

---

## ✅ Best Practices for New Tests

1. **Test Folder Structure**: Place tests in the `tests/` directory matching the `src/` directory structure. Append `.test.ts`.
2. **Setup Isolation**: If a test creates a User, ensure you don't rely on it existing in the next test (the `clearDatabase` utility handles this automatically).
3. **Mocking External APIs**: Use `vi.mock()` for any third-party services (like Email providers, AWS S3, or external Auth APIs) to keep tests deterministic and offline-compliant.
4. **Use Supertest for Endpoints**: Always test the "Full Request-Response" cycle for routes to catch integration issues between Middleware, Controllers, and Services.

---

> [!IMPORTANT]
> **Test-Driven Development (TDD)** is highly encouraged. When fixing a bug, first write a failing test that reproduces the bug, then write the code to make it pass. This ensures the bug never regresses.
