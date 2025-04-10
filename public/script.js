const socket = io();
const form = document.getElementById('team-form');
const input = document.getElementById('team-input');
const list = document.getElementById('team-list');
const sidebarList = document.getElementById('sidebar-team-list');
const votingStatus = document.getElementById('voting-status');
const votingModal = document.getElementById('voting-modal');
const votingMessage = document.getElementById('voting-message');
const voteTeam1Button = document.getElementById('vote-team1');
const voteTeam2Button = document.getElementById('vote-team2');
const voteTeam1Count = document.getElementById('vote-team1-count');
const voteTeam2Count = document.getElementById('vote-team2-count');
const countdownTimer = document.getElementById('countdown-timer');
const winnerMessage = document.getElementById('winner-message');
const winnerModal = document.getElementById('winner-modal');

let currentVote = null;
let countdownInterval = null;
let remainingTime = 10.00; // 10 seconds in decimal

// Confetti effect
function startConfetti() {
    confetti.create(document.getElementById('confetti-canvas'), {
        resize: true,
        useWorker: true
    })({
        particleCount: 200,
        spread: 70,
        origin: { y: 0.6 }
    });
}

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
    sidebarList.innerHTML = '';

    for (let i = 0; i < teams.length; i += 2) {
        if (teams[i + 1]) {
            const pair = document.createElement('li');
            pair.classList.add('team-pair');
            pair.innerHTML = `
        <span class="team-name">${teams[i]}</span> ⚔️ <span class="team-name">${teams[i + 1]}</span>
        <button class="vote-button" onclick="startVote('${teams[i]}', '${teams[i + 1]}')">Fight!</button>
      `;
            list.appendChild(pair);
        }
    }

    teams.forEach((team) => {
        const teamItem = document.createElement('li');
        teamItem.textContent = team;
        sidebarList.appendChild(teamItem);
    });
});

socket.on('votingStarted', ({ team1, team2, endTime }) => {
    currentVote = { team1, team2, team1Votes: 0, team2Votes: 0 };
    votingMessage.textContent = `VOTE!`;

    // Reset the vote counts in the modal
    voteTeam1Count.textContent = `0 votes`;
    voteTeam2Count.textContent = `0 votes`;

    voteTeam1Button.textContent = `${team1}`;
    voteTeam2Button.textContent = `${team2}`;

    // Reset countdown
    remainingTime = 10.00;
    countdownTimer.textContent = remainingTime.toFixed(2);
    votingModal.style.display = 'flex';

    // Start the countdown
    if (countdownInterval) {
        clearInterval(countdownInterval); // Clear any existing interval
    }
    countdownInterval = setInterval(updateCountdown, 10); // Update every 10ms

    setTimeout(() => {
        socket.emit('endVote', { team1, team2 });
        votingModal.style.display = 'none';
        clearInterval(countdownInterval); // Stop the countdown when voting ends
    }, 10000); // 10 seconds
});

function updateCountdown() {
    if (remainingTime > 0) {
        remainingTime -= 0.01; // Decrease by 0.01 every 10ms (1 frame)
        countdownTimer.textContent = remainingTime.toFixed(2);
    } else {
        clearInterval(countdownInterval); // Stop the countdown when time reaches 0
    }
}

function startVote(team1, team2) {
    socket.emit('startVote', { team1, team2 });
}

function showEmoji(button) {
    const emoji = document.createElement('span');
    emoji.textContent = '👍';
    emoji.classList.add('emoji');
    button.appendChild(emoji);
    setTimeout(() => {
        emoji.remove();
    }, 1000); // Remove after 1 second
}

voteTeam1Button.addEventListener('click', () => {
    if (currentVote) {
        socket.emit('vote', { team: currentVote.team1 });
        showEmoji(voteTeam1Button);  // Show the emoji above Team 1 button
    }
});

voteTeam2Button.addEventListener('click', () => {
    if (currentVote) {
        socket.emit('vote', { team: currentVote.team2 });
        showEmoji(voteTeam2Button);  // Show the emoji above Team 2 button
    }
});

// Listen for voteEmoji events from the server to update vote counts
socket.on('voteEmoji', ({ team }) => {
    // Update the vote count displayed in the modal
    if (team === currentVote.team1) {
        currentVote.team1Votes += 1;
        voteTeam1Count.textContent = `${currentVote.team1Votes} votes`;
    } else if (team === currentVote.team2) {
        currentVote.team2Votes += 1;
        voteTeam2Count.textContent = `${currentVote.team2Votes} votes`;
    }
});

socket.on('voteResult', (result) => {
    const { winner, loser } = result;
    // Show confetti for the winning team
    startConfetti();
    // Show the victory message and update the voting status
    winnerModal.style.display = 'flex';
    winnerMessage.textContent = `${winner} Wins!`;
    setTimeout(() => {
        winnerModal.style.display = 'none';
    }, 3000); // Show the message for 3 seconds before updating the teams list
    socket.emit('updateTeams');
});
