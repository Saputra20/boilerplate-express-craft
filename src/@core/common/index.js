const { IPagination } = require('../interface');
const dayjs = require('dayjs');
const db = require('../../database/models');

// eslint-disable-next-line no-unused-vars
const { data: IData, options: IOptions, response: IResponse } = IPagination;

const { Op } = db.Sequelize;
const OPERATORS = {
  gt: Op.gt,
  gte: Op.gte,
  lt: Op.lt,
  lte: Op.lte,
  like: Op.like,
  between: Op.between,
  betweenDate: Op.between,
  in: Op.in,
  regexp: Op.regexp,
  not: Op.not,
  endsWith: Op.endsWith,
};

const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

/**
 * add meta data pagination
 * @param {IData} data
 * @param {IOptions} options
 * @returns {IResponse}
 */
const addPageMetadata = (data, options) => {
  const { count } = data;
  const { limit, page } = options;
  const currentPage = page;
  const perPage = limit;
  const totalItems = count;
  const totalPages = Math.ceil(count / limit);
  return {
    items: data.rows,
    meta: {
      currentPage,
      perPage,
      totalItems,
      totalPages,
    },
  };
};

const specialField = ['page', 'limit', 'allStatus', 'onlyFinish', 'companyId', 'filter', 'keyword'];

const queryParser = (query) => {
  const result = {
    where: {},
    order: [['id', 'ASC']],
    page: Number(query.page) || 1,
  };
  const fields = Object.keys(query);
  for (const field of fields) {
    const q = query[field];

    let [op, value] = q.split(':');
    if (value) {
      const opSymbol = OPERATORS[op];
      if (['between', 'in'].includes(op)) {
        result.where[field] = {
          [opSymbol]: value.split(',').map((v) => (isNaN(v) ? v : Number(v))),
        };
      } else if (['betweenDate'].includes(op)) {
        const [start, end] = value.split(',');
        result.where[field] = {
          [opSymbol]: [
            dayjs(start).startOf('day').toISOString(),
            dayjs(end).endOf('day').toISOString(),
          ],
        };
      } else {
        result.where[field] = { [opSymbol]: isNaN(value) ? value : Number(value) };
      }
    } else if (field === 'sortBy') {
      const orderArray = op.split('.');

      if (orderArray.length === 2) {
        const [sort, order] = orderArray;
        result.order[0] = [sort, order];
      } else {
        const [model, sort, order] = orderArray;
        result.order[0] = [model, sort, order];
      }
    } else if (!specialField.includes(field)) {
      result.where[field] = isNaN(op) ? op : Number(op);
    }
  }
  return result;
};

module.exports = {
  catchAsync,
  addPageMetadata,
  queryParser,
};
