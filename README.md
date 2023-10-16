# desafio_modulos_de_testing_para_el_proyecto_final

Este repositorio contiene el desafío "Módulos de testing para el proyecto final" con las siguientes características:

# Objetivo

## Mocha + Chai + Supertest

- Realización de módulos de testing para el proyecto principal, utilizando los módulos de mocha, chai y supertest.
- Incluye 3 (tres) tests desarrollados para:
  - Router de products.
  - Router de carts.
  - Router de sessions.

<small>Directorio/s de referencia</small>

- `/test/carts.test.js`: Configuración del test de carts.
- `/test/products.test.js`: Configuración del test de products.
- `/test/sessions.test.js`: Configuración del test de sessions.

### Comando para ejecutar el test:

```bash
npm test
```

### Video de "Módulos de testing para el proyecto final"

---

## Requisitos

Asegúrate de tener los siguientes requisitos instalados en tu entorno de desarrollo:

- Node.js
- MongoDB

## Instrucciones de instalación

Sigue estos pasos para instalar y configurar el proyecto:

1. Clona este repositorio en tu máquina local:

   ```bash
   git clone https://github.com/lisandrojm/desafio_documentar_apidesafio_modulos_de_testing_para_el_proyecto_final
   ```

2. Navega al directorio del proyecto:

   ```bash
   cd desafio_modulos_de_testing_para_el_proyecto_final
   ```

3. Instala las dependencias del proyecto ejecutando el siguiente comando:

   ```bash
   npm install
   ```

4. Configura la conexión a la base de datos MongoDB y todas las variables de entorno en el archivo `.env`. Puedes copiar el archivo `.env.example` y renombrarlo a `.env`, luego actualiza los valores con tu configuración:

   ```bash
   cp .env.example .env
   ```

   Asegúrate de tener MongoDB en ejecución , la URL de conexión correcta y todas las variables de entorno configuradas en el archivo `.env`.

5. Inicia el test con el siguiente comando:

   ```bash
   npm test
   ```

## Estructura general del proyecto

Aquí tienes la estructura del proyecto con descripciones para cada directorio:

El proyecto sigue la siguiente estructura de directorios:

- `/.env`: Variables de entorno.

- `/.env.example`: Archivo de ejemplo que muestra la estructura y variables de entorno requeridas para la configuración de la aplicación.

- `/src/components`: Carpeta contenedora de todos los componentes. Cada componente contiene un archivo index.js con sus rutas, una carpeta de controlador y una de servicios.

- `/src/config`: Archivos de configuración de la aplicación.

  - `/src/config/index.js`: Exporta variables de entorno y configuraciones generales.
  - `/src/config/mongo.js`: Configuración de Mongoose para establecer la conexión a la base de datos MongoDB.
  - `/src/config/passport.js`: Configuración de Passport para generar las estrategias de autenticación y autorización.

- `/src/models`: Modelos de datos de la aplicación.

- `/src/public`: Archivos públicos de la aplicación, como estilos CSS, imágenes y scripts JavaScript.

- `/src/routes`: Archivos de definición de rutas de la aplicación.

- `/src/utils`: Archivos relacionados con la configuración de las utilidades reutilizables.

- `/src/views`: Todas las vistas del proyecto.

## Dependencias

El proyecto utiliza las siguientes dependencias:

