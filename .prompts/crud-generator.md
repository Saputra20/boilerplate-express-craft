# CRUD Generator Prompt

Generates complete, production-ready CRUD resource implementation following boilerplate-express-craft conventions and architecture patterns from `guideline/project.md`.

---

## Agent Requirements (Must Read First)

**This prompt is designed to be executed by an AI agent.** Before beginning generation:

1. **Understand the architecture**: Read `guideline/project.md` to understand layered architecture (Routes → Controllers → Services → Models)
2. **Know the patterns**: All code must follow singleton services, catchAsync controllers, Joi validation, and ApiResponse responses
3. **Follow exact order**: Generate files in the sequence specified in "Agent Instructions" section
4. **Validate inputs**: Use "Input Validation" table to check arguments before starting
5. **Verify outputs**: Use "Output Verification Checklist" to confirm all files are correct after generation
6. **Handle mistakes**: Use "Common Mistakes & Recovery" to self-correct if issues detected

**Total files to generate: 13+**
**Execution order: Database → Service → Request → Routing → Documentation → Integration**
**Estimated completion: 5-15 files depending on complexity**

---

## Code Quality Standards (Senior-Level)

**All generated code must follow these principles:**

### SOLID Principles

| Principle                 | Implementation                               | Example                                                         |
| ------------------------- | -------------------------------------------- | --------------------------------------------------------------- |
| **Single Responsibility** | Each class/function has ONE reason to change | Service: only business logic. Controller: only request handling |
| **Open/Closed**           | Open for extension, closed for modification  | BaseService is extended, not modified per resource              |
| **Liskov Substitution**   | Subclasses can replace base classes          | ResourceService extends BaseService seamlessly                  |
| **Interface Segregation** | Clients depend on specific interfaces        | Joi validation schemas are precise, not bloated                 |
| **Dependency Injection**  | Pass dependencies, don't create them         | Model passed to service constructor                             |

### Clean Code Principles

- **Naming**: Meaningful names for variables, functions, classes

  - ✅ `getUserById()`, `validateEmailUniqueness()`, `ProductService`
  - ❌ `get()`, `validate()`, `Service1`

- **Functions/Methods**: Small, focused, single purpose

  - ✅ Custom method `findByEmail()` for specific queries
  - ❌ Generic `findOne()` with complex logic

- **Error Handling**: Explicit, informative, recoverable

  - ✅ `throw new ApiError(409, 'Email already exists', { field: 'email' })`
  - ❌ `throw new Error('failed')`

- **Comments**: Explain WHY, not WHAT

  - ✅ `// Cache popular products for 1 hour to reduce DB load`
  - ❌ `// Get products from database`

