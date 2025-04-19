const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const users = {};

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('checkPassword', ({ name, password }) => {
    if (password === 'admin123') {
      users[socket.id] = name;
      socket.emit('join-success');
      socket.broadcast.emit('user-joined', name);
    } else {
      socket.emit('join-failed');
    }
  });

  socket.on('send-message', (msg) => {
    const username = users[socket.id];
    if (username) {
      io.emit('receive-message', { user: username, message: msg });
    }
  });

  socket.on('disconnect', () => {
    const username = users[socket.id];
    if (username) {
      socket.broadcast.emit('user-left', username);
      delete users[socket.id];
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
