import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";
const Navbar = () => {
  const { isAuthenticated, userType, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          📸 PhotoApp
        </Link>

        <ul className="nav-links">
          {isAuthenticated && userType === "USER" && (
            <li>
              <Link to="/discover">Discover</Link>
            </li>
          )}

          {isAuthenticated && userType === "PHOTOGRAPHER" && (
            <div className="nav-links">
              <li>
                <Link to="/profile-dashboard">Photographer Dashboard</Link>
              </li>
              <li>
                <Link to="/manage-bookings">Manage Bookings</Link>
              </li>
            </div>
          )}

          {isAuthenticated ? (
            <li>
              <button className="logout-btn" onClick={logout}>
                Logout
              </button>
            </li>
          ) : (
            <li>
              <Link to="/login">Login</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
