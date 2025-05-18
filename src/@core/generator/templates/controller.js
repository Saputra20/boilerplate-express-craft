const { status: httpStatus } = require('http-status');
const { catchAsync } = require('../../../../@core/common');
const ApiResponse = require('../../../../@core/interceptor/ApiReponse');
const CONST = require('../../../../common/constants');
const __Name__Service = require('./__name__.service');
const ApiError = require('../../../../@core/interceptor/ApiError');

const { messages } = CONST;

const create = catchAsync(async (req, res) => {
  const { body } = req;
  const result = await __Name__Service.create(body);
  return new ApiResponse({
    messages: messages.COMMON.CREATED,
    data: result,
    status: httpStatus.CREATED,
  }).send(res);
});

const list = catchAsync(async (req, res) => {
  const { query } = req;
  const result = await __Name__Service.findAll(query);
  return new ApiResponse({
    messages: messages.COMMON.OK,
    data: result,
  }).send(res);
});

const detail = catchAsync(async (req, res) => {
  const { params } = req;
  const result = await __Name__Service.findById(params.id);
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, messages.COMMON.NOT_FOUND);
  return new ApiResponse({
    messages: messages.COMMON.OK,
    data: result,
  }).send(res);
});

const update = catchAsync(async (req, res) => {
  const { params, body } = req;
  const result = await __Name__Service.findById(params.id);
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, messages.COMMON.NOT_FOUND);
  result.update(body);
  return new ApiResponse({
    messages: messages.COMMON.UPDATED,
    data: result,
  }).send(res);
});

const destroy = catchAsync(async (req, res) => {
  const { params } = req;
  const result = await __Name__Service.findById(params.id);
  if (!result) throw new ApiError(httpStatus.NOT_FOUND, messages.COMMON.NOT_FOUND);
  result.destroy();
  return new ApiResponse({
    messages: messages.COMMON.DELETED,
    data: params,
  }).send(res);
});

module.exports = {
  create,
  list,
  detail,
  update,
  destroy,
};
