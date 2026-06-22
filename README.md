# Relay — Real-Time Multi-Room Chat

Relay is a production-ready, full-stack chat application built with React, Express, and Socket.io. Users choose a display name, join an isolated room, exchange messages instantly, see typing activity and online counts, and move between rooms without refreshing the page.

## Deployment

Frontend URL: https://prodesk-mission-12.vercel.app/                                                                                                                
Backend URL: https://sprint12-chat-backend.onrender.com/

## Features

- Real-time, bidirectional messaging over Socket.io
- Two isolated rooms: **General** and **Tech Support**
- Required username onboarding and room selection
- Live typing indicators with automatic two-second expiry
- Join and leave notifications scoped to the active room
- Room-specific online user counts
- Message timestamps, sender labels, and distinct own-message cards
- Automatic message-list scrolling
- Connection-loss and reconnection feedback
- Responsive desktop and mobile interface with reduced-motion support
- StrictMode-safe event listener registration and message ID de-duplication
- Server-side payload validation, room validation, and message length limits
- Express health endpoint for deployment monitoring

## Technology Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite, Socket.io Client, modern CSS |
| Backend | Node.js, Express, Socket.io, CORS, dotenv |
| Deployment | Vercel (frontend), Render (backend) |

## Project Structure

```text
.
├── backend/
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatRoom.jsx
│   │   │   ├── MessageInput.jsx
│   │   │   ├── RoomSelector.jsx
│   │   │   └── UsernameModal.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── socket.js
│   │   └── styles.css
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── vercel.json
│   └── vite.config.js
├── package.json
├── prompts.md
├── render.yaml
└── README.md
```

## Installation

Requirements:

- Node.js 20 or newer
- npm 10 or newer

Open the project in VS Code from its Windows location:

```powershell
cd "C:\Prodesk-Mission-12"
code .
```

Install each application independently:

```bash
cd backend
npm install

cd ../frontend
npm install
```

Alternatively, from the repository root:

```powershell
cd "C:\Prodesk-Mission-12"
npm run install:all
```

## Run Locally

Open two terminals.

Terminal 1:

```powershell
cd "C:\Prodesk-Mission-12\backend"
npm start
```

Terminal 2:

```powershell
cd "C:\Prodesk-Mission-12\frontend"
npm run dev
```

Open `http://localhost:5173`. To verify room isolation and presence updates, open the URL in two browser windows and join different rooms or the same room with different names.

## Socket Events

| Event | Direction | Purpose |
| --- | --- | --- |
| `join_room` | Client → Server | Join or switch to a validated room |
| `leave_room` | Client → Server | Explicitly leave the current room |
| `send_message` | Client → Server | Submit a validated room message |
| `receive_message` | Server → Room | Deliver a message to room members |
| `typing` | Client → Server | Announce current typing activity |
| `user_typing` | Server → Room | Show a room member's typing state |
| `stop_typing` | Client → Server | End typing activity early |
| `room_notification` | Server → Room | Deliver join and leave notices |
| `online_users` | Server → Room | Publish current room occupancy |
| `disconnect` | Socket.io lifecycle | Remove disconnected users and update presence |

## Author

A TEJASYA
FULL STACK DEVELOPER INTERN 
PRODESK IT
P/IL/26/NOIDA/M1299


