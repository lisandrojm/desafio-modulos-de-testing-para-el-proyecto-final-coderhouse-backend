/* ************************************************************************** */
/* /src/components/users/index.js - Contiene las rutas y controladores de 
usersController.js. */
/* ************************************************************************** */

const CustomRouter = require('../../routes/router');
const usersController = require('./usersController/usersController');
const { validateUserId } = require('../../utils/routes/routerParams');

class UsersRoutes extends CustomRouter {
  constructor() {
    super();
    this.setupRoutes();
  }

  setupRoutes() {
    // Middleware para manejar los parámetros cid y pid
    this.router.param('uid', validateUserId);

    const basePath = '/api/session/useradmin'; // Almacena el prefijo de la ruta
    const basePathUsersPremium = '/api/users/premium'; // Almacena el prefijo de la ruta

    /* ************************************************************************************ */
    /* Sistema de autorización para delimitar el acceso a endpoints:*/
    /* ************************************************************************************ */

    /* ************************************************************************************ */
    /* Public */
    /* ************************************************************************************ */
    this.get(`${basePath}/`, ['PUBLIC'], usersController.getUsers);
    this.post(`${basePath}/recovery`, ['PUBLIC'], usersController.recoveryUser);
    this.post(`${basePath}/resetpass`, ['PUBLIC'], usersController.resetPass);
    this.get(`${basePath}/resetpassbyemail`, ['PUBLIC'], usersController.resetPassByEmail);
    /* ************************************************************************************ */
    /* Admin */
    /* ************************************************************************************ */
    this.post(`${basePath}/register`, ['PUBLIC'], usersController.addUser);
    this.get(`${basePath}/:uid`, ['ADMIN'], usersController.getUserById);
    this.put(`${basePath}/:uid`, ['ADMIN'], usersController.updateUser);
    this.delete(`${basePath}/:uid`, ['ADMIN'], usersController.deleteUser);
    /* ************************************************************************************ */
    /* Premium */
    /* ************************************************************************************ */
    this.put(`${basePathUsersPremium}/:uid`, ['PREMIUM'], usersController.updateUserPremium);
  }
}

module.exports = new UsersRoutes();
