import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);
  const [user, setUser] = useState({});
  const [photographerId, setPhotographerId] = useState(null);

  const login = (user) => {
    setIsAuthenticated(true);
    setUserType(user.user_type)

    setUser(user)

    const photographerId = user.user_type == "PHOTOGRAPHER" ? user.id : null;
    setPhotographerId(photographerId);
    
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserType(null);
  }
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        photographerId,
        userType,
        user,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
