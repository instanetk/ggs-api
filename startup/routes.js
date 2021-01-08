const express = require('express');
const cors = require('cors');
const users = require('../routes/users');
const auth = require('../routes/auth');
const categories = require('../routes/categories');
const services = require('../routes/services');
const schedule = require('../routes/schedule');
// const error = require('../middleware/error');
const bodyParser = require('body-parser');

module.exports = function (app) {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cors());
  app.use('/api/users', users);
  app.use('/api/auth', auth);
  app.use('/api/categories', categories);
  app.use('/api/services', services);
  app.use('/api/schedule', schedule);
  // app.use(error);
};
