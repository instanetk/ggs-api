const winston = require('winston');
const express = require('express');
const { EIO } = require('constants');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();
require('dotenv').config();

const port = process.env.PORT || 9000;

let count = 0;

io.on('connection', (socket) => {
  count++;
  io.emit('users.count', count);
  socket.on('disconnect', () => {
    count--;
    io.emit('users.count', count);
  });
  console.log('new connection', count);
});

server.listen(port, () => winston.info(`Listening on port ${port}...`));

// const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

module.exports = server;
