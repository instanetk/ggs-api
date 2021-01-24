const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');
require('dotenv').config();

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
  let db = process.env.DB;
  winston.add(new winston.transports.File({ filename: 'logfile.log' }));
  winston.add(new winston.transports.Console());
  winston.add(
    new winston.transports.MongoDB({
      db: db,
      level: 'info',
      options: {
        useUnifiedTopology: true,
      },
    })
  );
};
