# Implement API from API Spec

Use this prompt when you already have an API spec and want implementation code that matches this project. This prompt assumes the input spec follows the style in `api-specs/expected.md`.

```text
You are implementing an API in the Boilerplate-Express-Craft repository.

Primary references:
- Follow `guideline/project.md` exactly.
- Treat `api-specs/expected.md` as the expected API spec format and level of detail.

Architecture and coding rules:
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
- Reuse existing constants, helpers, middleware, and patterns wherever possible.

Input spec assumptions:
- The API spec may include sections such as:
  - Overview
  - API Endpoint
  - Purpose
  - Request Headers
  - Header Details
  - Request Payload
  - Payload Details
  - Request Query Parameters
  - Query Details
  - Business Behavior
  - Data Impact
  - Response (Success)
  - Response (Error - ...)
  - Status Codes
  - Error Codes Reference
- Treat those sections as implementation requirements, not just documentation.
- If the spec includes business behavior or data impact, implement those flows consistently across route, controller, service, model, migration, and supporting infrastructure.

Task:
Implement the API described below.

API Spec:
[PASTE API SPEC HERE]

Required implementation behavior:
1. Read the spec carefully and extract:
   - endpoint path and HTTP method
   - auth requirements
   - payload and query validation rules
   - success and error response behavior
   - business behavior and side effects
   - database impact
2. Map the spec into this repository's architecture.
3. Use repository conventions for naming and placement:
   - folder names singular
   - endpoint names plural where appropriate
   - files like `resource.route.js`, `resource.controller.js`, `resource.service.js`, `resource.validation.js`, `resource.middleware.js`
4. Implement only the files required by the spec.
5. If the spec implies side effects, implement them in the correct layer, for example:
   - token invalidation
   - soft delete
   - relation cleanup
   - email sending
   - queue dispatch
   - audit logging
6. If the spec requires persistence changes, add or update:
   - Sequelize model
   - migration
   - seeder only if needed
7. If the spec requires resource lookup before controller execution, add resource middleware that resolves data into `req` and throws `ApiError` when not found.
8. Add or update Swagger schema files and route docs so the implementation and docs stay aligned.

Expected output:
1. List files to create or update.
2. Briefly summarize assumptions from the spec.
3. Implement route, controller, service, validation, and middleware if needed.
4. Add or update Sequelize model, migration, and seeder only if the spec requires data changes.
5. Add Swagger schema files and route docs.
6. Reuse existing constants/messages/helpers where possible.
7. Keep the implementation minimal, consistent, and production-ready for this repository.

Important constraints:
- Do not invent behavior that is not supported by the spec.
- If the spec is ambiguous, state the assumption briefly and choose the safest repository-consistent implementation.
- Do not bypass validation, auth, or error handling conventions.
- Keep responses aligned with the repository response system, while preserving the intent of the provided API spec.
- Prefer root-cause integration over superficial code generation.

Deliver code that is clean, minimal, and fully aligned with this repository.
```
