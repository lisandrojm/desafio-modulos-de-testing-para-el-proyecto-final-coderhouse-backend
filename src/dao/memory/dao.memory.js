/* ************************************************************************** */
/* /src/dao/memory/dao.memory.js */
/* ************************************************************************** */
/* ************************************************************************** */
/* IMPORTANTE: Implementación simulada de persistencia en memoria funcional el 
testing de  FACTORY */ /* NO ES FUNCIONAL */
/* ************************************************************************** */
/* ************************************************************************** */

class MemoryDAO {
  constructor() {
    this.data = [];
    this.lastId = 0;
  }

  async findAll() {
    return this.data;
  }

  async create(data) {
    const newItem = { id: ++this.lastId, ...data };
    this.data.push(newItem);
    return newItem;
  }

  async findById(id) {
    return this.data.find((item) => item.id === id);
  }

  async findByIdAndUpdate(id, data) {
    const index = this.data.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.data[index] = { ...this.data[index], ...data };
      return this.data[index];
    }
    return null;
  }

  async findByIdAndDelete(id) {
    const index = this.data.findIndex((item) => item.id === id);
    if (index !== -1) {
      const deletedItem = this.data[index];
      this.data.splice(index, 1);
      return deletedItem;
    }
    return null;
  }

  async findOne(query) {
    return this.data.find((item) => {
      for (const key in query) {
        if (item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    });
  }

  async update(id, data) {
    const index = this.data.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.data[index] = { ...this.data[index], ...data };
      return this.data[index];
    }
    return null;
  }

  async save(data) {
    const newItem = { id: ++this.lastId, ...data };
    this.data.push(newItem);
    return newItem;
  }

  async delete(id) {
    const index = this.data.findIndex((item) => item.id === id);
    if (index !== -1) {
      const deletedItem = this.data[index];
      this.data.splice(index, 1);
      return deletedItem;
    }
    return null;
  }

  async countDocuments(query) {
    const filteredData = this.data.filter((item) => {
      for (const key in query) {
        if (item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    });

    return filteredData.length;
  }

  async paginate(query = {}, options = {}) {
    const { page = 1, limit = 10 } = options;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedData = this.data.slice(startIndex, endIndex);

    return {
      docs: paginatedData,
      page,
      limit,
      totalDocs: this.data.length,
    };
  }
}

module.exports = MemoryDAO;
