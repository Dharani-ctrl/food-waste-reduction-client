import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Synchronously check local storage on initial render to prevent premature redirects
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        return JSON.parse(userInfo);
      } catch (error) {
        console.error('Error parsing user info', error);
        localStorage.removeItem('userInfo');
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      setUser(response.data);
      localStorage.setItem('userInfo', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Login failed');
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', userData);
      // Removed auto-login on register as per user request to redirect to login page
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Registration failed');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
