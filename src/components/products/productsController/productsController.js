/* ************************************************************************** */
/* /src/components/products/productsController/productsController.js -  servicios de los productos. */
/* ************************************************************************** */

const ProductsServices = require('../productsServices/productsServices');

class ProductsController {
  getAllProducts = async (req, res) => {
    const { limit, page, sort, query } = req.query;
    return await ProductsServices.getAllProducts(limit, page, sort, query, res);
  };

  addProduct = async (req, res) => {
    const payload = req.body;
    const images = req.files;
    return await ProductsServices.addProduct(payload, images, res, req);
  };

  getProductById = async (req, res) => {
    const { pid } = req.params;
    return await ProductsServices.getProductById(pid, res);
  };

  updateProduct = async (req, res) => {
    const { pid } = req.params;
    const updateFields = req.body;
    return await ProductsServices.updateProduct(pid, updateFields, res, req);
  };

  deleteProduct = async (req, res) => {
    const { pid } = req.params;
    return await ProductsServices.deleteProduct(pid, res, req);
  };
  getProducts = async (req, res) => {
    const { limit, page, sort, query } = req.query;
    return await ProductsServices.getProducts(limit, page, sort, query, res);
  };

  getAdminProducts = async (req, res) => {
    const { limit, page, sort, query } = req.query;
    return await ProductsServices.getAdminProducts(limit, page, sort, query, res);
  };

  getRealTimeProducts = async (req, res) => {
    const { limit, page, sort, query } = req.query;
    return await ProductsServices.getRealTimeProducts(limit, page, sort, query, res);
  };
  getHomeProducts = async (req, res) => {
    const { limit, page, sort, query } = req.query;
    return await ProductsServices.getHomeProducts(limit, page, sort, query, res);
  };
}

module.exports = new ProductsController();
