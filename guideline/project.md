# AI Agent Guidelines for Boilerplate-Express-Craft

This document helps AI agents generate code that maintains consistency with the boilerplate's architecture, patterns, and conventions.

## Quick Reference: Common Tasks

| Task                        | Command                                                               |
| --------------------------- | --------------------------------------------------------------------- |
| Create model with migration | `yarn model:create --name User --attributes=name:string,email:string` |
| Create migration only       | `yarn migration:create --name create-table.js`                        |
| Create seeder               | `yarn seed:create --name initialize-data.js`                          |
| Run migrations              | `yarn migrate`                                                        |
| Run seeders                 | `yarn seed`                                                           |
| Dev server                  | `yarn dev`                                                            |
| Linting                     | `yarn lint:fix && yarn prettier:fix`                                  |

---

## Architecture Overview

### Layered Structure

```
Routes → Controllers → Services → Models
```

The codebase follows strict layered architecture:

- **Routes** (`src/routers/`): Define endpoints and apply middleware/validation
- **Controllers** (`src/application/*/v1/`): Handle requests, call services, format responses
- **Services** (`src/application/*/v1/`): Business logic, data operations, isolated from HTTP
- **Models** (`src/database/models/`): Sequelize model definitions

### Domain Organization

- **`/application/core/v1/`**: Admin-only endpoints with admin authentication
- **`/application/public/v1/`**: Public endpoints with public authentication
- **`/@core/`**: Shared utilities, base classes, interceptors
- **`/infrastructure/`**: Mail, queue, upload, token services
- **`/middleware/`**: Reusable middleware (auth, validation, error handling)
- **`/common/`**: Constants, helpers, validation schemas, components

### File Organization Example

```
src/application/core/v1/admin/
├── admin.route.js        # Endpoints definition
├── admin.controller.js    # Request handlers
├── admin.validation.js    # Joi schemas for validation
└── admin.service.js       # Business logic (extends BaseService)
```

---

## Naming Conventions

### Files & Folders

- **Files**: `kebab-case` with resource suffix

  - Controllers: `admin.controller.js`
  - Services: `admin.service.js`
  - Routes: `admin.route.js`
  - Validation: `admin.validation.js`
  - Middleware: `query-parser.middleware.js`

- **Folders**: singular resource name

  - `src/application/core/v1/admin/` (not `admins`)

- **Routes/Endpoints**: plural resource name
  - `GET /core/v1/admins`
  - `GET /core/v1/admins/:id`
  - `POST /core/v1/admins`

### Code Elements

- **Classes**: `PascalCase` → `AdminService`, `ApiError`, `BaseService`
- **Methods**: `camelCase` → `findByEmail()`, `checkPermission()`, `create()`
- **Variables**: `camelCase` → `adminId`, `userData`, `responseData`
- **Constants**: `UPPERCASE_SNAKE_CASE` → `STATUS.ACTIVE`, `messages.AUTH.LOGIN_SUCCESS`
- **Database columns**: `snake_case` → `created_at`, `updated_at`, `email_verified`

### Endpoints

- Use hyphens for multi-word endpoints: `/queue-monitor`, `/role-menu`
- Version in path: `/core/v1/admins`, `/public/v1/auth`
- Use `:id` or `:resourceId` for path parameters

---

## Core Patterns

### 1. Services (Singleton Pattern)

**Pattern**: Services are instantiated once and exported as singleton, NOT per-request.

```javascript
// src/application/core/v1/admin/admin.service.js
const { Admin } = require('../../../database/models');
const BaseService = require('../../../@core/service/BaseService');

class AdminService extends BaseService {
  constructor(model) {
    super(model);
    this.model = model;
  }

  async findByEmail(email) {
    return this.model.findOne({ where: { email } });
  }

  async findOneWithDetail(id) {
    return this.model.findOne({
      where: { id },
      include: [{ association: 'role' }],
    });
  }
}

module.exports = new AdminService(Admin);
```

**BaseService methods** (inherited): `findById()`, `findAll()`, `findOne()`, `create()`, `update()`, `destroy()`, `count()`, `restore()`, `findAndCountAll()`

### 2. Controllers (With catchAsync Wrapper)

**Pattern**: All async handlers wrapped with `catchAsync()` for automatic error handling.

