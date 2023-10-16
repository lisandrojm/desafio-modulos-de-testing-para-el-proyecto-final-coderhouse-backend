/* ************************************************************************** */
/* /src/components/sessions/sessionsServices/sessionsServices.js - servicio de sessions. */
/* ************************************************************************** */

class SessionsServices {
  getSession = async (req, res) => {
    try {
      if (req.session.counter) {
        req.session.counter++;
        return res.sendSuccess(`Se ha visitado el sitio ${req.session.counter} veces.`);
      } else {
        req.session.counter = 1;
        return res.sendSuccess('Bienvenido!');
      }
    } catch (error) {
      return res.sendServerError('Error en getSession al obtener la session');
    }
  };

  deleteSession = async (req, res) => {
    try {
      req.session.destroy((err) => {
        if (!err) {
          return res.sendSuccess('Logout Ok!');
        } else {
          return res.sendServerError('Logout ERROR', err);
        }
      });
    } catch (error) {
      return res.sendServerError('Error en deleteSession al eliminar la session');
    }
  };
}

module.exports = new SessionsServices();
