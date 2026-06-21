import { useEffect, useRef, useState } from "react";
import MessageInput from "./MessageInput.jsx";
import { socket } from "../socket.js";

const roomDetails = {
  General: { icon: "✦", description: "Open conversation for everyone" },
  "Tech Support": { icon: "⌘", description: "Questions, fixes, and technical help" },
};

function formatTime(timestamp) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

export default function ChatRoom({
  username,
  room,
  connectionStatus,
  initialOnlineCount,
  onRoomChange,
  onLeave,
}) {
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [onlineCount, setOnlineCount] = useState(initialOnlineCount);
  const messagesEndRef = useRef(null);
  const typingTimers = useRef(new Map());

  useEffect(() => {
    setMessages([]);
    setTypingUsers([]);
    setOnlineCount(initialOnlineCount);
  }, [room, initialOnlineCount]);

  useEffect(() => {
    const addMessage = (data) => {
      if (data.room !== room) return;
      setMessages((current) =>
        current.some((message) => message.id === data.id) ? current : [...current, data],
      );
    };

    const handleTyping = ({ username: typingUsername, room: typingRoom }) => {
      if (typingRoom !== room || typingUsername === username) return;
      setTypingUsers((current) =>
        current.includes(typingUsername) ? current : [...current, typingUsername],
      );
      clearTimeout(typingTimers.current.get(typingUsername));
      typingTimers.current.set(
        typingUsername,
        setTimeout(() => {
          setTypingUsers((current) => current.filter((name) => name !== typingUsername));
          typingTimers.current.delete(typingUsername);
        }, 2000),
      );
    };

    const stopTyping = (typingUsername) => {
      clearTimeout(typingTimers.current.get(typingUsername));
      typingTimers.current.delete(typingUsername);
      setTypingUsers((current) => current.filter((name) => name !== typingUsername));
    };

    const handleOnlineUsers = (data) => {
      if (data.room === room) setOnlineCount(data.count);
    };

    socket.on("receive_message", addMessage);
    socket.on("room_notification", addMessage);
    socket.on("user_typing", handleTyping);
    socket.on("user_stopped_typing", stopTyping);
    socket.on("online_users", handleOnlineUsers);

    return () => {
      socket.off("receive_message", addMessage);
      socket.off("room_notification", addMessage);
      socket.off("user_typing", handleTyping);
      socket.off("user_stopped_typing", stopTyping);
      socket.off("online_users", handleOnlineUsers);
      typingTimers.current.forEach(clearTimeout);
      typingTimers.current.clear();
    };
  }, [room, username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  const typingText =
    typingUsers.length === 1
      ? `${typingUsers[0]} is typing...`
      : typingUsers.length > 1
        ? `${typingUsers.slice(0, 2).join(" and ")} are typing...`
        : "";

  return (
    <main className="chat-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark small" aria-hidden="true"><span /><span /><span /></div>
          <div><strong>Relay</strong><small>Real-time chat</small></div>
        </div>

        <nav aria-label="Rooms">
          <p className="nav-label">Rooms</p>
          {Object.entries(roomDetails).map(([name, details]) => (
            <button
              key={name}
              className={`sidebar-room ${room === name ? "active" : ""}`}
              onClick={() => room !== name && onRoomChange(name)}
              type="button"
            >
              <span>{details.icon}</span>{name}
            </button>
          ))}
        </nav>

        <div className="profile-card">
          <span className="avatar">{username.charAt(0).toUpperCase()}</span>
          <span><strong>{username}</strong><small><i /> Online</small></span>
          <button onClick={onLeave} type="button" aria-label="Leave chat" title="Leave chat">↗</button>
        </div>
      </aside>

      <section className="chat-panel">
        <header className="chat-header">
          <div className="room-heading">
            <span className="header-icon">{roomDetails[room].icon}</span>
            <div>
              <div className="title-line">
                <h1>{room}</h1>
                <span className="room-badge">Room</span>
              </div>
              <p>{roomDetails[room].description}</p>
            </div>
          </div>
          <div className="online-count" title={`${onlineCount} people online`}>
            <span className="avatars" aria-hidden="true">
              <i>{username.charAt(0).toUpperCase()}</i><i>+</i>
            </span>
            <strong>{onlineCount} online</strong>
          </div>
        </header>

        <div className="message-list" aria-live="polite">
          <div className="room-welcome join-animation">
            <span>{roomDetails[room].icon}</span>
            <h2>Welcome to {room}</h2>
            <p>This is the beginning of the conversation. Say hello!</p>
          </div>

          {messages.map((item) => {
            if (item.type === "system") {
              return <div className="system-message" key={item.id}><span />{item.message}</div>;
            }

            const ownMessage = item.senderId === socket.id;
            return (
              <article className={`message-row ${ownMessage ? "own" : ""}`} key={item.id}>
                {!ownMessage && <span className="message-avatar">{item.username.charAt(0).toUpperCase()}</span>}
                <div className="message-body">
                  <div className="message-meta">
                    <strong>{ownMessage ? "You" : item.username}</strong>
                    <time dateTime={item.timestamp}>{formatTime(item.timestamp)}</time>
                  </div>
                  <div className="message-card">{item.message}</div>
                </div>
              </article>
            );
          })}

          <div className={`typing-indicator ${typingText ? "visible" : ""}`}>
            <span><i /><i /><i /></span>{typingText}
          </div>
          <div ref={messagesEndRef} />
        </div>

        {connectionStatus !== "connected" && (
          <div className="reconnect-banner">Connection lost. Reconnecting…</div>
        )}
        <MessageInput
          username={username}
          room={room}
          disabled={connectionStatus !== "connected"}
        />
      </section>
    </main>
  );
}
