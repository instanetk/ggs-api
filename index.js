const winston = require('winston');
const express = require('express');
const { EIO } = require('constants');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const { Schedule } = require('./models/schedule');

// require('./startup/socket')();
require('./startup/logging')(server);
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();
require('dotenv').config();

const onChangeStream = (change) => {
  io.emit('update-requested', 'DB Changed');
  console.log(new Date());
  console.log('type:', change.operationType);
};

const changeStream = Schedule.watch().on('change', (change) => onChangeStream(change));

// let count = 0;
// io.on('connection', (socket) => {
//   count++;
//   console.log('new connection', count);
//   socket.on('update', (message) => {
//     console.log(message);
//     io.emit('update-requested', 'hello client');
//     // const changeStream = Schedule.watch().on('change', (change) => onChangeStream(change));
//   });
//   socket.on('disconnect', () => {
//     count--;
//     console.log('goodbye', count);
//     // io.emit('count', 'goodbye');
//   });
// });

const port = process.env.PORT || 9000;

server.listen(port, () => winston.info(`Listening on port ${port}...`));

// const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

module.exports = server;