- **DRY (Don't Repeat Yourself)**: Reuse, don't duplicate
  - ✅ Extract validation into `productService.validateUnique()`
  - ❌ Duplicate unique checks in create and update handlers

### Code Structure

```
Service Layer (Business Logic)
  ↓
Controller Layer (Request/Response)
  ↓
Middleware Layer (Pre/Post Processing)
  ↓
Routes Layer (Endpoint Definition)
```

Each layer has clear responsibilities, minimal coupling, maximum cohesion.

---

## Maintainability Guidelines

### 1. Service Layer Best Practices

```javascript
class ProductService extends BaseService {
  /**
   * Find product by name (custom query)
   * @param {string} name - Product name to search
   * @returns {Promise<Product|null>} Product object or null if not found
   * @throws {ApiError} If database error occurs
   */
  async findByName(name) {
    try {
      return super.findOne({
        where: { name: { [Op.iLike]: name } },
      });
    } catch (error) {
      throw new ApiError(500, 'Database error', { originalError: error.message });
    }
  }

  /**
   * Check if product name is unique (for validation)
   * @param {string} name - Name to check
   * @param {string} excludeId - ID to exclude from check (for updates)
   * @returns {Promise<boolean>} True if name is available
   */
  async isNameUnique(name, excludeId = null) {
    const where = { name };
    if (excludeId) where.id = { [Op.ne]: excludeId };
    return !(await super.findOne({ where }));
  }
}
```

**Requirements**:

- JSDoc comments on all methods
- Clear parameter types and return types
- Error handling with proper ApiError
- Meaningful method names
- No business logic in controllers

### 2. Controller Best Practices

```javascript
const create = catchAsync(async (req, res) => {
  const { body } = req;

  // Validate business logic before creating
  const exists = !(await productService.isNameUnique(body.name));
  if (exists) {
    throw new ApiError(httpStatus.CONFLICT, 'Product name already exists', { field: 'name' });
  }

  // Create and log
  const result = await productService.create(body);
  logger.info(`Product created: ${result.id} by user: ${req.user.id}`);

  return new ApiResponse({
    messages: messages.COMMON.CREATED,
    data: result,
    status: httpStatus.CREATED,
  }).send(res);
});
```

**Requirements**:

- All handlers wrapped with `catchAsync()`
- Business logic validation before operations
- Logging for audit trail
- Clear error messages
- Proper HTTP status codes
- No database queries directly in controller

### 3. Validation Best Practices

```javascript
const createOrUpdate = {
  body: Joi.object().keys({
    name: Joi.string().required().trim().min(2).max(100).example('Premium Widget'),

    status: Joi.boolean().default(true).description('Product availability status'),

    sku: Joi.string()
      .required()
      .trim()
      .uppercase()
      .pattern(/^[A-Z0-9-]{5,20}$/)
      .example('PROD-12345')
      .messages({
        'string.pattern.base': 'SKU must be 5-20 alphanumeric characters',
      }),
  }),
};
```

**Requirements**:

- Set min/max lengths for strings
- Use patterns for structured data
- Add `.example()` for documentation
- Custom error messages with `.messages()`
- Clear validation rules

---

## Scalability Patterns

### 1. Database Optimization

```javascript
// Model: Add indexes for frequently queried fields
class Product extends Model {
  static associate(models) {
    // Associations for eager loading
  }
}

Product.init(
  {
    id: { type: DataTypes.UUID, primaryKey: true },
    name: {
      type: DataTypes.STRING,
      index: true, // ✅ Index on frequently searched field
      allowNull: false,
      unique: true, // ✅ Unique constraint
    },
    sku: {
      type: DataTypes.STRING,
      index: true, // ✅ Index for faster lookups
      unique: true,
    },
  },
  { sequelize, underscored: true, timestamps: true },
);
```

**Indexing Strategy**:

- Index frequently queried fields (WHERE, ORDER BY, JOIN)
- Index unique constraint fields
- Index foreign keys
- Avoid over-indexing (impacts write performance)

### 2. Query Optimization

```javascript
// Service: Use include for eager loading, avoid N+1 queries
async findAllWithDetail(options) {
  return super.findAll({
    ...options,
    include: [
      {
        association: 'category', // ✅ Eager load related data
        attributes: ['id', 'name'], // ✅ Select only needed fields
      },
    ],
    attributes: {
      exclude: ['internalNotes'], // ✅ Exclude heavy fields
    },
  });
}
```

**Query Patterns**:

- Eager load related data (include)
- Select specific attributes (not `SELECT *`)
- Use pagination for large datasets
- Add query limits (default: 100 items per page)
- Create database views for complex queries

### 3. Caching Strategy

```javascript
// Service: Cache frequently accessed data
class ProductService extends BaseService {
  constructor(model) {
    super(model);
    this.cacheKey = 'products:list'; // ✅ Cache key pattern
    this.cacheTTL = 3600; // ✅ 1 hour TTL
  }

  async findAll(options) {
    // For list without filters, use cache
    if (!options.where && !options.search) {
      const cached = await redis.get(this.cacheKey);
      if (cached) return JSON.parse(cached);
    }

    const result = await super.findAll(options);

    // Cache the result if listable
    if (!options.where) {
      await redis.setex(this.cacheKey, this.cacheTTL, JSON.stringify(result));
    }

    return result;
  }

  // Invalidate cache on mutations
  async create(data) {
    const result = await super.create(data);
    await redis.del(this.cacheKey); // ✅ Invalidate cache
    return result;
  }
}
```

**Caching Rules**:

- Cache read-heavy data (lists, popular items)
- Invalidate cache on create/update/delete
- Use TTL to prevent stale data
- Cache key pattern: `{resource}:{operation}`

### 4. Pagination (Always Required)

```javascript
// Controller: All list endpoints must paginate
// ✅ querySearch middleware transforms search params into where clauses
// ✅ Service receives pre-processed query with where conditions already set
const list = catchAsync(async (req, res) => {
  const { query } = req;
  
  // ✅ Service just passes query through - no search logic needed here
  const result = await productService.findAll(query);

  return new ApiResponse({
    messages: messages.COMMON.OK,
    data: result, // Already has meta with pagination info
  }).send(res);
});
```

**Important**: Search filtering is handled by the `querySearch` middleware in routes, NOT by the service or controller.

**Pagination Rules**:

- Default: 20 items per page
- Maximum: 100 items per page
- Meta includes: `currentPage`, `perPage`, `totalItems`, `totalPages`
- Pagination params automatically handled by BaseService (via queryParser middleware)

### 5. Soft Deletes (for data preservation)

```javascript
// Model: Support soft deletes
Product.init(
  {
    // ... fields
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null, // ✅ Soft delete support
    },
  },
  { sequelize, paranoid: true },
); // ✅ Enable paranoid mode
```

**Benefits**:

- Never lose data
- Recover deleted items
- Audit trail
- Restore functionality

### 6. Scaling Considerations (Growth Planning)

When your data grows from 1k to 1M+ records:

**Database Performance**:

- ✅ Indexes prevent full table scans
- ✅ Partitioning (if using PostgreSQL) splits large tables
- ✅ Archive old records to separate storage
- ✅ Query optimization prevents timeout
- ✅ Read replicas for reporting queries

**Application Performance**:

- ✅ Caching layer (Redis) for hot data
- ✅ Background jobs for heavy processing
- ✅ Pagination prevents memory bloat
- ✅ Lazy loading for related data (when needed)
- ✅ API rate limiting prevents abuse

**Architecture Scaling**:

- ✅ Stateless services (horizontally scalable)
- ✅ Message queue for async work (not blocking requests)
- ✅ Microservices separation (if needed later)
- ✅ API versioning for backward compatibility
- ✅ Feature flags for gradual rollout

**Monitoring Readiness**:

- ✅ Logging captures what happened (troubleshooting)
- ✅ Metrics track performance (alerts on issues)
- ✅ Distributed tracing follows requests (bottleneck detection)
- ✅ Error tracking identifies problems (proactive fixes)
- ✅ User behavior analytics (optimization insights)

**What the Generated Code Provides**:

- ✅ Foundation for horizontal scaling (stateless services)
- ✅ Query patterns that scale (no N+1 queries)
- ✅ Pagination ready (won't break with large datasets)
- ✅ Audit logging built-in (debugging at scale)
- ✅ Error context captured (diagnosing issues)

**To Add Later**:

- Implement Redis caching layer
- Set up distributed logging (ELK stack, etc.)
- Configure database monitoring (slow query logs)
- Add background job queue (Bull, RabbitMQ)
- Implement API rate limiting per user/IP
- Set up performance monitoring (New Relic, Datadog)

---

## Senior-Level Practices

### 1. Logging & Monitoring

```javascript
// Controller: Log important operations
const create = catchAsync(async (req, res) => {
  logger.info(`[Product] Creating new product`, {
    user_id: req.user.id,
    name: req.body.name,
    timestamp: new Date().toISOString(),
  });

  const result = await productService.create(req.body);

  logger.info(`[Product] Product created successfully`, {
    product_id: result.id,
    duration_ms: Date.now() - startTime,
  });

  return new ApiResponse({
    messages: messages.COMMON.CREATED,
    data: result,
    status: httpStatus.CREATED,
  }).send(res);
});

// Service: Log errors with context
async findByName(name) {
  try {
    return await super.findOne({ where: { name } });
  } catch (error) {
    logger.error(`[Product] Database error finding by name: ${name}`, {
      error: error.message,
      stack: error.stack,
    });
    throw new ApiError(500, 'Database error');
  }
}
```

**Logging Standards**:

- Log all mutations (create, update, delete)
- Log errors with full context
- Include user ID for audit trail
- Include timing for performance monitoring
- Use structured logging (JSON format for parsing)

### 2. Error Handling & Recovery

```javascript
// Controller: Detailed error messages
const update = catchAsync(async (req, res) => {
  const { product, body } = req;

  // Check unique constraint before update
  if (body.name && body.name !== product.name) {
    const exists = await productService.findByName(body.name);
    if (exists) {
      throw new ApiError(httpStatus.CONFLICT, 'Product name already exists', {
        field: 'name',
        currentValue: product.name,
        attemptedValue: body.name,
      });
    }
  }

  const result = await product.update(body);

  return new ApiResponse({
    messages: messages.COMMON.UPDATED,
    data: result,
  }).send(res);
});
```

**Error Handling Rules**:

- Throw ApiError with HTTP status, message, and context
- Include field name for validation errors
- Never expose database/system errors to client
- Log full errors server-side

### 3. API Documentation

```javascript
/**
 * @swagger
 * /core/v1/products:
 *   post:
 *     summary: Create new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/createProductRequest'
 *           example:
 *             name: "Premium Widget"
 *             sku: "PROD-12345"
 *             status: true
 *     responses:
 *       '201':
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/productResponse'
 *       '409':
 *         description: Product name already exists
 *       '422':
 *         description: Validation error
 */
```

**Documentation Standards**:

- JSDoc for all endpoints
- Include request/response examples
- Document all error scenarios
- Include authentication requirements
- Keep docs in sync with code

### 4. Testing Strategy

```javascript
// Test file pattern (for reference, not generated)
describe('ProductService', () => {
  let service;

  beforeEach(() => {
    service = new ProductService(Product);
  });

  describe('create', () => {
    it('should create a product with valid data', async () => {
      const result = await service.create({ name: 'Widget', sku: 'W001' });
      expect(result.id).toBeDefined();
      expect(result.name).toBe('Widget');
    });

    it('should throw error if name is not unique', async () => {
      await service.create({ name: 'Widget', sku: 'W001' });
      expect(() => service.create({ name: 'Widget', sku: 'W002' })).rejects.toThrow(ApiError);
    });
  });
});
```

**Testing Guidelines**:

- Unit test services (business logic)
- Integration test controllers (request/response)
- Mock external dependencies
- Aim for 80%+ code coverage
- Test happy paths and error cases

---

## Code Quality Review Checklist

**Before generation, agents must ensure:**

### Architecture Quality

- ✅ Layered architecture maintained (no controller-model coupling)
- ✅ No circular dependencies between modules
- ✅ Service extends BaseService, not duplicating CRUD logic
- ✅ All dependencies injected (not `require`d directly in class)

### Code Style

- ✅ Consistent naming: camelCase code, snake_case DB, PascalCase classes
- ✅ Methods have JSDoc with @param, @returns, @throws
- ✅ No magic numbers (use constants)
- ✅ Maximum method length: 50 lines (refactor if longer)
- ✅ Consistent indentation (2 spaces)

### Business Logic

- ✅ All mutations validate data first
- ✅ Unique constraints checked in service
- ✅ Error messages are user-friendly
- ✅ No N+1 queries (use eager loading)
- ✅ Complex logic documented with comments

### Error Handling

- ✅ All errors use ApiError class
- ✅ HTTP status codes are correct (201 for create, 404 for not found, etc.)
- ✅ Error messages don't expose internal details
- ✅ Errors logged with full context
- ✅ Recovery options documented

### Performance

- ✅ Database queries optimized (indexes, specific fields)
- ✅ Pagination implemented for lists
- ✅ No unnecessary data fetched
- ✅ Cache invalidation strategy documented
- ✅ Response time reasonable (<500ms typical)

### Security

- ✅ Input validation comprehensive (Joi schemas)
- ✅ Authentication required for sensitive operations
- ✅ Authorization checks in place (roles/permissions)
- ✅ SQL injection prevented (Sequelize parameterized)
- ✅ XSS prevented (no raw HTML in responses)

### Maintainability

- ✅ Code is readable and self-documenting
- ✅ No copy-paste code (DRY principle)
- ✅ Tests written for complex logic
- ✅ Documentation matches implementation
- ✅ Future dev can extend without changes

---

## Apply Standards During Generation

**When generating each file, apply these standards:**

### Model Generation

- ✅ Add indexes on: unique fields, foreign keys, commonly queried fields
- ✅ Include JSDoc for all attributes and associations
- ✅ Use DataTypes correctly (UUID for IDs, STRING for short text, TEXT for long content)
- ✅ Add custom getters/setters for computed fields
- ✅ Document why each association exists

### Service Generation

- ✅ Extend BaseService without duplicating CRUD methods
- ✅ Add custom methods with clear, business-focused names
- ✅ Include JSDoc with @param types and @throws errors
- ✅ Handle database errors with try/catch and throw ApiError
- ✅ Implement query optimization (eager loading, specific attributes)
- ✅ Add validation methods (isUnique, isValid, etc.)
- ✅ Singleton export: `module.exports = new {Resource}Service({Resource})`
- ✅ **Do NOT add search logic to `findAll()`** - `querySearch` middleware handles search filtering. Service just calls `super.findAll(options)`
- ✅ **Do NOT add search logic to `findAll()`** - let `querySearch` middleware handle it. Service just calls `super.findAll(options)`

### Validation Generation

- ✅ Set min/max lengths for strings (e.g., min: 2, max: 100)
- ✅ Add regex patterns for structured data (emails, SKUs, phone numbers)
- ✅ Include `.example()` for Swagger documentation
- ✅ Custom error messages with `.messages({})`
- ✅ For updates: use `.min(1)` to ensure at least one field
- ✅ For unique fields: note that server validation also required in service

### Controller Generation

- ✅ Wrap all handlers with `catchAsync()`
- ✅ Validate business logic BEFORE database operations
- ✅ Log important operations (create, update, delete, errors)
- ✅ Return `ApiResponse` with: messages, data, status
- ✅ Use correct HTTP status codes (201 created, 404 not found, 409 conflict)
- ✅ Don't expose database errors to client
- ✅ For `list` handler: simply pass `req.query` to service - search filtering already handled by `querySearch` middleware
- ✅ For `list` handler: simply pass `req.query` to service - don't build search conditions here (middleware handles it)

### Middleware Generation

- ✅ Resolve resource by ID from `req.params.id`
- ✅ Eager load related data with associations
- ✅ Attach to req with: `req.{resource} = data`
- ✅ Return 404 ApiError if not found
- ✅ Never skip next() - even in error case use `next(error)`

### Route Generation

- ✅ Middleware order: auth → validate → middleware → controller
- ✅ For core: include `authCore({ menu, permission })` guards
- ✅ For public: include `auth()` only
- ✅ JSDoc with @swagger, include all parameters and responses
- ✅ Reference schemas and common parameters
- ✅ Document all error scenarios (401, 403, 404, 409, 422)

### Migration Generation

- ✅ Use snake_case column names
- ✅ Add indexes on queried fields
- ✅ Foreign keys with explicit references and CASCADE
- ✅ UUID primary keys with UUIDV4
- ✅ Timestamps (created_at, updated_at) always included
- ✅ Use proper Sequelize.DATE for date fields

### Swagger Documentation Generation

- ✅ Schemas match validation schemas exactly
- ✅ Examples are realistic and valid
- ✅ All status codes documented (200, 201, 404, 409, 422, 500)
- ✅ Security requirements specified
- ✅ Request/response bodies fully documented
- ✅ Parameters documented (path, query, body)

---

## Quick Start

**Minimal example:**

```
Generate CRUD for "Product" with fields: name (required string unique), status (boolean default true)
```

**Full example with all options:**

```
Generate CRUD for "Post" (scope=public) with fields: title (required string), content (required text), published (boolean default false)
Include role permissions, timestamps, full-text search on title
```

---

## Agent Instructions (For AI Execution)

### Pre-Generation Phase

1. **Parse Input Arguments**

   - Extract `resourceName` (must be PascalCase singular: `Product` not `product` or `Products`)
   - Parse `fields` string into structured array with type, constraints, default values
   - Extract optional: `scope` (default: `core`), `withRoles` (default: true for core), `withTimestamps` (default: true), `withSearch` (default: false), `customLogic`

2. **Validate Inputs**

   - ✅ `resourceName` is PascalCase and singular
   - ✅ At least 2 fields provided (beyond system fields)
   - ✅ All field types are in supported list (string, text, integer, decimal, boolean, date, datetime, email, uuid, enum)
   - ✅ Enum fields have explicit values: `enum: value1/value2`
   - ✅ `scope` is either "core" or "public"
   - ✅ If `withSearch: true`, at least one searchable field is specified
   - If any validation fails, **stop and return error message** with specific issue

3. **Check Prerequisites**
   - ✅ `src/application/{scope}/v1/` directory exists
   - ✅ `src/database/models/` directory exists
   - ✅ `src/docs/{scope}/v1/components/schemas/` directory exists
   - ✅ Existing resource doesn't conflict (check no `{resource}.js` files exist)
   - If any check fails, **abort with clear error**

### Generation Phase (Exact Order)

4. **Create Database Files** (in this order)

   - Model: `src/database/models/{resource}.js`
   - Migration: `src/database/migrations/{timestamp}-create-{resource}.js`
   - Seed: `src/database/seeds/{timestamp}-initialize-{resource}.js` (optional, only if withTimestamps or complex fields)

5. **Create Service Layer**

   - Service: `src/application/{scope}/v1/{resource}/{resource}.service.js` (extends BaseService)

6. **Create Request Layer**

   - Validation: `src/application/{scope}/v1/{resource}/{resource}.validation.js`
   - Middleware: `src/application/{scope}/v1/{resource}/{resource}.middleware.js`
   - Controller: `src/application/{scope}/v1/{resource}/{resource}.controller.js`

7. **Create Routing Layer**

   - Routes: `src/application/{scope}/v1/{resource}/{resource}.route.js`

8. **Create Documentation Layer**

   - Utils: `src/docs/{scope}/v1/components/schemas/{resource}/utils.js`
   - Request Schema: `src/docs/{scope}/v1/components/schemas/{resource}/request.schema.js`
   - Response Schema: `src/docs/{scope}/v1/components/schemas/{resource}/response.schema.js`
   - Index: `src/docs/{scope}/v1/components/schemas/{resource}/index.js`

9. **Integration Updates** (modify existing files)
   - Add route import to `src/routers/{scope}/v1/router.js`
   - Add schema export to `src/docs/{scope}/v1/components/schemas/index.js`

### Post-Generation Verification

10. **Verify Generated Files**

    - ✅ All 13+ files created successfully
    - ✅ No syntax errors in any generated file
    - ✅ File paths follow exact naming conventions
    - ✅ Controllers wrapped with `catchAsync()`
    - ✅ Services exported as singletons
    - ✅ Routes have proper middleware order
    - ✅ Validation uses Joi correctly

11. **Report Results**
    - List all 13+ generated files with paths
    - Confirm integrations applied (route + schema registrations)
    - Provide next steps for user (migrate, seed, test)

---

## Arguments

### Required

- **`resourceName`** - Singular, PascalCase resource name

  - Examples: `User`, `Product`, `BlogPost`, `OrderItem`
  - Must match model class name

- **`fields`** - Comma-separated field definitions with types and constraints
  - Format: `fieldName (type, constraints)`
  - Must include at least one field beyond system fields
  - Example: `name (required string), email (unique email), age (integer optional), status (enum: active/inactive default: active)`

### Optional

- **`scope`** - `"core"` (admin-only) or `"public"` (default: `"core"`)

  - `core`: Uses `authCore()` with role-based guards
  - `public`: Uses `auth()` without permission checks

- **`withRoles`** - Include role-based permissions

  - Default: `true` for core, `false` for public
  - Core routes require "product" menu entry in database

- **`withTimestamps`** - Include `createdAt`/`updatedAt` auto-timestamps

  - Default: `true`

- **`withSearch`** - Include full-text search capability

  - Default: `false`
  - If true, specify searchable fields in `customLogic`

- **`customLogic`** - Brief description of business logic beyond basic CRUD
  - Examples: "validate email uniqueness", "apply discount logic", "check inventory"
  - Optional: leave blank for standard CRUD

---

## Field Format Reference

### Types Supported

| Type       | Database      | Notes                                            |
| ---------- | ------------- | ------------------------------------------------ |
| `string`   | VARCHAR       | Use for short text (email, username, title)      |
| `text`     | TEXT          | Use for long content (description, bio, content) |
| `integer`  | INTEGER       | Whole numbers only                               |
| `decimal`  | DECIMAL(10,2) | Money, precise decimals                          |
| `boolean`  | BOOLEAN       | true/false, default: false                       |
| `date`     | DATE          | YYYY-MM-DD format                                |
| `datetime` | DATETIME      | ISO 8601 format                                  |
| `email`    | STRING        | Validated as email, lowercase                    |
| `uuid`     | UUID          | Auto-generated UUIDV4 if default                 |
| `enum`     | ENUM          | Predefined values: `enum: value1/value2/value3`  |

### Constraints

| Constraint       | Behavior                                                |
| ---------------- | ------------------------------------------------------- |
| `required`       | NOT NULL in database, required in request validation    |
| `unique`         | UNIQUE constraint in database, checked on create/update |
| `optional`       | Nullable field, not required in request                 |
| `default: value` | Default value on creation                               |
| `index`          | Create database index for queries                       |

### Examples

```
name (required string unique)
→ NOT NULL, UNIQUE, VARCHAR

email (required unique email)
→ NOT NULL, UNIQUE, validated as email, lowercased

status (enum: draft/published/archived default: draft)
→ ENUM constraint, defaults to 'draft'

description (optional text)
→ Nullable TEXT field

price (required decimal)
→ NOT NULL, DECIMAL(10,2)

isActive (boolean default: true)
→ BOOLEAN, defaults to true

publishedAt (optional datetime)
→ Nullable DATETIME

role_id (required uuid)
→ UUID foreign key reference
```

---

## Complete File Manifest

**13+ Files to Generate** (exact paths, must match project structure):

### Database Layer (3 files)

```
src/database/models/{resource}.js
src/database/migrations/YYYYMMDDHHMMSS-create-{resource}.js
src/database/seeds/YYYYMMDDHHMMSS-initialize-{resource}.js
```

### Service Layer (1 file)

```
src/application/{scope}/v1/{resource}/{resource}.service.js
```

### Request Layer (3 files)

```
src/application/{scope}/v1/{resource}/{resource}.validation.js
src/application/{scope}/v1/{resource}/{resource}.middleware.js
src/application/{scope}/v1/{resource}/{resource}.controller.js
```

### Routing Layer (1 files)

```
src/application/{scope}/v1/{resource}/{resource}.route.js
```

### Documentation Layer (4 files)

```
src/docs/{scope}/v1/components/schemas/{resource}/utils.js
src/docs/{scope}/v1/components/schemas/{resource}/request.schema.js
src/docs/{scope}/v1/components/schemas/{resource}/response.schema.js
src/docs/{scope}/v1/components/schemas/{resource}/index.js
```

### Integration Updates (2 modified files)

```
src/routers/{scope}/v1/router.js (add route import + route definition)
src/docs/{scope}/v1/components/schemas/index.js (add schema export)
```

---

## Input Validation (Agent Must Check)

Before generating any files, validate all inputs:

| Input          | Validation Rule                                     | Error Message                                                         |
| -------------- | --------------------------------------------------- | --------------------------------------------------------------------- |
| `resourceName` | Must be PascalCase, singular, 1-50 chars            | "Resource name must be PascalCase singular (e.g., Product, BlogPost)" |
| `resourceName` | Not already used (no .js file exists)               | "Resource '{name}' already exists. Choose a different name."          |
| `fields`       | At least 2 fields provided                          | "Must specify at least 2 fields beyond system fields"                 |
| Each field     | Type is supported (string, text, integer, etc.)     | "Field '{name}' has unsupported type: '{type}'"                       |
| Enum fields    | Values specified as `enum: val1/val2/val3`          | "Enum field '{name}' missing values. Format: `enum: value1/value2`"   |
| `scope`        | Exactly "core" or "public"                          | "Scope must be 'core' or 'public'"                                    |
| Timestamps     | Boolean value                                       | "withTimestamps must be true or false"                                |
| Roles          | Boolean value                                       | "withRoles must be true or false"                                     |
| Search         | Boolean value + at least 1 searchable field if true | "withSearch requires search fields to be specified"                   |

---

## Generation Output

The generator creates **13+ files** organized by layer:

### 1. Database Layer (3 files)

**Model** - `src/database/models/{resource}.js`

- Sequelize model class extending `Model`
- UUID primary key with UUIDV4 default
- All fields mapped to DataTypes
- Associations defined in static `associate()` method
- Custom setter for password fields using `security.hash()`

**Migration** - `src/database/migrations/YYYYMMDDHHMMSS-create-{resource}.js`

- Snake_case column names
- UUID primary keys with UUIDV4
- Foreign key references with CASCADE delete
- Timestamps if enabled

**Seed** (optional) - `src/database/seeds/YYYYMMDDHHMMSS-initialize-{resource}.js`

- Sample data for testing
- Uses UUIDV4 for IDs
- Helpful for development and testing

### 2. Service Layer (1 file)

**Service** - `src/application/{scope}/v1/{resource}/{resource}.service.js`

- Extends `BaseService` (provides CRUD methods)
- Singleton pattern: `module.exports = new ResourceService(Model)`
- Custom methods for business logic (e.g., `findByEmail()`, `checkPermission()`)
- Include associations via `include[]` in queries
- Proper error handling with `ApiError`
- **Search filtering**: Do NOT add search logic to `findAll()`. The `querySearch` middleware (in routes) pre-processes search params into where clauses. Service just passes query through.

**BaseService inherited methods:**

- `findById(id)`, `findOne(options)`, `findAll(options)`
- `create(data)`, `update(id, data)`, `destroy(id)`
- `findOrCreate()`, `count()`, `restore()`

### 3. Request Layer (3 files)

**Controller** - `src/application/{scope}/v1/{resource}/{resource}.controller.js`

- All handlers wrapped with `catchAsync()`
- Returns `ApiResponse` with message, data, status
- Accesses pre-resolved resource from `req.{resource}`
- Standard methods: `create()`, `list()`, `detail()`, `update()`, `destroy()`
- Custom logic and validation as needed

**Validation** - `src/application/{scope}/v1/{resource}/{resource}.validation.js`

- Joi schemas for each operation: `createOrUpdate`, `update`
- String fields: `.trim()` and `.lowercase()`
- Email fields: `.email()` validation
- UUID params: `.uuid()`
- Password fields: `.custom(password)` validator
- Partial updates: `Joi.object().keys({...}).min(1)`

**Middleware** - `src/application/{scope}/v1/{resource}/{resource}.middleware.js`

- `get{Resource}()` middleware to resolve and attach resource to `req`
- Returns 404 `ApiError` if not found
- Uses `findOneWithDetail()` with associations

### 4. Routing Layer (1 files)

**Routes** - `src/application/{scope}/v1/{resource}/{resource}.route.js`

- Middleware order: `auth → validate → middleware → controller`
- `authCore()` for core routes with `{ menu, permission }` guards
- `auth()` for public routes
- JSDoc `@swagger` comments with full documentation
- References common parameters and schemas

### 5. Documentation Layer (4 files)

**Request Schema** - `src/docs/{scope}/v1/components/schemas/{resource}/request.schema.js`

- Converts Joi validation to Swagger using `swagger.joiToSwagger()`
- Auto-generated from validation file

**Response Schema** - `src/docs/{scope}/v1/components/schemas/{resource}/response.schema.js`

- `{resource}CreatedResponse` for POST
- `{resource}sResponse` for LIST (with pagination)
- `{resource}Response` for GET detail
- `{resource}UpdateResponse` for PUT
- `{resource}DeleteResponse` for DELETE

**Utils** - `src/docs/{scope}/v1/components/schemas/{resource}/utils.js`

- Realistic sample data for Swagger examples
- `{resource}Data`, `{resource}Created`, `{resource}DetailData`

**Index** - `src/docs/{scope}/v1/components/schemas/{resource}/index.js`

- Combines request and response schemas
- Exported as a single module

---

## Naming Conventions Enforced

| Element              | Convention                      | Example                            |
| -------------------- | ------------------------------- | ---------------------------------- |
| **Folders**          | Singular                        | `src/application/core/v1/product/` |
| **Routes**           | Plural                          | `GET /core/v1/products`            |
| **Files**            | kebab-case with resource suffix | `product.service.js`               |
| **Classes**          | PascalCase                      | `ProductService`                   |
| **Methods**          | camelCase                       | `findByName()`                     |
| **Database columns** | snake_case                      | `created_at`, `product_id`         |
| **Code variables**   | camelCase                       | `productId`, `userData`            |
| **Constants**        | UPPERCASE_SNAKE_CASE            | `STATUS.ACTIVE`                    |

---

## Code Patterns Applied

### Service Pattern (Singleton)

```javascript
class ProductService extends BaseService {
  async findByName(name) {
    return super.findOne({ where: { name } });
  }
}
module.exports = new ProductService(Product);
```

### Controller Pattern (catchAsync)

```javascript
const create = catchAsync(async (req, res) => {
  const result = await productService.create(req.body);
  return new ApiResponse({
    messages: messages.COMMON.CREATED,
    data: result,
    status: httpStatus.CREATED,
  }).send(res);
});
```

### Route Pattern (Middleware Order)

```javascript
router.post(
  '/',
  authCore({ menu: 'product', permission: 'create' }),
  validate(productValidation.createOrUpdate),
  productController.create,
);
```

### Validation Pattern (Joi)

```javascript
const createOrUpdate = {
  body: Joi.object().keys({
    name: Joi.string().required().trim(),
    status: Joi.boolean().default(true),
  }),
};
```

---

## Examples

### Example 1: Simple Public Blog Post

```
Resource: Post
Scope: public
Fields: title (required string), content (required text), author (string optional), published (boolean default: false)
Search: title
Custom: "auto-publish if scheduled date is reached"
```

**Output**: CRUD endpoints `GET /public/v1/posts`, `POST /public/v1/posts/{id}`, etc. with full-text search on title.

### Example 2: Admin Product Management

```
Resource: Product
Scope: core
Fields: name (required string unique), description (text optional), sku (required string unique), price (required decimal), category (string optional), stock (integer default: 0)
Roles: true
Search: name
Custom: "validate SKU format, track stock levels"
```

**Output**: CRUD endpoints `GET /core/v1/products` with role-based permissions and search.

### Example 3: Core User Settings

```
Resource: UserSetting
Scope: core
Fields: language (enum: en/fr/es default: en), theme (enum: light/dark default: light), notifications (boolean default: true)
WithTimestamps: false
```

**Output**: Settings management without timestamps.

---

## Pre-Generation Checklist

Before requesting CRUD generation, ensure:

- ✅ Resource name is **singular and PascalCase**: `Product` not `Products` or `product`
- ✅ All required fields are clearly specified with types and constraints
- ✅ UUID fields are marked (auto-generated if `default: uuid`)
- ✅ Unique constraints on actual unique fields (email, sku, username)
- ✅ Enums specify all valid values: `status (enum: active/inactive/pending)`
- ✅ Custom logic is briefly described (don't leave blank unless standard CRUD)
- ✅ Scope matches use case: `core` for admin, `public` for users
- ✅ Search fields identified if `withSearch: true`

---

## Post-Generation Steps

After the generator creates all files:

### 1. Register Model Export

If model.js file is new, add to `src/database/models/index.js`:

```javascript
const modelName = require('./product');
module.exports.Product = modelName;
```

_(Usually auto-loaded by the index.js glob pattern)_

### 2. Register Routes

Add to `src/routers/{scope}/v1/router.js`:

```javascript
const productRoute = require('../../../application/core/v1/product');
// ...
{ path: '/products', route: productRoute }
```

### 3. Register Schemas

Add to `src/docs/{scope}/v1/components/schemas/index.js`:

```javascript
const productSchema = require('./product');
module.exports = { ...productSchema };
```

### 4. Add Menu Entry (if core + roles)

Insert into `role_menus` table in database:

```sql
INSERT INTO role_menus (role_id, menu_id, permissions)
VALUES (1, (SELECT id FROM menus WHERE slug='product'), '["create","read","update","delete"]');
```

### 5. Run Migrations & Seeds

```bash
yarn migrate           # Apply migration
yarn seed              # Run seeds
yarn lint:fix          # Fix linting
yarn prettier:fix      # Format code
```

### 6. Access & Test

- Visit Swagger: `/core/v1/docs` or `/public/v1/docs`
- Test endpoints with sample data from seeds
- Verify role permissions (core only)

---

## Validation Rules

The generated validation follows these rules:

| Rule                | When Applied               | Example                             |
| ------------------- | -------------------------- | ----------------------------------- |
| `.required()`       | If `required` in field def | `name (required string)`            |
| `.unique()` check   | If `unique` in field def   | DB constraint + controller logic    |
| `.trim()`           | All string fields          | Removes whitespace                  |
| `.lowercase()`      | Email and specified fields | For case-insensitive lookups        |
| `.email()`          | Email type fields          | Validates email format              |
| `.uuid()`           | UUID type or `:id` params  | Validates UUID v4 format            |
| `.custom(password)` | Password fields            | Min 8 chars, special chars required |
| `.enum()`           | Enum type fields           | Only valid values allowed           |
| `.min(1)`           | PATCH/partial updates      | At least one field to update        |
| `.default()`        | If `default:` in field def | Applied on creation                 |

---

## Error Handling

Generated code handles these scenarios:

| Scenario               | Status | Message                     |
| ---------------------- | ------ | --------------------------- |
| Not found              | 404    | Resource not found          |
| Validation error       | 422    | Field validation errors     |
| Duplicate unique field | 409    | Unique constraint violation |
| Unauthorized           | 401    | Missing/invalid token       |
| Forbidden              | 403    | Insufficient permissions    |
| Server error           | 500    | Caught by error middleware  |

All errors use `ApiError` class and are formatted by error middleware.

---

## Output Verification Checklist

After generating all 13+ files, agents **must verify**:

### File Creation Verification

- ✅ All 13 files exist and have non-zero size
- ✅ Directory structure matches `src/application/{scope}/v1/{resource}/`
- ✅ File names follow kebab-case with type suffix: `{resource}.{type}.js`
- ✅ Migration filename has correct timestamp format: `YYYYMMDDHHMMSS-create-{resource}.js`
- ✅ Seed filename follows pattern: `YYYYMMDDHHMMSS-initialize-{resource}.js`

### Code Quality Verification

- ✅ Model exports factory function: `module.exports = (sequelize, DataTypes) => { ... }`
- ✅ Service exports singleton: `module.exports = new {Resource}Service({Resource})`
- ✅ All controller handlers wrapped: `catchAsync(async (req, res) => { ... })`
- ✅ All ApiResponse calls include: `messages`, `data`, `status`
- ✅ Validation schemas have proper Joi chain: `.required()`, `.trim()`, `.email()`, etc.
- ✅ Routes have correct middleware order: auth → validate → middleware → controller
- ✅ Swagger JSDoc comments present on all route handlers
- ✅ No syntax errors (proper braces, quotes, commas)

### Integration Verification

- ✅ Route added to `src/routers/{scope}/v1/router.js` with correct path
- ✅ Schema exported in `src/docs/{scope}/v1/components/schemas/index.js`
- ✅ Both integration files have correct require/import syntax
- ✅ No duplicate route or schema definitions

### Generated Content Verification

- ✅ Model has UUID primary key with UUIDV4 default
- ✅ All fields from input present in model definition
- ✅ Foreign key references use `targetKey: 'id'` and `as` alias
- ✅ Timestamps set if `withTimestamps: true`
- ✅ Migration has `up()` and `down()` functions
- ✅ Migration uses snake_case column names
- ✅ Service inherits from BaseService and passes Model to constructor
- ✅ Controller has all 5 methods: create, list, detail, update, destroy
- ✅ Validation has `createOrUpdate` and `update` schemas
- ✅ Middleware resolves resource and checks for 404
- ✅ Routes have JSDoc with proper paths, parameters, responses
- ✅ Swagger schemas reference Joi validation correctly

### Senior-Level Code Quality Verification

- ✅ All service/controller methods have JSDoc comments
- ✅ Error handling uses ApiError, not generic Error
- ✅ Controllers wrapped with `catchAsync()`, no try/catch
- ✅ Service methods are focused (single responsibility)
- ✅ No code duplication (DRY - complex logic in one place)
- ✅ Meaningful names (not abbreviated: `findByEmail` not `findByMail`)
- ✅ Methods are reasonably sized (under 50 lines)
- ✅ Business logic in service, not controller
- ✅ No direct model access in controller (through service)
- ✅ No circular dependencies
- ✅ Database queries optimized (indexes on unique/search fields)
- ✅ Eager loading used to prevent N+1 queries
- ✅ Pagination limits enforced (max 100 items per page)
- ✅ Validation comprehensive (min/max, patterns, constraints)
- ✅ Error messages user-friendly (don't expose DB details)
- ✅ Logging capability for audit trail (user_id context)
- ✅ Security: auth/authorization in place
- ✅ Constants used instead of magic values/strings
- ✅ Code is self-documenting and readable

---

## Common Mistakes & Recovery

### Mistake 1: Wrong Resource Name Format

**Problem**: Agent generates with `product` (lowercase) or `Products` (plural)
**Recovery**: Stop, warn user, regenerate with corrected PascalCase singular name
**Check**: `resourceName` must match `/^[A-Z][a-zA-Z0-9]*$/` (PascalCase) and be singular

### Mistake 2: Duplicate Field Name in Model

**Problem**: Field name conflicts with Sequelize reserved words (id, createdAt, updatedAt)
**Recovery**: Either rename field with prefix (e.g., `customId`) or abort with error
**Check**: After field parsing, verify no conflicts with: id, createdAt, updatedAt, deletedAt

### Mistake 3: Missing Joi Constraint Chain

**Problem**: Generated validation is missing `.trim()` on strings or `.email()` on emails
**Recovery**: Regenerate validation file with complete Joi chains
**Check**: Every string field must have `.trim()`, email fields must have `.email()`

### Mistake 4: Controllers Not Wrapped with catchAsync

**Problem**: Controller handlers use try/catch instead of catchAsync wrapper
**Recovery**: Regenerate controller with all handlers wrapped
**Check**: Pattern must be: `const handler = catchAsync(async (req, res) => { ... })`

### Mistake 5: Service Not Exported as Singleton

**Problem**: Service exports class instead of instance: `module.exports = UserService`
**Recovery**: Regenerate with: `module.exports = new UserService(Model)`
**Check**: Last line must be: `module.exports = new {Resource}Service({Resource})`

### Mistake 6: Middleware Doesn't Attach Resource to Request

**Problem**: Middleware resolves resource but doesn't set `req.{resource}`
**Recovery**: Regenerate middleware to attach: `req.{resource} = data; next();`
**Check**: Middleware must end with: `req.resource = data; next();`

### Mistake 7: Routes Not Registered in router.js

**Problem**: Routes generated but not imported/registered in routing file
**Recovery**: Manually add to `src/routers/{scope}/v1/router.js`
**Check**: File must include: `const {resource}Route = require(...); { path: '/{resources}', route }`

### Mistake 8: Swagger Schemas Not Exported in index.js

**Problem**: Schema files generated but not exported in `schemas/index.js`
**Recovery**: Manually add: `const {resource}Schema = require(./product); module.exports = {...productSchema}`
**Check**: Main schema index must export all resource schemas

### Mistake 9: Migration Timestamp Format Wrong

**Problem**: Migration filename uses incorrect timestamp: `2025-05-06` instead of `20250506090000`
**Recovery**: Regenerate with correct format: `YYYYMMDDHHMMSS` with leading zeros
**Check**: Use `new Date().getTime()` or proper timestamp formatting

### Mistake 10: Enum Values Not Validated

**Problem**: Enum fields accept any string, no validation against specified values
**Recovery**: Regenerate validation with: `.valid(...Object.values(enum_constants))`
**Check**: Joi enum must use `.valid('value1', 'value2', 'value3')`

### Recovery Process

If any mistake detected:

1. Stop current generation
2. Report specific mistake with line number and file
3. Regenerate that specific file (or all files if structural)
4. Re-run verification checklist
5. Confirm completion before reporting to user

---

## Troubleshooting

| Issue                   | Solution                                                         |
| ----------------------- | ---------------------------------------------------------------- |
| "Model not found" error | Run migrations first: `yarn migrate`                             |
| Route returns 404       | Ensure route is registered in `src/routers/{scope}/v1/router.js` |
| "401 Unauthorized"      | Check token is valid and not blacklisted                         |
| "403 Forbidden"         | Verify `menu` and `permission` in role_menus for your role       |
| Validation errors       | Check Joi schema matches request body structure and field types  |
| UUID validation fails   | Use `.uuid()` for UUID params, not `.string().uuid()`            |
| Swagger docs empty      | Ensure schemas are exported in components/schemas/index.js       |
| Seed data not inserted  | Check seed timestamps are correct format: `YYYYMMDDHHMMSS`       |

---

## Senior Developer Expectations

**A senior programmer should expect the following from generated code:**

### Code That Requires Zero Cleanup

- No linting errors or style issues (ready for `git push`)
- No refactoring needed (already following best practices)
- Methods are appropriately sized and focused
- Naming is clear and self-documenting
- Comments explain "why", not "what"

### Code That Scales

- Database optimized (indexes, eager loading)
- Pagination enforced (won't bog down on large datasets)
- Query patterns prevent N+1 problems
- Response times consistent (no unexplained slowness)
- Ready for caching layer without modifications

### Code That's Maintainable

- Junior developers can understand structure
- Adding new fields requires minimal changes
- Business logic isolated (easy to unit test)
- Error scenarios documented and handled
- Future tech stack changes don't break layers

### Code That's Production-Ready

- Security built-in (validation, auth, authorization)
- Errors logged with context (debuggable)
- API documented in Swagger (self-documenting)
- No secrets hardcoded
- No unsafe operations (parameterized queries, input validation)

### Code That Follows Team Standards

- Matches boilerplate conventions exactly
- Uses established patterns (not reinventing)
- Integrates seamlessly with existing codebase
- No conflicts with other resources
- Follows naming conventions throughout

### Code Review Friendly

- Easy to review (clear intent, short methods)
- Defensive programming (validates early)
- No ambiguous logic (explicit over implicit)
- Changes have minimal side effects
- Dependencies clear and tracked

### What NOT to Expect

- ❌ Copy-paste code (DRY principle applied)
- ❌ Magic strings or numbers (constants used)
- ❌ Missing error handling (comprehensive)
- ❌ Unclear business logic (self-documenting)
- ❌ Performance issues (queries optimized)
- ❌ Security concerns (built-in validation)

---

## Related Tasks

After CRUD generation:

- **Refactor existing CRUD**: `/refactor-crud` - Modify existing resource fields/logic
- **Add validation rule**: `/add-validation-rule` - Add custom validation to existing resource
- **Migrate field**: `/migrate-field` - Add/modify/remove database field safely
- **Generate tests**: `/generate-test` - Create unit tests for endpoints
- **Create relationship**: `/add-relationship` - Link two resources with association

---

## Important Notes

⚠️ **Field Naming**: Use `camelCase` in request/response bodies, automatically converted to `snake_case` in database via Sequelize's `underscored: true`.

⚠️ **Singleton Services**: Services are instantiated once globally. Do NOT create new instances per request.

⚠️ **Timestamps**: Always include timestamps unless explicitly disabled. Format: `YYYY-MM-DDTHH:mm:ss.sssZ` in responses.

⚠️ **Authentication**: Core routes require valid JWT with admin role. Public routes require valid JWT with user role.

⚠️ **Pagination**: List endpoints auto-paginate with page/limit query params. Meta includes currentPage, perPage, totalItems, totalPages.

⚠️ **Search**: If enabled, searches across specified fields using `ilike` (case-insensitive) in PostgreSQL or `like` in MySQL.

⚠️ **Associations**: Always use explicit `targetKey` and `as` aliases in model associations for clarity.

⚠️ **Migrations**: Timestamps are required in order (YYYYMMDDHHMMSS). If migration doesn't run, check timestamp format and database permissions.
