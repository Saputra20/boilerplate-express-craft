# Code Review

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
