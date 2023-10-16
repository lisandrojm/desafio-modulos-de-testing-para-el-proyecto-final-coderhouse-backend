/* ************************************************************************** */
/* /src/repositories/base.repository.js */
/* ************************************************************************** */

const Dao = require('../dao/factory');

class BaseRepository {
  constructor(model) {
    this.model = model;
    this.Dao = new Dao(model);
  }

  create = async (data) => {
    try {
      const newItem = await this.Dao.create(data);
      /*       console.log(`${this.model.modelName}Repository create running`); */
      return newItem;
    } catch (error) {
      throw error;
    }
  };

  findById = async (id) => {
    try {
      const item = await this.Dao.findById(id);
      if (!item) {
        /*         console.log(`${this.model.modelName} not found in repository`); */
        return null;
      }
      /*       console.log(`${this.model.modelName}Repository findById running`); */
      return item;
    } catch (error) {
      throw error;
    }
  };

  findByIdAndUpdate = async (id, data) => {
    try {
      const updatedItem = await this.Dao.findByIdAndUpdate(id, data);
      if (!updatedItem) {
        /*         console.log(`${this.model.modelName} not found in repository`); */
        return null;
      }
      /*       console.log(`${this.model.modelName}Repository findByIdAndUpdate running`); */
      return updatedItem;
    } catch (error) {
      throw error;
    }
  };

  findByIdAndDelete = async (id) => {
    try {
      const deletedItem = await this.Dao.findByIdAndDelete(id);
      if (!deletedItem) {
        /*         console.log(`${this.model.modelName} not found in repository`); */
        return null;
      }
      /*       console.log(`${this.model.modelName}Repository  findByIdAndDelete running`); */
      return deletedItem;
    } catch (error) {
      throw error;
    }
  };

  findOne = async (query) => {
    try {
      const item = await this.Dao.findOne(query);
      /*       console.log(`${this.model.modelName}Repository findOne running`); */
      return item;
    } catch (error) {
      throw error;
    }
  };

  findAll = async () => {
    try {
      const items = await this.Dao.findAll();
      /*       console.log(`${this.model.modelName}Repository findAll running`); */
      return items;
    } catch (error) {
      throw error;
    }
  };

  save = async (data) => {
    try {
      const saveItem = await this.Dao.save(data);
      /*       console.log(`${this.model.modelName}Repository save running`); */
      return saveItem;
    } catch (error) {
      throw error;
    }
  };

  countDocuments = async (query) => {
    try {
      const count = await this.Dao.countDocuments(query);
      /*       console.log(`${this.model.modelName}Repository countDocuments running`); */
      return count;
    } catch (error) {
      throw error;
    }
  };

  async paginate(query = {}, options = {}) {
    const { page = 1, limit = 10 } = options;

    const skip = (page - 1) * limit;

    const results = await this.model.find(query).skip(skip).limit(limit).exec();

    const totalDocs = await this.model.countDocuments(query);

    const totalPages = Math.ceil(totalDocs / limit);

    const hasPrevPage = page > 1;

    const hasNextPage = page < totalPages;

    const prevPage = hasPrevPage ? page - 1 : null;
    const nextPage = hasNextPage ? page + 1 : null;
    /*     console.log(`${this.model.modelName}Repository pagination running`); */
    return {
      docs: results,
      totalDocs,
      limit,
      totalPages,
      page,
      pagingCounter: (page - 1) * limit + 1,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
    };
  }
  deleteOne = async (query) => {
    try {
      const deletedItem = await this.Dao.deleteOne(query);
      if (deletedItem.deletedCount === 0) {
        /*         console.log(`${this.model.modelName} not found in repository`); */
        return null;
      }
      /*       console.log(`${this.model.modelName}Repository deleteOne running`); */
      return deletedItem;
    } catch (error) {
      throw error;
    }
  };
}

module.exports = BaseRepository;
