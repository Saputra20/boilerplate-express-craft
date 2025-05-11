const db = require('../database/models');

const { Op, where, literal } = db.Sequelize;

const querySearch = (...fields) => {
  return (req, res, next) => {
    const { search } = req.query.where;
    // allow empty value on 'search='
    if (search !== undefined) {
      delete req.query.where.search;
      if (search !== 0) {
        const keywords = fields.map((field) => {
          let keyword = {};
          const result = field.split(':');

          if (result.length > 1) {
            const [op, value] = result;

            if (['date', 'number'].includes(op)) {
              const [table, column] = value.split('.');
              keyword = db.Sequelize.where(db.Sequelize.literal(`"${table}"."${column}"::TEXT`), {
                [Op.iLike]: `%${search}%`,
              });
            }
          } else if (field.includes(',')) {
            keyword = where(literal(`CONCAT_WS(${field})`), { [Op.iLike]: `%${search}%` });
          } else {
            keyword = { [field]: { [Op.iLike]: `%${search}%` } };
          }

          return keyword;
        });
        req.query.where[Op.or] = keywords;
      }
    }
    next();
  };
};

module.exports = querySearch;
