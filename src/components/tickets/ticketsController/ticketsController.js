/* ************************************************************************** */
/* /src/components/tickets/ticketsController/ticketsController.js -  
controlador de los tickets. */
/* ************************************************************************** */
const TicketsServices = require('../ticketsServices/ticketsServices');

class TicketsController {
  getAllTickets = async (req, res) => {
    return await TicketsServices.getAllTickets(res);
  };

  getTicketById = async (req, res) => {
    const { tid } = req.params;
    return await TicketsServices.getTicketById(tid, res);
  };

  addTicket = async (req, res) => {
    const payload = req.body;
    return await TicketsServices.addTicket(payload, res);
  };

  deleteTicket = async (req, res) => {
    const { tid } = req.params;
    return await TicketsServices.deleteTicket(tid, res);
  };
}

module.exports = new TicketsController();
