/* ************************************************************************** */
/* /src/components/cookies/index.js - Contiene las rutas y controladores de  
cookiesController.js. */
/* ************************************************************************** */

const CustomRouter = require('../../routes/router'); // Assuming you have a CustomRouter defined similarly to the first code snippet
const cookiesController = require('./cookiesController/cookiesController');

class Cookies extends CustomRouter {
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
    this.get(`${basePath}/setsignedcookies`, ['ADMIN'], cookiesController.setSignedCookies);
    this.get(`${basePath}/getsignedcookies`, ['ADMIN'], cookiesController.getSignedCookies);
    this.get(`${basePath}/deletesignedcookies`, ['ADMIN'], cookiesController.deleteSignedCookies);
  }
}

module.exports = new Cookies();
