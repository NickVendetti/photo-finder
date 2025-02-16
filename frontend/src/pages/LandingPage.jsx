import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    console.log("Logging in:", formData);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Login failed. Please check your credentials.");
      }

      const data = await response.json();
      console.log("User Logged In:", data);

      // Store user data in local storage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user_type", data.user.user_type); 

      // Redirect based on user type
      if (data.user.user_type === "photographer") {
        navigate("/profile-dashboard"); // Photographer goes to their dashboard
      } else {
        navigate("/discover"); // Regular users go to the discovery page
      }

    } catch (err) {
      setError("Invalid email or password. Please try again.");
      console.error("Login error:", err);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h2>Welcome to Photo Finder</h2>
      <p>Log in to continue</p>

      <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "300px", margin: "auto" }}>
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />

        <button type="submit" style={{ background: "#008CBA", color: "white", padding: "10px", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          Log In
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Sign Up Button */}
      <p>Don't have an account?</p>
      <button
        onClick={() => navigate("/register")}
        style={{ background: "#4CAF50", color: "white", padding: "10px", border: "none", borderRadius: "5px", cursor: "pointer", marginTop: "10px" }}
      >
        Sign Up
      </button>
    </div>
  );
}

export default LandingPage;