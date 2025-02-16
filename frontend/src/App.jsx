import { Routes, Route } from "react-router-dom";
import DiscoveryPage from "./pages/DiscoveryPage";
import PhotoDetailsPage from "./pages/PhotoDetailsPage";
import LandingPage from "./pages/LandingPage";
import Register from "./pages/Register";
import ProfileDashboard from "./pages/PhotographerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

// export enum UserType {
//   USER,
//   PHOTOGRAPHER
// }

function App() {
  const { isAuthenticated, userType } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
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
    </Routes>
  );
}

export default App;
