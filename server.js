const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

let teams = [];
let voteCounts = {}; // To store the vote counts for each team

io.on('connection', (socket) => {
  // Send current team list to the client
  socket.emit('updateTeams', teams);

  // Handle adding teams
  socket.on('addTeam', (teamName) => {
    teams.push(teamName);
    io.emit('updateTeams', teams);
  });

  // Handle starting a vote
  socket.on('startVote', ({ team1, team2 }) => {
    // Initialize vote counts
    voteCounts[team1] = 0;
    voteCounts[team2] = 0;
  });

  // Handle ending a vote
  socket.on('endVote', ({ team1, team2 }) => {
    const team1Votes = voteCounts[team1] || 0;
    const team2Votes = voteCounts[team2] || 0;
    const winner = team1Votes > team2Votes ? team1 : team2;
    const loser = winner === team1 ? team2 : team1;

    // Remove loser from the teams array
    teams = teams.filter(team => team !== loser);
    io.emit('updateTeams', teams);
    io.emit('voteResult', { winner, loser });
  });

  // Handle a vote from the client
  socket.on('vote', (team) => {
    if (voteCounts[team] !== undefined) {
      voteCounts[team]++;
    }
  });
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
