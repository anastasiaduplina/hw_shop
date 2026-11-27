import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const saved = await AsyncStorage.getItem('currentUser');
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      const raw = await AsyncStorage.getItem('users');
      const users = raw ? JSON.parse(raw) : [];

      const exists = users.find((u) => u.email === email.toLowerCase());
      if (exists) {
        return { ok: false, error: 'userExists' };
      }

      const newUser = {
        id: Date.now().toString(),
        name,
        email: email.toLowerCase(),
        password,
      };

      users.push(newUser);
      await AsyncStorage.setItem('users', JSON.stringify(users));
      return { ok: true };
    } catch (e) {
      console.log(e);
      return { ok: false, error: 'orderError' };
    }
  };

  const login = async (email, password) => {
    try {
      const raw = await AsyncStorage.getItem('users');
      const users = raw ? JSON.parse(raw) : [];

      const found = users.find(
        (u) => u.email === email.toLowerCase() && u.password === password
      );

      if (!found) {
        return { ok: false, error: 'wrongData' };
      }

      const sessionUser = { id: found.id, name: found.name, email: found.email };
      setUser(sessionUser);
      await AsyncStorage.setItem('currentUser', JSON.stringify(sessionUser));
      return { ok: true };
    } catch (e) {
      console.log(e);
      return { ok: false, error: 'orderError' };
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
