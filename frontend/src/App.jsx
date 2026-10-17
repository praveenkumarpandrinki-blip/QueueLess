import { useState } from "react";
import Navbar from "./Navbar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerDashboard from "./pages/CustomerDashboard";
import BookAppointment from "./pages/BookAppointment";
import MyAppointments from "./pages/MyAppointments";
import QueueStatus from "./pages/QueueStatus";
import AppointmentDetails from "./pages/AppointmentDetails";
import AdminDashboard from "./pages/AdminDashboard";

import "./App.css";
import "./Auth.css";

function App() {
  const [page, setPage] = useState("home");

  const handleNavigate = (newPage) => {
    setPage(newPage);
  };

  if (page === "login") {
    return <Login onNavigate={handleNavigate} />;
  }

  if (page === "register") {
    return <Register onNavigate={handleNavigate} />;
  }

  if (page === "dashboard") {
    return <CustomerDashboard onNavigate={handleNavigate} />;
  }

  if (page === "book") {
    return <BookAppointment onNavigate={handleNavigate} />;
  }

  if (page === "appointments") {
    return <MyAppointments onNavigate={handleNavigate} />;
  }

  if (page === "queue") {
    return <QueueStatus onNavigate={handleNavigate} />;
  }

  if (page === "details") {
    return <AppointmentDetails onNavigate={handleNavigate} />;
  }

  if (page === "admin") {
    return <AdminDashboard onNavigate={handleNavigate} />;
  }

  return (
    <>
      <Navbar onNavigate={handleNavigate} />

      <main className="hero">
        <div className="hero-content">

          <div className="hero-left">
            <div className="hero-badge">
              Smart Appointment & Queue Management
            </div>

            <h1>
              Skip the Line.
              <br />
              <span>Save Your Time.</span>
            </h1>

            <p className="hero-text">
              QueueLess makes appointments simple.
              Book your service, get a digital token,
              and track your queue without standing
              in long lines.
            </p>
          </div>

          <div className="hero-visual">
            <div className="queue-illustration">

              <div className="illustration-header">
                <span>QueueLess</span>
                <span className="live-dot">● Live</span>
              </div>

              <div className="token-display">
                <span className="token-label">
                  YOUR TOKEN
                </span>

                <strong>#18</strong>

                <span className="token-status">
                  Waiting
                </span>
              </div>

              <div className="queue-progress">
                <div className="progress-label">
                  <span>Queue progress</span>
                  <span>4 ahead</span>
                </div>

                <div className="progress-bar">
                  <div className="progress-fill"></div>
                </div>
              </div>

              <div className="wait-info">
                <div>
                  <small>People ahead</small>
                  <strong>4</strong>
                </div>

                <div>
                  <small>Estimated wait</small>
                  <strong>20 min</strong>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      <section className="features">
        <div className="section-heading">
          <p>HOW QUEUELESS HELPS</p>

          <h2>
            Everything you need to avoid
            unnecessary waiting.
          </h2>
        </div>

        <div className="feature-grid">

          <div className="feature-card">
            <div className="feature-icon">
              📅
            </div>

            <h3>Easy Booking</h3>

            <p>
              Choose your service, date and time
              and book your appointment in just
              a few simple steps.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              🎫
            </div>

            <h3>Digital Tokens</h3>

            <p>
              Get a digital token after booking
              instead of standing in a physical
              queue.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              📍
            </div>

            <h3>Track Your Queue</h3>

            <p>
              Know your token number, see how many
              people are ahead of you and check
              your estimated waiting time.
            </p>
          </div>

        </div>
      </section>

      <section className="about">
        <div className="about-content">

          <p className="about-label">
            ABOUT QUEUELESS
          </p>

          <h2>
            Less waiting.
            <br />
            More time for what matters.
          </h2>

          <p>
            QueueLess is a full-stack appointment
            and queue management system designed
            to make service appointments faster,
            clearer and easier for both customers
            and administrators.
          </p>

        </div>
      </section>
    </>
  );
}

export default App;