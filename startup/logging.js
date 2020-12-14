const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

module.exports = function () {
  winston.createLogger({
    transports: [
      new winston.transports.Console({ colorize: true, prettyPrint: true }),
      new winston.transports.File({ filename: 'uncaughtExceptions.log' }),
    ],
  });

  process.on('unhandledRejection', (ex) => {
    throw ex;
  });

  winston.add(new winston.transports.File({ filename: 'logfile.log' }));
  winston.add(new winston.transports.Console());
  winston.add(
    new winston.transports.MongoDB({
      db: 'mongodb://localhost/ggs',
      level: 'info',
      useUnifiedTopology: true,
    })
  );
};
