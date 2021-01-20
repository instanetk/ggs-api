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
      db: "mongodb+srv://ggs:mprWM4p8bRhIw'yaS(@v,@cluster0.qjrb1.mongodb.net/ggs?retryWrites=true&w=majority",
      level: 'info',
      options: {
        useUnifiedTopology: true,
      },
    })
  );
};
