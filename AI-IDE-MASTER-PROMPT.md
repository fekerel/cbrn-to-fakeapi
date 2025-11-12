# Master Experiment Prompt (for AI IDEs)

Use this prompt verbatim inside your AI IDE. GUIDE.md is the single source of truth. Do not restate rules here or ask for clarifications.

---

You are working in repository "cbrn-to-fakeapi" on branch "experiment-sanitized". Follow GUIDE.md exactly (especially sections 0, 2, 3.1–3.3, 4.1, 5.1, 6.1, 7, 8, 9, 11). Do not ask for clarifications.

CRITICAL RULES (must follow)
- Use existing CRUD services and any base CRUD tests already present; do NOT duplicate or rewrite them. Only add missing methods (for specialized endpoints) and new tests to complete coverage and assertions.
- For EVERY response field that is not marked `nullable: true` in the schema: assert presence AND type. This applies to top-level fields, nested fields, and representative array items.
- Use the exact success status code from OpenAPI for each tested endpoint (avoid generic "200 or 201").
- Cover every endpoint in openapi.json; if unreachable, leave a TODO test as described in GUIDE.

1) Branch
- Create and switch to a new branch named `ai-<tool-name>-<YYYYMMDD-HHmm>`. The timestamp MUST be the current date and time at branch creation; do not hard-code or reuse an existing timestamp. Use the PowerShell snippet below to generate the branch name automatically.

```powershell
# PowerShell (recommended) - creates branch ai-<tool-name>-YYYYMMDD-HHmm using current time
$now = Get-Date -Format "yyyyMMdd-HHmm"
$tool = "<tool-name>"  # replace with your ai tool id, e.g. 'cursor'
git checkout -b "ai-$tool-$now"
```

One-liner variant (pasteable into PowerShell):

```powershell
git checkout -b ("ai-" + "<tool-name>" + "-" + (Get-Date -Format "yyyyMMdd-HHmm"))
```

Make sure you actually run the command in the workspace — do not create the branch by manually typing a fixed timestamp. This ensures every experiment branch is timestamped at creation and is unique.

2) Read and prepare
- Read GUIDE.md end-to-end and adhere to all constraints (Sanitized Mode, naming, title convention, file layout).
- Ensure the Fake API is running at http://localhost:8000.
- Refresh OpenAPI per GUIDE (openapi:fetch).

3) Implement per GUIDE
- Basic CRUD methods already exist under src/api/fakeApi — use them. Implement only missing/specialized endpoints. All HTTP calls must go through ApiService.getInstance().instance.
  When creating resources, prefer using the body builder helpers from `src/common/fakeApi/Utils.ts` (e.g., `buildRandomUserBody`, `buildRandomProductBody`, etc.) to generate valid payloads; override fields as needed per test scenario.
- For each test case, create a scenario service under src/api/fakeApi named <Domain>ScenarioService.ts exposing exactly one parameterless public method that does setup → calls exactly one endpoint → returns the Axios response.
- Tests must live under fake-api-tests/, be named *.spec.ts, and call exactly one parameterless scenario method.
- Every `it` title must follow: METHOD PATH - expectation (see GUIDE 4.1).
 - Assertions must be schema-driven per GUIDE 5.1 — validate ALL documented non-nullable/required response fields (not just top-level), including nested object fields and representative array item shapes. Use the exact success status code from OpenAPI (do not write "200 or 201"). Also cover numeric bounds, ordering, and pagination when applicable. Tests omitting any non-nullable field assertion are invalid.

Note on server-managed timestamps: If schemas show `createdAt` and `modifiedAt` (or similar) in `openapi.json`, do NOT include those fields in request bodies. They are server-handled. Scenario services must not set `createdAt`/`modifiedAt` in request payloads, these fields may be excluded from validations as well.

Additional mandate (must follow): Cover every endpoint in `openapi.json`
- For this experiment you MUST cover every endpoint listed in `openapi.json`. For each endpoint, add a core service method (if missing), a scenario method, and a single `.spec.ts` test. If an endpoint cannot be exercised in this environment, add a short TODO test explaining why (see GUIDE.md for the exemption format).
- After running tests, ensure `coverage/summary.json` shows `openapi.untestedCount: 0`. If not, add/adjust tests until coverage is complete. 

4) Run and deliver
- Run tests exactly as documented in GUIDE and fix failures.
- Deliverables:
  - List of files created/modified.
  - Short summary of endpoints covered.
  - Note any discrepancies observed between live responses and the OpenAPI documentation (endpoint + brief description of the mismatch, e.g., missing field, different status code, type mismatch).
- Note: coverage/summary.json is generated automatically after the run; no extra work needed.

Constraints / Don’ts
- Do not call axios/fetch directly in tests; go through ApiService within services.
- Do not pass parameters from tests to scenario methods.
- One test = one scenario call (one endpoint).
- Do not create non-.spec.ts tests.
- Do not reintroduce SpecialEndpointService; use modular *ScenarioService files.

Acceptance
- Repo compiles; tests pass via the provided scripts.
- Tests live in fake-api-tests/*.spec.ts and follow the title convention.
 - Assertions reflect OpenAPI schemas (including nested fields) — depth over shallow type-only checks.
- Scenario services exist under src/api/fakeApi/*ScenarioService.ts and expose parameterless methods.
- HTTP calls go through ApiService only.
- coverage/summary.json is present after the run.
- Provide endpoints covered + files changed in your final output.
