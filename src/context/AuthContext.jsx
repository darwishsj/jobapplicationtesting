import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing session in localStorage
    const savedUser = localStorage.getItem('jobPortalUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (email, password, captchaAnswer, captchaValue) => {
    // Validate captcha
    if (parseInt(captchaAnswer) !== captchaValue) {
      throw new Error('Invalid captcha. Please try again.');
    }

    // Check if user exists in localStorage
    const users = JSON.parse(localStorage.getItem('jobPortalUsers') || '[]');
    const existingUser = users.find(u => u.email === email && u.password === password);
    
    if (!existingUser) {
      throw new Error('Invalid email or password.');
    }

    // Set user session
    const userData = {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      loginTime: new Date().toISOString()
    };

    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('jobPortalUser', JSON.stringify(userData));
    
    return userData;
  };

  const register = (name, email, password) => {
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('jobPortalUsers') || '[]');
    const existingUser = users.find(u => u.email === email);
    
    if (existingUser) {
      throw new Error('User with this email already exists.');
    }

    // Create new user
    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      registrationDate: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('jobPortalUsers', JSON.stringify(users));

    // Auto-login after registration
    const userData = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      loginTime: new Date().toISOString()
    };

    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('jobPortalUser', JSON.stringify(userData));
    
    return userData;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('jobPortalUser');
  };

  const value = {
    user,
    isAuthenticated,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};