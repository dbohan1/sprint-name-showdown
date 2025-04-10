🏆 Real-Time Tournament Bracket Voting App
This project is a Node.js-based real-time voting application that lets users enter team names, automatically organizes them into matchups, and allows others to vote on each matchup. When one team receives >50% of the votes, it is automatically advanced to the next round. The bracket is displayed and updated in real time using Socket.IO, and hot reloading is supported on both the server and client sides.

⚙️ Tech Stack
Layer	Technology
Backend	Node.js, Express
Real-time	Socket.IO
Frontend	Vanilla JS + HTML
Dev Tools	Nodemon, LiveReload
📦 Installation
bash
Copy
Edit
git clone https://github.com/your-repo/bracket-voting-app.git
cd bracket-voting-app
npm install
🚀 Running the App
Start in development mode (with hot reload):

bash
Copy
Edit
npm run dev
This will:

Run the Express server via nodemon

Serve the client with live-reload support (auto-refresh on file changes)

Automatically reflect both server-side and client-side updates

🧠 Features
✅ Real-Time Bracket Syncing
All clients connected via Socket.IO receive live updates on the bracket state.

When a new team is added or a vote is cast, all clients are notified immediately.

✅ Team Registration
Teams can be added via a simple input form.

Once two or more teams are registered, matchups are generated and displayed.

✅ Matchup Voting Logic
Matchups are pairs of teams (e.g., Team A vs Team B).

Users vote on their preferred team using UI buttons.

When a team receives >50% of votes, it's automatically promoted to the next round.

✅ Bracket Rendering Rules
Only valid matchups of exactly 2 defined teams are shown.

No UI is shown for incomplete or invalid matchups.

Once a team is promoted, a new round is generated.

✅ Hot Reloading
Server side: Uses nodemon for automatic server restarts.

Client side: Uses livereload + middleware for automatic page reloads on changes to index.html or script.js.

📁 Project Structure
csharp
Copy
Edit
.
├── public/
│   ├── index.html       # Static frontend
│   └── script.js        # Client-side Socket.IO logic & DOM rendering
├── .gitignore           # Ignores node_modules, etc.
├── server.js            # Express + Socket.IO server
├── bracket.js           # Bracket logic & vote management
├── package.json
└── README.md
🔄 Vote Handling Algorithm
Each matchup is stored as a pair of team names: [team1, team2].

Votes are counted using an internal Map structure.

When a vote is cast:

The current vote count is updated

If one team surpasses 50% of total votes, it advances

Matchups are recalculated with the winners and re-broadcasted

js
Copy
Edit
// Pseudocode
onVote(matchup, selectedTeam) {
  voteCounts[matchup][selectedTeam]++;
  if (voteCounts[team] > totalVotes / 2) {
    advanceTeam(team);
  }
}
🧪 Development & Debugging
Run with npm run dev to automatically reload on code changes.

Use browser DevTools to monitor socket messages and DOM updates.

Debug server-side logic in bracket.js and server.js.

🚧 Future Enhancements
Authentication / user vote limits

Persistent team storage (MongoDB / SQLite)

Admin panel for managing tournament phases

Animated transitions between rounds

Match history or vote analytics

🛡 License
MIT