```javascript
// src/application/core/v1/admin/admin.controller.js
const httpStatus = require('http-status');
const { catchAsync } = require('../../../@core/common');
const { ApiResponse, ApiError } = require('../../../@core/interceptor');
const adminService = require('./admin.service');

const create = catchAsync(async (req, res) => {
  const admin = await adminService.create(req.body);
  return new ApiResponse({
    message: 'Admin created successfully',
    data: admin,
    status: httpStatus.CREATED,
  }).send(res);
});

const getById = catchAsync(async (req, res) => {
  // req.admin is already set by middleware
  return new ApiResponse({
    message: 'Admin fetched successfully',
    data: req.admin,
    status: httpStatus.OK,
  }).send(res);
});

module.exports = { create, getById };
```

**Key points**:

- Don't use `try/catch` - use `catchAsync()` wrapper
- Always return `ApiResponse` with message, data, and status
- Use `httpStatus` constants instead of hardcoded numbers
- Access resolved resources from `req` object (set by middleware)

### 3. Routes (With Validation & Middleware)

```javascript
// src/application/core/v1/admin/admin.route.js
const express = require('express');
const { validate } = require('../../../middleware/validation.middleware');
const { authCore } = require('../../../middleware/auth.middleware');
const { getAdmin } = require('./admin.middleware');
const controller = require('./admin.controller');
const validation = require('./admin.validation');

const router = express.Router();

router.post(
  '/',
  authCore({ menu: 'admin', permission: 'create' }),
  validate(validation.create),
  controller.create,
);

router.get(
  '/:id',
  authCore({ menu: 'admin', permission: 'read' }),
  validate(validation.getById),
  getAdmin,
  controller.getById,
);

module.exports = router;
```

**Middleware order**:

1. Authentication (`authCore()` or `auth()`)
2. Authorization (guard-based via `authCore()` params)
3. Validation (`validate()`)
4. Resource resolution (e.g., `getAdmin`)
5. Controller handler

### 4. Validation (Joi Schemas)

```javascript
// src/application/core/v1/admin/admin.validation.js
const Joi = require('joi');
const { password } = require('../../../common/validation');

const create = {
  body: Joi.object().keys({
    name: Joi.string().trim().required(),
    email: Joi.string().email().trim().lowercase().required(),
    password: Joi.string().custom(password).required(),
    roleId: Joi.number().integer().required(),
  }),
};

const getById = {
  params: Joi.object().keys({
    id: Joi.string().uuid().required(),
  }),
};

const update = {
  params: Joi.object().keys({
    id: Joi.string().uuid().required(),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().trim(),
      email: Joi.string().email().trim().lowercase(),
      password: Joi.string().custom(password),
    })
    .min(1),
};

module.exports = { create, getById, update };
```

**Patterns**:

- Use `.trim()` and `.lowercase()` for strings
- Use `.custom(password)` for password validation
- Use `.uuid()` for UUID fields
- Use `.integer()` and `.number()` appropriately
- Use `Joi.object().keys({...}).min(1)` for partial updates
- Organize by body, params, query objects

### 5. Middleware (Resource Resolution)

```javascript
// src/application/core/v1/admin/admin.middleware.js
const httpStatus = require('http-status');
const { catchAsync } = require('../../../@core/common');
const { ApiError } = require('../../../@core/interceptor');
const adminService = require('./admin.service');

const getAdmin = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const admin = await adminService.findOneWithDetail(id);
  if (!admin) {
    return next(new ApiError(httpStatus.NOT_FOUND, 'Admin not found'));
  }
  req.admin = admin;
  next();
});

module.exports = { getAdmin };
```

**Pattern**: Middleware resolves resources and attaches to `req` object, or calls `next(error)` if not found.

### 6. Error Handling

**ApiError class**: Use for all operational errors.

```javascript
// Throw errors with this pattern:
new ApiError(statusCode, message, data, isOperational);

// Examples:
throw new ApiError(httpStatus.NOT_FOUND, 'Resource not found');
throw new ApiError(httpStatus.CONFLICT, 'Email already exists', { field: 'email' });
throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
```

**Response format** (handled automatically):

```json
{
  "success": false,
  "code": 400,
  "message": "Error message",
  "data": null,
  "stack": "only in development"
}
```

**Sequelize error conversion** happens automatically in middleware - no manual mapping needed.

### 7. Authentication & Authorization

**Dual Auth Systems**:

```javascript
// Admin routes - use authCore with guard-based permissions
router.post('/', authCore({ menu: 'admin', permission: 'create' }), ...);

// Public routes - use auth() without guards
router.get('/me', auth(), controller.getMe);
```

