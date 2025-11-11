# Master Experiment Prompt (for AI IDEs)

Use this prompt verbatim inside your AI IDE. GUIDE.md is the single source of truth—do not restate rules here or ask for clarifications.

---

You are working in repository "cbrn-to-fakeapi" on branch "experiment-sanitized". Follow GUIDE.md exactly (especially sections 0, 2, 3.1–3.3, 4.1, 7, 8, 9, 11). Do not ask for clarifications.

1) Branch
- Create and switch to a new branch named ai-<tool-name>-<YYYYMMDD-HHmm> (example: ai-copilot-20251111-1430).

```powershell
git checkout -b ai-<tool-name>-<YYYYMMDD-HHmm>
```

2) Read and prepare
- Read GUIDE.md end-to-end and adhere to all constraints (Sanitized Mode, naming, title convention, file layout).
- Ensure the Fake API is running at http://localhost:8000.
- Refresh OpenAPI per GUIDE (openapi:fetch).

3) Implement per GUIDE
- Implement/complete missing CRUD methods only in the core services under src/api/fakeApi (HTTP wrappers only via ApiService.getInstance().instance).
- For each test case, create a scenario service under src/api/fakeApi named <Domain>ScenarioService.ts exposing exactly one parameterless public method that does setup → calls exactly one endpoint → returns the Axios response.
- Tests must live under fake-api-tests/, be named *.spec.ts, and call exactly one parameterless scenario method.
- Every `it` title must follow: METHOD PATH - expectation (see GUIDE 4.1).
 - Assertions must be schema-driven per GUIDE 5.1 (assert required fields, types, enums, nested object fields, array item shape, numeric bounds, ordering, and pagination when applicable).

Additional mandate (must follow): Cover every endpoint in `openapi.json`
- For this experiment you MUST cover every endpoint listed in `openapi.json`. For each endpoint, add a core service method (if missing), a scenario method, and a single `.spec.ts` test. If an endpoint cannot be exercised in this environment, add a short TODO test explaining why (see GUIDE.md for the exemption format).
- After running tests, ensure `coverage/summary.json` shows `openapi.untestedCount: 0`. If not, add/adjust tests until coverage is complete. The bootstrap supports an enforcement flag `FAIL_ON_UNTESTED=true` to make the run fail when untested endpoints remain — use that in CI runs when comparing AI IDE outputs.

4) Run and deliver
- Run tests exactly as documented in GUIDE and fix failures.
- Deliverables:
  - List of files created/modified.
  - Short summary of endpoints covered.
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
