import { useEffect, useState } from "react";

function QueueStatus({ onNavigate }) {
  const [queue, setQueue] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/queue", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.tokenNumber) {
          setQueue(data);
        } else {
          setMessage(data.message || "No active queue found.");
        }
      })
      .catch(() => {
        setMessage("Unable to connect to server.");
      });
  }, []);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Queue Status</h2>
        <p>Track your position in the queue</p>

        {message && <p>{message}</p>}

        {queue && (
          <div>
            <h1>Token #{queue.tokenNumber}</h1>

            <p>
              <strong>People Ahead:</strong>{" "}
              {queue.peopleAhead}
            </p>

            <p>
              <strong>Estimated Wait:</strong>{" "}
              {queue.estimatedWait} minutes
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {queue.status}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {queue.appointmentDate}
            </p>

            <p>
              <strong>Time:</strong>{" "}
              {queue.appointmentTime}
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={() => onNavigate("dashboard")}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default QueueStatus;