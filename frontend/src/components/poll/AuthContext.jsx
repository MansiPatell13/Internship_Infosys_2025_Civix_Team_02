import React, { createContext, useContext, useState } from "react";
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [jwt, setJwt] = useState(null);
  const [user, setUser] = useState(null);
  return (
    <AuthContext.Provider value={{ jwt, setJwt, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);


src/components/Auth/AuthContext.jsx