**How it works**:

1. `authCore()` extracts JWT, verifies with RSA public key
2. Checks token in database for blacklist
3. For routes with `menu` and `permission` props: calls `roleService.checkPermission(roleId, guard)`
4. Sets `req.user` (admin) or `req.user` (public user) based on issuer
5. Throws 401 or 403 if unauthorized

---

## Database Patterns

### Models

```javascript
// src/database/models/admin.js
'use strict';
const { Model } = require('sequelize');
const security = require('../../common/helpers/security');

module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Admin.belongsTo(models.Role, {
        foreignKey: 'roleId',
        targetKey: 'id',
        as: 'role',
      });
    }
  }

  Admin.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: {
        type: DataTypes.STRING,
        set(value) {
          if (value) {
            const hashedPassword = security.hash(value);
            this.setDataValue('password', hashedPassword);
          }
        },
      },
      roleId: DataTypes.INTEGER,
      status: DataTypes.STRING,
      image: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'Admin',
      tableName: 'admins',
      underscored: true,
    },
  );

  return Admin;
};
```

**Conventions**:

- Start with `'use strict';` directive
- Model class extends `Model` from sequelize
- Use `Admin.init()` pattern with attributes and options separated
- Table names: plural (`admins`, `users`)
- Column names: `snake_case` (`created_at`, `updated_at`) - handled by `underscored: true`
- Primary keys: UUID with `UUIDV4` default and `allowNull: false`
- Always include `underscored: true` for automatic snake_case conversion
- Use `targetKey: 'id'` in associations for explicit target reference
- Use `as` aliases for associations (e.g., `as: 'role'`)
- Implement custom getters/setters for password hashing using `security.hash()` helper in the setter
- Return the model class from the export function

### Migrations

```javascript
// src/database/migrations/20250506090327-create-admin.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('admins', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'roles',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      created_at: Sequelize.DATE,
      updated_at: Sequelize.DATE,
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('admins');
  },
};
```

**Conventions**:

- Use `snake_case` in migrations
- Explicit foreign key references with `onDelete: 'CASCADE'`
- Always add timestamps
- Use UUID for primary keys

---

## Response Format Standards

### Success Response

```javascript
new ApiResponse({
  message: 'Action completed successfully',
  data: result,
  status: httpStatus.OK
}).send(res);

// Output:
{
  "success": true,
  "message": "Action completed successfully",
  "data": {...}
}
```

### Paginated Response

```javascript
const items = await adminService.findAndCountAll({ ...queryOptions });
new ApiResponse({
  message: 'Admins fetched successfully',
  data: items,
  status: httpStatus.OK
}).send(res);

// Output:
{
  "success": true,
  "message": "Admins fetched successfully",
  "data": {
    "items": [...],
    "meta": {
      "currentPage": 1,
      "perPage": 10,
      "totalItems": 100,
      "totalPages": 10
    }
  }
}
```

### Error Response

Errors are automatically formatted by error middleware:

```json
{
  "success": false,
  "code": 400,
  "message": "Validation failed",
  "data": null,
  "stack": "Error stack (dev only)"
}
```

---

## Constants Usage

### Access Pattern

```javascript
const { status, messages, jwt } = require('../constants');

// Use with nested notation:
status.ACTIVE;
messages.AUTH.LOGIN_SUCCESS;
jwt.JWT_ALGORITHM;
```

### Creating New Constants

Store in `/common/constants/` with clear organization:

```javascript
// src/common/constants/my.constant.js
module.exports = {
  TYPE: {
    STANDARD: 'standard',
    PREMIUM: 'premium',
  },
  STATUS: {
    PENDING: 'pending',
    APPROVED: 'approved',
  },
};
```

Export from `index.js`:

```javascript
// src/common/constants/index.js
module.exports = {
  status: require('./status.constant'),
  messages: require('./messages.constant'),
  myConstant: require('./my.constant'),
};
```

---

## Query Parser Middleware

The custom query parser converts URL parameters into Sequelize-compatible objects.

### Examples

```
GET /core/v1/admins?page=1&limit=10&email:like=test&status=active&sortBy:updatedAt.DESC
```

Converts to:

```javascript
{
  where: {
    email: { [Op.like]: '%test%' },
    status: 'active'
  },
  limit: 10,
  offset: 0,
  order: [['updatedAt', 'DESC']]
}
```

