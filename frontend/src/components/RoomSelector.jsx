const rooms = [
  { name: "General", icon: "✦", description: "Open conversation for everyone" },
  { name: "Tech Support", icon: "⌘", description: "Questions, fixes, and technical help" },
];

export default function RoomSelector({
  username,
  room,
  onRoomChange,
  onJoin,
  onBack,
  error,
  connectionStatus,
}) {
  return (
    <main className="welcome-shell">
      <section className="room-card" aria-labelledby="room-title">
        <button className="text-button back-button" onClick={onBack} type="button">
          ← Change name
        </button>
        <p className="eyebrow">Hello, {username}</p>
        <h1 id="room-title">Choose your room</h1>
        <p className="welcome-copy">Each room has its own conversation and online community.</p>

        <div className="room-options" role="radiogroup" aria-label="Chat rooms">
          {rooms.map((item) => (
            <button
              key={item.name}
              className={`room-option ${room === item.name ? "selected" : ""}`}
              onClick={() => onRoomChange(item.name)}
              role="radio"
              aria-checked={room === item.name}
              type="button"
            >
              <span className="room-icon" aria-hidden="true">{item.icon}</span>
              <span>
                <strong>{item.name}</strong>
                <small>{item.description}</small>
              </span>
              <span className="radio-mark" />
            </button>
          ))}
        </div>

        {error && <p className="form-error" role="alert">{error}</p>}
        <button
          className="primary-button"
          onClick={onJoin}
          disabled={connectionStatus !== "connected"}
          type="button"
        >
          Join {room} <span aria-hidden="true">→</span>
        </button>
      </section>
    </main>
  );
}
