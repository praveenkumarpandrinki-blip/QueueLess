import { useState } from "react";

function AdminAccessRequest({ onNavigate }) {
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  const [form, setForm] = useState({
    occupation: "",
    organization_name: "",
    organization_type: "",
    reason: "",
    responsibilities: []
  });

  const responsibilitiesList = [
    "Manage appointments",
    "Manage services",
    "Manage users",
    "Manage queues",
    "View reports"
  ];

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleResponsibility = (item) => {
    setForm((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.includes(item)
        ? prev.responsibilities.filter((r) => r !== item)
        : [...prev.responsibilities, item]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.responsibilities.length === 0) {
      alert("Please select at least one admin responsibility.");
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
        "http://localhost:5000/api/admin-requests",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            user_id: user.id,
            full_name: user.name,
            email: user.email,
            phone: user.phone,
            occupation: form.occupation,
            organization_name: form.organization_name,
            organization_type: form.organization_type,
            reason: form.reason,
            responsibilities: form.responsibilities.join(", ")
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Request failed.");
        return;
      }

      alert("Admin access request submitted successfully!");

      onNavigate("dashboard");
    } catch (error) {
      console.error(error);
      alert("Unable to connect to the server.");
    }
  };

  return (
    <main className="admin-request-page">
      <div className="admin-request-container">
        <h1>Request Admin Access</h1>

        <p>
          Submit your details to request administrator access to QueueLess.
        </p>

        <form onSubmit={handleSubmit}>
          <label>Full Name</label>

          <input
            value={user?.name || ""}
            readOnly
          />

          <label>Email</label>

          <input
            value={user?.email || ""}
            readOnly
          />

          <label>Phone Number</label>

          <input
            value={user?.phone || ""}
            readOnly
          />

          <label>Occupation / Position</label>

          <input
            type="text"
            name="occupation"
            value={form.occupation}
            onChange={handleChange}
            required
          />

          <label>Organization / Institution Name</label>

          <input
            type="text"
            name="organization_name"
            value={form.organization_name}
            onChange={handleChange}
            required
          />

          <label>Organization Type</label>

          <select
            name="organization_type"
            value={form.organization_type}
            onChange={handleChange}
            required
          >
            <option value="">
              Select organization type
            </option>

            <option value="Hospital">
              Hospital
            </option>

            <option value="Clinic">
              Clinic
            </option>

            <option value="College">
              College
            </option>

            <option value="University">
              University
            </option>

            <option value="Company">
              Company
            </option>

            <option value="Government Organization">
              Government Organization
            </option>

            <option value="Other">
              Other
            </option>
          </select>

          <label>Why do you need Admin Access?</label>

          <textarea
            name="reason"
            value={form.reason}
            onChange={handleChange}
            required
          />

          <label>Admin Responsibilities</label>

          <div className="responsibilities">
            {responsibilitiesList.map((item) => (
              <label key={item}>
                <input
                  type="checkbox"
                  checked={form.responsibilities.includes(item)}
                  onChange={() =>
                    handleResponsibility(item)
                  }
                />

                {item}
              </label>
            ))}
          </div>

          <button type="submit">
            Submit Admin Request
          </button>

          <button
            type="button"
            onClick={() => onNavigate("dashboard")}
          >
            Cancel
          </button>
        </form>
      </div>
    </main>
  );
}

export default AdminAccessRequest;