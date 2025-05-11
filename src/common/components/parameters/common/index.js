const paramsIdString = {
  name: 'id',
  in: 'path',
  required: true,
  schema: {
    type: 'string',
  },
};

const paramsId = {
  name: 'id',
  in: 'path',
  required: true,
  schema: {
    type: 'integer',
  },
};

const paramsSlug = {
  name: 'slug',
  in: 'path',
  required: true,
  schema: {
    type: 'string',
  },
};

const paramsDate = {
  name: 'date',
  in: 'path',
  required: true,
  schema: {
    type: 'string',
  },
};

const page = {
  name: 'page',
  in: 'query',
  required: true,
  schema: {
    type: 'integer',
    example: 1,
  },
};

const limit = {
  name: 'limit',
  in: 'query',
  required: true,
  schema: {
    type: 'integer',
    example: 10,
  },
};

const search = {
  name: 'search',
  in: 'query',
  required: false,
  schema: {
    type: 'string',
  },
};

const sortBy = {
  name: 'sortBy',
  in: 'query',
  required: false,
  schema: {
    type: 'string',
    example: 'createdAt.DESC',
  },
};

const startDate = {
  name: 'startDate',
  in: 'query',
  required: false,
  schema: {
    type: 'string',
  },
};

const endDate = {
  name: 'endDate',
  in: 'query',
  required: false,
  schema: {
    type: 'string',
  },
};

const token = {
  name: 'token',
  in: 'query',
  required: true,
  schema: {
    type: 'string',
  },
};

module.exports = {
  paramsIdString,
  paramsId,
  paramsDate,
  page,
  limit,
  search,
  sortBy,
  startDate,
  endDate,
  token,
  paramsSlug,
};
