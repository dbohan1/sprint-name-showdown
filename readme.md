# Tournament Bracket Voting App

This is a real-time tournament bracket application built with Node.js, Express, and Socket.IO. Users can enter team names, which are paired into matchups. Users can vote on each matchup, and once a team receives more than 50% of the votes, it advances to the next round. The bracket is automatically updated and synchronized across all connected clients.

## Features

- Add teams to participate in the tournament
- Automatically generate matchups
- Real-time voting for each matchup
- Automatically advance the team that gets more than 50% of the votes
- Real-time updates across all clients using Socket.IO
- Hot reloading for both server and client during development

## Technologies Used

- Node.js
- Express
- Socket.IO
- Vanilla JavaScript (client-side)
- Nodemon (server hot reload)
- Livereload (client hot reload)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/bracket-voting-app.git
cd bracket-voting-app
npm install
```

## Running the app

```bash
npm run dev
```
This uses nodemon for the server and livereload for the frontend.

## Project Structure

```plaintext
.
├── public/                 # Static frontend files
│   ├── index.html          # HTML markup for the client
│   └── script.js           # Client-side JavaScript (Socket.IO + DOM updates)
├── server.js               # Express server with Socket.IO integration
├── bracket.js              # Bracket and voting logic
├── package.json            # Project metadata and dependencies
├── .gitignore              # Files and folders to ignore in git (e.g. node_modules)
└── README.md               # Project documentation
```
