import { useEffect, useState } from "react";
import Navbar from "../Navbar";

function AdminDashboard({ onNavigate }) {
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      onNavigate("login");
      return;
    }

    fetch("http://localhost:5000/api/admin/appointments", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAppointments(data);
        } else {
          setMessage(
            data.message || "Unable to load appointments."
          );
        }
      })
      .catch(() => {
        setMessage("Unable to connect to server.");
      });
  }, [onNavigate]);

  return (
    <>
      <Navbar onNavigate={onNavigate} />

      <main className="admin-page">
        <div className="admin-container">

          {/* Header */}
          <div className="admin-header">
            <div>
              <h1>Admin Dashboard</h1>

              <p>
                Manage QueueLess appointments and monitor
                customer bookings.
              </p>
            </div>
          </div>


          {/* Message */}
          {message && (
            <div className="error-message">
              {message}
            </div>
          )}


          {/* Appointments */}
          {!message && appointments.length === 0 && (
            <div className="empty-message">
              No appointments found.
            </div>
          )}


          {appointments.map((appointment) => (
            <div
              className="admin-appointment"
              key={appointment.id}
            >
              <h3>
                {appointment.service_name}
              </h3>

              <p>
                <strong>Customer:</strong>{" "}
                {appointment.customer_name}
              </p>

              <p>
                <strong>Email:</strong>{" "}
                {appointment.email}
              </p>

              <p>
                <strong>Date:</strong>{" "}
                {appointment.appointment_date}
              </p>

              <p>
                <strong>Time:</strong>{" "}
                {appointment.appointment_time}
              </p>

              <p>
                <strong>Token:</strong>{" "}
                #{appointment.token_number}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {appointment.status}
              </p>
            </div>
          ))}

        </div>
      </main>
    </>
  );
}

export default AdminDashboard;