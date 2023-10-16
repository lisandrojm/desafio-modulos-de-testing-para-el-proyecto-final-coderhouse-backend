/* ************************************************************************** */
/* /src/components/auth/authController/authController.js - Controlador  de 
autenticación de usuarios. */
/* ************************************************************************** */

const authServices = require('../authServices/authServices');
const passport = require('passport');
const { config } = require('../../../config');
const jwt = require('jsonwebtoken');
class AuthController {
  /* ///////////////////////////////////// */
  /* Jwt */
  /* ///////////////////////////////////// */
  register = async (req, res) => {
    const payload = req.body;
    /*     console.log('register', payload); */

    return await authServices.register(req, payload, res);
  };

  login = async (req, res, next) => {
    let { email, password } = req.body;
    const isAdminLogin = email === config.admin_email && password === config.admin_password;

    const response = await authServices.login(req, { email, password, isAdminLogin });

    if (response.status === 200) {
      const { _id, email, role, first_name, last_name, age, cart } = response.response;
      const secretKey = config.jwt_secret;

      const tokenPayload = isAdminLogin ? { _id, email, admin: true, role, first_name, last_name, age, cart } : { _id, email, role, first_name, last_name, age, cart };

      const token = jwt.sign(tokenPayload, secretKey, { expiresIn: '24h' });

      res.cookie('jwt', token, { maxAge: 60 * 60 * 1000, httpOnly: true });

      const user = { _id, email, role, first_name, last_name, age, cart };

      response.user = user;
    }

    res.json(response);
  };

  current = async (req, res) => {
    return await authServices.current(req, res);
  };

  /*   //////////////////////////////////// */
  /*   Github Login */
  /*   //////////////////////////////////// */
  githubLogin = (req, res, next) => {
    passport.authenticate('github', { scope: ['user_email'] })(req, res, next);
  };

  githubCallback = (req, res, next) => {
    passport.authenticate('github', { failureRedirect: '/' })(req, res, next);
  };

  githubCallbackRedirect = (req, res) => {
    req.session.user = req.user;
    res.redirect('/products');
  };

  /* //////////////////////////////////// */
  /* Jwt & Session Logout */
  /* //////////////////////////////////// */
  logout = async (req, res) => {
    try {
      const logoutResult = await authServices.logout(req, res);
      if (logoutResult.success) {
        /*         console.log('Logout session and jwt success!'); */
        return res.redirect('/');
      } else {
        return res.sendUnauthorized(logoutResult);
      }
    } catch (err) {
      const response = { error: err.message || 'Error interno en el servidor' };
      return res.sendServerError(response);
    }
  };
}

module.exports = new AuthController();
