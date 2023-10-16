/* ************************************************************************** */
/* /src/components/logger/loggerController/loggerController.js */
/* ************************************************************************** */

/* const LoggerServices = require('../loggerServices/loggerServices'); */

class LoggerController {
  getLogger = async (req, res) => {
    try {
      /* transporte file */
      req.logger.fatal('¡Alerta!');
      req.logger.error('¡Alerta!');
      req.logger.warn('¡Alerta!');
      req.logger.info('¡Alerta!');
      req.logger.http('¡Alerta!');
      req.logger.debug('¡Alerta!');
      res.send({ message: '¡Test de loggers!' });
    } catch (error) {
      /* res.status(500).send({ error: 'Ha ocurrido un error' }); */
      return res.sendServerError('Ha ocurrido un error');
    }
  };
}

module.exports = new LoggerController();
