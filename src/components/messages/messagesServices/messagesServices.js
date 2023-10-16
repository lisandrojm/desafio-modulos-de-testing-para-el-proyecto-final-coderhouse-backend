/* ************************************************************************** */
/* /src/components/messages/messagesServices/messagesServices.js -
 controlador de los servicios. */
/* ************************************************************************** */

const { Message } = require('../../../models/messages');
/* Repository */
const { messagesServices } = require('../../../repositories/index');

class MessagesServices {
  addUserMessage = async (payload, res) => {
    try {
      const { user, message } = payload;
      const newMessage = new Message({
        user,
        message,
      });
      /* Repository */
      /*await newMessage.save(); */
      await messagesServices.save(newMessage);
      const data = newMessage;
      return res.sendSuccess({ message: 'Mensaje agregado correctamente', payload: data });
    } catch (error) {
      return res.sendServerError('Error al agregar el mensaje');
    }
  };

  getAllMessages = async (res) => {
    try {
      /* Repository */
      /* const messages = await Message.find(); */
      const messages = await messagesServices.findAll();
      const data = messages;
      return res.sendSuccess(data);
    } catch (error) {
      return res.sendServerError('Error al obtener los mensajes');
    }
  };

  deleteUserMessage = async (mid, res, req) => {
    try {
      /* Repository */
      /* const deletedMessage = await Message.findByIdAndDelete(mid); */
      const deletedMessage = await messagesServices.findByIdAndDelete(mid);

      if (!deletedMessage) {
        return res.sendNotFound('Mensaje no encontrado');
      } else {
        const data = deletedMessage;
        return res.sendSuccess({ message: 'Mensaje eliminado correctamente', payload: data });
      }
    } catch (error) {
      return res.sendServerError('Error al eliminar el mensaje');
    }
  };
}

module.exports = new MessagesServices();
