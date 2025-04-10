const socket = io();
const form = document.getElementById('teamForm');
const input = document.getElementById('teamInput');
const bracket = document.getElementById('bracket');

// Flag to prevent an infinite loop
let isUpdatingBracket = false;

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const teamName = input.value.trim();
    if (teamName) {
        socket.emit('addTeam', teamName);
        input.value = '';
    }
});

socket.on('updateBracket', ({ teams, results }) => {
    // Guard condition to prevent an infinite loop
    if (isUpdatingBracket) return;

    isUpdatingBracket = true;
    bracket.innerHTML = ''; // Clear the current bracket view

    const rounds = Math.ceil(Math.log2(teams.length || 1));
    const roundColumns = [];
    let currentRound = teams.slice();

    // Create rounds based on the number of teams
    while (currentRound.length > 1) {
        roundColumns.push(currentRound);
        currentRound = currentRound.reduce((acc, _, i) => {
            if (i % 2 === 0) {
                acc.push([currentRound[i], currentRound[i + 1]]);
            }
            return acc;
        }, []);
    }

    // Add the final round (if any)
    if (currentRound.length === 1) {
        roundColumns.push(currentRound);
    }

    // Create bracket structure and display vote buttons for matchups
    roundColumns.forEach((round, roundIdx) => {
        const col = document.createElement('div');
        col.classList.add('round');
        round.forEach((matchup, matchupIdx) => {
            const div = document.createElement('div');
            div.classList.add('team');

            // Check if the matchup is an array (i.e., a pair of teams)
            if (Array.isArray(matchup) && matchup.length === 2 && matchup[0] && matchup[1]) {

                const [team1, team2] = matchup;

                const div = document.createElement('div');
                div.classList.add('team');

                const matchupDiv = document.createElement('div');
                matchupDiv.classList.add('matchup');
                matchupDiv.id = `matchup-${roundIdx}-${matchupIdx}`;
                matchupDiv.innerHTML = `${team1} vs ${team2}`;

                // Add vote buttons
                const voteButtons = document.createElement('div');
                voteButtons.classList.add('vote-buttons');

                const team1Button = document.createElement('button');
                team1Button.textContent = `Vote for ${team1}`;
                team1Button.onclick = () => socket.emit('vote', [team1, team2], team1);

                const team2Button = document.createElement('button');
                team2Button.textContent = `Vote for ${team2}`;
                team2Button.onclick = () => socket.emit('vote', [team1, team2], team2);

                voteButtons.appendChild(team1Button);
                voteButtons.appendChild(team2Button);
                matchupDiv.appendChild(voteButtons);
                div.appendChild(matchupDiv);

                col.appendChild(div);
            } else {
                div.textContent = matchup;
            }

            col.appendChild(div);
        });
        bracket.appendChild(col);
    });

    isUpdatingBracket = false;
});
