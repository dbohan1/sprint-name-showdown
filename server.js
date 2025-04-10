const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let teams = [];
let currentVote = null;
let voteEndTime = null;

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A user connected');

  // Send the current teams to the new user
  socket.emit('updateTeams', teams);

  // Handle adding a new team
  socket.on('addTeam', (teamName) => {
    teams.push(teamName);
    io.emit('updateTeams', teams); // Update all clients with the new team list
  });

  // Start a vote session
  socket.on('startVote', ({ team1, team2 }) => {
    currentVote = { team1, team2, team1Votes: 0, team2Votes: 0 };
    voteEndTime = Date.now() + 10000; // Vote lasts for 10 seconds

    // Broadcast to all clients that voting is starting
    io.emit('votingStarted', { team1, team2, endTime: voteEndTime });

    // End voting after 10 seconds
    setTimeout(() => {
      if (!currentVote) return; // If currentVote is null, exit the function
      const winner = currentVote.team1Votes > currentVote.team2Votes ? currentVote.team1 : currentVote.team2;
      const loser = currentVote.team1Votes <= currentVote.team2Votes ? currentVote.team1 : currentVote.team2;
      
      // Broadcast the result to all clients
      io.emit('voteResult', { winner, loser });

      // Update teams and broadcast
      teams = teams.filter(team => team !== loser);
      io.emit('updateTeams', teams);

      // Reset the currentVote after the vote ends
      currentVote = null;
      voteEndTime = null;
    }, 10000); // 10 seconds
  });

  // Handle a vote for a team
  socket.on('vote', ({ team }) => {
    if (currentVote) {
      if (team === currentVote.team1) {
        currentVote.team1Votes += 1;
      } else if (team === currentVote.team2) {
        currentVote.team2Votes += 1;
      }

      // Emit a "voteEmoji" event to all clients with the team voted for
      io.emit('voteEmoji', { team });
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
