/* ************************************************************************** */
/* /src/components/sessions/index.js - Contiene las rutas y controladores de  
sessionsController.js. */
/* ************************************************************************** */

const CustomRouter = require('../../routes/router'); // Assuming you have a CustomRouter defined similarly to the first code snippet
const sessionsController = require('./sessionsController/sessionsController');

class SessionsRoutes extends CustomRouter {
  constructor() {
    super();
    this.setupRoutes();
  }

  setupRoutes() {
    const basePath = '/api/session'; // Almacena el prefijo de la ruta

    /* ************************************************************************************ */
    /* Sistema de autorización para delimitar el acceso a endpoints:*/
    /* ************************************************************************************ */

    /* ************************************************************************************ */
    /* Admin */
    /* ************************************************************************************ */
    this.get(`${basePath}/session`, ['ADMIN'], sessionsController.getSession);
    this.get(`${basePath}/deletesession`, ['ADMIN'], sessionsController.deleteSession);
  }
}

module.exports = new SessionsRoutes();
