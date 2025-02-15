import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "", user_type: "user" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    console.log("User Registering:", formData);

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Registration failed. Please try again.");
      }

      const data = await response.json();
      console.log("User Registered:", data);
      alert("Registration successful! You can now log in.");

      // Navigate to Login Page after successful registration
      navigate("/");
    } catch (err) {
      setError("Registration failed. Please try again.");
      console.error("Registration error:", err);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h2>Sign Up for Photo Finder</h2>
      <form onSubmit={handleRegisterSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "300px", margin: "auto" }}>
        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />

        {/* User Type Dropdown */}
        <select name="user_type" value={formData.user_type} onChange={handleChange} required>
          <option value="user">User</option>
          <option value="photographer">Photographer</option>
        </select>

        <button type="submit" style={{ background: "#4CAF50", color: "white", padding: "10px", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          Sign Up
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Register;