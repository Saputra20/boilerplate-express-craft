const { addPageMetadata } = require('../common');

class BaseService {
  constructor(model) {
    if (this.constructor === BaseService) {
      throw new Error("Can't instantiate abstract class!");
    }
    this.model = model;
  }

  /**
   * find by id
   * @param {number} id
   * @returns {model}
   */
  async findById(id) {
    return this.model.findOne({ where: { id } });
  }

  /**
   * find one
   * @param {import('sequelize').FindOptions} options
   * @returns {model | null}
   */
  async findOne(options) {
    return this.model.findOne({ ...options });
  }

  /**
   * find all with pagination
   * @param {import('sequelize').FindAndCountOptions} options
   * @returns {{ rows: model[]; count: Number }}
   */
  async findAll(options) {
    return this.model
      .findAndCountAll({ ...options })
      .then((data) => addPageMetadata(data, options));
  }

  /**
   * find all
   * @param {import('sequelize').FindOptions} options
   * @returns {model[]}
   */
  async findAllWithoutPaginate(options) {
    return this.model.findAll({ ...options });
  }

  /**
   * find or create data
   * @param {import('sequelize').FindOrCreateOptions} options
   * @returns {[model, boolean]}
   */
  async findOrCreate(options) {
    return this.model.findOrCreate({ where: { ...options } });
  }

  /**
   *
   * @param {model} data
   * @param {import('sequelize').Optional | import('sequelize').Options} options
   * @returns {model}
   */
  async create(data, options) {
    return this.model.create(data, { ...options });
  }

  /**
   * update data by id
   * @param {number} id
   * @param {model} data
   * @returns {model | null}
   */
  async update(id, data) {
    const userFind = await this.model.findOne({ where: { id } });
    if (!userFind) return null;
    return userFind.update(data);
  }

  /**
   * update data
   * @param {import('sequelize').UpdateOptions} options
   * @param {model} data
   * @returns {model | null}
   */
  async updateWhere(options, data) {
    const userFind = await this.model.findOne({ where: { ...options } });
    if (!userFind) return null;
    return userFind.update(data);
  }

  /**
   * update many data
   * @param {model} data
   * @param {import('sequelize').UpdateOptions} options
   * @returns {[affectedCount: number, affectedRows: model[]]}
   */
  async updateMany(data, options) {
    return this.model.update(data, { ...options });
  }

  /**
   * delete data by id
   * @param {number} id
   * @returns {model}
   */
  async destroy(id) {
    const userFind = await this.model.findOne({ where: { id } });
    if (!userFind) return null;
    return userFind.destroy();
  }

  /**
   * delete many data
   * @param {import('sequelize').DestroyOptions} options
   * @returns {number}
   */
  async destroyMany(options) {
    return this.model.destroy({ ...options });
  }
}

module.exports = BaseService;
