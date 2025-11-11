# Fake API Test Generation Guide (for AI IDEs)

This repository is an API test project targeting a json-server based REST API called "fakeapi" running at http://localhost:8000. Your task is to generate tests in a consistent structure and placement so we can compare AI IDEs fairly.

Read this guide carefully and follow all rules strictly. Do not ask clarifying questions—assume defaults below and proceed.

## 0) Quick checklist (must follow)
- Before any change, create and switch to a dedicated branch named `ai-<tool-name>-<YYYYMMDD-HHmm>` and keep all your work on this branch. IMPORTANT: the timestamp must be the current date and time when you start the experiment — do not hard-code or reuse a previous timestamp.

  Examples (PowerShell) - run these in the workspace root to produce a branch with the current timestamp:

  ```powershell
  # create branch with current date+hour+minute (yyyyMMdd-HHmm)
  $now = Get-Date -Format "yyyyMMdd-HHmm"
  $tool = "<tool-name>"  # replace with ai tool id, e.g. 'cursor'
  git checkout -b "ai-$tool-$now"
  ```

  Example one-liner you can paste (PowerShell):

  ```powershell
  git checkout -b ("ai-" + "<tool-name>" + "-" + (Get-Date -Format "yyyyMMdd-HHmm"))
  ```

  Notes:
  - Replace `<tool-name>` with the short identifier used for the experiment (e.g., `cursor`, `copilot`).
  - The AI must run the command in the new chat/session; do NOT manually type a fixed timestamp into the branch name. This ensures traceability and prevents accidental reuse of previous branches.
- Use the existing ApiService and service files under `src/api/fakeApi`. Never call axios/fetch directly in tests.
- Each test must call exactly one public "test-specific service function" with no arguments, then perform validations on the returned response.
- Any setup (creating/selecting IDs, building request params/body) must be encapsulated inside that service function.
- Place tests under `fake-api-tests/` and name them with the `.spec.ts` suffix (e.g., `users.crud.spec.ts`, `products.analytics.spec.ts`).
- Do not use `describe.only` or `it.only`.
- Before generating endpoints/tests, run `npm run openapi:fetch` to refresh `openapi.json`.
- Tests are TypeScript and run with Mocha via `npm run test:fake`. The bootstrap file handles per-file DB reset; do NOT reset DB in tests.
- Use the OpenAPI schema to drive assertions beyond basic type checks (see 5.1 Schema-driven assertions).

## 1) Environment and scripts
- Node.js 18+ required.
- Fake API should be running at `http://localhost:8000` (outside of this repo).
- Important scripts:
  - `npm run openapi:fetch` → writes latest OpenAPI spec to `./openapi.json`.
  - `npm run test:fake` → runs Mocha with TS support and loads `fake-api-tests/bootstrap.ts`.

## 2) Project structure you must conform to
- Core HTTP layer:
  - `src/api/HttpClient.ts` provides Axios instances and interceptors.
  - `src/api/ApiService.ts` extends `HttpClient` and exposes `ApiService.getInstance().instance` for HTTP calls.
- Core resource services (one per domain):
  - `src/api/fakeApi/UserService.ts`, `ProductService.ts`, `OrderService.ts`, `CategoryService.ts`, `ReviewService.ts`, etc.
  - These wrap a single REST endpoint per method and return the Axios response.
- Scenario/composite services:
  - Create new scenario service files under `src/api/fakeApi/` (suffix with `...ScenarioService.ts`) to encapsulate setup + the single target call.
- Tests:
  - `fake-api-tests/**/*.spec.ts` (TypeScript, Mocha + Chai). `fake-api-tests/bootstrap.ts` enforces a per-file DB reset using `StateService.resetDb()`.

## 3) What to generate (rules and patterns)

### 3.1 Core service methods (if missing)
- Implement missing CRUD or specialized endpoint calls in the appropriate core service under `src/api/fakeApi/`.
- Method signature: prefer descriptive names (e.g., `getUserOnlyByID(id: number)` or `createNewOrder()`).
- Use `ApiService.getInstance().instance.<method>(path, ...)` for all HTTP calls.
- Keep logic minimal: no test assertions here. Only HTTP and necessary small integrity checks (e.g., ID match) as seen in existing files.

### 3.2 Scenario (test-specific) service methods
- For each test scenario, expose a single public method that:
  - Performs required setup (e.g., pick or create IDs, compute params/body) internally.
  - Calls exactly one target endpoint.
  - Returns the Axios response.
- Create a new scenario service file under `src/api/fakeApi/` and suffix it with `...ScenarioService.ts` (e.g., `UsersScenarioService.ts`, `OrdersScenarioService.ts`). Do not add these to `SpecialEndpointService.ts` (it has been removed in this branch).
- Optionally provide a second variant that accepts explicit IDs when needed (pattern: `getXOnlyByID(id: number)`) for flexibility.

