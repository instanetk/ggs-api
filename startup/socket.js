const io = require('socket.io');

module.exports = function socket(server) {
  io(server);
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
};
