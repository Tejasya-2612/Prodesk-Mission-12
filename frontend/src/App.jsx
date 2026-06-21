import { useCallback, useEffect, useState } from "react";
import ChatRoom from "./components/ChatRoom.jsx";
import RoomSelector from "./components/RoomSelector.jsx";
import UsernameModal from "./components/UsernameModal.jsx";
import { socket } from "./socket.js";

export default function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("General");
  const [activeRoom, setActiveRoom] = useState("");
  const [initialOnlineCount, setInitialOnlineCount] = useState(1);
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [joinError, setJoinError] = useState("");

  useEffect(() => {
    const onConnect = () => setConnectionStatus("connected");
    const onDisconnect = () => setConnectionStatus("disconnected");
    const onConnectError = () => setConnectionStatus("disconnected");

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.connect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.disconnect();
    };
  }, []);

  const joinRoom = useCallback(() => {
    if (!username.trim() || !room) return;
    setJoinError("");

    socket.emit("join_room", { username: username.trim(), room }, (response) => {
      if (response?.ok) {
        setUsername(username.trim());
        setInitialOnlineCount(response.count || 1);
        setActiveRoom(room);
      } else {
        setJoinError(response?.error || "Could not join the room. Please try again.");
      }
    });
  }, [room, username]);

  const changeRoom = useCallback(
    (nextRoom) => {
      setRoom(nextRoom);
      setJoinError("");
      socket.emit("join_room", { username, room: nextRoom }, (response) => {
        if (response?.ok) {
          setInitialOnlineCount(response.count || 1);
          setActiveRoom(nextRoom);
        }
        else setJoinError(response?.error || "Could not switch rooms.");
      });
    },
    [username],
  );

  const leaveChat = useCallback(() => {
    socket.emit("leave_room");
    setActiveRoom("");
    setUsername("");
    setRoom("General");
  }, []);

  if (!username) {
    return (
      <UsernameModal
        onSubmit={setUsername}
        connectionStatus={connectionStatus}
      />
    );
  }

  if (!activeRoom) {
    return (
      <RoomSelector
        username={username}
        room={room}
        onRoomChange={setRoom}
        onJoin={joinRoom}
        onBack={() => setUsername("")}
        error={joinError}
        connectionStatus={connectionStatus}
      />
    );
  }

  return (
    <ChatRoom
      username={username}
      room={activeRoom}
      connectionStatus={connectionStatus}
      initialOnlineCount={initialOnlineCount}
      onRoomChange={changeRoom}
      onLeave={leaveChat}
    />
  );
}
