/* ************************************************************************** */
/* /src/config/index.js - configuración de variables de entorno */
/* ************************************************************************** */

const { program } = require('commander');
const dotenv = require('dotenv');
const { devLogger, stageLogger, prodLogger } = require('../utils/logger/logger'); // Importa los loggers

/* ///////////////////////////////////////// */
/* Commander */
program.version('1.0.0').description('Programa para levantar nuestro servidor con un ambiente especifico').option('-m, --mode <mode>', 'Ambiente de ejecución', 'development').option('-p, --persistence <persistence>', 'Tipo de persistencia', 'MONGO').parse();

const args = program.opts();

let envFilePath = '';
if (args.mode === 'production') {
  envFilePath = './.env.production';
  /*   console.log('~~~ Iniciando entorno Production ~~~'); */
  prodLogger.info('Iniciando entorno Production');
} else if (args.mode === 'staging') {
  envFilePath = './.env.staging';
  /* console.log('~~~ Iniciando entorno Staging ~~~'); */
  stageLogger.info('Iniciando entorno Staging');
} else if (args.mode === 'staging') {
} else {
  envFilePath = './.env.development';
  /*   console.log('~~~ Iniciando entorno Development ~~~'); */
  devLogger.info('Iniciando entorno Development');
}
/* ///////////////////////////////////////// */
/* Comandos para las diferentes variables de entorno */
/* ///////////////////////////////////////// */
/* node indexedDB.js -m <nombre_de_la_variable_de_entorno> -p <nombre_de_la_variable_de_persistencia> */
/* node index.js -m development -p MONGO */
/* node index.js -m production -p MEMORY */
/* node index.js -m staging -p FILESYSTEM */
/* ///////////////////////////////////////// */

dotenv.config({
  path: envFilePath,
});

const config = {
  port: process.env.PORT,
  cookie_key: process.env.COOKIE_KEY,
  secret_key: process.env.SECRET_KEY,
  github_client_id: process.env.GITHUB_CLIENT_ID,
  github_secret_key: process.env.GITHUB_SECRET_KEY,
  github_callback_url: process.env.GITHUB_CALLBACK_URL,
  jwt_secret: process.env.JWT_SECRET,
  jwt_expires: process.env.JWT_EXPIRES_IN,
  jwt_algorithm: process.env.JWT_ALGORITHM,
  admin_email: process.env.ADMIN_EMAIL,
  admin_password: process.env.ADMIN_PASSWORD,
  persistence: process.env.PERSISTENCE,
  nodemailer_user: process.env.NODE_MAILER_USER,
  nodemailer_pass: process.env.NODE_MAILER_PASSWORD,
  twilio_sid: process.env.TWILIO_ACCOUNT_SID,
  twilio_auth_token: process.env.TWILIO_AUTH_TOKEN,
  twilio_phone_number: process.env.TWILIO_PHONE_NUMBER,
};

const db = {
  mongo_local: process.env.MONGO_URL_LOCAL,
  mongo_atlas: process.env.MONGO_URL_ATLAS,
  dbName: process.env.DB_NAME,
};

module.exports = {
  args,
  config,
  db,
  persistence: args.persistence,
};
