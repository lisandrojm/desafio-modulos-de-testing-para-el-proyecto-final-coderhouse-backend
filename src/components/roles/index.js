/* ************************************************************************** */
/* /src/components/roles/index.js - Contiene las rutas y controladores de  
rolesController.js. */
/* ************************************************************************** */

const CustomRouter = require('../../routes/router');
const rolesController = require('./rolesController/rolesController');

class RolesRoutes extends CustomRouter {
  constructor() {
    super();
    this.setupRoutes();
  }

  setupRoutes() {
    const basePath = '/api/sessions'; // Almacena el prefijo de la ruta

    /* ************************************************************************************ */
    /* Sistema de autorización para delimitar el acceso a endpoints:*/
    /* ************************************************************************************ */

    /* ************************************************************************************ */
    /* Admin */
    /* ************************************************************************************ */
    this.get(`${basePath}/admintest`, ['ADMIN'], rolesController.getAdmin);
    this.get(`${basePath}/usertest`, ['ADMIN'], rolesController.getUser);
  }
}

module.exports = new RolesRoutes();
