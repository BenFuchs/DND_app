import React, { createContext, useContext, useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { getTheme } from "../colors/colorPalette";

// Define Theme Context
const ThemeContext = createContext({
  isDarkMode: false,
  toggleTheme: () => {},
});

// Create Theme Provider Component
export const ThemeProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Load saved theme from localStorage or default to system preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme === "dark";

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Toggle Theme Function
  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <ThemeProvider theme={getTheme(isDarkMode)}>
        <CssBaseline /> {/* Ensures MUI applies the correct background */}
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

// Custom Hook to use Theme Context
export const useTheme = () => useContext(ThemeContext);
