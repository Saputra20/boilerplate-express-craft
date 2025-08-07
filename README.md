# Boilerplate Express

> A clean and scalable Express.js boilerplate designed for building modern RESTful APIs with maintainability in mind.

[![license](https://img.shields.io/npm/l/@dctrl/crudify.svg)](LICENSE)

---

## 🚀 Features

- Modular folder structure (routes, controllers, services, validations, etc.)
- Environment variable support via `.env`
- Built-in logger
- Docker & docker-compose ready
- Linting with ESLint & formatting with Prettier
- Process management with PM2
- Request validation support

---

## 📦 Installation

Clone the repo:

```bash
git clone git@bitbucket.org:vodjo/boilerplate-express.git
cd boilerplate-express
```

Set the environment variables:

```bash
cp .env.example .env

# open .env and modify the environment variables (if needed)
```

Generate key:

```bash
yarn generate:key
```
---

## Running Apps

Run mode development
```bash
yarn dev
```

Run with PM2 
```bash
pm2 start ecosystem.config.json
```

## 🚀 Basic Usage

Generate model with migration:

```bash
yarn model:create --name User --attributes=name:string,email:string
```

Generate migration only:

```bash
yarn migration:create --name create-table-users-table.js
```

Generate seeder only:

```bash
yarn seed:create --name initialize-account.js
```

Running migration:

```bash
yarn migrate
```

Running seeder:

```bash
yarn seed
```

Rollback migration using sequelize-cli:

```bash
yarn sequelize-cli db:migrate:undo
```
---

## 🚀 Basic Usage Middleware

Query Parser:

```js
const queryParser = require('../../../../middleware/query-parser.middleware');

router.get(
  '/',
  queryParser,
  authCore({ menu: menuName, permission: 'read' }),
  adminController.list,
);

# provide pagination and filter
```

Query Search:

```js
const queryParser = require('../../../../middleware/query-parser.middleware');

router.get(
  '/',
  querySerch('email', 'name', '$role.name$'),
  authCore({ menu: menuName, permission: 'read' }),
  adminController.list,
);
```
---


## 📁 Folder Structure

```
src/
├── src/
│   └── @core
│   └── application
│       └── core
│           └── v1
│               └── auth
│           └── v2
│       └── public
│           └── v1
│               └── auth
│           └── v2
│   └── common
│       └── components
│       └── constants
│       └── docs
│       └── helpers
│       └── interface
│       └── validation
│   └── config
│       └── secret
│   └── database
│       └── migrations
│       └── models
│       └── seeds
│   └── docs
│       └── core
│           └── v1
│       └── public
│           └── v1
│   └── infrastructure
│       └── mail
│       └── queue
│       └── token
│       └── upload
│   └── middleware
│   └── routers
│       └── core
│           └── v1
│           └── v2
│       └── public
│           └── v1
│           └── v2
│   └── app.js
│   └── index.js
```
---

## ✅ Example Output

Controller

```js
const list = catchAsync(async (req, res) => {
  const { query } = req;
  const result = await __Name__Service.findAll(query);
  return new ApiResponse({
    messages: messages.COMMON.OK,
    data: result,
  }).send(res);
});
```

Service

```js
const BaseService = require('../../../../@core/service/BaseService');
const { User } = require('../../../../database/models');

class UserService extends BaseService {}

module.exports = new UserService(User);

```

Route

```js
/**
 * @swagger
 * /core/v1/users:
 *   post:
 *     summary: Create User
 *     tags: [User]
 *     security:
 *       - bearerAuth: [auth]
 *     description: Returns users data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/createOrUpdateUserRequest'
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/createOrUpdateUserRequest'
 *     responses:
 *       '201':
 *         description: Successful Response
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/userCreatedResponse'
 *       '401':
 *         description: Unauthorize response
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
 *       '404':
 *         description: Not Found response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/notFoundResponse'
 *       '422':
 *         description: Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/badRequestFormResponse'
 */
router.post(
  '/',
  authCore({ menu: menuName, permission: 'create' }),
  validate(userValidation.createOrUpdate),
  userController.create,
);
```

Validation

```js
const Joi = require('joi');

const createOrUpdate = {
  body: Joi.object().keys({ 
     name: Joi.string().required()
  }),
};

module.exports = {
  createOrUpdate,
};

```
---

## 🧩 Integration Notes

- Compatible with generator CRUD [here](https://www.npmjs.com/package/@dctrl/crudify?activeTab=readme)
---

## 📄 License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.

---