import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import { AccountCircle, Work } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLogging } from '../context/LoggingContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { logAction } = useLogging();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path) => {
    logAction('navigation', { from: location.pathname, to: path });
    navigate(path);
  };

  const handleLogout = () => {
    logAction('logout', { userId: user?.id });
    logout();
    setAnchorEl(null);
    navigate('/login');
  };

  return (
    <AppBar position="static" data-testid="navbar">
      <Toolbar>
        <Work sx={{ mr: 2 }} data-testid="logo-icon" />
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => handleNavigation('/jobs')}
          data-testid="app-title"
        >
          Job Application Portal
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isAuthenticated ? (
            <>
              <Button 
                color="inherit"
                onClick={() => handleNavigation('/jobs')}
                data-testid="jobs-nav-button"
              >
                Jobs
              </Button>
              <Button 
                color="inherit"
                onClick={() => handleNavigation('/dashboard')}
                data-testid="dashboard-nav-button"
              >
                Dashboard
              </Button>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
                data-testid="user-menu-button"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                data-testid="user-menu"
              >
                <MenuItem onClick={handleClose} disabled data-testid="user-email">
                  {user?.email}
                </MenuItem>
                <MenuItem onClick={handleLogout} data-testid="logout-button">
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button 
                color="inherit"
                onClick={() => handleNavigation('/login')}
                data-testid="login-nav-button"
              >
                Login
              </Button>
              <Button 
                color="inherit"
                onClick={() => handleNavigation('/register')}
                data-testid="register-nav-button"
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;