### Supported Operators

| Operator      | Syntax         | Example                                       |
| ------------- | -------------- | --------------------------------------------- |
| Like          | `:like`        | `email:like=test`                             |
| Greater than  | `:gt`          | `age:gt=18`                                   |
| Greater/equal | `:gte`         | `age:gte=18`                                  |
| Less than     | `:lt`          | `age:lt=100`                                  |
| Between       | `:between`     | `age:between=18,65`                           |
| In            | `:in`          | `status:in=active,pending`                    |
| Regexp        | `:regexp`      | `email:regexp=^test`                          |
| Date range    | `:betweenDate` | `createdAt:betweenDate=2024-01-01,2024-12-31` |

---

## Important Gotchas & Best Practices

### 1. Don't Create Service Per-Request

❌ Wrong: `const service = new AdminService(Admin);` in controller
✅ Right: Import singleton service `const adminService = require('./admin.service');`

### 2. Don't Use try/catch in Controllers

❌ Wrong: Wrap with `try/catch` manually
✅ Right: Use `catchAsync()` wrapper on handler function

### 3. Don't Hardcode HTTP Status Codes

❌ Wrong: `res.status(404).json(...)`
✅ Right: Use `httpStatus.NOT_FOUND` constant

### 4. Don't Skip Validation

❌ Wrong: Access `req.body` directly
✅ Right: Run through Joi validation middleware

### 5. Don't Return Multiple Values from Services

❌ Wrong: Return `{ data, count, page }`
✅ Right: Return paginated object with `items` and `meta`

### 6. Always Trim & Lowercase String Inputs

```javascript
email: Joi.string().email().trim().lowercase().required();
name: Joi.string().trim().required();
```

### 7. Use Proper Sequelize Operators

```javascript
// Correct import
const { Op } = require('sequelize');

// Correct usage
where: {
  age: { [Op.gte]: 18 }
}
```

### 8. Handle Not Found Errors in Middleware

```javascript
if (!resource) {
  return next(new ApiError(httpStatus.NOT_FOUND, 'Resource not found'));
}
```

### 9. Always Add Guard Checks for Protected Routes

```javascript
authCore({ menu: 'admin', permission: 'create' });
auth(); // for public routes (no guard needed)
```

### 10. Seed & Migration Filenames

- Migrations: Timestamp prefix → `20250506090327-create-admin.js`
- Seeds: Timestamp prefix → `20230724092321-initialize-modules.js`

---

## File Structure Checklist for New Resources

When creating a new resource (e.g., `user`), ensure these files exist:

```
src/application/core/v1/user/
├── user.route.js              # Routes definition
├── user.controller.js          # Request handlers
├── user.service.js             # Business logic
├── user.validation.js          # Joi schemas
├── user.middleware.js          # Resource resolution (optional)
└── index.js                    # Export routes

src/database/models/
└── user.js                     # Sequelize model

src/database/migrations/
└── YYYYMMDDHHMMSS-create-user.js  # Migration

src/database/seeds/
└── YYYYMMDDHHMMSS-initialize-users.js  # Seeder (optional)
```

---

## Code Style Requirements

- **Linter**: ESLint (Airbnb base) + Prettier
- **Format**: `yarn lint:fix && yarn prettier:fix`
- **Indentation**: 2 spaces
- **Module system**: CommonJS (require/module.exports)
- **Async pattern**: async/await with `catchAsync()` wrapper
- **Variable declaration**: `const` by default, `let` if needed
- **Comments**: JSDoc for public methods, inline comments for complex logic

---

## Swagger/OpenAPI Documentation Flow

API documentation is generated automatically from JSDoc comments in route files using `swagger-jsdoc`. Every route must include Swagger documentation.

### File Organization

```
src/docs/
├── core/v1/
│   ├── spec.swagger.js                    # Core API spec definition
│   ├── components/schemas/
│   │   ├── admin/
│   │   │   ├── request.schema.js         # Request body schemas
│   │   │   ├── response.schema.js        # Response schemas
│   │   │   └── utils.js                  # Sample data
│   │   └── index.js                      # Export all schemas
│   └── docs.route.js                     # Swagger UI endpoint
├── public/v1/
│   ├── spec.swagger.js                    # Public API spec definition
│   └── components/schemas/
└── docs.router.js                         # Main docs router

src/common/
├── docs/index.js                          # Swagger helper functions
├── components/
│   ├── schemas/index.js                  # Common response schemas
│   └── parameters/index.js                # Common parameters
└── helpers/swagger.js                     # joiToSwagger converter
```

