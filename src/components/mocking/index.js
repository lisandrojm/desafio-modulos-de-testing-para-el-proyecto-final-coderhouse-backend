/* ************************************************************************** */
/* /src/components/mocking/index.js */
/* ************************************************************************** */

const CustomRouter = require('../../routes/router');
const mockingController = require('./mockingController/mockingController');

class Mocking extends CustomRouter {
  constructor() {
    super(); // Establece el prefijo de la ruta base para las rutas
    this.setupRoutes();
  }

  setupRoutes() {
    const basePath = '/mockingproducts'; // Almacena el prefijo de la ruta

    // Rutas para manejar mocking
    this.post(`${basePath}/`, ['ADMIN'], mockingController.addMocking);
  }
}

module.exports = new Mocking();
