import { useState } from "react";

function Settings({ onNavigate }) {
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || ""
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // ================================
  // PROFILE CHANGE
  // ================================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again.");
      onNavigate("login");
      return;
    }

    setSavingProfile(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            phone: form.phone
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update profile.");
        return;
      }

      // Save updated user information locally
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      alert("Profile updated successfully!");

      onNavigate("dashboard");

    } catch (error) {
      console.error(error);

      alert(
        "Unable to connect to the server."
      );

    } finally {
      setSavingProfile(false);
    }
  };


  // ================================
  // PASSWORD CHANGE
  // ================================

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (
      passwordForm.newPassword !==
      passwordForm.confirmPassword
    ) {
      alert("New passwords do not match.");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert(
        "New password must be at least 6 characters."
      );
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again.");
      onNavigate("login");
      return;
    }

    setChangingPassword(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            currentPassword:
              passwordForm.currentPassword,

            newPassword:
              passwordForm.newPassword
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
          "Failed to change password."
        );
        return;
      }

      alert(
        "Password changed successfully!"
      );

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

    } catch (error) {
      console.error(error);

      alert(
        "Unable to connect to the server."
      );

    } finally {
      setChangingPassword(false);
    }
  };


  // ================================
  // DELETE ACCOUNT
  // ================================

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete your QueueLess account?"
    );

    if (!confirmed) {
      return;
    }

    const secondConfirmation = window.confirm(
      "This action cannot be undone. Do you really want to delete your account?"
    );

    if (!secondConfirmation) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again.");
      onNavigate("login");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/account",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
          "Failed to delete account."
        );
        return;
      }

      // Remove login information
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      alert(
        "Your account has been deleted successfully."
      );

      // Return to home page
      onNavigate("home");

    } catch (error) {
      console.error(error);

      alert(
        "Unable to connect to the server."
      );
    }
  };


  return (
    <main className="settings-page">

      <div className="settings-container">

        {/* HEADER */}

        <div className="settings-header">

          <button
            type="button"
            className="secondary-button"
            onClick={() =>
              onNavigate("dashboard")
            }
          >
            ← Back
          </button>

          <h1>Settings</h1>

          <p>
            Manage your QueueLess account
            information and security.
          </p>

        </div>


        {/* ACCOUNT INFORMATION */}

        <section className="settings-section">

          <h2>Account Information</h2>

          <form onSubmit={handleSaveChanges}>

            <div className="settings-field">

              <label>
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />

            </div>


            <div className="settings-field">

              <label>
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />

            </div>


            <div className="settings-field">

              <label>
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
              />

            </div>


            <button
              type="submit"
              className="primary-button"
              disabled={savingProfile}
            >
              {savingProfile
                ? "Saving..."
                : "Save Changes"}
            </button>

          </form>

        </section>


        {/* CHANGE PASSWORD */}

        <section className="settings-section">

          <h2>Security</h2>

          <form onSubmit={handleChangePassword}>

            <div className="settings-field">

              <label>
                Current Password
              </label>

              <input
                type="password"
                name="currentPassword"
                value={
                  passwordForm.currentPassword
                }
                onChange={handlePasswordChange}
                required
              />

            </div>


            <div className="settings-field">

              <label>
                New Password
              </label>

              <input
                type="password"
                name="newPassword"
                value={
                  passwordForm.newPassword
                }
                onChange={handlePasswordChange}
                minLength="6"
                required
              />

            </div>


            <div className="settings-field">

              <label>
                Confirm New Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                value={
                  passwordForm.confirmPassword
                }
                onChange={handlePasswordChange}
                minLength="6"
                required
              />

            </div>


            <button
              type="submit"
              className="secondary-button settings-action"
              disabled={changingPassword}
            >
              {changingPassword
                ? "Changing Password..."
                : "🔒 Change Password"}
            </button>

          </form>

        </section>


        {/* DELETE ACCOUNT */}

        <section className="settings-section danger-zone">

          <h2>Account</h2>

          <p>
            Permanently delete your QueueLess
            account and account information.
          </p>

          <button
            type="button"
            className="danger-button settings-action"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </button>

        </section>

      </div>

    </main>
  );
}

export default Settings;