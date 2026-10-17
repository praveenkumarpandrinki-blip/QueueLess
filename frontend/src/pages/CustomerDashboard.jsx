import Navbar from "../Navbar";

function CustomerDashboard({ onNavigate }) {
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  return (
    <>
      <Navbar onNavigate={onNavigate} />

      <main className="customer-dashboard">
        <div className="dashboard-container">

          {/* Welcome Section */}
          <section className="dashboard-welcome">
            <h1>Welcome to QueueLess</h1>

            <h2>
              Hello, {user?.name || "Customer"} 👋
            </h2>

            <p>
              Book an appointment without waiting in line.
            </p>
          </section>


          {/* Dashboard Cards */}
          <section className="dashboard-cards">

            {/* Book Appointment */}
            <div className="dashboard-card">
              <div className="card-icon">
                📅
              </div>

              <h3>
                Book Appointment
              </h3>

              <p>
                Choose a service, date and time
                and book your appointment easily.
              </p>

              <button
                type="button"
                onClick={() => onNavigate("book")}
              >
                Book Appointment
              </button>
            </div>


            {/* My Appointments */}
            <div className="dashboard-card">
              <div className="card-icon">
                📋
              </div>

              <h3>
                My Appointments
              </h3>

              <p>
                View your upcoming and previous
                appointments.
              </p>

              <button
                type="button"
                onClick={() => onNavigate("appointments")}
              >
                My Appointments
              </button>
            </div>


            {/* Queue Status */}
            <div className="dashboard-card">
              <div className="card-icon">
                🎫
              </div>

              <h3>
                Queue Status
              </h3>

              <p>
                Track your token number, people
                ahead and estimated waiting time.
              </p>

              <button
                type="button"
                onClick={() => onNavigate("queue")}
              >
                Check Queue
              </button>
            </div>

          </section>

        </div>
      </main>
    </>
  );
}

export default CustomerDashboard;