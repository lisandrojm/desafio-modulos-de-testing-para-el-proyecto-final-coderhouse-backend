/* ************************************************************************** */
/* /src/components/mailer/index.js */
/* ************************************************************************** */

const CustomRouter = require('../../routes/router');
const smsController = require('./smsController/smsController');
/* const { validateMessageId } = require('../../utils/routes/routerParams'); */

class smsRoutes extends CustomRouter {
  constructor() {
    super();
    this.setupRoutes();
  }

  setupRoutes() {
    // Middleware para manejar el parámetro eid
    /* this.router.param('eid', validateMessageId); */

    const basePath = '/sms'; // Almacena el prefijo de la ruta

    /* ************************************************************************************ */
    /* Sistema de autorización para delimitar el acceso a endpoints:*/
    /* ************************************************************************************ */

    // Rutas para manejar los mensajes
    /* ************************************************************************************ */
    /* Admin */
    /* ************************************************************************************ */
    this.post(`${basePath}/`, ['ADMIN'], smsController.sendSms);
  }
}

module.exports = new smsRoutes();
