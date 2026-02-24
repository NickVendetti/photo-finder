import { Routes, Route, Navigate } from "react-router-dom";
import DiscoveryPage from "./pages/DiscoveryPage";
import Register from "./pages/Register";
import Login from "./pages/Login/Login";
import BookingManager from "./pages/BookingManager";
import ProfileDashboard from "./pages/PhotographerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import Booking from "./pages/Booking/Booking";
import Navbar from "./components/Navbar";
import PhotographerProfile from "./pages/PhotographerProfile/PhotographerProfile";

function App() {
  const { isAuthenticated, userType, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<DiscoveryPage />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/booking/:photographer_id"
          element={
            <ProtectedRoute
              element={<Booking />}
              allowedUserTypes={["USER"]}
              authenticationStatus={isAuthenticated}
              userType={userType}
            />
          }
        />

        <Route path="/discover" element={<Navigate to="/" replace />} />
        <Route path="/photographer/:id" element={<PhotographerProfile />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/profile-dashboard"
          element={
            <ProtectedRoute
              element={<ProfileDashboard />}
              allowedUserTypes={["PHOTOGRAPHER"]}
              authenticationStatus={isAuthenticated}
              userType={userType}
            />
          }
        />
        <Route
          path="/manage-bookings"
          element={
            <ProtectedRoute
              element={<BookingManager />}
              allowedUserTypes={["PHOTOGRAPHER"]}
              authenticationStatus={isAuthenticated}
              userType={userType}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
