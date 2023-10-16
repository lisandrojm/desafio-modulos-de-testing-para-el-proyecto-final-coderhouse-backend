/* ************************************************************************** */
/* /src/dao/factory.js - configuración de persistencia */
/* ************************************************************************** */
const mongoose = require('mongoose');
const { db, persistence } = require('../config');

/*  Importar el objeto req configurado con el middleware para utilizar logger 
antes de la inicialización de la app */
const req = require('../utils/logger/loggerSetup');

mongoose.set('debug', false);
mongoose.set('strictQuery', false);

let Dao;

switch ((req, persistence)) {
  case 'MONGO':
    let connection;

    mongoose.connect(db.mongo_atlas, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: db.dbName,
    });

    connection = mongoose.connection;

    connection.on('connected', () => {
      /*       console.log('~~~ Conexión exitosa a la base de datos de MONGO Factory ~~~'); */
    });

    const DaoMongo = require('./mongo/dao.mongo');
    Dao = DaoMongo;
    /*     console.log('~~~ Conexión exitosa a persistencia MONGO Factory ~~~'); */
    req.logger.info('Conexión exitosa a persistencia MONGO Factory');
    break;

  case 'MEMORY':
    const DaoMemory = require('./memory/dao.memory');
    Dao = DaoMemory;
    /* console.log('~~~ Conexión exitosa a persistencia MEMORY Factory ~~~'); */
    req.logger.info('Conexión exitosa a persistencia MEMORY Factory');
    break;

  case 'FILESYSTEM':
    const DaoFileSystem = require('./filesystem/dao.fylesystem');
    Dao = DaoFileSystem;
    /* console.log('~~~ Conexión exitosa a persistencia FILESYSTEM Factory ~~~'); */
    req.logger.info('Conexión exitosa a persistencia FILESYSTEM Factory');
    break;

  default:
    throw new Error('Persistence type not supported');
}

module.exports = Dao;

/////////////////////////////////////////////////////////////////////////////////
/* Formato de comandos */
/////////////////////////////////////////////////////////////////////////////////
/* node indexedDB.js -m <nombre_de_la_variable_de_entorno> -p <nombre_de_la_variable_de_persistencia> */

/////////////////////////////////////////////////////////////////////////////////
/* Ejemplos de comandos para para inicializar el proyecto con diferentes variables de entorno y capas de persistencia */
/////////////////////////////////////////////////////////////////////////////////
/* node index.js -m development -p MONGO */
/* node index.js -m production -p MEMORY */
/* node index.js -m staging -p FILESYSTEM */
