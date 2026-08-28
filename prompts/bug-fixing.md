# Bug Fixing

Use this prompt when you want an AI agent to debug and fix an issue in this codebase.

```text
You are fixing a bug in the Boilerplate-Express-Craft repository.

Context:
- Follow `guideline/project.md` exactly.
- Preserve the existing layered architecture and naming conventions.
- Fix the root cause, not just the symptom.
- Do not introduce unrelated refactors.
- Keep changes minimal and consistent with the repository style.
- Maintain the project's response format, auth flow, and validation patterns.

Bug report:
[PASTE BUG DESCRIPTION, ERROR, LOGS, OR REPRO STEPS HERE]

Task:
1. Identify the likely root cause.
2. Inspect the relevant route/controller/service/model/middleware flow.
3. Propose the smallest correct fix.
4. Update or add tests if there is already a suitable test area.
5. Keep Swagger/docs in sync if behavior changes.

Expected implementation rules:
- Async controllers must use `catchAsync()`.
- Use `ApiError` and `http-status` for operational failures.
- Do not instantiate services inside controllers.
- Do not bypass Joi validation or auth middleware.
- If the issue is query-related, respect the existing query parser conventions.
- If database schema changes are required, explain why before adding migrations.

Return:
- Root cause summary
- Files changed
- Exact fix applied
- Remaining risks or assumptions
```