- **Express.js (v4.18.2):** Framework de Node.js para construir aplicaciones web.
- **UUID (v9.0.0):** Biblioteca para generar identificadores únicos.
- **Cors (v2.8.5):** Middleware para permitir peticiones HTTP entre diferentes dominios.
- **Dotenv (v16.3.1):** Carga variables de entorno desde un archivo .env.
- **Express-handlebars (v7.0.7):** Motor de plantillas para Express.js.
- **MongoDB (v5.6.0):** Driver de MongoDB para Node.js.
- **Mongoose (v7.3.1):** Modelado de objetos de MongoDB para Node.js.
- **Multer (v1.4.5-lts.1):** Middleware para manejar datos de formulario multipart/form-data.
- **Socket.io (v4.6.2):** Biblioteca para la comunicación en tiempo real basada en WebSockets.
- **Sweetalert2 (v11.7.12):** Biblioteca para mostrar mensajes y alertas personalizadas.
- **Connect-mongo (v5.0.0):** Middleware para almacenar sesiones de Express.js en MongoDB.
- **Cookie-parser (v1.4.6):** Middleware para analizar cookies en las solicitudes de Express.js.
- **Express-session (v1.17.3):** Middleware para manejar sesiones en Express.js.
- **Mongoose-paginate-v2 (v1.7.1):** Plugin de paginación para Mongoose.
- **Bcrypt (v5.1.0):** Biblioteca para el hashing seguro de contraseñas.
- **Passport (v0.6.0):** Middleware para autenticación en Node.js.
- **Passport-github2 (v0.1.12):** Estrategia de autenticación para Passport usando OAuth 2.0 con GitHub.
- **Passport-local (v1.0.0):** Estrategia de autenticación para Passport basada en credenciales locales.
- **Jsonwebtoken (v9.0.1):** Biblioteca para generar y verificar tokens JWT.
- **Passport-jwt (v4.0.1):** Estrategia de autenticación para Passport que utiliza tokens JWT (JSON Web Tokens) para la autenticación de usuarios.
- **Commander (v11.0.0):** Biblioteca para crear interfaces de línea de comandos interactivas en Node.js.
- **Twilio (v4.16.0):** Biblioteca para enviar y recibir mensajes de texto y realizar llamadas telefónicas a través de la API de Twilio.
- **Nodemailer (v6.9.4):** Biblioteca para enviar correos electrónicos desde una aplicación Node.js.
- **Faker (v5.5.3):** Biblioteca para generar datos falsos como nombres, direcciones, correos electrónicos, etc., útil para pruebas y desarrollo.
- **winston (v3.10.0):** Biblioteca para el registro de registros (logs) en Node.js.
- **Swagger-jsdoc (v6.2.8):** Biblioteca para generar documentación de API utilizando comentarios en el código fuente.
- **Swagger-ui-express (v5.0.0):** Biblioteca para renderizar la documentación de Swagger de forma interactiva en una aplicación Express..

## DevDependencies

El proyecto utiliza las siguientes devDependencies:

- **Nodemon (v2.0.22):** Utilidad que monitoriza cambios en los archivos y reinicia automáticamente la aplicación durante el desarrollo, lo que facilita la iteración y prueba del código.
- **Chai (v4.3.10):** Biblioteca de aserciones para realizar pruebas unitarias y de integración en JavaScript. Chai es muy flexible y se puede utilizar con varios marcos de pruebas como Mocha.
- **Mocha (v10.2.0):** Un popular marco de pruebas (testing framework) para JavaScript que se utiliza para escribir y ejecutar pruebas en aplicaciones Node.js y en el navegador.
- **Supertest (v6.3.3):** Biblioteca que simplifica la realización de pruebas HTTP en aplicaciones Node.js. Es especialmente útil para probar las rutas y endpoints de una API.

Estas dependencias pueden ser instaladas ejecutando el comando `npm install` en el directorio del proyecto.

## Postman Collections

- En la carpeta `postman_collections`, encontrarás los archivos necesarios para importar las colecciones en Postman y realizar pruebas en el proyecto. Las colecciones proporcionan ejemplos de solicitudes HTTP para interactuar con la API y probar su funcionalidad.

- Importante: Como el proyecto cuenta con un Middleware de autorización hay que realizar los siguientes pasos en Postman:

  1.0 - Ir a Postman/Headers/Cookies/Manage Cookies.

  2.0 - Type a domain name:localhost.

  3.0 - Template: Cookie_5=value; Path=/; Expires=Sun, 01 Sep 2024 22:47:37 GMT;

  3.1 - Loguearse como Admin o como User según corresponda para testear la ruta.

  3.2 - Una vez logueado ingresar a Application/Cookies/http://localhost:8080 y copiar el value del token jwt.

  3.3 - En el Template de la cookie de Postman reemplazar Cookie_5 por jwt y value por el value del token copiado.

  3.4 - Debe quedar un código como el siguiente (el token a continuación es un ejemplo):

  jwt=ey123456789wolrtjlwkjt.eyJfaWQiOiI2NGY3YzBkY2ZmMzY2NmQ4YTdjMDA0MDciLCJlbWFpbCI6InVzZXJAY29ycmVvLmNvbSIsInJvbGUiOiJhZG1pbiIsImZpcnN0X25hbWUiOiJ1c2VyIiwibGFzdF9uYW1lIjoidXNlciIsImFnZSI6MzMsImNhcnQiOiI2NGY3YzBkY2ZmMzY2NmQ4YTdjMDA0MDkiLCJpYXQiOjE2OTQwNTU5OTgsImV4cCI6MTY5NDE0MjM5OH0.hIYn2frVQCVNBMGI5E4sRkTqCTBhSHQ0Th0uSOUtabc; Path=/; Expires=Fri, 06 Sep 2024 03:12:07 GMT;

  3.5 - Ten en cuenta que los tokens de las cookies expiran por lo que para realizar varios tests debes volver a loguearte y copiar y pegar el token en la cookie de Postman.
