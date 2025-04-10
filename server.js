const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const teams = [];

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A user connected');

  // Send current teams to new user
  socket.emit('updateBracket', teams);

  socket.on('addTeam', (teamName) => {
    if (teamName && teamName.trim() !== '') {
      teams.push(teamName.trim());
      io.emit('updateBracket', teams);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
