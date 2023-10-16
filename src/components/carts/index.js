/* ************************************************************************** */
/* /src/components/carts/index.js - Contiene las rutas y controladores de  
cartsController.js. */
/* ************************************************************************** */

const CustomRouter = require('../../routes/router');
const cartsController = require('./cartsController/cartsController');
const { validateCartId, validateProductId } = require('../../utils/routes/routerParams');

class Carts extends CustomRouter {
  constructor() {
    super();
    this.setupRoutes();
  }

  setupRoutes() {
    // Middleware para manejar los parámetros cid y pid
    this.router.param('cid', validateCartId);
    this.router.param('pid', validateProductId);

    const basePath = '/api/carts'; // Almacena el prefijo de la ruta

    /* ************************************************************************************ */
    /* Sistema de autorización para delimitar el acceso a endpoints:*/
    /* ************************************************************************************ */

    /* ************************************************************************************ */
    /* Public */
    /* ************************************************************************************ */
    this.get(`${basePath}/`, ['ADMIN', 'PREMIUM'], cartsController.getCarts);
    this.post(`${basePath}/`, ['ADMIN'], cartsController.addCart);
    this.get(`${basePath}/:cid`, ['ADMIN'], cartsController.getCartProductById);

    /* ************************************************************************************ */
    /* User */
    /* ************************************************************************************ */
    /* Sólo el USER puede agregar productos a su carrito carrito. */
    this.post(`${basePath}/:cid/product/:pid`, ['USER', 'PREMIUM'], cartsController.addProductToCart);
    this.put(`${basePath}/:cid/product/:pid`, ['USER', 'PREMIUM'], cartsController.updateProductQuantity);
    /* ************************************************************************************ */
    /* Nueva ruta purchase */
    this.post(`${basePath}/:cid/purchase`, ['USER', 'PREMIUM'], cartsController.purchaseCart);
    this.post(`${basePath}/:cid/purchasecart`, ['USER', 'PREMIUM'], cartsController.purchaseCartMail);

    /* ************************************************************************************ */
    /* Admin */
    /* ************************************************************************************ */
    this.delete(`${basePath}/:cid`, ['ADMIN'], cartsController.deleteCart);
    this.delete(`${basePath}/:cid/product/:pid`, ['ADMIN'], cartsController.deleteProductFromCart);
    this.put(`${basePath}/:cid`, ['ADMIN'], cartsController.updateCart);
    this.delete(`${basePath}/:cid/products`, ['ADMIN'], cartsController.deleteAllProductsFromCart);
  }
}

module.exports = new Carts();
