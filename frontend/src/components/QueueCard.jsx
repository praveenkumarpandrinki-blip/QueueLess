function QueueCard({ token, peopleAhead, estimatedWait, status }) {
  return (
    <div className="queue-card">
      <div className="queue-card-header">
        <div>
          <span>YOUR QUEUE</span>
          <h2>Token #{token}</h2>
        </div>

        <span className={`status-badge ${status.toLowerCase()}`}>
          {status}
        </span>
      </div>

      <div className="queue-token">
        {token}
      </div>

      <div className="queue-details">
        <div>
          <strong>{peopleAhead}</strong>
          <span>People Ahead</span>
        </div>

        <div>
          <strong>{estimatedWait} min</strong>
          <span>Estimated Wait</span>
        </div>
      </div>

      <p className="queue-message">
        We'll notify you when you're almost up.
      </p>
    </div>
  );
}

export default QueueCard;