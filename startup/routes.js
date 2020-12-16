const express = require('express');
const cors = require('cors');
// const customers = require('../routes/customers');
const users = require('../routes/users');
const auth = require('../routes/auth');
// const error = require('../middleware/error');
const bodyParser = require('body-parser');

module.exports = function (app) {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cors());
  app.use('/api/users', users);
  app.use('/api/auth', auth);
  // app.use(error);
};
