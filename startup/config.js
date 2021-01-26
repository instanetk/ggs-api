// const config = require('config');
require('dotenv').config();

module.exports = function () {
  // if (!config.get('jwtPrivateKey')) {
  let jwtPrivateKey = process.env.JWT;
  console.log(jwtPrivateKey);
  if (!jwtPrivateKey) {
    throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
  }
};
