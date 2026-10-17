function AppointmentDetails({ onNavigate }) {
  const appointment = {
    service: "General Consultation",
    date: "20 October 2026",
    time: "10:30 AM",
    token: 18,
    status: "Upcoming",
    duration: "30 minutes"
  };

  return (
    <div className="details-page">
      <header className="details-header">
        <button
          className="back-button"
          onClick={() => onNavigate("appointments")}
        >
          ← Back to Appointments
        </button>

        <p>APPOINTMENT DETAILS</p>
        <h1>Your Appointment</h1>
      </header>

      <section className="details-card">
        <div className="details-top">
          <div>
            <span>SERVICE</span>
            <h2>{appointment.service}</h2>
          </div>

          <span
            className={`status-badge ${appointment.status.toLowerCase()}`}
          >
            {appointment.status}
          </span>
        </div>

        <div className="details-grid">
          <div>
            <span>Date</span>
            <strong>{appointment.date}</strong>
          </div>

          <div>
            <span>Time</span>
            <strong>{appointment.time}</strong>
          </div>

          <div>
            <span>Token Number</span>
            <strong>#{appointment.token}</strong>
          </div>

          <div>
            <span>Duration</span>
            <strong>{appointment.duration}</strong>
          </div>
        </div>

        <div className="details-actions">
          <button
            className="secondary-btn"
            onClick={() => onNavigate("queue")}
          >
            🎟️ Track Queue
          </button>

          <button
            className="primary-btn"
            onClick={() => onNavigate("appointments")}
          >
            Back to Appointments
          </button>
        </div>
      </section>
    </div>
  );
}

export default AppointmentDetails;