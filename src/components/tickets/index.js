/* ************************************************************************** */
/* /src/components/tickets/index.js - Contiene las rutas y controladores de 
ticketsController.js. */
/* ************************************************************************** */
const CustomRouter = require('../../routes/router');
const ticketsController = require('./ticketsController/ticketsController');
const { validateTicketId } = require('../../utils/routes/routerParams');

class Tickets extends CustomRouter {
  constructor() {
    super(); // Set the base path for the routes
    this.setupRoutes();
  }

  setupRoutes() {
    // Middleware para manejar el parámetro mid
    this.router.param('tid', validateTicketId);
    const basePath = '/api/tickets'; // Almacena el prefijo de la ruta

    // Rutas para manejar los tickets
    this.get(`${basePath}/`, ['ADMIN'], ticketsController.getAllTickets);
    this.get(`${basePath}/:tid`, ['ADMIN'], ticketsController.getTicketById);
    this.post(`${basePath}/`, ['ADMIN'], ticketsController.addTicket);
    this.delete(`${basePath}/:tid`, ['ADMIN'], ticketsController.deleteTicket);
  }
}

module.exports = new Tickets();
