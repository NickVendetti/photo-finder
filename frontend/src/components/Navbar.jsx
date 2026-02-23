import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, userType, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-primary-600">
                📸 PhotoBook
              </span>
            </Link>
          </div>
          <div className="flex items-center">
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {isAuthenticated && userType === "USER" && (
                <Link
                  to="/discover"
                  className="text-neutral-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Discover
                </Link>
              )}
              {isAuthenticated && userType === "PHOTOGRAPHER" && (
                <>
                  <Link
                    to="/profile-dashboard"
                    className="text-neutral-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Photographer Dashboard
                  </Link>
                  <Link
                    to="/manage-bookings"
                    className="text-neutral-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Manage Bookings
                  </Link>
                </>
              )}
              {isAuthenticated ? (
                <button
                  onClick={logout}
                  className="text-neutral-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-neutral-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-primary-600 text-white hover:bg-primary-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
