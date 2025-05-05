const data = {
  count: Number,
  data: Array,
};

const options = {
  limit: Number,
  page: Number,
};

const response = {
  totalPages: Number,
  currentPage: Number,
  perPage: Number,
  countPerPage: Number,
};

module.exports = {
  data,
  options,
  response,
};
