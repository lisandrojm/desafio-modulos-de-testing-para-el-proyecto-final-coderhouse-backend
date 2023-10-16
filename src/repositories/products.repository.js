/* ************************************************************************** */
/* /src/repositories/products.repository.js */
/* ************************************************************************** */

const { Product } = require('../models/products');
const BaseRepository = require('./base.repository');

class ProductsRepository extends BaseRepository {
  constructor() {
    super(Product);
  }
  async populateOwner(product) {
    try {
      await product.populate('owner');
      return product;
    } catch (error) {
      throw error; // Lanza la excepción para manejarla en el código que llama a esta función
    }
  }
}

module.exports = ProductsRepository;
