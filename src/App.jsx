import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Components
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import JobListings from './components/JobListings';
import JobApplication from './components/JobApplication';
import JobDetails from './components/JobDetails';
import Dashboard from './components/Dashboard';

// Context
import { AuthProvider } from './context/AuthContext';
import { LoggingProvider } from './context/LoggingContext';

// Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DndProvider backend={HTML5Backend}>
        <AuthProvider>
          <LoggingProvider>
            <Router>
              <div className="App" data-testid="app-container">
                <Navbar />
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/jobs" element={<JobListings />} />
                  <Route path="/jobs/:id/apply" element={<JobApplication />} />
                  <Route path="/jobs/:id/details" element={<JobDetails />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/" element={<Navigate to="/jobs" replace />} />
                </Routes>
                {/* Hidden logging element for automation access */}
                <div 
                  id="automation-logs" 
                  data-testid="automation-logs" 
                  style={{ display: 'none' }}
                />
              </div>
            </Router>
          </LoggingProvider>
        </AuthProvider>
      </DndProvider>
    </ThemeProvider>
  );
}

export default App;
