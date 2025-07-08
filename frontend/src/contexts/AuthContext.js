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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('newsAggregatorUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate with dummy data
      
      // Commented out API call - replace with actual backend later
      /*
      const response = await axios.post('/api/auth/login', {
        username,
        password
      });
      const userData = response.data;
      */

      // Dummy user data for frontend testing - name based on username
      const userData = {
        id: 1,
        name: username,
        username: username,
        email: `${username}@example.com`,
        preferences: {
          categories: ['technology', 'politics'],
          sources: ['bbc', 'cnn'],
          viewMode: 'grid'
        },
        settings: {
          darkMode: false,
          compactView: false,
          articlesPerPage: 12,
          notifications: {
            breaking: true,
            daily: true
          }
        }
      };

      setUser(userData);
      localStorage.setItem('newsAggregatorUser', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Invalid credentials' };
    }
  };

  const register = async (username, email, password) => {
    try {
      // In a real app, this would be an API call
      // Commented out API call - replace with actual backend later
      /*
      const response = await axios.post('/api/auth/register', {
        username,
        email,
        password
      });
      const userData = response.data;
      */

      // Dummy user data for frontend testing
      const userData = {
        id: Date.now(), // Simple ID generation for demo
        name: username,
        username: username,
        email,
        preferences: {
          categories: [],
          sources: [],
          viewMode: 'grid'
        },
        settings: {
          darkMode: false,
          compactView: false,
          articlesPerPage: 12,
          notifications: {
            breaking: true,
            daily: true
          }
        }
      };

      setUser(userData);
      localStorage.setItem('newsAggregatorUser', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('newsAggregatorUser');
  };

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('newsAggregatorUser', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
