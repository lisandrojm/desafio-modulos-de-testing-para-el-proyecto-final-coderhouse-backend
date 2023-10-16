/* ************************************************************************** */
/* /src/components/users/usersServices/usersServices.js -
 controlador de los usuarios. */
/* ************************************************************************** */

const { User } = require('../../../models/users');
const { Cart } = require('../../../models/carts');
const { createHash } = require('../../../utils/bcrypt/bcrypt');
/* Repository */
const { usersServices } = require('../../../repositories/index');
const { cartsServices } = require('../../../repositories/index');
/* ************************************************************************** */
/* test customError */
/* ************************************************************************** */
const CustomError = require('../../../utils/errors/services/customError');
const EErrors = require('../../../utils/errors/services/enums');
const { generateUserErrorInfo } = require('../../../utils/errors/services/info');
/* ************************************************************************** */
const MailManager = require('../../../utils/mailManager/mailManager');
const path = require('path');
const { config } = require('../../../config');
const PORT = `${config.port}`;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class UsersServices {
  /* ////////////////////////////////////////// */
  /* Jwt */
  /* ////////////////////////////////////////// */

  getUsers = async (res) => {
    try {
      /* Repository */
      const users = await usersServices.findAll();
      const data = users;
      return res.sendSuccess({ message: 'Todos los usuarios', payload: data });
    } catch (error) {
      return res.sendServerError('Error al obtener los usuarios');
    }
  };

  addUser = async (payload, res) => {
    try {
      const { first_name, last_name, age, email, password } = payload;
      /*     if (!first_name || !last_name || !email || !age || !password) {
        return res.sendServerError('Faltan campos obligatorios');
      } */
      /* ************************************************************************** */
      /* test customError */
      /* ************************************************************************** */
      if (!first_name || !last_name || !email) {
        console.log('entra al bloque');
        try {
          CustomError.createError({
            name: 'User creation error',
            cause: generateUserErrorInfo({ first_name, last_name, age, email, password }),
            message: 'Error Trying to create User',
            code: EErrors.INVALID_TYPES_ERROR,
          });
        } catch (error) {
          console.error('Ocurrió un error en CustomError:', error);
        }
        return res.sendServerError('Faltan campos obligatorios del Usuario');
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
      });

      /* Repository */
      await usersServices.save(newUser);

      const userCart = new Cart({
        user: newUser._id,
        products: [],
      });

      /* Repository */
      await cartsServices.save(userCart);

      newUser.cart = userCart._id;

      const data = newUser;

      return res.sendCreated({ message: 'Usuario agregado correctamente', payload: data });
    } catch (error) {
      return res.sendServerError('Error al agregar el usuario');
    }
  };

  recoveryUser = async ({ email, password, res }) => {
    try {
      /* Repository */
      let user = await usersServices.findOne({
        email: email,
      });

      if (!user) {
        return res.sendUnauthorized('El usuario no existe en la base de datos');
      }

      /* Repository */
      let data = await usersServices.findByIdAndUpdate(user._id, { password: createHash(password) }, { new: true });

      return res.sendSuccess({ message: 'Contraseña actualizada correctamente', payload: data });
    } catch (error) {
      return res.sendServerError('Error al recuperar la contraseña');
    }
  };

  getUserById = async (uid, res) => {
    try {
      /* Repository */
      const user = await usersServices.findById(uid);

      if (!user) {
        return res.sendNotFound('Usuario no encontrado');
      }

      const data = user;

      return res.sendSuccess({ message: 'Usuario obtenido correctamente', payload: data });
    } catch (error) {
      return res.sendServerError('Error al obtener el usuario');
    }
  };

  updateUser = async (uid, updateFields, res, req) => {
    try {
      const allowedFields = ['first_name', 'last_name', 'email', 'age', 'password', 'role'];

      const invalidFields = Object.keys(updateFields).filter((field) => !allowedFields.includes(field));

      if (invalidFields.length > 0) {
        return res.sendUserError(`Los siguientes campos no se pueden modificar: ${invalidFields.join(', ')}`);
      }

      // Validar si el campo 'role' existe en los campos de actualización
      if (updateFields.hasOwnProperty('role')) {
        // Verificar si el valor de 'role' es uno de los valores permitidos
        if (!['admin', 'user', 'premium'].includes(updateFields.role)) {
          return res.sendUserError('El campo "role" solo puede cambiar a "admin", "user" o "premium"');
        }
      }

      /* Repository */
      const updatedUser = await usersServices.findByIdAndUpdate(uid, updateFields, { new: true });

      if (!updatedUser) {
        return res.sendNotFound('Usuario no encontrado');
      }

      req.app.io.emit('updateUser', updatedUser);

      const data = updatedUser;

      return res.sendSuccess({ message: 'Usuario actualizado correctamente', payload: data });
    } catch (error) {
      return res.sendServerError('Error al actualizar el usuario');
    }
  };

  deleteUser = async (uid, res, req) => {
    try {
      /* Repository */
      const deletedUser = await usersServices.findByIdAndDelete(uid);

      if (!deletedUser) {
        return res.sendNotFound('Usuario no encontrado');
      }

      req.app.io.emit('deleteUser', uid);
      const data = deletedUser;
      return res.sendSuccess({ message: 'Usuario eliminado correctamente', payload: data });
    } catch (error) {
      return res.sendServerError('Error al eliminar el usuario');
    }
  };

  resetPass = async ({ email, password, res, req }) => {
    try {
      // Buscar al usuario por correo electrónico
      const user = await usersServices.findOne({ email });

      if (!user) {
        req.logger.info('Usuario no encontrado');
        return res.sendNotFound('Usuario no encontrado');
      }

      // Comprobar si la contraseña proporcionada coincide con la almacenada en la base de datos
      const passwordMatch = bcrypt.compareSync(password, user.password);

      if (passwordMatch) {
        req.logger.info('La nueva contraseña es la misma que la contraseña actual.');
        return res.sendUserError('La nueva contraseña es la misma que la contraseña actual. No se puede colacar la misma contraseña.');
      }

      // Actualizar la contraseña solo si es diferente
      const newPasswordHash = createHash(password);
      // Actualizar la contraseña en la base de datos
      let data = await usersServices.findByIdAndUpdate(user._id, { password: newPasswordHash }, { new: true });

      req.logger.info('Contraseña actualizada');
      return res.sendSuccess({ message: 'Contraseña actualizada correctamente', payload: data });
    } catch (error) {
      req.logger.error('Error al recuperar la contraseña');
      return res.sendServerError('Error al recuperar la contraseña');
    }
  };

  resetPassByEmail = async (email, res, req) => {
    try {
      // Buscar al usuario por correo electrónico
      const user = await usersServices.findOne({ email });

      /*       req.logger.debug('resetPassByEmail', user); */

      if (!user) {
        return res.sendNotFound('Usuario no encontrado');
      }

      const username = user.email;
      const resetPasswordToken = jwt.sign({ userId: user._id }, config.jwt_secret, {
        expiresIn: '1h', // Token expira después de 1 hora
      });

      // Crear la URL de restablecimiento de contraseña
      const resetPasswordLink = `http://localhost:${PORT}/resetpass/${resetPasswordToken}`;

      // Contenido del correo electrónico
      const emailContent = `
      <h1>Reestablezca su contraseña</h1>
      <p>Username: ${username}</p>
      <p>Acceda <a href="${resetPasswordLink}">aquí</a> para reestablecer su contraseña.</p>
      <!-- Agrega cualquier otra información que desees en el correo -->
    `;

      // Configuración del correo electrónico
      const attachments = [
        {
          filename: 'freelo.png',
          path: path.join(__dirname, '../../../uploads/mail/freelo.png'),
        },
      ];

      const emailPayload = {
        from: 'lisandrojm@gmail.com',
        to: user.email,
        subject: 'FreeloECOM - Reestablecimiento de contraseña',
        html: emailContent,
        attachments,
      };

      // Enviar el correo electrónico
      await MailManager.sendEmail(emailPayload);

      const data = emailPayload;

      // Guardar el token en una cookie con el nombre 'resetPasswordToken'
      res.cookie('resetPasswordToken', resetPasswordToken, { maxAge: 3600000 }); // Cookie expira en 1 hora (3600000 ms)

      req.logger.info('Mail de reestablecimiento de contraseña enviado correctamente');
      return res.sendSuccess({
        payload: {
          message: 'Mail de reestablecimiento de contraseña enviado correctamente',
          data,
        },
      });
    } catch (error) {
      req.logger.error('Error al reestablecer la contraseña y enviar el correo electrónico');
      return res.sendServerError('Error al reestablecer la contraseña y enviar el correo electrónico');
    }
  };
  updateUserPremium = async (uid, updateFields, res, req) => {
    try {
      const allowedFields = ['role'];
      // Verificar si el campo 'role' existe en updateFields y si su valor es 'user' o 'premium'
      if (updateFields.hasOwnProperty('role') && !['user', 'premium'].includes(updateFields.role)) {
        return res.sendUserError('Eres un user premium. El campo role solo puedes cambiarlo a user o premium');
      }

      const invalidFields = Object.keys(updateFields).filter((field) => !allowedFields.includes(field));

      if (invalidFields.length > 0) {
        return res.sendUserError(`Los siguientes campos no se pueden modificar: ${invalidFields.join(', ')}`);
      }

      /* Repository */
      const updatedUser = await usersServices.findByIdAndUpdate(uid, updateFields, { new: true });

      if (!updatedUser) {
        return res.sendNotFound('Usuario no encontrado');
      }

      req.app.io.emit('updateUser', updatedUser);

      const data = updatedUser;

      return res.sendSuccess({ message: 'Role de user actualizado correctamente', payload: data });
    } catch (error) {
      return res.sendServerError('Error al actualizar el usuario');
    }
  };
}

module.exports = new UsersServices();
