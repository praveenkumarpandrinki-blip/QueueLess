function Navbar({ onNavigate }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const getInitials = (name) => {
    if (!name) return "U";

    const parts = name.trim().split(" ");

    if (parts.length === 1) {
      return parts[0][0].toUpperCase();
    }

    return (
      parts[0][0] + parts[parts.length - 1][0]
    ).toUpperCase();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    onNavigate("home");
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
        {token && user ? (
          <details className="profile-container">
            <summary className="profile-button">
              {getInitials(user.name)}
            </summary>

            <div className="profile-menu">
              <h3>{user.name}</h3>

              <div className="profile-info">
                <span>Email</span>
                <strong>{user.email}</strong>
              </div>

              <div className="profile-info">
                <span>Phone</span>
                <strong>
                  {user.phone || "Not added"}
                </strong>
              </div>

              <div className="profile-info">
                <span>Role</span>
                <strong>
                  {user.role === "admin"
                    ? "Admin"
                    : "Customer"}
                </strong>
              </div>

              <button
                className="profile-logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </details>
        ) : (
          <button
            className="navbar-login"
            onClick={() => onNavigate("login")}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;