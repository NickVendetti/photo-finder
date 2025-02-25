import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../api/client";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const response = await loginUser(formData);

      login(response.user, response.token);

      if (response.user.user_type === "PHOTOGRAPHER") {
        navigate("/profile-dashboard"); // Photographer dashboard
      } else {
        navigate("/discover"); // Regular users go to discovery page
      }
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h2>Login to PhotoApp</h2>

      {error && <div className="error-message">{error}</div>}

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          maxWidth: "300px",
          margin: "auto",
        }}
      >
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" className="auth-button" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p>Don&#39;t have an account?</p>
      <button
        onClick={() => navigate("/register")}
        style={{
          background: "#4CAF50",
          color: "white",
          padding: "10px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "10px",
        }}
      >
        Sign Up
      </button>
    </div>
  );
}
