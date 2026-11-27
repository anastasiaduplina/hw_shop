import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext();

export const themes = {
  light: {
    background: '#fff6e8',
    card: '#fffdf7',
    text: '#2c2416',
    textSecondary: '#7a6548',
    primary: '#e67e22',
    secondary: '#f1c40f',
    accent: '#27ae60',
    border: '#f0d9b5',
    danger: '#e74c3c',
    success: '#27ae60',
    inputBg: '#fffaf0',
    tabBar: '#fffdf7',
    headerBg: '#fff3d6',
    rain: 'rgba(230, 126, 34, 0.35)',
  },
  dark: {
    background: '#1a1510',
    card: '#2a2118',
    text: '#fff4e0',
    textSecondary: '#c4a882',
    primary: '#f39c12',
    secondary: '#f1c40f',
    accent: '#2ecc71',
    border: '#4a3a28',
    danger: '#e74c3c',
    success: '#2ecc71',
    inputBg: '#33281c',
    tabBar: '#2a2118',
    headerBg: '#241c14',
    rain: 'rgba(46, 204, 113, 0.4)',
  },
};

export function ThemeProvider({ children }) {
  const [themeName, setThemeName] = useState('light');

  useEffect(() => {
    AsyncStorage.getItem('theme').then((saved) => {
      if (saved === 'light' || saved === 'dark') {
        setThemeName(saved);
      }
    });
  }, []);

  const toggleTheme = async () => {
    const next = themeName === 'light' ? 'dark' : 'light';
    setThemeName(next);
    await AsyncStorage.setItem('theme', next);
  };

  const setTheme = async (name) => {
    setThemeName(name);
    await AsyncStorage.setItem('theme', name);
  };

  const colors = themes[themeName];

  return (
    <ThemeContext.Provider value={{ themeName, colors, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
