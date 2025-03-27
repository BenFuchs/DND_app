import { createTheme } from "@mui/material/styles";

export const getTheme = (isDarkMode: boolean) =>
  createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
      primary: {
        main: isDarkMode ? "#3F4F44" : "#AAB99A",
      },
      secondary: {
        main: isDarkMode ? "#DCD7C9" : "#727D73",
        contrastText: "#47008F",
      },
      background: {
        default: isDarkMode ? "#3F4F44" : "#AAB99A",
        paper: isDarkMode ? "#5e4b3c" : "#A27B5C", // Background color of sideNav
      },
      text: {
        primary: isDarkMode ? "#ffffff" : "#000000",
      },
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiInputBase-root": {
              color: isDarkMode ? "#ffffff" : "#000000", // Corrected text color
            },
            "& .MuiInputLabel-root": {
              color: isDarkMode ? "#D0DDD0" : "#727D73", // Label color
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: isDarkMode ? "#AAB99A" : "#3F4F44", // Focused label color
            },
            "& .MuiFilledInput-root": {
              backgroundColor: isDarkMode ? "#3F4F44" : "#AAB99A", // Input background
            },
            "& .MuiFilledInput-root:hover": {
              backgroundColor: isDarkMode ? "#5A6B5F" : "#8AA07C", // Hover background
            },
            "& .MuiFilledInput-root.Mui-focused": {
              backgroundColor: isDarkMode ? "#D0DDD0" : "#636C5E", // Focused background
            },
          },
        },
      },
    },
  });
