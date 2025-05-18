const fs = require('fs-extra');
const path = require('path');

const toCamelCase = (str) => {
  return str
    .split('-')
    .map((word, index) => {
      if (index === 0) return word.toLowerCase();
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join('');
};

const toPascalCase = (str) => {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
};

const controllerPath = path.join(__dirname, `../generator/templates/controller.js`);
const servicePath = path.join(__dirname, `../generator/templates/service.js`);
const routePath = path.join(__dirname, `../generator/templates/route.js`);
const validationPath = path.join(__dirname, `../generator/templates/validation.js`);

const generateController = (fullPath, modelName) => {
  const name = modelName.toLowerCase();
  const capitalizedName = toCamelCase(name);

  const targetDir = path.join(__dirname, `../../../src/application/${fullPath}`);

  // Create target directory if it doesn't exist
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const controllerTemplate = fs.readFileSync(controllerPath, 'utf-8');
  const controllerContent = controllerTemplate
    .replace(/__name__/g, name)
    .replace(/__Name__/g, capitalizedName);
  fs.writeFileSync(path.join(targetDir, `${name}.controller.js`), controllerContent);
};

const generateService = (fullPath, modelName) => {
  const name = modelName.toLowerCase();
  const capitalizedName = toPascalCase(name);

  const targetDir = path.join(__dirname, `../../../src/application/${fullPath}`);

  // Create target directory if it doesn't exist
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const serviceTemplate = fs.readFileSync(servicePath, 'utf-8');
  const serviceContent = serviceTemplate.replace(/__Name__/g, capitalizedName);
  fs.writeFileSync(path.join(targetDir, `${name}.service.js`), serviceContent);
};

const generateRoute = (fullPath, modelName) => {
  const name = modelName.toLowerCase();
  const capitalizedName = toCamelCase(name);

  const targetDir = path.join(__dirname, `../../../src/application/${fullPath}`);

  // Create target directory if it doesn't exist
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const routeTemplate = fs.readFileSync(routePath, 'utf-8');
  const routeContent = routeTemplate
    .replace(/__name__/g, name)
    .replace(/__Name__/g, capitalizedName);
  fs.writeFileSync(path.join(targetDir, `${name}.route.js`), routeContent);
};

const parseAttributes = (attributeString) => {
  const fields = attributeString.split(',').map((attr) => {
    const [key, type] = attr.split(':');
    return { key, type };
  });
  return fields;
};

const joiTypeMap = {
  string: 'Joi.string().trim()',
  number: 'Joi.number()',
  boolean: 'Joi.boolean()',
  date: 'Joi.date()',
};

const convertToJoiSchema = (fields) => {
  return fields
    .map(({ key, type }) => {
      const joi = joiTypeMap[type] || 'Joi.any()';
      return `    ${key}: ${joi}.required(),`;
    })
    .join('\n');
};

const generateValidation = (fullPath, modelName, attributes) => {
  const name = modelName.toLowerCase();
  const capitalizedName = toPascalCase(name);

  const fields = parseAttributes(attributes);
  const joiFields = convertToJoiSchema(fields);

  const targetDir = path.join(__dirname, `../../../src/application/${fullPath}`);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const validationTemplate = fs.readFileSync(validationPath, 'utf-8');
  const validationContent = validationTemplate
    .replace(/__name__/g, name)
    .replace(/__Name__/g, capitalizedName)
    .replace('__joi_fields__', joiFields);

  fs.writeFileSync(path.join(targetDir, `${name}.validation.js`), validationContent);
};

const generateCRUD = (fullPath, modelName, attributes) => {
  generateController(fullPath, modelName);
  generateService(fullPath, modelName);
  generateRoute(fullPath, modelName);
  generateValidation(fullPath, modelName, attributes);
  return true;
};

module.exports = {
  generateController,
  generateService,
  generateRoute,
  generateCRUD,
};
