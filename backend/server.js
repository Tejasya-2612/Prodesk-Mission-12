require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const PORT = Number(process.env.PORT) || 5000;
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: process.env.NODE_ENV === "production" ? allowedOrigins : true,
  methods: ["GET", "POST"],
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    name: "Real-Time Multi-Room Chat API",
    status: "online",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === "production" ? allowedOrigins : "*",
    methods: ["GET", "POST"],
  },
});

const VALID_ROOMS = new Set(["General", "Tech Support"]);
const users = new Map();

function cleanText(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function roomUserCount(room) {
  let count = 0;
  users.forEach((user) => {
    if (user.room === room) count += 1;
  });
  return count;
}

function emitRoomCount(room) {
  io.to(room).emit("online_users", {
    room,
    count: roomUserCount(room),
  });
}

function systemMessage(message, room) {
  return {
    id: `system-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type: "system",
    username: "System",
    room,
    message,
    timestamp: new Date().toISOString(),
  };
}

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("join_room", (payload, acknowledgement) => {
    const room = cleanText(typeof payload === "string" ? payload : payload?.room, 50);
    const username = cleanText(payload?.username, 30);

    if (!VALID_ROOMS.has(room) || !username) {
      acknowledgement?.({ ok: false, error: "A valid username and room are required." });
      return;
    }

    const previousUser = users.get(socket.id);
    if (previousUser?.room === room && previousUser.username === username) {
      acknowledgement?.({ ok: true, room, count: roomUserCount(room) });
      return;
    }

    if (previousUser?.room) {
      socket.leave(previousUser.room);
      socket.to(previousUser.room).emit(
        "room_notification",
        systemMessage(`${previousUser.username} left the room`, previousUser.room),
      );
      emitRoomCount(previousUser.room);
    }

    socket.join(room);
    users.set(socket.id, { username, room });

    socket.to(room).emit(
      "room_notification",
      systemMessage(`${username} joined ${room}`, room),
    );
    emitRoomCount(room);
    acknowledgement?.({ ok: true, room, count: roomUserCount(room) });
  });

  socket.on("leave_room", () => {
    const user = users.get(socket.id);
    if (!user) return;

    socket.leave(user.room);
    users.delete(socket.id);
    socket.to(user.room).emit(
      "room_notification",
      systemMessage(`${user.username} left the room`, user.room),
    );
    emitRoomCount(user.room);
  });

  socket.on("send_message", (payload, acknowledgement) => {
    const user = users.get(socket.id);
    const message = cleanText(payload?.message, 1000);

    if (!user || !message || payload?.room !== user.room) {
      acknowledgement?.({ ok: false, error: "Unable to send this message." });
      return;
    }

    const data = {
      id: `${socket.id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type: "message",
      username: user.username,
      room: user.room,
      message,
      timestamp: new Date().toISOString(),
      senderId: socket.id,
    };

    io.to(user.room).emit("receive_message", data);
    acknowledgement?.({ ok: true, id: data.id });
  });

  socket.on("typing", (payload) => {
    const user = users.get(socket.id);
    if (!user || payload?.room !== user.room) return;

    socket.to(user.room).emit("user_typing", {
      username: user.username,
      room: user.room,
    });
  });

  socket.on("stop_typing", () => {
    const user = users.get(socket.id);
    if (user) socket.to(user.room).emit("user_stopped_typing", user.username);
  });

  socket.on("disconnect", () => {
    const user = users.get(socket.id);
    if (user) {
      users.delete(socket.id);
      socket.to(user.room).emit(
        "room_notification",
        systemMessage(`${user.username} left the room`, user.room),
      );
      emitRoomCount(user.room);
    }
    console.log("User Disconnected:", socket.id);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on port ${PORT}`);
});