### 3.3 Test files
- Location: `fake-api-tests/`.
- Structure per test case:
  - Import the scenario service instance (e.g., `usersScenarioService`).
  - In the `it` block, call one scenario method with no parameters (e.g., `await usersScenarioService.exampleScenario()`).
  - Validate response: `status` code, `data` type, presence and types of required fields, and basic consistency checks (counts, min/max, non-negativity, ID equality).
- Do not embed setup or additional API calls inside the test—the scenario service must hide that complexity.
- Avoid guards that swallow failures; tests should fail if the response is invalid.

Example skeleton:

```ts
import { expect } from "chai";
// Implement your own scenario service first, e.g., src/api/fakeApi/UsersScenarioService.ts
// import { usersScenarioService } from "@/api/fakeApi/UsersScenarioService";

describe("Example Scenario", function () {
  this.timeout(20000);

  it("Runs a parameterless scenario and validates", async () => {
    const response = await usersScenarioService.exampleScenario();
    expect(response).to.be.an("object");
    expect(response.status).to.equal(200);
    const data = response.data;
    expect(data).to.be.an("object");
    // add field/type assertions and invariants here
  });
});
```

## 4) Naming and placement rules
- Core services: keep/extend existing files, e.g., `UserService.ts`, `ProductService.ts`, `OrderService.ts`, `CategoryService.ts`, `ReviewService.ts`.
- Scenario/composite endpoints: create a new scenario file under `src/api/fakeApi/` and suffix with `...ScenarioService.ts`.
- Test file naming: end with `.spec.ts` and group by resource or analytics theme, e.g., `users.crud.spec.ts`, `orders.analytics.spec.ts`.

### 4.1 Test title convention (mandatory)
Each `it` title must begin with an HTTP verb and the logical path, then a hyphen and the expectation. Pattern:

`<METHOD> <PATH> - <expectation statement>`

Rules:
- METHOD must be one of: GET, POST, PUT, PATCH, DELETE.
- PATH should mirror the actual endpoint path with placeholders for IDs: `/users/{id}`, `/orders/{id}/details`, `/products/{id}/reviews-summary`.
- Use `{id}` (or `{userId}`, `{productId}` if clearer) for dynamic segments—not concrete numbers.
- Expectation statement is a short English phrase (or Turkish if required) describing the core success criteria: `should return 200`, `creates new user with id`, `returns non-empty array`, `returns stats fields`.
- No extra punctuation at the end (avoid trailing period).

Examples:
```ts
it("GET /users/{id} - should return 200", async () => { /* ... */ });
it("POST /users - creates new user with id", async () => { /* ... */ });
it("GET /products/{id}/reviews-summary - returns aggregation fields", async () => { /* ... */ });
it("DELETE /orders/{id} - removes order (200)", async () => { /* ... */ });
```

Why: This drives a readable mapping from titles to endpoints and enhances the generated `coverage/summary.json` artifact for human comparison.

## 5) Assertions (minimum expectations)
- Always check `response.status` matches the expected success code (typically 200; 201 for creations).
- Validate `response.data` type.
- Validate critical fields exist with correct primitive types.
- Basic invariants where applicable:
  - IDs in payload match the selected entity ID.
  - Non-negative numeric fields (`totalSales`, `totalRevenue`, counts).
  - Ranges: `min <= max`.
  - Array lengths consistent with counts or limits.
- Mandatory: add schema-driven checks using `openapi.json` (see 5.1).

### 5.1) Schema-driven assertions (mandatory)
Use `openapi.json` as the source of truth for response shapes and constraints. Your tests must assert key schema elements, not just that `data` is an object. Aim for concise but meaningful coverage:

- Required vs optional fields
  - Assert all `required` properties exist.
  - For optional fields present, assert their types.
- Types and enums
  - Assert primitive types (string/number/boolean/integer).
  - For enums, assert value ∈ allowed set.
- Arrays and items
  - Assert arrays when the schema says `type: array`.
  - Assert item object shape (key fields and their types) for a representative element.
  - If `minItems`/`maxItems` are known or a `limit` param is used, assert the length.
- Numeric constraints
  - Non-negative values; if `minimum`/`maximum` present, assert bounds.
  - If schema implies ordering (e.g., ranking by score), assert sort order on the relevant field.
- Path/query consistency
- Nested objects
  - For nested object properties (e.g., `user.address.city`), assert presence and primitive types for key nested fields per schema.
  - For nested arrays of objects (e.g., `items: [{ product: {...}, quantity }]`), assert the shape for a representative element: `items` is array, first item has `quantity` as number and `product.id` as number, `product.name` as string, etc.

## 6) OpenAPI usage
- Start every generation cycle by refreshing OpenAPI:

```powershell
npm run openapi:fetch
```

- Use `openapi.json` to list endpoints and schemas. Implement missing core service methods before writing scenario methods/tests.

### 6.1 Required endpoint coverage (MANDATORY)

