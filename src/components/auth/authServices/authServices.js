/* ************************************************************************** */
/* /src/components/auth/authServices/authServices.js -  servicios de los usuarios. */
/* ************************************************************************** */
const { User } = require('../../../models/users');
const JWTService = require('../../../utils/jwt/jwt');
const jwt = require('jsonwebtoken');
const { createHash, isValidPassword } = require('../../../utils/bcrypt/bcrypt');
const { Cart } = require('../../../models/carts');
const { config } = require('../../../config');
/* Repository */
const { cartsServices } = require('../../../repositories/index');
const { usersServices } = require('../../../repositories/index');
/*  Importar el objeto req configurado con el middleware para utilizar logger 
antes de la inicialización de la app */
const req = require('../../../utils/logger/loggerSetup');

class AuthServices {
  /* ///////////////////////////////////// */
  /* ///////////////////////////////////// */
  /* Jwt */
  register = async (req, payload, res) => {
    try {
      const { first_name, last_name, email, age, password, role } = payload;

      if (!first_name || !last_name || !email || !age || !password) {
        return res.sendServerError('Faltan campos obligatorios');
      }

      /* Repository */
      const existingUser = await usersServices.findOne({ email: email });

      if (existingUser) {
        return res.sendUserError('Ya existe un usuario con el mismo correo electrónico');
      }

      const newUser = new User({
        first_name,
        last_name,
        email,
        age,
        password: createHash(password),
        role,
      });

      /* Utilización de DTO de  /src/repositories/users.repository.js   */
      const savedUser = await usersServices.createUserDTO(newUser);

      const userCart = new Cart({
        user: savedUser._id,
        products: [],
      });

      /* Repository */
      await cartsServices.save(userCart);

      savedUser.cart = userCart._id;
      await savedUser.save();

      const data = newUser;
      const token = await JWTService.generateJwt({ id: savedUser._id });

      /* Repository */
      /*       let updatedUser = await usersServices.findByIdAndUpdate(savedUser._id, { token }, { new: true }); */
      /*       console.log('~~~User registrado~~~', updatedUser); */

      /*Logger */
      /*       req.logger.debug(`User registrado: ${JSON.stringify(updatedUser, null, 2)}`); */

      return res.sendCreated({
        payload: {
          message: 'Usuario agregado correctamente',
          token,
          data,
        },
      });
    } catch (error) {
      /*Logger */
      req.logger.error('Error al agregar el usuario');
      return res.sendServerError('Error al agregar el usuario');
    }
  };

  login = async (req, { email, password, isAdminLogin }) => {
    try {
      if (isAdminLogin) {
        const adminUser = {
          email: config.admin_email,
          admin: true,
          role: 'admin',
        };
        /* console.log('admin', adminUser); */
        return { status: 200, success: true, response: adminUser, isAdminLogin: true };
      } else {
        /* Repository */
        let user = await usersServices.findOne({
          email: email,
        });
        if (!user) {
          /* console.log('~~~El usuario no existe en la base de datos!~~~'); */
          req.logger.debug('El usuario no existe en la base de datos');
          return { status: 401, success: false, response: 'El usuario no existe en la base de datos!' };
        }

        if (!isValidPassword(password, user)) {
          /*           console.log('~~~Credenciales inválidas~~~'); */
          /*Logger */
          req.logger.debug('Credenciales inválidas');
          return { status: 403, success: false, response: 'Credenciales inválidas' };
        }

        /* console.log('~~~Login jwt success!~~~', user); */
        /*Logger */
        /*         req.logger.debug('Login jwt success'); */
        return { status: 200, success: true, response: user, isAdminLogin: false };
      }
    } catch (error) {
      /* console.log(error); */
      /*Logger */
      req.logger.error('Error en el servidor durante el login');
      return { status: 500, success: false, response: 'Error en el servidor durante el login' };
    }
  };

  current = async (req, res) => {
    try {
      const cookie = req.cookies['jwt'];

      if (!cookie) {
        return res.sendUnauthorized('Token no proporcionado');
      }

      const user = jwt.verify(cookie, config.jwt_secret);

      const data = user;
      return res.sendSuccess({
        payload: {
          message: 'Token obtenido correctamente',
          data,
        },
      });
    } catch (error) {
      return res.sendUnauthorized('Token no válido');
    }
  };

  /* //////////////////////////////////// */
  /* Jwt & Session Logout */
  /* //////////////////////////////////// */
  logout = async (req, res) => {
    try {
      res.clearCookie('jwt');
      await new Promise((resolve, reject) => {
        req.session.destroy((err) => {
          if (err) {
            const response = { status: 500, success: false, error: err };
            req.logoutResult = response;
            reject(response);
          } else {
            const response = { status: 200, success: true, message: 'Logout exitoso' };
            req.logoutResult = response;
            resolve(response);
          }
          /*          console.log('Logout Session success'); */
          /*Logger */
          req.logger.debug('Logout success');
        });
      });

      return req.logoutResult;
    } catch (err) {
      /*Logger */
      req.logger.error('Error durante el logout');
      const response = { status: 500, success: false, error: 'Error durante el logout' };
      req.logoutResult = response;
      return response;
    }
  };
}

module.exports = new AuthServices();
