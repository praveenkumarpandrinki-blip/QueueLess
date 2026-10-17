import { useEffect, useState } from "react";

function BookAppointment({ onNavigate }) {
  const [services, setServices] = useState([]);
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/services")
      .then((response) => response.json())
      .then((data) => {
        setServices(data);
      })
      .catch(() => {
        setMessage("Unable to load services.");
      });
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!serviceId || !date || !time) {
    setMessage("Please fill all fields.");
    return;
  }

  const token = localStorage.getItem("token");

  try {
    const response = await fetch(
      "http://localhost:5000/api/appointments",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          serviceId,
          date,
          time
        })
      }
    );

    const data = await response.json();

    if (response.ok) {
      setMessage(
        `Appointment booked with token number ${data.tokenNumber}.`
      );
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
        <h2>Book Appointment</h2>
        <p>Select a service, date, and time.</p>

        <form onSubmit={handleSubmit}>
          <select
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            required
          >
            <option value="">Select Service</option>

            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} - {service.duration} min
              </option>
            ))}
          </select>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />

          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />

          <button type="submit">
            Continue
          </button>
        </form>

        {message && <p>{message}</p>}

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

export default BookAppointment;