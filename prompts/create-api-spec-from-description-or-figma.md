# Create API Spec from Description or Figma

Use this prompt when you want a complete API spec before implementation, and the output must match the style in `api-specs/expected.md`.

```text
You are designing an API specification for the Boilerplate-Express-Craft repository.

Primary references:
- Follow `guideline/project.md` as the project architecture guide.
- Match the output structure, tone, and level of detail from `api-specs/expected.md`.

Repository context:
- The result must fit the current Express + Sequelize + Joi + Swagger architecture.
- Separate admin/core APIs from public APIs when relevant.
- Use versioned routes consistent with the repository.
- Prefer repository-aligned paths such as `/core/v1/...` or `/public/v1/...` unless the provided product context explicitly requires a different path style.
- Validation rules should be realistic for later Joi implementation.
- The spec should be implementation-ready for route, controller, service, validation, Swagger docs, and possible model/migration work.

Input source:
[PASTE PRODUCT DESCRIPTION OR FIGMA DETAILS HERE]

Task:
Create a complete API specification in Markdown.

Output requirements:
- The final output must closely follow the format used in `api-specs/expected.md`.
- Write the spec as a business-readable API document, not as source code.
- Use clear section headings and tables.
- If more than one endpoint is needed, create a separate full section for each endpoint.
- If the input is from Figma, only define behavior that is clearly supported by the UI and mark uncertain parts as assumptions.

Required structure for each API:
1. `# {Feature Name} - API Specifications`
2. `## Overview`
   - Explain the feature goal in 1-3 short paragraphs.
   - Mention important business behavior and scope.
3. `## API Endpoint`
4. `### {Action Name}`
5. `**Purpose**`
6. `#### Endpoint`
   - Show the full endpoint path in a code block.
7. `#### Method`
   - Use one HTTP method only unless there is a strong reason otherwise.
8. `#### Request Headers`
   - Include `Authorization` when auth is required.
   - Include `Content-Type: application/json` for JSON payloads.
9. `#### Header Details`
   - Add a header details table when headers need explanation.
10. `#### Request Payload`
   - Provide JSON example.
11. `#### Payload Details`
   - Add a field-by-field table with columns like: `Field`, `Type`, `Required`, `Description`.
12. `#### Request Query Parameters`
   - Include only if needed.
13. `#### Query Details`
   - Add a table when query parameters exist.
14. `#### Business Behavior`
   - Describe the step-by-step system behavior when the request succeeds.
15. `#### Data Impact`
   - Add a table for affected tables/entities and what changes.
16. `#### Response (Success)`
   - Provide JSON example.
17. `#### Response (Error - ... )`
   - Add separate error examples for realistic failure cases.
18. `#### Status Codes`
   - List HTTP codes with meaning.
19. `## Error Codes Reference`
   - Add a table with `Error Code`, `Meaning`, and `What To Do`.

Content rules:
- Be concrete and implementation-oriented.
- Include realistic error cases such as:
  - invalid input
  - unauthorized or invalid token
  - forbidden or invalid permission
  - resource not found
  - business rule conflict
- Include business behavior and data impact whenever the feature changes data.
- If soft delete, relation removal, audit logging, queue dispatch, email sending, token invalidation, or other side effects are implied, describe them explicitly.
- If authentication is needed, state whether it is expected to map later to:
  - `authCore({ menu, permission })` for admin/core routes
  - `auth()` for authenticated public routes
- Use field names and response shapes that can be implemented cleanly in this repository.
- Keep the endpoint RESTful and minimal.

Formatting rules:
- Use Markdown headings exactly and consistently.
- Use code blocks for endpoint, headers, payloads, and responses.
- Use tables for field details, header details, data impact, and error codes.
- Keep language professional and concise.

Final instruction:
Generate the final spec in the same style and structure as `api-specs/expected.md`, adapted to the provided feature description or Figma screen.
```