### 1. Create Schema Files (Request & Response)

**Request Schema**: Convert Joi validation to Swagger schema

```javascript
// src/docs/core/v1/components/schemas/admin/request.schema.js
const swagger = require('../../../../../../common/helpers/swagger');
const adminValidation = require('../../../../../../application/core/v1/admin/admin.validation');

const createOrUpdateAdminRequest = swagger.joiToSwagger(
  adminValidation.createOrUpdate.body
);

module.exports = {
  createOrUpdateAdminRequest,
};
```

**Response Schema**: Define response objects with sample data

```javascript
// src/docs/core/v1/components/schemas/admin/response.schema.js
const httpStatus = require('http-status');
const { objectResponseSwagger } = require('../../../../../../common/helpers/swagger');
const { listPagination } = require('../../../../../../common/components/data');
const CONST = require('../../../../../../common/constants');
const { adminCreated } = require('./utils');

const { messages } = CONST;

const adminCreatedResponse = objectResponseSwagger(
  true,
  httpStatus.CREATED,
  messages.COMMON.CREATED,
  adminCreated
);

const adminsResponse = objectResponseSwagger(
  true,
  httpStatus.OK,
  messages.COMMON.OK,
  listPagination(adminCreated)
);

const adminResponse = objectResponseSwagger(
  true,
  httpStatus.OK,
  messages.COMMON.OK,
  adminCreated
);

module.exports = {
  adminCreatedResponse,
  adminsResponse,
  adminResponse,
};
```

**Utils**: Provide sample data for response examples

```javascript
// src/docs/core/v1/components/schemas/admin/utils.js
const adminCreated = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  name: 'John Doe',
  email: 'john@example.com',
  roleId: 1,
  status: 'active',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

module.exports = { adminCreated };
```

### 2. Add JSDoc Swagger Comments to Routes

Place Swagger comments **before** each route definition:

```javascript
// src/application/core/v1/admin/admin.route.js
const express = require('express');
const adminController = require('./admin.controller');
const { authCore } = require('../../../../middleware/auth.middleware');
const { validate } = require('../../../../middleware/validation.middleware');
const adminValidation = require('./admin.validation');
const { getAdmin } = require('./admin.middleware');

const menuName = 'admin';

/**
 * @swagger
 * tags:
 *   - name: Admin
 *     description: Admin management endpoints
 */
const router = express.Router();

/**
 * @swagger
 * /core/v1/admins:
 *   post:
 *     summary: Create Admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     description: Create a new admin user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/createOrUpdateAdminRequest'
 *     responses:
 *       '201':
 *         description: Admin created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/adminCreatedResponse'
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/unauthorizedResponse'
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/forbiddenResponse'
 *       '422':
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/badRequestFormResponse'
 */
router.post(
  '/',
  authCore({ menu: menuName, permission: 'create' }),
  validate(adminValidation.createOrUpdate),
  adminController.create,
);

/**
 * @swagger
 * /core/v1/admins:
 *   get:
 *     summary: List Admins
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve paginated list of admins
 *     parameters:
 *       - $ref: '#/components/parameters/page'
 *       - $ref: '#/components/parameters/limit'
 *       - $ref: '#/components/parameters/search'
 *       - $ref: '#/components/parameters/sortBy'
 *     responses:
 *       '200':
 *         description: List of admins
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/adminsResponse'
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/unauthorizedResponse'
 *       '403':
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/forbiddenResponse'
 */
router.get(
  '/',
  authCore({ menu: menuName, permission: 'read' }),
  adminController.list,
);

/**
 * @swagger
 * /core/v1/admins/{id}:
 *   get:
 *     summary: Get Admin by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/paramsIdString'
 *     responses:
 *       '200':
 *         description: Admin details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/adminResponse'
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: Admin not found
 */
router.get(
  '/:id',
  authCore({ menu: menuName, permission: 'read' }),
  validate(adminValidation.getById),
  getAdmin,
  adminController.getById,
);

module.exports = router;
```

### 3. Common Swagger Patterns

**Error Responses** (standard across all endpoints):

