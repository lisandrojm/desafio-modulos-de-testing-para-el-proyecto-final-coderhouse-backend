/* ************************************************************************** */
/* /src/routes/router.js -  */
/* ************************************************************************** */
const jwt = require('jsonwebtoken');
const { config } = require('../config');
const { Router } = require('express');

class CustomRouter {
  constructor() {
    this.router = Router();
    this.init();
  }

  getRouter() {
    return this.router;
  }

  init() {}

  get(path, policies, ...callbacks) {
    this.router.get(path, this.generateCustomResponses, this.handlePolicies(policies), ...this.applyCallbacks(callbacks));
  }

  post(path, policies, ...callbacks) {
    this.router.post(path, this.generateCustomResponses, this.handlePolicies(policies), ...this.applyCallbacks(callbacks));
  }

  put(path, policies, ...callbacks) {
    this.router.put(path, this.generateCustomResponses, this.handlePolicies(policies), ...this.applyCallbacks(callbacks));
  }

  delete(path, policies, ...callbacks) {
    this.router.delete(path, this.generateCustomResponses, this.handlePolicies(policies), ...this.applyCallbacks(callbacks));
  }

  applyCallbacks(callbacks) {
    return callbacks.map((callback) => async (req, res, next) => {
      try {
        await callback(req, res, next);
        /*         console.log('~~~Callback~~~', callback); */
      } catch (error) {
        console.error(error);
        res.status(500).send(error);
      }
    });
  }
  generateCustomResponses = (req, res, next) => {
    res.sendSuccess = (payload) => res.status(200).json({ success: true, payload });
    res.sendServerError = (error) => res.status(500).json({ success: false, error });
    res.sendCreated = (payload) => res.status(201).json({ success: true, payload });
    res.sendUserError = (error) => res.status(400).json({ success: false, error });
    res.sendUnauthorized = (error) => res.status(401).json({ success: false, error });
    res.sendForbidden = (error) => res.status(403).json({ success: false, error });
    res.sendNotFound = (error) => res.status(404).json({ success: false, error });
    next();
  };

  handlePolicies = (policies) => async (req, res, next) => {
    if (policies[0] === 'PUBLIC') {
      /*       console.log('~~~"handlePolicies" (public) access allowed.~~~'); */
      return next();
    }

    const token = req.cookies.jwt;

    if (!token) {
      /*       console.log('No JWT token found.'); */

      if (req.user && policies.includes(req.user.role.toUpperCase())) {
        /*         console.log(`~~~"handlePolicies" Role (${req.user.role}) is allowed.~~~`); */
        return next();
      }

      /*       console.log('~~~"handlePolicies" Unauthorized: User role not allowed.~~~'); */

      // Redirecciones según el rol para sesiones
      if (req.user && req.user.role === 'admin') {
        return res.redirect('/admin');
      } else if (req.user && req.user.role === 'user') {
        return res.redirect('/user');
      }

      return res.redirect('/'); // Redirección genérica
    }

    try {
      let user = jwt.verify(token, config.jwt_secret);

      if (!policies.includes(user.role.toUpperCase())) {
        /*         console.log('~~~"handlePolicies" Forbidden: User role not allowed.~~~'); */

        // Redirecciones según el rol para JWT
        if (user.role === 'admin') {
          return res.redirect('/admin');
        } else if (user.role === 'user') {
          return res.redirect('/user');
        }

        return res.redirect('/'); // Redirección genérica
      }

      req.user = user;
      /*       console.log(`~~~"handlePolicies" Role (${req.user.role}) is allowed.~~~`); */
      next();
    } catch (error) {
      /*       console.log('~~~"handlePolicies" Unauthorized: JWT verification failed.~~~'); */

      if (error.name === 'JsonWebTokenError') {
        return res.redirect('/');
      }

      return res.sendServerError(error);
    }
  };
}

module.exports = CustomRouter;
