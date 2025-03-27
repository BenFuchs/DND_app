import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import FriendsList from "./features/friends_list/FriendsList";
import { getTheme } from "../src/features/colors/colorPalette";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useTheme } from "./features/DarkModeSwitch/ThemeProviderWrapper";
import { AppBar, Toolbar, Button, IconButton, Container, Box, ThemeProvider, Drawer, List, ListItem, ListItemButton, ListItemText, useMediaQuery } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sheetID, roomName } = useParams();
  const { isDarkMode, toggleTheme } = useTheme();
  const theme = getTheme(isDarkMode);
  const isMobile = useMediaQuery("(max-width:756px)");

  const [isSidenavOpen, setIsSidenavOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isExcludedRoute = location.pathname === "/" || location.pathname === "/login";
  const openNav = () => setIsSidenavOpen(true);
  const closeNav = () => setIsSidenavOpen(false);
  const toggleDrawer = (open: boolean) => setIsDrawerOpen(open);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const buttonStyle = {
    backgroundColor: isDarkMode ? "#3F4F44" : "#AAB99A",
    color: isDarkMode ? "#ffffff" : "#000000DE",
    "&:hover": {
      backgroundColor: isDarkMode ? "#2C3930" : "#8F9F7D",
    },
  };

  const pages = [
    { path: "/sheets", label: "Sheets" },
    { path: `/game/${sheetID}`, label: "Main Sheet" },
    { path: `/game/${sheetID}/inventory`, label: "Inventory" },
    { path: `/game/${sheetID}/traits`, label: "Traits" },
    { path: `/game/${sheetID}/chat`, label: "Chat" },
    { path: `/game/${sheetID}/chat/${roomName}`, label: roomName },
    { path: "/", label: "About" },
    {path: '/login', label: "login"},
    {path: '/register', label: "register"},
    { path: "/orders", label: "Extra Sheets!" }
  ];

  const buttons = (
    <>
    {(location.pathname === "/" || location.pathname === "/login" || location.pathname === "/register") && (
      // Only render the login button if we're on the About, Login, or Register page
      <Button variant="contained" sx={buttonStyle} component={Link} to="/login">Log in</Button>
    )}

    {location.pathname === "/sheets" ? (
      // Only render the "Extra Sheets!" button on the /sheets page
      <Button key="/orders" variant="contained" sx={buttonStyle} component={Link} to="/orders">Extra Sheets!</Button>
    ) : location.pathname === "/orders" ? (
      // Render only the "Back to Sheets" button on the /orders page
      <Button key="/sheets" variant="contained" sx={buttonStyle} component={Link} to="/sheets">Character Sheets</Button>
    ) : (
      (location.pathname !== "/" && location.pathname !== "/login" && location.pathname !== "/register") && (
        pages.map(({ path, label }) => {
          // Skip rendering button for specific labels like 'About', 'Login', 'Register', and labels like 'Extra Sheets!'
          if (
            label === 'About' ||
            label === 'Login' ||
            label === 'Register' ||
            label === 'Extra Sheets!'
          ) return null;

          // Skip the current page, so it doesn't show a button for itself
          if (location.pathname === path) return null;

          // Render buttons only for pages that are different from the current one
          // If on a specific page, filter out the relevant options
          if (
            (location.pathname.startsWith(`/game/${sheetID}`) &&
              !["Sheets", "Main Sheet", "Inventory", "Traits", "Chat"].includes(label!))
          ) {
            return null;
          }

          return (
            <Button key={path} variant="contained" sx={buttonStyle} component={Link} to={path}>
              {label}
            </Button>
          );
        })
      )
    )}
  </>
  );
  

  const shouldShowLogout = location.pathname !== "/" && location.pathname !== "/login" && location.pathname !== '/register';

  return (  
    <ThemeProvider theme={theme}>
      <div>
        <AppBar position="sticky" sx={{ backgroundColor: theme.palette.background.default }}>
          <Toolbar>
            <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {isMobile ? (
                <>
                  <IconButton onClick={() => toggleDrawer(true)}>
                    <MenuIcon />
                  </IconButton>
                  <Drawer anchor="left" open={isDrawerOpen} onClose={() => toggleDrawer(false)}>
                    <List>
                      {buttons && buttons.props.children && buttons.props.children.map((btn: any, index: number) => (
                        <ListItem key={index} disablePadding>
                          <ListItemButton component={btn.props.component} to={btn.props.to} onClick={() => toggleDrawer(false)}>
                            <ListItemText primary={btn.props.children} />
                          </ListItemButton>
                        </ListItem>
                      ))}
                      <ListItem disablePadding>
                        <ListItemButton onClick={toggleTheme}>
                          <ListItemText primary="Toggle Theme" />
                          {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
                        </ListItemButton>
                      </ListItem>
                    </List>
                  </Drawer>
                </>
              ) : (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {buttons}
                  <IconButton onClick={toggleTheme}>
                    {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
                  </IconButton>
                </Box>
              )}
              {shouldShowLogout && (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button variant="contained" onClick={logout}>Logout</Button>
                  <Button variant="contained" onClick={openNav}>Friends List</Button>
                </Box>
              )}
            </Container>
          </Toolbar>
        </AppBar>
        {!isExcludedRoute && <FriendsList isSidenavOpen={isSidenavOpen} openNav={openNav} closeNav={closeNav} isDarkMode={isDarkMode} />}
        <div className="container mt-4">
          <Outlet />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Layout;