```javascript
// Always include these error responses
'401':
  description: Unauthorized
  content:
    application/json:
      schema:
        $ref: '#/components/schemas/unauthorizedResponse'
'403':
  description: Forbidden
  content:
    application/json:
      schema:
        $ref: '#/components/schemas/forbiddenResponse'
'404':
  description: Not Found
  content:
    application/json:
      schema:
        $ref: '#/components/schemas/notFoundResponse'
'422':
  description: Validation Error
  content:
    application/json:
      schema:
        $ref: '#/components/schemas/badRequestFormResponse'
```

**Common Parameters**:

```javascript
// Reference pre-defined common parameters
parameters:
  - $ref: '#/components/parameters/page'           // GET ?page=1
  - $ref: '#/components/parameters/limit'          // GET ?limit=10
  - $ref: '#/components/parameters/search'         // GET ?search=query
  - $ref: '#/components/parameters/sortBy'         // GET ?sortBy=field.ASC
  - $ref: '#/components/parameters/paramsIdString' // GET /:id
  - $ref: '#/components/parameters/paramsIdInt'    // GET /:id (integer)
```

### 4. Swagger Helper Functions

**Convert Joi Schema to Swagger**:

```javascript
// src/common/helpers/swagger.js
const j2s = require('joi-to-swagger');

const joiToSwagger = (schema) => {
  const result = j2s(schema).swagger;
  delete result.additionalProperties;
  return result;
};

module.exports = { joiToSwagger };
```

**Response Wrapper**:

```javascript
const objectResponseSwagger = (success, code, message, data) => {
  return {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: success,
      },
      code: {
        type: 'integer',
        example: code,
      },
      message: {
        type: 'string',
        example: message,
      },
      data: {
        type: 'object',
        example: data,
      },
    },
  };
};
```

### 5. Access Swagger UI

- **Core API**: `GET /core/v1/docs/` → Swagger UI for admin endpoints
- **Public API**: `GET /public/v1/docs/` → Swagger UI for public endpoints
- **JSON Spec**: `GET /core/v1/docs/swagger.json` → Raw OpenAPI spec

### Swagger Conventions & Best Practices

✅ **DO**:
- Every route must have a `@swagger` JSDoc comment
- Use existing schema references (`$ref: '#/components/schemas/...'`)
- Reference common parameters for pagination and sorting
- Include all error response codes (401, 403, 404, 422)
- Use `security: - bearerAuth: []` for protected routes
- Tag endpoints with resource name (e.g., `tags: [Admin]`)
- Provide meaningful summaries and descriptions

❌ **DON'T**:
- Hardcode schema definitions inline - create reusable schemas
- Skip error responses
- Use different parameter names across endpoints
- Leave responses undocumented
- Include internal implementation details in descriptions

### Schema References

Common pre-defined response schemas:
- `unauthorizedResponse` - 401 error
- `forbiddenResponse` - 403 error
- `notFoundResponse` - 404 error
- `badRequestFormResponse` - 422 validation error

---

## Links to Key Files

- [BaseService](src/@core/service/BaseService.js) - Base class for all services
- [ApiError & ApiResponse](src/@core/interceptor/) - Error and response interceptors
- [Constants](src/common/constants/) - Application constants
- [Validation Middleware](src/middleware/validation.middleware.js) - Validation HOF
- [Auth Middleware](src/middleware/auth.middleware.js) - Authentication strategies
- [Query Parser](src/middleware/query-parser.middleware.js) - Custom query DSL
- [Error Middleware](src/middleware/error.middleware.js) - Error handler
- [Admin Example](src/application/core/v1/admin/) - Complete resource example
- [Swagger Helpers](src/common/helpers/swagger.js) - Swagger conversion functions
- [Core Swagger Spec](src/docs/core/v1/spec.swagger.js) - OpenAPI spec generator
- [Swagger Components](src/docs/core/v1/components/schemas/) - Reusable schemas

---

## Questions for AI Agents

Before generating code, verify:

1. ✅ Is this a **service**, **controller**, **route**, or **middleware**?
2. ✅ Should this be **guard-protected** (authCore) or **public** (auth)?
3. ✅ What **Sequelize operators** are needed? (import `Op`)
4. ✅ What **HTTP status code** should this return? (use `httpStatus` const)
5. ✅ What **validation rules** apply? (create Joi schema)
6. ✅ Should this resource be **paginated**? (use `findAndCountAll()`)
7. ✅ Are there **custom queries** beyond BaseService? (add to service)
8. ✅ What **error cases** need handling? (throw `ApiError`)
