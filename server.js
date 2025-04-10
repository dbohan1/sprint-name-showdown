const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const teams = [];
const votes = {}; // Store votes for matchups
const results = {}; // Store winners of each round

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A user connected');

  // Send current teams to new user
  socket.emit('updateBracket', { teams, results });

  socket.on('addTeam', (teamName) => {
    if (teamName && teamName.trim() !== '') {
      teams.push(teamName.trim());
      io.emit('updateBracket', { teams, results });
    }
  });

  socket.on('vote', (matchup, votedTeam) => {
    if (!votes[matchup]) {
      votes[matchup] = { [matchup[0]]: 0, [matchup[1]]: 0 };
    }

    // Increment the vote for the voted team
    votes[matchup][votedTeam]++;
    
    // Check if we have enough votes to determine a winner (more than 50%)
    const totalVotes = votes[matchup][matchup[0]] + votes[matchup][matchup[1]];
    if (totalVotes > 1) {
      if (votes[matchup][matchup[0]] > totalVotes / 2) {
        results[matchup] = matchup[0]; // Team 1 wins
      } else if (votes[matchup][matchup[1]] > totalVotes / 2) {
        results[matchup] = matchup[1]; // Team 2 wins
      }
    }

    io.emit('updateBracket', { teams, results });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
