/* ************************************************************************** */
/* /src/components/logger/index.js */
/* ************************************************************************** */

const CustomRouter = require('../../routes/router');
const loggerController = require('./loggerController/loggerController');

class Logger extends CustomRouter {
  constructor() {
    super(); // Set the base path for the routes
    this.setupRoutes();
  }

  setupRoutes() {
    const basePath = '/loggertest'; // Almacena el prefijo de la ruta

    /* ************************************************************************************ */
    /* Sistema de autorización para delimitar el acceso a endpoints:*/
    /* ************************************************************************************ */

    // Rutas para manejar los
    /* ************************************************************************************ */
    /* ADMIN */
    /* ************************************************************************************ */
    this.get(`${basePath}/`, ['ADMIN'], loggerController.getLogger);
  }
}

module.exports = new Logger();
