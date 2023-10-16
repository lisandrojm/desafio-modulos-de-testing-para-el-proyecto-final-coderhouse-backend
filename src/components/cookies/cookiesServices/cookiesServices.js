/* ************************************************************************** */
/* /src/components/cookies/cookiesServices/cookiesServices.js - servicio de auth. */
/* ************************************************************************** */

class CookiesServices {
  setSignedCookies = async (req, res) => {
    try {
      await res.cookie('SignedCookie', 'Esta es una cookie muy poderosa', { maxAge: 10000, signed: true });
      res.sendSuccess('SignedCookie firmada');
    } catch (error) {
      res.sendServerError('Error en setSignedCokies al configurar la cookie firmada');
    }
  };

  getSignedCookies = async (req, res, next) => {
    try {
      const signedCookie = req.signedCookies.SignedCookie;

      if (signedCookie) {
        res.sendSuccess(signedCookie);
      } else {
        res.sendNotFound('No se encontró la cookie firmada');
      }
    } catch (error) {
      res.sendServerError('Error en getSignedCookies al obtener la cookie');
    }
  };

  deleteSignedCookies = async (req, res) => {
    try {
      await res.clearCookie('SignedCookie');
      res.sendSuccess('SignedCookie eliminada');
    } catch (error) {
      res.sendServerError('Error en deleteSignedCookies al eliminar la cookie firmada');
    }
  };
}

module.exports = new CookiesServices();
