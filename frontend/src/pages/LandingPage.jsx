import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(to bottom, #ff7e5f, #feb47b)" }}>
      <h1>Welcome to Photo Finder</h1>
      <p>Find photographers and stunning images.</p>
      <button onClick={() => navigate("/discover")}>Start Exploring</button>
      <button onClick={() => navigate("/register")} style={{ background: "#4CAF50", color: "white" }}>
          Sign Up
        </button>
    </div>
  );
}

export default LandingPage;