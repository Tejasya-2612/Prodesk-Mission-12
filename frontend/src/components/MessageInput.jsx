import { useEffect, useRef, useState } from "react";
import { socket } from "../socket.js";

export default function MessageInput({ username, room, disabled }) {
  const [message, setMessage] = useState("");
  const [sendError, setSendError] = useState("");
  const typingTimer = useRef(null);

  useEffect(() => () => clearTimeout(typingTimer.current), []);

  const handleChange = (event) => {
    const nextMessage = event.target.value;
    setMessage(nextMessage);
    setSendError("");

    if (nextMessage.trim()) socket.emit("typing", { username, room });
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => socket.emit("stop_typing"), 1200);
  };

  const sendMessage = (event) => {
    event.preventDefault();
    const cleanMessage = message.trim();
    if (!cleanMessage || disabled) return;

    clearTimeout(typingTimer.current);
    socket.emit("stop_typing");
    socket.emit(
      "send_message",
      { username, room, message: cleanMessage },
      (response) => {
        if (!response?.ok) setSendError(response?.error || "Message could not be sent.");
      },
    );
    setMessage("");
  };

  return (
    <div className="composer-wrap">
      {sendError && <p className="send-error" role="alert">{sendError}</p>}
      <form className="composer" onSubmit={sendMessage}>
        <label className="sr-only" htmlFor="message-input">Message</label>
        <input
          id="message-input"
          value={message}
          onChange={handleChange}
          placeholder={`Message #${room.toLowerCase().replace(" ", "-")}`}
          maxLength={1000}
          disabled={disabled}
          autoComplete="off"
        />
        <button type="submit" disabled={!message.trim() || disabled} aria-label="Send message">
          <span>Send</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="m21 3-7.6 18-3.5-7-7-3.5L21 3Z" />
          </svg>
        </button>
      </form>
      <p className="composer-hint">Press Enter to send</p>
    </div>
  );
}
