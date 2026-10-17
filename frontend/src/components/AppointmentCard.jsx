function AppointmentCard({ appointment, onView }) {
  return (
    <div className="appointment-card">
      <div className="appointment-main">
        <div>
          <span className="appointment-label">SERVICE</span>
          <h3>{appointment.service}</h3>
        </div>

        <span className={`appointment-status ${appointment.status.toLowerCase()}`}>
          {appointment.status}
        </span>
      </div>

      <div className="appointment-info">
        <div>
          <span>Date</span>
          <strong>{appointment.date}</strong>
        </div>

        <div>
          <span>Time</span>
          <strong>{appointment.time}</strong>
        </div>

        <div>
          <span>Token</span>
          <strong>#{appointment.token}</strong>
        </div>
      </div>

      <button
        className="secondary-btn"
        onClick={() => onView(appointment)}
      >
        View Details
      </button>
    </div>
  );
}

export default AppointmentCard;