/* ************************************************************************** */
/* /src/components/carts/cartsController/cartsController.js - controlador de los carritos. */
/* ************************************************************************** */

const cartsServices = require('../cartsServices/cartsServices');

class CartsController {
  getCarts = async (req, res) => {
    return await cartsServices.getCarts(res);
  };
  addCart = async (req, res) => {
    return await cartsServices.addCart(res);
  };

  getCartProductById = async (req, res) => {
    const { cid } = req.params;
    return await cartsServices.getCartProductById(cid, res);
  };

  addProductToCart = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    return await cartsServices.addProductToCart(cid, pid, quantity, res, req);
  };

  deleteCart = async (req, res) => {
    const { cid } = req.params;
    return await cartsServices.deleteCart(cid, res);
  };

  deleteProductFromCart = async (req, res) => {
    const { cid, pid } = req.params;
    return await cartsServices.deleteProductFromCart(cid, pid, res);
  };

  updateCart = async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body;
    await cartsServices.updateCart(cid, products, res);
  };

  updateProductQuantity = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    await cartsServices.updateProductQuantity(cid, pid, quantity, res);
  };

  deleteAllProductsFromCart = async (req, res) => {
    const { cid } = req.params;
    await cartsServices.deleteAllProductsFromCart(cid, res);
  };

  purchaseCart = async (req, res) => {
    const { cid } = req.params;
    await cartsServices.purchaseCart(cid, req, res);
  };

  purchaseCartMail = async (req, res) => {
    const { cid } = req.params;
    await cartsServices.purchaseCartMail(cid, req, res);
  };
}

module.exports = new CartsController();
