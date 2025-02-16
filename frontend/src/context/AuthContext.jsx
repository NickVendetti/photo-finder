import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);
  const [photographerId, setPhotographerId] = useState(null);

  const login = (user) => {
    setIsAuthenticated(true);
    console.log(user)
    console.log(user.user_type)
    setUserType(user.user_type)
    console.log('set user type to ', user.user_type)

    const photographerId = user.user_type == "PHOTOGRAPHER" ? user.id : null;
    console.log('photographerId ', photographerId);
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
