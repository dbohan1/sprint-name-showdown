const socket = io();
const form = document.getElementById('team-form');
const input = document.getElementById('team-input');
const list = document.getElementById('team-list');
const sidebarList = document.getElementById('sidebar-team-list');
const votingStatus = document.getElementById('voting-status');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const teamName = input.value.trim();
  if (teamName) {
    socket.emit('addTeam', teamName);
    input.value = '';
  }
});

socket.on('updateTeams', (teams) => {
  list.innerHTML = '';
  sidebarList.innerHTML = ''; // Clear the sidebar

  // Display the teams in pairs for voting
  for (let i = 0; i < teams.length; i += 2) {
    if (teams[i + 1]) {
      const pair = document.createElement('li');
      pair.classList.add('team-pair');
      pair.innerHTML = `
        <span class="team-name">${teams[i]}</span> vs <span class="team-name">${teams[i + 1]}</span>
        <button class="vote-button" onclick="startVote('${teams[i]}', '${teams[i + 1]}')">Start Vote</button>
      `;
      list.appendChild(pair);
    }
  }

  // Display all teams in the sidebar
  teams.forEach((team) => {
    const teamItem = document.createElement('li');
    teamItem.textContent = team;
    sidebarList.appendChild(teamItem);
  });
});

function startVote(team1, team2) {
  votingStatus.textContent = `Voting between ${team1} and ${team2}... Voting will end in 10 seconds!`;

  // Emit event to start vote
  socket.emit('startVote', { team1, team2 });

  setTimeout(() => {
    socket.emit('endVote', { team1, team2 });
    votingStatus.textContent = `Vote finished! The winner will be announced shortly.`;
  }, 10000); // 10 seconds
}

socket.on('voteResult', (result) => {
  const { winner, loser } = result;
  votingStatus.textContent = `The winner is ${winner}! ${loser} is eliminated.`;
  // Update the list
  socket.emit('updateTeams');
});
