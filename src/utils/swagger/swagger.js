/* ************************************************************************** */
/* /src/utils/swagger/swagger.js */
/* ************************************************************************** */

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const options = {
  swaggerDefinition: {
    openapi: '3.0.1',
    info: {
      title: 'Freelo ECOM API',
      version: '1.0.0',
      description: 'API para administrar un ecommerce',
    },
  },
  apis: [path.join(__dirname, '..', '..', 'docs', '**', '**.yaml')],
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
