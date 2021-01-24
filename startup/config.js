// const config = require('config');
require('dotenv').config();

module.exports = function () {
  // if (!config.get('jwtPrivateKey')) {
  let jwtPrivateKey = process.env.JWT;

  if (!jwtPrivateKey) {
    throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
  }
};
