const { status: httpStatus } = require('http-status');
const { catchAsync } = require('../../../../@core/common');
const ApiResponse = require('../../../../@core/interceptor/ApiReponse');
const CONST = require('../../../../common/constants');
const roleService = require('./role.service');
const { Sequelize } = require('../../../../database/models');
const ApiError = require('../../../../@core/interceptor/ApiError');

const { messages } = CONST;

const create = catchAsync(async (req, res) => {
  const { body } = req;

  const result = await roleService.create(body).then(async (d) => {
    return {
      ...d.toJSON(),
      modules: await roleService.insertOrUpdateModules(body.modules, d.id),
    };
  });
  return new ApiResponse({
    messages: messages.COMMON.CREATED,
    data: result,
    status: httpStatus.CREATED,
  }).send(res);
});

const list = catchAsync(async (req, res) => {
  const { query } = req;
  const result = await roleService.findAll({
    ...query,
    attributes: {
      include: [
        [
          Sequelize.literal(
            '(SELECT COUNT(*) FROM "role_menus" WHERE "Role"."id" = "role_menus"."role_id")::INTEGER',
          ),
          'accessCount',
        ],
      ],
    },
  });
  return new ApiResponse({
    messages: messages.COMMON.OK,
    data: result,
  }).send(res);
});

const detail = catchAsync(async (req, res) => {
  const { role } = req;
  return new ApiResponse({
    messages: messages.COMMON.OK,
    data: role,
  }).send(res);
});

const update = catchAsync(async (req, res) => {
  const { role, body } = req;
  await role.update(body).then(async (d) => {
    return {
      ...d.toJSON(),
      modules: await roleService.insertOrUpdateModules(body.modules, d.id),
    };
  });
  return new ApiResponse({
    messages: messages.COMMON.UPDATED,
    data: role,
  }).send(res);
});

const destroy = catchAsync(async (req, res) => {
  const { role } = req;
  if (await roleService.roleIsUse(role.id))
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Role cannot be deleted because it is being used by other data!',
    );
  await role.destroy();
  return new ApiResponse({
    messages: messages.COMMON.DELETED,
    data: role,
  }).send(res);
});

module.exports = {
  create,
  list,
  detail,
  update,
  destroy,
};
