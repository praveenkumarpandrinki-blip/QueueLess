import { useState } from "react";

function Login({ onNavigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (response.ok) {
  setMessage("Login successful!");

  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  setTimeout(() => {
  if (data.user.role === "admin") {
    onNavigate("admin");
  } else {
    onNavigate("dashboard");
  }
}, 800);
}
else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Unable to connect to server.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p>Login to your QueueLess account</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>

        {message && <p>{message}</p>}

        <button
          type="button"
          onClick={() => onNavigate("register")}
        >
          Don't have an account? Create Account
        </button>
      </div>
    </div>
  );
}

export default Login;