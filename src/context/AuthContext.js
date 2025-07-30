import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import mockAPI from '../services/api';

// Web-compatible storage
const createStorage = () => {
  if (Platform.OS === 'web') {
    return {
      getItemAsync: async (key) => {
        return localStorage.getItem(key);
      },
      setItemAsync: async (key, value) => {
        localStorage.setItem(key, value);
      },
      deleteItemAsync: async (key) => {
        localStorage.removeItem(key);
      }
    };
  } else {
    // Use expo-secure-store for mobile
    const SecureStore = require('expo-secure-store');
    return SecureStore;
  }
};

const storage = createStorage();
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const token = await storage.getItemAsync('userToken');
      const userData = await storage.getItemAsync('userData');
      
      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        mockAPI.currentUser = parsedUser;
        mockAPI.token = token;
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await mockAPI.login(email, password);
      
      // Salva dados no storage
      await storage.setItemAsync('userToken', response.token);
      await storage.setItemAsync('userData', JSON.stringify(response.user));
      
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await mockAPI.logout();
      
      // Remove dados do storage
      await storage.deleteItemAsync('userToken');
      await storage.deleteItemAsync('userData');
      
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
    isTeacher: user?.role === 'docente'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};