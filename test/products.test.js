/* ************************************************************************** */
/* /test/products.test.js */
/* ************************************************************************** */

const { app } = require('../src/index');
const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const req = require('../src/utils/logger/loggerSetup');
const { productsServices } = require('../src/repositories/index');

const getRandomEmail = () => {
  return `user${Math.floor(Math.random() * 10000)}@example.com`;
};

const registerUser = async (user) => {
  return request(app).post('/api/session/auth/register').send(user);
};

const loginUser = async (credentials) => {
  return request(app).post('/api/session/auth/login').send(credentials);
};

const createProduct = async (cookie, product) => {
  return request(app).post('/api/products').send(product).set('Cookie', `jwt=${cookie}`);
};

describe('FreeloECOM API / Router de products', () => {
  let adminCookie;
  let productIdToDelete; // Variable para almacenar el ID del producto a eliminar

  before(async function () {
    this.timeout(10000);
    const randomEmail = getRandomEmail();
    const adminUser = {
      first_name: 'Admin',
      last_name: 'Testing',
      email: randomEmail,
      age: 25,
      password: 'password123',
      role: 'admin',
    };
    await registerUser(adminUser);
    const loginResponse = await loginUser({ email: randomEmail, password: 'password123' });
    adminCookie = loginResponse.headers['set-cookie'][0].split(';')[0].split('=')[1];
  });

  it('POST /api/products: Debe crear un producto correctamente', async function () {
    const newProduct = {
      title: 'Test Product',
      description: 'Test Description',
      code: generateRandomCode(),
      price: 10.0,
      stock: 100,
      category: 'Test Category',
    };

    const createProductResponse = await createProduct(adminCookie, newProduct);
    productIdToDelete = createProductResponse.body.payload.payload._id;

    expect(createProductResponse.status).to.equal(201);
    expect(createProductResponse.body.success).to.be.true;
    expect(createProductResponse.body.payload.message).to.equal('Producto agregado correctamente');
    expect(typeof productIdToDelete).to.equal('string');
    expect(createProductResponse.body.payload.payload.title).to.equal(newProduct.title);
    expect(createProductResponse.body.payload.payload.description).to.equal(newProduct.description);

    req.logger.test(`POST /api/products ~ Product add ~ pid: ${productIdToDelete}`);
  });

  it('GET /api/products: Debe obtener todos los productos', async function () {
    const getAllProductsResponse = await request(app).get('/api/products').set('Cookie', `jwt=${adminCookie}`);

    expect(getAllProductsResponse.status).to.equal(200);
    expect(getAllProductsResponse.body.success).to.be.true;
    expect(getAllProductsResponse.body.payload.payload.payload).to.be.an('array');

    req.logger.test(`GET /api/products ~ Products get ~ success: ${getAllProductsResponse.body.success}`);
    req.logger.test(`GET /api/products ~ Products get ~ object: ${getAllProductsResponse.body.payload.payload}`);
  });

  it('DELETE /api/products/:pid: Debe eliminar un producto correctamente', async function () {
    const deleteProductResponse = await request(app).delete(`/api/products/${productIdToDelete}`).set('Cookie', `jwt=${adminCookie}`);
    const productId = deleteProductResponse.body.payload.payload._id;

    expect(deleteProductResponse.status).to.equal(200);
    expect(deleteProductResponse.body.success).to.be.true;
    expect(deleteProductResponse.body.payload.message).to.equal('Producto eliminado correctamente');
    // Verifica que se haya eliminado el producto correctamente en la base de datos
    const productInDB = await productsServices.findById(productId);
    expect(productInDB).to.be.null;

    req.logger.test(`DELETE /api/products ~ Product delete ~ pid: ${productIdToDelete}`);
  });

  function generateRandomCode() {
    return Array.from({ length: 6 }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 62)]).join('');
  }

  // Limpieza después de las pruebas
  after(async function () {
    // Eliminar el producto creado durante las pruebas
    if (productIdToDelete) {
      await request(app).delete(`/api/products/${productIdToDelete}`).set('Cookie', `jwt=${adminCookie}`);
    }
  });
});
