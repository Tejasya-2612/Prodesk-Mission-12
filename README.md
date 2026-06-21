# Relay — Real-Time Multi-Room Chat

Relay is a production-ready, full-stack chat application built with React, Express, and Socket.io. Users choose a display name, join an isolated room, exchange messages instantly, see typing activity and online counts, and move between rooms without refreshing the page.

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

## Environment Variables

Backend, in `backend/.env`:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
```

`CLIENT_URL` accepts a comma-separated list when more than one deployed frontend origin is allowed.

Frontend, in `frontend/.env`:

```env
VITE_BACKEND_URL=http://localhost:5000
```

The frontend defaults to `http://localhost:5000` when this variable is omitted locally.

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

## Deployment

### Backend on Render

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. In Render, choose **New → Blueprint** and connect the repository. Render reads `render.yaml` automatically. You can also create a Web Service manually with root directory `backend`, build command `npm install`, and start command `npm start`.
3. Set `CLIENT_URL` to the final Vercel URL, for example `https://relay-chat.vercel.app`. Do not add a trailing slash.
4. Deploy and copy the Render service URL, for example `https://relay-chat-api.onrender.com`.
5. Confirm `https://YOUR-RENDER-URL/health` returns a JSON response with `"status":"ok"`.

### Frontend on Vercel

1. Import the same repository into Vercel.
2. Set the project root directory to `frontend`.
3. Vercel detects Vite automatically. The build command is `npm run build` and the output directory is `dist`.
4. Add `VITE_BACKEND_URL` with the Render service URL. Do not add a trailing slash.
5. Deploy the frontend.
6. If the Vercel production URL changed, update `CLIENT_URL` in Render and redeploy the backend.

The included `vercel.json` preserves client-side routing, and `render.yaml` configures the backend health check and production start command.

## Screenshots

The interface includes three polished responsive views:

| View | What it shows |
| --- | --- |
| Username onboarding | Display-name validation and live server connection status |
| Room selection | General and Tech Support room cards with clear descriptions |
| Chat workspace | Room navigation, messages, timestamps, room badge, online count, typing activity, and responsive composer |

For portfolio submission, capture these views at desktop width and one chat view at mobile width after starting both local services. This keeps screenshots representative of the deployed build and avoids committing stale UI captures.

## Demo Video

A concise demo should show two browser windows joining the same room, instant two-way messaging, the typing indicator, online count changes, and a room switch proving message isolation. Finish by resizing one window to demonstrate the mobile layout. A 60–90 second screen recording covers the complete feature set without editing.

## Production Notes

- User and room state is held in memory, which is appropriate for one Render instance. Horizontal scaling requires a shared Socket.io adapter such as Redis.
- Chat history is intentionally session-only. Add a database if message persistence is required.
- In production, CORS is restricted to `CLIENT_URL`; local development accepts browser origins for convenience.
- Messages are plain React text nodes, so user-supplied HTML is not executed.

## License

This project is available for educational and portfolio use.
