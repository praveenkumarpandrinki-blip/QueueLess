function Navbar({ onNavigate }) {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  const getInitials = (name) => {
    if (!name) return "U";

    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const handleLogout = () => {
    // Remove login information
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Force the application to reload
    // so Navbar immediately detects that the user is logged out
    window.location.href = "/";
  };

  const handleSettings = () => {
    onNavigate("settings");
  };

  const handleAdminRequest = () => {
    onNavigate("admin-request");
  };

  return (
    <nav className="navbar">

      <div
        className="navbar-logo"
        onClick={() => onNavigate("home")}
      >
        QueueLess
      </div>

      <div className="navbar-right">

        {!token || !user ? (
          <button
            className="navbar-login"
            onClick={() => onNavigate("login")}
          >
            Login
          </button>
        ) : (
          <div className="profile-area">

            {/* Admin Access Request */}
            {user.role !== "admin" && (
              <button
                className="admin-request-button"
                title="Request Admin Access"
                onClick={handleAdminRequest}
              >
                ?
              </button>
            )}

            {/* Profile */}
            <details className="profile-container">

              <summary className="profile-button">
                {getInitials(user.name)}
              </summary>

              <div className="profile-menu">

                <h3>Profile</h3>

                <div className="profile-info">
                  <span>Name</span>
                  <strong>
                    {user.name || "Not available"}
                  </strong>
                </div>

                <div className="profile-info">
                  <span>Email</span>
                  <strong>
                    {user.email || "Not available"}
                  </strong>
                </div>

                <div className="profile-info">
                  <span>Phone</span>
                  <strong>
                    {user.phone || "Not available"}
                  </strong>
                </div>

                <div className="profile-info">
                  <span>Role</span>
                  <strong>
                    {user.role || "customer"}
                  </strong>
                </div>

                {/* Settings */}
                <button
                  type="button"
                  className="profile-settings"
                  onClick={handleSettings}
                >
                  ⚙️ Settings
                </button>

                {/* Logout */}
                <button
                  type="button"
                  className="profile-logout"
                  onClick={handleLogout}
                >
                  🚪 Logout
                </button>

              </div>

            </details>

          </div>
        )}

      </div>

    </nav>
  );
}

export default Navbar;