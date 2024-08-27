import { createContext, useState, useEffect } from 'react';
import { loginUser, registerUser, forgotPassword, resetPassword } from '../services/api'; 

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      setUser(userInfo);
    }
  }, []);

  const login = async (email, password) => {
    const { data } = await loginUser(email, password);
    localStorage.setItem('userInfo', JSON.stringify(data));
    setUser(data);
  };

  const register = async (username, email, password) => {
    const { data } = await registerUser(username, email, password);
    localStorage.setItem('userInfo', JSON.stringify(data));
  };

  const forgotPassword1 = async (email) => {
    await forgotPassword(email);
    // Handle success notification or redirect if needed
  };

  const resetPassword1 = async (id, token, password) => {
    await resetPassword(id, token, password);
    // Handle success notification or redirect if needed
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, forgotPassword1, resetPassword1, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext};
