import { useState } from "react";

export default function UsernameModal({ onSubmit, connectionStatus }) {
  const [value, setValue] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const cleanName = value.trim().slice(0, 30);
    if (cleanName) onSubmit(cleanName);
  };

  return (
    <main className="welcome-shell">
      <section className="welcome-card" aria-labelledby="welcome-title">
        <div className="brand-mark" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p className="eyebrow">Welcome to Relay</p>
        <h1 id="welcome-title">Enter Your Name</h1>
        <p className="welcome-copy">
          Pick a name, choose a room, and join the conversation in real time.
        </p>

        <form onSubmit={handleSubmit} className="welcome-form">
          <label htmlFor="username">Display name</label>
          <input
            id="username"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="e.g. Nakul, Tejasya, John"
            maxLength={30}
            autoComplete="nickname"
            autoFocus
          />
          <button type="submit" disabled={!value.trim()}>
            Continue <span aria-hidden="true">→</span>
          </button>
        </form>

        <p className={`connection-note ${connectionStatus}`}>
          <span className="status-dot" />
          {connectionStatus === "connected" ? "Chat server online" : "Connecting to chat server"}
        </p>
      </section>
    </main>
  );
}
