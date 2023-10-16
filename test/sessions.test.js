/* ************************************************************************** */
/* /test/sessions.test.js */
/* ************************************************************************** */

const { app } = require('../src/index');
const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const req = require('../src/utils/logger/loggerSetup');

describe('FreeloECOM API / Router de sessions', () => {
  const randomEmailOnlyRegister = `user${Math.floor(Math.random() * 10000)}@example.com`;
  const randomEmail = `user${Math.floor(Math.random() * 10000)}@example.com`;
  let userCookie;

  before(async function () {
    this.timeout(10000);

    /* User registrado en el before para utilizarlo en los test "login" y "current" y evitar conflictos de
    asincronía si demora en guardarse en la base de datos */
    const newUser = {
      first_name: 'User',
      last_name: 'Testing',
      email: randomEmail,
      age: 25,
      password: 'password123',
      role: 'user',
    };

    await request(app).post('/api/session/auth/register').send(newUser);

    const loginResponse = await request(app).post('/api/session/auth/login').send({ email: randomEmail, password: 'password123' });

    userCookie = loginResponse.headers['set-cookie'][0].split(';')[0].split('=')[1];
  });

  it('POST /api/session/auth/register: Debe crear un usuario correctamente', async function () {
    /* User registrado para realizar un test individual del registro de usuario" */
    const newUser = {
      first_name: 'User',
      last_name: 'registerTest',
      email: randomEmailOnlyRegister,
      age: 25,
      password: 'password123',
      role: 'user',
    };

    const response = await request(app).post('/api/session/auth/register').send(newUser);

    expect(response.status).to.equal(201);
    expect(response.body.success).to.be.true;
    expect(response.body.payload.payload.message).to.equal('Usuario agregado correctamente');
    expect(response.body.payload.payload.data.email).to.equal(randomEmailOnlyRegister);

    req.logger.test(`POST /api/session/auth/register ~ User register ~ email: ${response.body.payload.payload.data.email}`);
  });

  it('POST /api/session/auth/login: Debe loguear a un usuario correctamente y devolver una cookie', async function () {
    const credentials = {
      email: randomEmail,
      password: 'password123',
    };

    const response = await request(app).post('/api/session/auth/login').send(credentials);

    expect(response.status).to.equal(200);

    const setCookieHeader = response.headers['set-cookie'];
    expect(setCookieHeader).to.exist;

    const cookieParts = setCookieHeader[0].split(';')[0].split('=');
    const cookie = {
      name: cookieParts[0],
      value: cookieParts[1],
    };

    expect(cookie.name).to.equal('jwt');
    expect(cookie.value).to.be.ok;

    req.logger.test(`POST /api/session/auth/login ~ User login ~ email : ${randomEmail}`);
    req.logger.test(`POST /api/session/auth/login ~ User login ~ cookie : ${JSON.stringify(cookie.name, null, 2)}`);
  });

  it('GET /api/session/auth/current: Debe enviar la cookie que contiene el usuario y desestructurarlo correctamente', async function () {
    const response = await request(app).get('/api/session/auth/current').set('Cookie', `jwt=${userCookie}`);

    expect(response.status).to.equal(200);
    expect(response.body.success).to.be.true;
    expect(response.body.payload.payload.data.email).to.equal(randomEmail);

    req.logger.test(`GET /current ~ User jwt cookie ~ email: ${randomEmail}`);
  });
});
