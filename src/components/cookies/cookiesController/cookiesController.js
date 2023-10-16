/* ************************************************************************** */
/* /src/components/auth/authController/authController.js - controlador de auth. */
/* ************************************************************************** */

const authServices = require('../cookiesServices/cookiesServices');

class CookiesController {
  setSignedCookies = async (req, res) => {
    return await authServices.setSignedCookies(req, res);
  };

  getSignedCookies = async (req, res) => {
    return await authServices.getSignedCookies(req, res);
  };

  deleteSignedCookies = async (req, res) => {
    return await authServices.deleteSignedCookies(req, res);
  };
}

module.exports = new CookiesController();
