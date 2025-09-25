import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import * as jwt_decode from "jwt-decode";
import { AuthContext } from "./AuthContextProvider";

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);
  const [user, setUser] = useState({});
  const [photographerId, setPhotographerId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Verify token expiration
          const decodedToken = jwt_decode.jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (decodedToken.exp > currentTime) {
            setIsAuthenticated(true);
            setUserType(decodedToken.user_type);

            const userId =
              decodedToken.user_type == "PHOTOGRAPHER" ? decodedToken.id : null;
            setPhotographerId(userId);
            const userData = localStorage.getItem("user");
            if (userData) {
              setUser(JSON.parse(userData));
            }
          } else {
            logout();
          }
        } catch (error) {
          console.error("Token validation error:", error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    const decodedToken = jwt_decode.jwtDecode(token);

    setIsAuthenticated(true);
    setUserType(decodedToken.user_type);
    setUser(userData);

    const photographerId =
      decodedToken.user_type == "PHOTOGRAPHER" ? decodedToken.id : null;
    setPhotographerId(photographerId);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUserType(null);
    setUser(null);
  };
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        photographerId,
        userType,
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
