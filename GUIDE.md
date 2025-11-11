# Fake API Test Generation Guide (for AI IDEs)

This repository is an API test project targeting a json-server based REST API called "fakeapi" running at http://localhost:8000. Your task is to generate tests in a consistent structure and placement so we can compare AI IDEs fairly.

Read this guide carefully and follow all rules strictly. Do not ask clarifying questions—assume defaults below and proceed.

## 0) Quick checklist (must follow)
- Use the existing ApiService and service files under `src/api/fakeApi`. Never call axios/fetch directly in tests.
- Each test must call exactly one public "test-specific service function" with no arguments, then perform validations on the returned response.
- Any setup (creating/selecting IDs, building request params/body) must be encapsulated inside that service function.
- Place tests under `fake-api-tests/` and name them meaningfully (e.g., `products.analytics.tests.ts`).
- Do not use `describe.only` or `it.only`.
- Before generating endpoints/tests, run `npm run openapi:fetch` to refresh `openapi.json`.
- Tests are TypeScript and run with Mocha via `npm run test:fake`. The bootstrap file handles per-file DB reset; do NOT reset DB in tests.

## 1) Environment and scripts
- Node.js 18+ required.
- Fake API should be running at `http://localhost:8000` (outside of this repo).
- Important scripts:
  - `npm run openapi:fetch` → writes latest OpenAPI spec to `./openapi.json`.
  - `npm run test:fake` → runs Mocha with TS support and loads `fake-api-tests/bootstrap.ts`.
  - `npm run seed:fake` → optional; creates sample data via a script if needed.

## 2) Project structure you must conform to
- Core HTTP layer:
  - `src/api/HttpClient.ts` provides Axios instances and interceptors.
  - `src/api/ApiService.ts` extends `HttpClient` and exposes `ApiService.getInstance().instance` for HTTP calls.
- Core resource services (one per domain):
  - `src/api/fakeApi/UsersService.ts`, `ProductsService.ts`, `OrdersService.ts`, `CategoriesService.ts`, `ReviewService.ts`, etc.
  - These wrap a single REST endpoint per method and return the Axios response.
- Scenario/composite services:
  - `src/api/fakeApi/SpecialEndpointService.ts` already contains many scenario-style methods that handle setup + target calls.
  - For new composite endpoints, add a new public method here or in a new scenario service file under the same folder.
- Tests:
  - `fake-api-tests/**/*.ts` (TypeScript, Mocha + Chai). `fake-api-tests/bootstrap.ts` enforces a per-file DB reset using `StateService.resetDb()`.

## 3) What to generate (rules and patterns)

### 3.1 Core service methods (if missing)
- Implement missing CRUD or specialized endpoint calls in the appropriate core service under `src/api/fakeApi/`.
- Method signature: prefer descriptive names (e.g., `getUserOnlyByID(id: number)` or `createNewOrder()`), return `AxiosResponse` where possible.
- Use `ApiService.getInstance().instance.<method>(path, ...)` for all HTTP calls.
- Keep logic minimal: no test assertions here. Only HTTP and necessary small integrity checks (e.g., ID match) as seen in existing files.

### 3.2 Scenario (test-specific) service methods
- For each test scenario, expose a single public method that:
  - Performs required setup (e.g., pick or create IDs, compute params/body) internally.
  - Calls exactly one target endpoint.
  - Returns the Axios response (or `false` if preconditions fail). Prefer returning the response.
- Place these as new methods in `SpecialEndpointService.ts` if they are composite/analytics-type endpoints, or in a new scenario service file under the same folder if you need logical separation.
- Ensure a second method variant exists that accepts explicit IDs when needed (pattern: `getXOnlyByID(id: number)`) for flexibility, mirroring the existing style.

### 3.3 Test files
- Location: `fake-api-tests/`.
- Structure per test case:
  - Import the scenario service instance (e.g., `specialEndpointService`).
  - In the `it` block, call one scenario method with no parameters (e.g., `await specialEndpointService.getProductSalesStatsByID()`).
  - Validate response: `status` code, `data` type, presence and types of required fields, and basic consistency checks (counts, min/max, non-negativity, ID equality).
- Do not embed setup or additional API calls inside the test—the scenario service must hide that complexity.
- Avoid guards that swallow failures; tests should fail if the response is invalid.

Example skeleton:

