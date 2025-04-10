const socket = io();
const form = document.getElementById('teamForm');
const input = document.getElementById('teamInput');
const bracket = document.getElementById('bracket');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const teamName = input.value.trim();
  if (teamName) {
    socket.emit('addTeam', teamName);
    input.value = '';
  }
});

socket.on('updateBracket', (teams) => {
  bracket.innerHTML = '';
  const rounds = Math.ceil(Math.log2(teams.length || 1));
  const roundColumns = [];

  // Group teams for visual bracket
  let currentRound = teams.slice();

  while (currentRound.length > 0) {
    roundColumns.push([...currentRound]);
    currentRound = Array(Math.ceil(currentRound.length / 2)).fill('TBD');
  }

  for (const round of roundColumns) {
    const col = document.createElement('div');
    col.classList.add('round');
    round.forEach(team => {
      const div = document.createElement('div');
      div.className = 'team';
      div.textContent = team;
      col.appendChild(div);
    });
    bracket.appendChild(col);
  }
});
