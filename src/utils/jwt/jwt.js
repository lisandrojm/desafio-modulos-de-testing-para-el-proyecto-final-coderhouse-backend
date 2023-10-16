/* ************************************************************************** */
/* /src/utils/jwt/jwt.js 
/* ************************************************************************** */

const jwt = require('jsonwebtoken');
const { config } = require('../../config');

const generateJwt = async (payload) => {
  try {
    const token = jwt.sign(payload, config.jwt_secret, {
      expiresIn: config.jwt_expires * 1000 || 6000000,
      algorithm: config.jwt_algorithm || 'HS256',
    });
    return token;
  } catch (error) {
    /*     console.log(`~~~~  generateJWT ~~ `, error); */
    return null;
  }
};

const verify = async (token) => {
  try {
    const certificated = jwt.verify(token, config.jwt_secret, {
      algorithm: [config.jwt_algorithm],
    });
    return certificated;
  } catch (error) {
    return null;
  }
};

const decode = async (token) => {
  try {
    const decodeToken = jwt.decode(token, config.jwt_secret, {
      algorithm: [config.jwt_algorithm],
    });
    return decodeToken;
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateJwt,
  verify,
  decode,
};
