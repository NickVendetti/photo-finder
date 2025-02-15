import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  // Handle login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    console.log("User Logging In:", loginData);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        throw new Error("Invalid email or password.");
      }

      const data = await response.json();
      console.log("User Logged In:", data);
      

      // Navigate to Discovery Page if login is successful
      navigate("/discover");

    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password.");
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(to bottom, #ff7e5f, #feb47b)" }}>
      <h1>Welcome to Photo Finder</h1>
      <p>Find photographers and stunning images.</p>

      {/* Login Form */}
      <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "300px", margin: "auto" }}>
        <input type="text" name="email" placeholder="Email" value={loginData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={loginData.password} onChange={handleChange} required />
        <button type="submit" style={{ background: "#008CBA", color: "white", padding: "10px", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          Login
        </button>
      </form>

      {/* Error Message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Sign Up Button (Redirects to Register Page) */}
      <button onClick={() => navigate("/register")} style={{ background: "#4CAF50", color: "white", padding: "10px", border: "none", borderRadius: "5px", cursor: "pointer", marginTop: "10px" }}>
        Sign Up
      </button>
    </div>
  );
}

export default LandingPage;