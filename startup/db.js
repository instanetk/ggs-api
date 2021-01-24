const winston = require('winston');
const mongoose = require('mongoose');
// const config = require('config');
require('dotenv').config();

module.exports = function () {
  // const db = config.get('db');
  const db = process.env.DB;
  mongoose.set('useCreateIndex', true);
  mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => winston.info(`Connected to ${db}...`));
};
