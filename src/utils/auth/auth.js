/* ************************************************************************** */
/* /src/utils/auth/auth.js - Configuración de auth.js  (middleware de autenticación)
/* ************************************************************************** */

const authorization = (allowedRoles) => {
  return async (req, res, next) => {
    /*     console.log('Authorization middleware called.'); */

    if (!req.user) {
      /*       console.log('User not authenticated.'); */
      res.redirect('/');
      return res.status(401).send({ error: 'Unauthorized' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      /*       console.log('User does not have required role.', req.user.role); */

      if (req.user.role === 'admin') {
        return res.redirect('/admin');
      } else if (req.user.role === 'user') {
        return res.redirect('/user');
      }

      return res.status(403).send({ error: 'No permissions' });
    }

    /*     console.log('User has required role. Proceeding...'); */
    next();
  };
};

module.exports = {
  authorization,
};
