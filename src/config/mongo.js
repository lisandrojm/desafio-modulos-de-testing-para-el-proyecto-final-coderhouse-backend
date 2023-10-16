/* ************************************************************************** */
/* /src/config/mongo.js - configuracion de mongoose. */
/* ************************************************************************** */
/* Comentado por reemplazo desde Factory************************************* */
/* ************************************************************************** */

/* const mongoose = require('mongoose');
const { db } = require('./index');

mongoose.set('debug', false);
mongoose.set('strictQuery', false);

let connection;

mongoose.connect(db.mongo_atlas, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: db.dbName,
});

connection = mongoose.connection;

connection.on('connected', () => {
  console.log('~~~Conexión exitosa a la base de datos~~~');
});

connection.on('error', (error) => {
  console.error('~~~Error en la conexión a la base de datos:~~~', error);
});

module.exports = { connection };
 */
