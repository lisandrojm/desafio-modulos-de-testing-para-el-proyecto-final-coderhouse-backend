/* ************************************************************************** */
/* /src/components/mocking/mockingServices/mockingServices.js */
/* ************************************************************************** */

const faker = require('faker');
const { Product } = require('../../../models/products'); // Importa tu modelo de Producto
const { productsServices } = require('../../../repositories/index');

const NUM_FAKE_PRODUCTS = 100; // Ajusta la cantidad de productos falsos que deseas generar

class MockingServices {
  addMocking = async (res) => {
    try {
      const fakeProducts = []; // Creamos un array para almacenar los productos falsos

      for (let i = 0; i < NUM_FAKE_PRODUCTS; i++) {
        const fakeProduct = new Product({
          title: faker.commerce.productName(),
          description: limitDescriptionToFiveWords(faker.lorem.sentence()),
          code: faker.random.alphaNumeric(6),
          price: faker.datatype.number({ min: 1, max: 1000, precision: 0.01 }),
          stock: faker.datatype.number({ min: 0, max: 100 }),
          category: faker.commerce.department(),
        });

        await productsServices.save(fakeProduct);
        fakeProducts.push(fakeProduct); // Agregamos cada producto falso al array
      }

      const data = fakeProducts; // Asignamos fakeProducts a la variable data

      console.log('~~~ Productos creados con Faker ejecutando addMocking exitosamente ~~~');

      return res.sendSuccess({ message: 'Mensaje agregado correctamente', payload: data });
    } catch (error) {
      console.error('Error generando productos falsos:', error);
    }
  };
}

function limitDescriptionToFiveWords(description) {
  // Divide la descripción en palabras y selecciona las primeras 5 palabras
  const words = description.split(' ');
  return words.slice(0, 5).join(' ');
}

module.exports = new MockingServices();
