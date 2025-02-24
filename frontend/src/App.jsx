import { Routes, Route } from "react-router-dom";
import DiscoveryPage from "./pages/DiscoveryPage";
import PhotoDetailsPage from "./pages/PhotoDetailsPage";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import BookingManager from "./pages/BookingManager";
import ProfileDashboard from "./pages/PhotographerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import Booking from "./pages/Booking";
import Navbar from "./components/Navbar";

function App() {
  const { isAuthenticated, userType } = useAuth();

  return (
    <div>
      <Navbar />
      <div style={{ paddingTop: "75px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
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

          <Route
            path="/discover"
            element={
              <ProtectedRoute
                element={<DiscoveryPage />}
                allowedUserTypes={["USER"]}
                authenticationStatus={isAuthenticated}
                userType={userType}
              />
            }
          />

          <Route
            path="/photo/:photoId"
            element={
              <ProtectedRoute
                element={<PhotoDetailsPage />}
                allowedUserTypes={["USER"]}
                authenticationStatus={isAuthenticated}
                userType={userType}
              />
            }
          />
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
    </div>
  );
}

export default App;
