import { useEffect, useState } from "react";
import Navbar from "../Navbar";

function AdminDashboard({ onNavigate }) {
  const [appointments, setAppointments] = useState([]);
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("");
  const [requestMessage, setRequestMessage] = useState("");

  const loadRequests = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      onNavigate("login");
      return;
    }

    fetch("http://localhost:5000/api/admin-requests", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRequests(data);
          setRequestMessage("");
        } else {
          setRequestMessage(
            data.message || "Unable to load admin access requests."
          );
        }
      })
      .catch(() => {
        setRequestMessage(
          "Unable to load admin access requests."
        );
      });
  };

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

    loadRequests();
  }, [onNavigate]);

  const handleApprove = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      onNavigate("login");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin-requests/${id}/approve`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to approve request.");
        return;
      }

      alert("Admin access approved successfully!");

      loadRequests();
    } catch (error) {
      alert("Unable to connect to server.");
    }
  };

  const handleReject = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      onNavigate("login");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/admin-requests/${id}/reject`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Unable to reject request.");
        return;
      }

      alert("Admin access request rejected.");

      loadRequests();
    } catch (error) {
      alert("Unable to connect to server.");
    }
  };

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

          {/* Admin Access Requests */}
          <section className="admin-requests-section">

            <div className="admin-requests-header">
              <h2>Admin Access Requests</h2>

              <p>
                Review and manage requests from customers
                who want administrator access.
              </p>
            </div>

            {requestMessage && (
              <div className="error-message">
                {requestMessage}
              </div>
            )}

            {requests.length === 0 && !requestMessage && (
              <div className="empty-message">
                No admin access requests found.
              </div>
            )}

            {requests.map((request) => (
              <div
                className="admin-request-card"
                key={request.id}
              >
                <h3>{request.full_name}</h3>

                <p>
                  <strong>Email:</strong>{" "}
                  {request.email}
                </p>

                <p>
                  <strong>Phone:</strong>{" "}
                  {request.phone}
                </p>

                <p>
                  <strong>Occupation:</strong>{" "}
                  {request.occupation}
                </p>

                <p>
                  <strong>Organization:</strong>{" "}
                  {request.organization_name}
                </p>

                <p>
                  <strong>Organization Type:</strong>{" "}
                  {request.organization_type}
                </p>

                <p>
                  <strong>Reason:</strong>{" "}
                  {request.reason}
                </p>

                <p>
                  <strong>Responsibilities:</strong>{" "}
                  {request.responsibilities}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {request.status}
                </p>

                {request.status === "pending" && (
                  <div className="request-actions">

                    <button
                      className="approve-button"
                      onClick={() =>
                        handleApprove(request.id)
                      }
                    >
                      Approve
                    </button>

                    <button
                      className="reject-button"
                      onClick={() =>
                        handleReject(request.id)
                      }
                    >
                      Reject
                    </button>

                  </div>
                )}

              </div>
            ))}

          </section>

        </div>
      </main>
    </>
  );
}

export default AdminDashboard;