```ts
import { expect } from "chai";
import { specialEndpointService } from "@/api/fakeApi/SpecialEndpointService";

describe("Product Sales Stats", function () {
  this.timeout(20000);

  it("Get Product Sales Stats By ID", async () => {
    const response = await specialEndpointService.getProductSalesStatsByID();
    expect(response).to.be.an("object");
    expect(response.status).to.equal(200);
    const data = response.data;
    expect(data).to.be.an("object");
    expect(data).to.have.property("productId").that.is.a("number");
    expect(data).to.have.property("totalSales").that.is.a("number");
    expect(data.totalSales).to.be.at.least(0);
  });
});
```

## 4) Naming and placement rules
- Core services: keep/extend existing files, e.g., `UserService.ts`, `ProductsService.ts`, `OrderService.ts`, `CategoryService.ts`, `ReviewService.ts`.
- Scenario/composite endpoints: prefer adding to `SpecialEndpointService.ts`; if creating a new scenario file, place it under `src/api/fakeApi/` and suffix with `...ScenarioService.ts`.
- Test file naming: group by resource or analytics theme, e.g., `basicUsersTests.ts`, `analyticsOrdersTests.ts`, `specialEndpoint.ts` (existing).

## 5) Assertions (minimum expectations)
- Always check `response.status` matches the expected success code (typically 200; 201 for creations).
- Validate `response.data` type.
- Validate critical fields exist with correct primitive types.
- Basic invariants where applicable:
  - IDs in payload match the selected entity ID.
  - Non-negative numeric fields (`totalSales`, `totalRevenue`, counts).
  - Ranges: `min <= max`.
  - Array lengths consistent with counts or limits.
- Optional: add additional detailed checks if the OpenAPI schema specifies constraints.

## 6) OpenAPI usage
- Start every generation cycle by refreshing OpenAPI:

```powershell
npm run openapi:fetch
```

- Use `openapi.json` to list endpoints and schemas. Implement missing core service methods before writing scenario methods/tests.

## 7) What NOT to do
- Do not import or use `axios`/`fetch` directly in tests.
- Do not put setup (entity creation/selection) logic inside the test; keep it in service methods.
- Do not pass parameters into the test’s scenario-call; tests must call parameterless scenario functions.
- Do not leave `describe.only` or `it.only` anywhere.
- Do not catch and ignore errors in tests.

## 8) Running tests
- Ensure the Fake API is running.
- Then run:

```powershell
npm run test:fake
```

- The `bootstrap.ts` will reset the DB once per test file by calling `StateService.resetDb()` which posts to `/_admin/reset-db`.

## 9) Experiment procedure (how we will compare AI IDEs)
1. Preparation (common for all AIs)
   - Ensure Fake API is running at `http://localhost:8000`.
   - Run `npm run openapi:fetch` to update `openapi.json`.
   - Provide this `GUIDE.md` and repository to the AI IDE. Do not provide extra instructions beyond this guide.

2. Scope for generation
   - For each endpoint in `openapi.json`, the AI must:
     a) Ensure a core CRUD service method exists (create if missing) under `src/api/fakeApi/*Service.ts`.
     b) Add a scenario method (no-arg public function) that performs setup + calls the endpoint.
     c) Add a test in `fake-api-tests/` that calls exactly one scenario method and asserts results.

3. Execution per AI IDE
   - Work on a dedicated branch named `ai-<tool-name>-<date>`.
   - Generate/modify files according to this guide only.
   - Run `npm run test:fake` and ensure tests execute.
   - Produce artifacts: list of files changed, summary of endpoints covered.

4. Collection
   - We will collect branches and compare:
     - Structure conformance (this guide’s rules).
     - Endpoint coverage (fraction of paths with at least one test).
     - Assertion quality (breadth of checks vs. schema).
     - Build/lint status.

## 10) Reference: existing patterns in this repo
- Scenario methods with internal setup: `src/api/fakeApi/SpecialEndpointService.ts` (e.g., `getProductSalesStatsByID()`).
- Core services with simple wrappers: `UserService.ts`, `ProductsService.ts`, `OrderService.ts`, `CategoryService.ts`, `ReviewService.ts`.
- Test file example with only one scenario call per test: `fake-api-tests/specialEndpoint.ts`.

## 11) Optional enhancements (not required but allowed)
- Shared assertion helpers under `fake-api-tests/helpers/` (e.g., `assertNonNegativeFields`, `assertRange`).
- JSON Schema/Zod checks aligned to `openapi.json`.
- Negative tests (404/400) in separate `it` cases, still calling a scenario function that arranges an invalid ID internally.

---
By following this guide exactly, your generated tests will be comparable to others and will integrate cleanly with the current codebase and tooling.
