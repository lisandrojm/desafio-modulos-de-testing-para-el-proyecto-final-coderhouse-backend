/* ************************************************************************** */
/* /src/dao/mongo/dao.mongo.js */
/* ************************************************************************** */
const mongoose = require('mongoose');
class MongoDAO {
  constructor(model) {
    this.model = model;
  }

  create = async (data) => {
    try {
      const document = new this.model(data);
      const result = await document.save();
      return result;
    } catch (error) {
      throw `Error en MongoDAO create: ${error.message}`;
    }
  };

  findById = async (id, populateOptions = {}) => {
    try {
      const query = this.model.findById(id);
      if (populateOptions.path) {
        query.populate(populateOptions);
      }
      const result = await query.exec();
      return result;
    } catch (error) {
      throw `Error en MongoDAO findById: ${error.message}`;
    }
  };

  findByIdAndUpdate = async (id, data, populateOptions = {}) => {
    try {
      const query = this.model.findByIdAndUpdate(id, data, { new: true });
      if (populateOptions.path) {
        query.populate(populateOptions);
      }
      const result = await query.exec();
      return result;
    } catch (error) {
      throw `Error en MongoDAO findByIdAndUpdate: ${error.message}`;
    }
  };

  findByIdAndDelete = async (id, populateOptions = {}) => {
    try {
      let query = this.model.findByIdAndDelete(id);

      if (populateOptions.path) {
        query = query.populate(populateOptions);
      }

      const result = await query.exec();
      return result;
    } catch (error) {
      throw `Error en MongoDAO findByIdAndDelete: ${error.message}`;
    }
  };

  findOne = async (query = {}, populateOptions = {}) => {
    try {
      const findOneQuery = this.model.findOne(query);
      if (populateOptions.path) {
        findOneQuery.populate(populateOptions);
      }
      const result = await findOneQuery.exec();
      return result;
    } catch (error) {
      throw `Error en MongoDAO findOne: ${error.message}`;
    }
  };

  findAll = async (query = {}, options = {}, populateOptions = {}) => {
    try {
      const findQuery = this.model.find(query, null, options);
      if (populateOptions.path) {
        findQuery.populate(populateOptions);
      }
      const result = await findQuery.exec();
      return result;
    } catch (error) {
      throw `Error en MongoDAO findAll: ${error.message}`;
    }
  };

  save = async (data, populateOptions = {}) => {
    try {
      const document = new this.model(data);

      if (populateOptions.path) {
        await document.populate(populateOptions).execPopulate();
      }

      const result = await document.save();
      return result;
    } catch (error) {
      throw `Error en MongoDAO save: ${error.message}`;
    }
  };

  countDocuments = async (query = {}, populateOptions = {}) => {
    try {
      let countQuery = this.model.countDocuments(query);

      if (populateOptions.path) {
        countQuery = countQuery.populate(populateOptions);
      }

      const count = await countQuery.exec();
      return count;
    } catch (error) {
      throw `Error en MongoDAO countDocuments: ${error.message}`;
    }
  };

  paginate = async (query = {}, options = {}) => {
    try {
      const { page = 1, limit = 10 } = options;
      const skip = (page - 1) * limit;

      const findQuery = this.model.find(query).skip(skip).limit(limit);
      const result = await findQuery.exec();

      const paginationData = {
        docs: result,
        page: page,
        limit: limit,
        totalDocs: result.length,
      };

      return paginationData;
    } catch (error) {
      throw `Error in MongoDAO paginateData: ${error.message}`;
    }
  };
  deleteOne = async (query) => {
    try {
      const result = await this.model.deleteOne(query);
      return result;
    } catch (error) {
      throw `Error en MongoDAO deleteOne: ${error.message}`;
    }
  };
}

module.exports = MongoDAO;
