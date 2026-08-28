# Bun Native Library Replacement Plan

Date: 2026-08-28

## Goal

Reduce dependency count without changing API behavior, database behavior, security guarantees, or mail/queue integrations. Bun remains runtime at `1.4.0`; Express remains `5.2.1`.

## Implementation Status

Implemented on 2026-08-28:

- Removed `dotenv`; Bun now provides `.env` loading before application code.
- Replaced `dayjs` with `src/common/helpers/date.js` and native `Date` arithmetic.
- Replaced `bcryptjs` with bcrypt-compatible `Bun.password.hashSync` and `Bun.password.verifySync`.
- Replaced Jest command with `bun test` and added compatibility coverage in `test/runtime-builtins.test.js`.
- Removed unused packages: `@dctrl/crudify`, `cross-env`, `html-entities`, `multer`, `multer-s3`, `swagger-themes`, `twilio`, `uuid`, `faker`, `@types/faker`, `jest`, `@types/jest`, `eslint-plugin-jest`, and `supertest`.

Not implemented: `aws-sdk`, `basic-auth`, `crypto-js`, `ioredis`, `jsonwebtoken`, `morgan`, `sequelize`, `winston`, and `xss-clean` replacements.

## Audit Summary

| Package | Current use | Built-in replacement | Decision |
| --- | --- | --- | --- |
| `express` | HTTP app, routers, middleware | None | Keep |
| `@bull-board/api`, `@bull-board/express` | Queue dashboard | None | Keep |
| `@dctrl/crudify` | No source import found | None | Removed |
| `aws-sdk` | DigitalOcean Spaces S3 client | Bun S3 API or `fetch` | Replace later; verify ACL and response compatibility |
| `basic-auth` | Bull dashboard auth | `Buffer` plus explicit header parser | Keep until security-tested replacement exists |
| `bcryptjs` | Password and token-session hashes | `Bun.password` | Replaced with bcrypt-compatible sync API |
| `bull` | Redis-backed email queue | None equivalent | Keep |
| `compression` | Express response compression | None while using Express on Node-compatible HTTP | Keep |
| `cors` | CORS middleware | None | Keep |
| `cross-env` | No script use found | Bun handles environment variables | Removed |
| `crypto-js` | AES encrypt/decrypt | `node:crypto` | Replace later; define ciphertext compatibility plan first |
| `dayjs` | Date range boundaries and OTP timestamp | `Date` and `Intl` | Replaced |
| `dotenv` | `.env` loading in `src/config/config.js` | Bun auto-loads `.env` | Removed |
| `ejs` | Mail HTML templates | None | Keep |
| `express-rate-limit` | Auth and mail throttling | None | Keep |
| `helmet` | Security headers | None | Keep |
| `html-entities` | No source import found | None | Removed |
| `html-to-text` | HTML mail text alternative | None | Keep |
| `http-status` | Named HTTP status constants | `node:http` has no equivalent named status API | Keep for now; local constants are separate refactor |
| `ioredis` | Redis connection for token blacklist | Bun Redis API, if command parity is confirmed | Evaluate after queue path |
| `joi` | Request and environment validation | None equivalent | Keep |
| `joi-to-swagger` | Joi schema conversion | None | Keep |
| `jsonwebtoken` | RS256 signing and verification | `node:crypto` primitives, not complete JWT API | Keep |
| `juice` | Inline CSS in mail HTML | None | Keep |
| `morgan` | HTTP access logging | Custom middleware using `console`/`process.hrtime` | Keep; logging format is production contract |
| `multer` | No source import found | `Request.formData()` only outside current Express flow | Removed |
| `multer-s3` | No source import found | Bun S3 API or `fetch` | Removed |
| `nodemailer` | SMTP mail delivery | None | Keep |
| `pg` | Sequelize PostgreSQL dialect driver | None while Sequelize remains | Keep |
| `sequelize` | ORM and model layer | Bun SQL would require ORM rewrite | Keep |
| `sequelize-cli` | Migrations and seeds | None | Keep |
| `swagger-jsdoc` | OpenAPI generation | None | Keep |
| `swagger-themes` | No source import found | None | Removed |
| `swagger-ui-express` | Swagger UI routes | None | Keep |
| `twilio` | No source import found | `fetch` only if Twilio integration is added | Removed |
| `uuid` | No runtime import; DB uses UUID generation | `crypto.randomUUID()` for app-generated IDs | Removed |
| `winston` | Console logger with levels and formatting | `console` | Keep until structured logging requirements are defined |
| `xss-clean` | Global request sanitization | No direct built-in | Replace with schema validation and output escaping; security review required |

## Development Dependencies

| Package | Finding | Decision |
| --- | --- | --- |
| `eslint`, configs, plugins | Used by lint tooling | Keep |
| `prettier` | Used by formatting scripts | Keep |
| `husky` | Used by `prepare` | Keep if Git hooks remain required |
| `faker`, `@types/faker` | No source or test use found | Removed |
| `jest`, `@types/jest`, `eslint-plugin-jest`, `supertest` | No `test/` directory or test files found | Replaced with `bun test`; removed |

## Completed Native Changes

`dotenv` is redundant under Bun. `src/config/config.js` no longer imports or invokes it; Bun loads `.env` before app code.

```js
const Joi = require('joi');
```

`dayjs` now uses native helpers:

- `dayjs(start).startOf('day')`: construct local midnight with `Date`.
- `dayjs(end).endOf('day')`: construct next local midnight minus one millisecond.
- `dayjs().add(5, 'minutes').unix()`: `Math.floor((Date.now() + 300000) / 1000)`.

`bcryptjs` now uses Bun synchronous APIs because Sequelize's password setter is synchronous:

1. `Bun.password.hashSync` explicitly uses bcrypt and cost `10`.
2. `Bun.password.verifySync` accepts existing bcrypt hashes.
3. `test/runtime-builtins.test.js` verifies a pre-migration bcrypt hash and a new Bun hash.

Do not replace `jsonwebtoken`, `crypto-js`, `xss-clean`, or `basic-auth` in same change. Each has security or compatibility risk.

## Removal Batch

After source and deployment consumers are confirmed absent, remove:

```text
All listed packages have been removed.
```

Keep `pg` despite no direct source import; Sequelize loads it as PostgreSQL dialect driver.

## Validation Gates

Run after each batch:

```bash
bun install --frozen-lockfile
bun x --no-install eslint .
bun x --no-install prettier --check '**/*.js'
bun -e "require('./src/app'); console.log('app-load-ok')"
```

With PostgreSQL, Redis, SMTP, and environment variables available, also run migrations and endpoint smoke tests. Do not deploy a security-sensitive replacement without compatibility tests against existing data.

## Deferred Options

- `aws-sdk` → Bun S3 API: test DigitalOcean Spaces endpoint, public ACL, returned `ETag`, `Location`, `Key`, and `Bucket` fields.
- `ioredis` → Bun Redis: test token blacklist commands and Bull isolation; do not replace Bull's Redis dependency as side effect.
- `winston`/`morgan` → native console middleware: preserve log levels, timestamps, request IDs, stderr routing, and production ingestion format.
- `sequelize` → Bun SQL: not library substitution; it is a database-layer rewrite and out of scope.