- Every endpoint defined in `openapi.json` MUST be covered by at least one test. Coverage is defined as an actual HTTP call recorded during the test run that matches the OpenAPI path (path templating like `{id}` is handled automatically).
- The standard flow for each endpoint is:
  1. Ensure the core service method exists under `src/api/fakeApi/*Service.ts` that can call the endpoint (create it if missing).
 2. Create a `*ScenarioService.ts` exposing exactly one parameterless public method that performs any setup and calls the endpoint.
 3. Create a `.spec.ts` test under `fake-api-tests/` that calls the scenario method and asserts results using the OpenAPI schema (see 5.1).
- If an endpoint is impossible to exercise in this test environment (external auth-only, requires special partner data, or is deprecated), you MUST:
  - Leave a single `.spec.ts` test file for that endpoint containing a failing-skipped-style TODO: a short comment explaining why it's unreachable and a clearly labeled `it("<METHOD> <PATH> - TODO: unreachable in current test env", async () => { /* TODO: reason */ });` entry. Do not use `it.skip` or `describe.skip`—we need visible TODOs for manual review.
  - Document the exemption in your PR description and in the test file header comment.
- The test bootstrap collects coverage and writes `coverage/summary.json` which contains an `openapi.untested` list. Aim for `untestedCount: 0` before finishing your run.

Note: For the automated experiment runs we may set an environment flag to enforce zero untested endpoints (see section 11 and the `fake-api-tests/bootstrap.ts` behavior). If enforced, the test run will fail when any endpoint is untested.

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
  - Create and checkout a dedicated branch: `ai-<tool-name>-<YYYYMMDD-HHmm>` (e.g., `ai-copilot-20251111-1430`).
    Optional commands:

```powershell
git checkout -b ai-<tool-name>-<YYYYMMDD-HHmm>
```
   - Ensure Fake API is running at `http://localhost:8000`.
   - Run `npm run openapi:fetch` to update `openapi.json`.
   - Provide this `GUIDE.md` and repository to the AI IDE. Do not provide extra instructions beyond this guide.

2. Scope for generation
   - For each endpoint in `openapi.json`, the AI must:
     a) Ensure a core CRUD service method exists (create if missing) under `src/api/fakeApi/*Service.ts`.
     b) Add a scenario method (no-arg public function) that performs setup + calls the endpoint.
     c) Add a test in `fake-api-tests/` that calls exactly one scenario method and asserts results.

3. Execution per AI IDE
  - Work on a dedicated branch named `ai-<tool-name>-<YYYYMMDD-HHmm>`.
   - Generate/modify files according to this guide only.
   - Run `npm run test:fake` and ensure tests execute.
  - Produce artifacts: list of files changed, summary of endpoints covered.
  - Coverage artifact (auto): After tests, a file `coverage/summary.json` is generated containing:
    - unique endpoints hit (METHOD + path)
    - per-file breakdown
    - parsed test titles (`testsWithTitles`) following the convention in 4.1
    - OpenAPI-aware coverage: total defined endpoints, per-endpoint hit counts, and an explicit `untested` list of endpoints not hit by any test. This is derived automatically from `openapi.json` and recorded HTTP calls.
    You don’t need to write this manually; it is collected via HTTP interceptors during tests.

4. Collection
   - We will collect branches and compare:
     - Structure conformance (this guide’s rules).
  - Endpoint coverage (fraction of paths with at least one test).
  - Assertion quality (depth against OpenAPI schema; shallow type-only checks are insufficient).
     - Build/lint status.

## 10) Reference: existing patterns in this repo
- Core services with simple wrappers: `UserService.ts`, `ProductService.ts`, `OrderService.ts`, `CategoryService.ts`, `ReviewService.ts`.
- Test reset logic: `fake-api-tests/bootstrap.ts` performs per-file DB reset.

## 11) Sanitized Mode (this branch)
This branch is prepared for the AI IDE experiment with a minimal scaffold and strict conventions:

- `SpecialEndpointService.ts` and any prior composite endpoint logic have been removed.
- Core services under `src/api/fakeApi` currently expose only CRUD stub methods that throw `NOT_IMPLEMENTED`.
- Your first step is to implement missing CRUD methods (simple wrappers over HTTP) using `ApiService.getInstance().instance`.
- For higher-level flows or derived analytics calls, create new scenario service files (e.g., `UsersScenarioService.ts`) that expose parameterless public methods encapsulating setup + exactly one HTTP call.
- Do NOT recreate a monolithic “special endpoint” service; keep scenarios modular per domain.
- Test files MUST end with `.spec.ts` — only these are executed.
- Each test must call exactly one parameterless scenario method, then perform assertions.

Additional Sanitized Mode Title Rule:
- Follow the test title convention in 4.1 strictly; do not invent alternative formats (e.g., avoid `Should get user` without METHOD/PATH).

Recommended naming patterns:
- Core: `UserService.ts` with methods like `createUser(...)`, `getUserById(id)`, etc.
- Scenario: `UsersScenarioService.ts` with methods like `createAndFetchUser()` or `fetchRandomActiveUser()` (no params).
- Optional explicit-ID variants (not used directly by tests): `fetchUserOnlyByID(id: number)`.

---
By following this guide exactly, your generated tests will be comparable to others and will integrate cleanly with the current codebase and tooling.
