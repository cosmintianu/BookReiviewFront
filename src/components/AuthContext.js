// AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Initialize user state with data from LocalStorage on component mount
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
        //setUser(storedUsername)

    }
   
  } );


  const login = (user) => {

    setUser(user);
    //console.log(userData);
  };

  const logout = () => {

    setUser(null);
    localStorage.removeItem('username');
    localStorage.removeItem('password');
  };
  
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
