import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({  username: "" ,email: "", password: "", user_type: "user" });
  const [error, setError]= useState(null);
  const navigate = useNavigate(); // Initialize navigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("User Registered:", formData);
    // Send formData to backend API
 
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
      
      // Navigate to discovery page after successful register
      navigate("/discover");

    } catch (err) {
      setError(err.message);
      console.error("Registration error:", err);
    }
 
  };

   return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h2>Sign Up for Photo Finder</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "300px", margin: "auto" }}>
        <input type="username" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <button type="submit" style={{ background: "#4CAF50", color: "white" }}>Sign Up</button>
      </form>
    </div>
  );
}

export default Register;