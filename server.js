const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const livereload = require('livereload');
const connectLiveReload = require('connect-livereload');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'public'));
app.use(connectLiveReload());
liveReloadServer.server.once('connection', () => {
  setTimeout(() => liveReloadServer.refresh('/'), 100);
});

app.use(express.static('public'));

let teams = [];

io.on('connection', (socket) => {
  socket.emit('updateTeams', teams);

  socket.on('addTeam', (teamName) => {
    teams.push(teamName);
    io.emit('updateTeams', teams);
  });
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
