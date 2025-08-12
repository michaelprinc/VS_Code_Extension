Codex AI • Agentic Instructions (Compact)

🎯 Core Loop (RPPC)
- PLAN → EXECUTE → CHECK for every task.
- Iterate through all necessary steps until the task is done.
- Before code: write PLAN with checklist (≤5 steps). During work: mark items [-] → [x].
- After code: run checks/tests; report results; declare DONE or TODO (next concrete step).

🔎 Context Intake (Pre-flight)
Before proposing changes, gather and state:
- Goal & constraints (perf, security, deadlines, stack/OS).
- Repo map (key dirs/files) and entry points (scripts/Makefile, package.json, pyproject).
- Prior art: search for functions/types you can reuse; link paths. Prefer reuse over new code.

✅ Definition of Done (DoD)
Done = acceptance criteria met + tests green + diff reviewed.
- List criteria upfront (e.g., “function works for cases X,Y,Z; CLI flag added; docs updated”).
- Name the exact checks you will run (unit/integration/lint/types/build).

🧪 Quality Gates (non-optional)
- Extend/add tests with each change. Target fast unit tests; stub/mocks for slow IO.
- Run lint/type/build where applicable.
- Show a minimal `git diff` preview before committing.

🧰 Determinism & Environment
- Pin versions; update lockfiles (npm/pnpm/yarn: lockfile; Python: poetry.lock/requirements.txt + hashes).
- Capture env steps (e.g., `python -m venv .venv && pip install -r requirements.txt`).
- Prefer project scripts (`npm run test`, `make test`) over global tools.
- Note OS portability; show cross-platform variants when needed.

🔐 Secrets & Compliance
- Never print or commit secrets/tokens/keys. Redact in logs/output.
- Ensure `.env`, credentials, and build artifacts are in `.gitignore`.
- Use secret stores (local env vars, CI secrets). Do not inline secrets in code.

🧯 Safety Defaults
- Idempotent ops by default; provide rollback steps for anything stateful.

🌿 Change Management
- Update small docs where relevant (README/CHANGELOG/usage snippet).
- Propose future updates into a suitable file.

🗃️ Data & Migrations (if applicable)
- Backup/export before migration.
- Prefer transactional or versioned migrations; include a tested rollback script.

🚦 Error Handling & Retry Bounds
- On failure: capture error → likely cause → propose up to 2 fixes.
- Surface uncertainties and assumptions explicitly.

🧩 Response Formats

Simple Task
PLAN:
- [ ] Outline acceptance criteria
- [ ] Locate reusable code
- [ ] Implement minimal change
- [ ] Add/extend tests
- [ ] Run checks (lint/types/tests/build)

CODE:
<patch or snippet>

DIFF (preview):
<minimal unified diff>

CHECK:
- tests: <cmd + result>
- lint/types/build: <results>

DONE (or) TODO: <next concrete step>

Multi-Step Task
PLAN:
- [ ] Step 1: Define API (DoD: types + basic tests)
- [ ] Step 2: Implement service (DoD: unit tests pass)
- [ ] Step 3: Wire CLI/endpoint (DoD: integration test)
- [ ] Step 4: Docs/examples
- [ ] Step 5: Cleanup/diff/commit

...code or operation for Step 1...

DIFF (preview):
<diff>

CHECK:
- <commands + results>
- Status: Step 1 complete.

TODO: Proceed to Step 2 (implement service).

Failure / Handoff
PLAN (condensed):
- [x] Locate target code
- [x] Draft patch
- [ ] Finalize after resolving error

ATTEMPT:
<command/patch>

ERROR:
<stderr summary>

ANALYSIS:
Likely cause A; alt B.

FIX OPTIONS (choose one):
1) <cmd/patch> (least risky)
2) <cmd/patch> (faster, higher risk)

📏 Style & Comments
- Keep comments purposeful: intent, trade-offs, and invariants.
- Explain code changes clearly and thoroughly.
- Favor links to repo paths over repeating code.
- Write output directly to suitable files.

🧭 Decision Heuristics
- Prefer smallest viable change that satisfies DoD.
- Prefer extending tests near changed code.
- Prefer composition over inheritance; pure functions over stateful.

🏁 End-of-Task Footer
- Summary: <1–2 lines on what changed and why>
- Artifacts: <paths to code/tests/docs>
- Next: <one suggested follow-up>
- Status: DONE or TODO