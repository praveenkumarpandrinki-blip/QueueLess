import { useEffect, useState } from "react";

function MyAppointments({ onNavigate }) {
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");

  const loadAppointments = () => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/my-appointments", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAppointments(data);
        } else {
          setMessage(data.message || "Unable to load appointments.");
        }
      })
      .catch(() => {
        setMessage("Unable to connect to server.");
      });
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleCancel = async (appointmentId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/my-appointments/${appointmentId}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Appointment cancelled successfully!");
        loadAppointments();
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Unable to connect to server.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>My Appointments</h2>
        <p>Your booked appointments</p>

        {message && <p>{message}</p>}

        {appointments.length === 0 && !message && (
          <p>No appointments found.</p>
        )}

        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "15px",
              marginBottom: "15px",
              textAlign: "left"
            }}
          >
            <h3>{appointment.service_name}</h3>

            <p>
              <strong>Date:</strong>{" "}
              {appointment.appointment_date}
            </p>

            <p>
              <strong>Time:</strong>{" "}
              {appointment.appointment_time}
            </p>

            <p>
              <strong>Token:</strong> #{appointment.token_number}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {appointment.status}
            </p>

            {appointment.status === "booked" && (
              <button
                type="button"
                onClick={() => handleCancel(appointment.id)}
                style={{
                  background: "#dc2626",
                  color: "white",
                  border: "none",
                  padding: "10px 15px",
                  borderRadius: "8px",
                  cursor: "pointer"
                }}
              >
                Cancel Appointment
              </button>
            )}
          </div>
        ))}

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

export default MyAppointments;