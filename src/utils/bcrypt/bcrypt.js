/* ************************************************************************** */
/* /src/utils/bcrypt/bcrypt.js - Configuración de bcrypt.js  ( algoritmo de 
    hashing de contraseñas)
/* ************************************************************************** */

const bcrypt = require('bcrypt');

const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password);

const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

module.exports = {
  isValidPassword,
  createHash,
};
