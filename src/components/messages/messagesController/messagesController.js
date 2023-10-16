/* ************************************************************************** */
/* /src/components/messages/messagesController/messagesController.js -  
controlador de los mensajes. */
/* ************************************************************************** */

const MessagesServices = require('../messagesServices/messagesServices');

class MessagesController {
  addUserMessage = async (req, res) => {
    const payload = req.body;
    return await MessagesServices.addUserMessage(payload, res);
  };
  getAllMessages = async (req, res) => {
    return await MessagesServices.getAllMessages(res);
  };
  deleteUserMessage = async (req, res) => {
    const { mid } = req.params;
    return await MessagesServices.deleteUserMessage(mid, res, req);
  };
}

module.exports = new MessagesController();
