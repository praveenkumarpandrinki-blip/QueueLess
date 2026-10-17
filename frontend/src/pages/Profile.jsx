function Profile({ onNavigate }) {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="profile-page">
      <div className="profile-container-page">

        <div className="profile-header">
          <div className="profile-avatar">
            PK
          </div>

          <h1>Profile & Settings</h1>

          <p>
            Manage your QueueLess account details.
          </p>
        </div>

        <div className="profile-details">

          <div className="profile-row">
            <span>Full Name</span>
            <strong>
              {user?.name || "Not available"}
            </strong>
          </div>

          <div className="profile-row">
            <span>Email</span>
            <strong>
              {user?.email || "Not available"}
            </strong>
          </div>

          <div className="profile-row">
            <span>Phone Number</span>
            <strong>
              {user?.phone || "Not added"}
            </strong>
          </div>

          <div className="profile-row">
            <span>Role</span>
            <strong>
              {user?.role === "admin"
                ? "Admin"
                : "Customer"}
            </strong>
          </div>

        </div>

        <button
          className="back-dashboard-button"
          onClick={() => {
            if (user?.role === "admin") {
              onNavigate("admin");
            } else {
              onNavigate("dashboard");
            }
          }}
        >
          Back to Dashboard
        </button>

      </div>
    </div>
  );
}

export default Profile;