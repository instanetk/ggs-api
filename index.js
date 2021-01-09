const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();
require('dotenv').config();

const port = process.env.PORT || 9000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

module.exports = server;
