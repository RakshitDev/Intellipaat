import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as authService from '../services/authService';

const AuthContext = createContext(null);
const SESSION_KEY = 'session';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    // On app start: was the user already logged in?
    AsyncStorage.getItem(SESSION_KEY)
      .then(raw => raw && setUser(JSON.parse(raw).user))
      .catch(() => AsyncStorage.removeItem(SESSION_KEY)) // corrupted session → treat as logged out
      .finally(() => setIsRestoring(false));
  }, []);

  // Throws on wrong credentials — the Login screen catches it and shows the error.
  const login = async (email, password) => {
    const session = await authService.login(email, password);
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session.user);
  };

  const logout = async () => {
    await AsyncStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isRestoring, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
