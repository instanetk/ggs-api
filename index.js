const winston = require('winston');
const express = require('express');
// const { EIO } = require('constants');
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

// Function to call on Change Stream event
const onChangeStream = (change) => {
  if (change.operationType === 'insert') io.emit('new-lead', 'New Lead');
  io.emit('update-requested', 'DB Changed');
  console.log(new Date());
  console.log('type:', change.operationType);
};
// MongoDB Change Stream listener
const changeStream = Schedule.watch().on('change', (change) => onChangeStream(change));

let count = 0;
// Count number of online users
io.on('connection', (socket) => {
  count++;
  io.emit('userCount', count);
  io.emit('userOn');
  // console.log('connect', count);
  socket.on('disconnect', () => {
    count--;
    io.emit('userCount', count);
    io.emit('userOff'); // To play disconnect sound on client
    // console.log('disconnect', count);
  });
});

const port = process.env.PORT || 9000;

server.listen(port, () => winston.info(`Listening on port ${port}...`));

// const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

module.exports = server;
