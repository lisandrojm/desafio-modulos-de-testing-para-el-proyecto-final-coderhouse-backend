/* ************************************************************************** */
/* /src/utils/passport/passport.js 
/* ************************************************************************** */
const passport = require('passport');

const passportCall = (strategy) => {
  return async (req, res, next) => {
    // Verificar si el usuario ha iniciado sesión con express-session
    if (req.isAuthenticated()) {
      return next();
    }

    passport.authenticate(strategy, function (err, user, info) {
      if (err) {
        console.error('Error en autenticación con passportCall:', err);
        return next(err);
      }
      if (!user) {
        /*         console.log('Usuario no autenticado con passportCall:', info.messages ? info.messages : info.toString()); */
        return res.status(401).send({ error: info.messages ? info.messages : info.toString() });
      }
      req.user = user;
      /*       console.log('Usuario autenticado con passportCall:', user); */
      next();
    })(req, res, next);
  };
};

module.exports = passportCall;
