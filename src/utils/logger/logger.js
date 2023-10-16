/* ************************************************************************** */
/* /src/utils/logger/logger.js 
/* ************************************************************************** */
const winston = require('winston');

const customLevelsOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    http: 4,
    test: 5,
    debug: 6,
  },
  colors: {
    fatal: 'red',
    error: 'red',
    warn: 'yellow',
    info: 'blue',
    http: 'green',
    test: 'green',
    debug: 'magenta',
  },
};

winston.addColors(customLevelsOptions.colors);

// Configuración del logger de desarrollo
const devLogger = winston.createLogger({
  levels: customLevelsOptions.levels,
  transports: [
    new winston.transports.Console({
      level: 'debug', // Solo loggeará a partir del nivel debug
      format: winston.format.combine(winston.format.colorize({ colors: customLevelsOptions.colors }), winston.format.simple(), winston.format.timestamp()),
    }),
  ],
});

// Configuración del logger de desarrollo
const stageLogger = winston.createLogger({
  levels: customLevelsOptions.levels,
  transports: [
    new winston.transports.Console({
      level: 'http', // Solo loggeará a partir del nivel http
      format: winston.format.combine(winston.format.colorize({ colors: customLevelsOptions.colors }), winston.format.simple(), winston.format.timestamp()),
    }),
  ],
});

// Configuración del logger de producción
const prodLogger = winston.createLogger({
  levels: customLevelsOptions.levels,
  transports: [
    new winston.transports.Console({
      level: 'info', // Solo loggeará a partir del nivel info
      format: winston.format.combine(winston.format.colorize({ colors: customLevelsOptions.colors }), winston.format.simple(), winston.format.timestamp()),
    }),
    new winston.transports.File({
      filename: './errors.log',
      level: 'error', // Logueará a partir de error en un archivo "errors.log"
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
      ),
    }),
  ],
});

module.exports = { devLogger, stageLogger, prodLogger };
