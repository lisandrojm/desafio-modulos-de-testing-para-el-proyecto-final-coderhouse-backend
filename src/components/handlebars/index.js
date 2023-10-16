/* ************************************************************************** */
/* /src/components/handlebars/index.js - Contiene las rutas y controladores de los
 de handlebarsController.js. */
/* ************************************************************************** */

/* Comentado por ser reemplazado por handelePolicies */
/* const passportCall = require('../../utils/passport/passportCall');
 const { authorization } = require('../../utils/auth/auth'); */

const CustomRouter = require('../../routes/router');
const handlebarsController = require('./handlebarsController/handlebarsController');
const { validateCartId } = require('../../utils/routes/routerParams');

class HandlebarsRoutes extends CustomRouter {
  constructor() {
    super();
    this.setupRoutes();
  }

  setupRoutes() {
    // Middleware para manejar los parámetros cid y pid
    this.router.param('cid', validateCartId);

    /* ************************************************************************************ */
    /* VIEWS */
    /* ************************************************************************************ */

    /* ************************************************************************************ */
    /* Sistema de autorización para delimitar el acceso a endpoints:*/
    /* ************************************************************************************ */

    /* ************************************************************************************ */
    /* Public */
    /* ************************************************************************************ */
    this.get('/', ['PUBLIC'], handlebarsController.getLogin);
    this.get('/register', ['PUBLIC'], handlebarsController.getRegister);
    this.get('/recovery', ['PUBLIC'], handlebarsController.getRecovery);
    this.get('/resetpassbyemail', ['PUBLIC'], handlebarsController.getResetPassByEmail);
    /*     this.get('/resetpass', ['PUBLIC'], handlebarsController.getResetPass); */
    this.get('/resetpass/:token', ['PUBLIC'], handlebarsController.getResetPass);
    this.get('/resetpassexpiredtoken', ['PUBLIC'], handlebarsController.getResetPassExpiredToken);

    /* ************************************************************************************ */
    /* User */
    /* ************************************************************************************ */
    /* Sólo el USER puede agregar productos a su carrito carrito. */
    this.get('/products', ['USER', 'PREMIUM'], handlebarsController.getProducts);
    this.get('/carts/:cid', ['USER', 'PREMIUM'], handlebarsController.getCartProductById);
    /* Sólo el USER puede acceder al perfil de usuario. */
    this.get('/user', ['USER', 'PREMIUM'], handlebarsController.getUser);
    /* Sólo el USER puede enviar mensajes al chat. */
    this.get('/chat', ['USER', 'PREMIUM'], handlebarsController.getChat);

    /* ************************************************************************************ */
    /* Admin */
    /* ************************************************************************************ */
    this.get('/admin', ['ADMIN', 'PREMIUM'], handlebarsController.getAdmin);
    /* Sólo el ADMIN puede crear, actualizar y eliminar productos. */
    this.get('/admin/products', ['ADMIN', 'PREMIUM'], handlebarsController.getAdminProducts);

    /* //////////////////////////////////// */
    /* Views de otros desafíos */
    this.get('/realtimeproducts', ['ADMIN', 'PREMIUM'], handlebarsController.getRealTimeProducts);
    this.get('/home', ['ADMIN', 'PREMIUM'], handlebarsController.getHomeProducts);

    /* ************************************************************************************ */
    /* USER/ADMIN */
    /* ************************************************************************************ */
    this.get('/current', ['USER', 'ADMIN', 'PREMIUM'], handlebarsController.getCurrent);
  }
}

module.exports = new HandlebarsRoutes();
