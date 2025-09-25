import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { loginUser } from "../api/client";

function LandingPage() {
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser(formData);

      login(data.user);

      if (data.user.user_type === "PHOTOGRAPHER") {
        navigate("/profile-dashboard");
      } else {
        navigate("/discover");
      }
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h2>Welcome to Photo Finder</h2>
      <p>Log in to continue</p>

      <form
        onSubmit={handleLoginSubmit}
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

        <button
          type="submit"
          style={{
            background: "#008CBA",
            color: "white",
            padding: "10px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Log In
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Sign Up Button */}
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

export default LandingPage;
