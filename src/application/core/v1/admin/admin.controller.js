const { status: httpStatus } = require('http-status');
const { catchAsync } = require('../../../../@core/common');
const ApiResponse = require('../../../../@core/interceptor/ApiReponse');
const CONST = require('../../../../common/constants');
const adminService = require('./admin.service');
const ApiError = require('../../../../@core/interceptor/ApiError');
const mailQueue = require('../../../../infrastructure/queue/mail/mail.queue');
const config = require('../../../../config/config');

const { messages, mailer } = CONST;

const create = catchAsync(async (req, res) => {
  const { body } = req;
  if (await adminService.findByEmail(body.email))
    throw new ApiError(
      httpStatus.CONFLICT,
      messages.COMMON.CONFLICT.replace(':params', `Email ${body.email}`),
    );
  const result = await adminService.create(body);
  mailQueue.add({
    event: mailer.event.NEW_ADMIN,
    toAddress: body.email,
    templateData: {
      subject: 'Verify Email',
      link: `${config.baseAdminUrl}`,
      name: body.name,
      email: body.email,
      password: body.password,
    },
  });
  return new ApiResponse({
    messages: messages.COMMON.CREATED,
    data: result,
    status: httpStatus.CREATED,
  }).send(res);
});

const list = catchAsync(async (req, res) => {
  const { query } = req;
  query.include = [{ association: 'role' }];
  const result = await adminService.findAll(query);
  return new ApiResponse({
    messages: messages.COMMON.OK,
    data: result,
  }).send(res);
});

const detail = catchAsync(async (req, res) => {
  const { admin } = req;
  return new ApiResponse({
    messages: messages.COMMON.OK,
    data: admin,
  }).send(res);
});

const update = catchAsync(async (req, res) => {
  const { admin, body } = req;
  if (await adminService.findByEmail(body.email, admin.id))
    throw new ApiError(
      httpStatus.CONFLICT,
      messages.COMMON.CONFLICT.replace(':params', `Email ${body.email}`),
    );
  admin.update(body);
  return new ApiResponse({
    messages: messages.COMMON.UPDATED,
    data: admin,
  }).send(res);
});

const destroy = catchAsync(async (req, res) => {
  const { admin } = req;
  admin.destroy();
  return new ApiResponse({
    messages: messages.COMMON.DELETED,
    data: admin,
  }).send(res);
});

module.exports = {
  create,
  list,
  detail,
  update,
  destroy,
};
