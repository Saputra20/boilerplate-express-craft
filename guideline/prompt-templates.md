# Prompt Templates for Boilerplate-Express-Craft

This file contains reusable prompts tailored to this repository's architecture in `guideline/project.md`.

## 1) Implement API from API Spec

Use this prompt when you already have an API spec and want implementation code that matches this project.

```text
You are implementing an API in the Boilerplate-Express-Craft repository.

Context:
- Follow `guideline/project.md` exactly.
- Architecture must remain: Routes → Controllers → Services → Models.
- Use CommonJS (`require` / `module.exports`), 2-space indentation, ESLint + Prettier rules.
- Controllers must use `catchAsync()` and return `new ApiResponse({...}).send(res)`.
- Services must be singleton exports and extend `BaseService` when appropriate.
- Validation must use Joi in `*.validation.js`.
- Protected admin routes must use `authCore({ menu, permission })`.
- Public authenticated routes must use `auth()`.
- Use `http-status` constants, never hardcoded status codes.
- Use `ApiError` for operational errors.
- Add Swagger/OpenAPI docs that match the project structure in `src/docs/`.

Task:
Implement the API described below.

API Spec:
[PASTE API SPEC HERE]

Expected output:
1. List files to create or update.
2. Implement route, controller, service, validation, and middleware if needed.
3. Add or update Sequelize model, migration, and seeder only if the spec requires data changes.
4. Add Swagger schema files and route docs.
5. Reuse existing constants/messages/helpers where possible.
6. Keep naming aligned with the repository convention:
   - folder names singular
   - endpoint names plural
   - files like `resource.route.js`, `resource.controller.js`, `resource.service.js`, `resource.validation.js`
7. If any requirement is ambiguous, state the assumption briefly and continue.

Deliver code that is minimal, consistent, and production-ready for this repository.
```

## 2) Create API Spec from Description or Figma

Use this prompt when you want a complete API spec before implementation.

```text
You are designing an API spec for the Boilerplate-Express-Craft repository.

Context:
- Follow `guideline/project.md` as the source of truth.
- The result must fit the current Express + Sequelize + Joi + Swagger architecture.
- Separate admin/core APIs from public APIs when relevant.
- Route versioning must use `/core/v1/...` or `/public/v1/...`.
- Response format must align with `ApiResponse` and project pagination patterns.
- Validation rules should be realistic for Joi usage in this project.
- Resource folders use singular names, endpoints use plural names.

Input source:
[PASTE PRODUCT DESCRIPTION OR FIGMA DETAILS HERE]

Task:
Create a complete API specification that is ready for implementation in this repository.

Expected output:
1. Resource summary.
2. Recommended domain placement:
   - `core/v1` or `public/v1`
3. Endpoint list with method and path.
4. Request schema for params, query, and body.
5. Response schema for success and failure.
6. Auth strategy:
   - `authCore({ menu, permission })` for admin/core
   - `auth()` for authenticated public routes
   - no auth if public access is intended
7. Database impact:
   - new tables/fields/relations if needed
8. Validation and business rules.
9. Suggested file structure under `src/application/...` and `src/docs/...`.
10. OpenAPI-ready YAML or Markdown spec.

Additional instructions:
- If the input is a Figma design, infer only API behavior that is clearly supported by the UI.
- Mark uncertain behaviors as assumptions.
- Prefer simple, RESTful endpoints that fit the existing project patterns.
```

## 3) Bug Fixing Prompt

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

## 4) Code Review Prompt

Use this prompt when you want a review focused on this repository's standards.

```text
You are reviewing code for the Boilerplate-Express-Craft repository.

Review context:
- Use `guideline/project.md` as the review standard.
- Evaluate correctness, architecture fit, maintainability, security, validation, and consistency.
- Be strict about repository patterns, not generic preferences.

Code to review:
[PASTE PR DIFF, FILES, OR FEATURE DESCRIPTION HERE]

Review checklist:
1. Does the code follow Routes → Controllers → Services → Models?
2. Are controllers wrapped with `catchAsync()` and using `ApiResponse`?
3. Are services singleton exports and business-logic focused?
4. Is Joi validation present and well-structured?
5. Are `authCore()` / `auth()` applied correctly?
6. Are `ApiError` and `http-status` used correctly?
7. Do naming, folder placement, and file suffixes match the repository rules?
8. Are Sequelize model, migration, and association patterns correct?
9. Are Swagger docs added or updated where required?
10. Are there security or permission concerns?
11. Are there opportunities to reuse existing helpers/constants/services?

Expected output:
- Summary verdict
- Must-fix issues
- Nice-to-have improvements
- Architecture consistency notes
- Security concerns
- Missing tests or docs

Important:
- Flag violations of project conventions clearly.
- Prefer actionable review comments with suggested fixes.
- Avoid requesting stylistic changes that conflict with the repository standard.
```

## 5) Recommended Inputs to Attach

For best results, attach these project-specific inputs alongside any prompt above:

- `guideline/project.md`
- target API spec from `api-specs/` if available
- relevant module files under `src/application/...`
- related Swagger files under `src/docs/...`
- affected model/migration files under `src/database/...`
- sample request/response payloads
- error logs or reproduction steps for bug fixing

## 6) Usage Notes

- Use the implementation prompt after the API spec is stable.
- Use the API spec prompt first if the feature starts from product text or Figma.
- For admin features, prefer `core/v1` and explicit guard permissions.
- For user-facing features, prefer `public/v1` unless back-office control is required.
- Keep prompts specific: mention resource name, auth type, database impact, and expected response shape.
