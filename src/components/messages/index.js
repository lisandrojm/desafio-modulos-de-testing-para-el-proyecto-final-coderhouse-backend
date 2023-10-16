/* ************************************************************************** */
/* /src/components/messages/index.js - Contiene las rutas y controladores de 
messagesController.js. */
/* ************************************************************************** */

const CustomRouter = require('../../routes/router');
const messagesController = require('./messagesController/messagesController');
const { validateMessageId } = require('../../utils/routes/routerParams');

class Messages extends CustomRouter {
  constructor() {
    super(); // Set the base path for the routes
    this.setupRoutes();
  }

  setupRoutes() {
    // Middleware para manejar el parámetro mid
    this.router.param('mid', validateMessageId);

    const basePath = '/api/chat'; // Almacena el prefijo de la ruta

    /* ************************************************************************************ */
    /* Sistema de autorización para delimitar el acceso a endpoints:*/
    /* ************************************************************************************ */

    // Rutas para manejar los mensajes
    /* ************************************************************************************ */
    /* User */
    /* ************************************************************************************ */
    /* Sólo el USER puede agregar productos a su carrito carrito. */
    this.post(`${basePath}/`, ['USER'], messagesController.addUserMessage);
    /* ************************************************************************************ */
    /* Admin */
    /* ************************************************************************************ */
    this.get(`${basePath}/`, ['ADMIN'], messagesController.getAllMessages);
    this.delete(`${basePath}/:mid`, ['ADMIN'], messagesController.deleteUserMessage);
  }
}

module.exports = new Messages();
