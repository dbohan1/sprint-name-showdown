const socket = io();
const form = document.getElementById('team-form');
const input = document.getElementById('team-input');
const list = document.getElementById('team-list');

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
  teams.forEach(team => {
    const li = document.createElement('li');
    li.textContent = team;
    list.appendChild(li);
  });
});
