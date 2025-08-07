import React, { createContext, useContext, useEffect } from 'react';

const LoggingContext = createContext();

export const useLogging = () => {
  const context = useContext(LoggingContext);
  if (!context) {
    throw new Error('useLogging must be used within a LoggingProvider');
  }
  return context;
};

export const LoggingProvider = ({ children }) => {
  const logAction = (action, details = {}) => {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      action,
      details,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Get existing logs
    const existingLogs = JSON.parse(localStorage.getItem('jobPortalLogs') || '[]');
    existingLogs.push(logEntry);
    
    // Keep only last 1000 logs to prevent storage overflow
    if (existingLogs.length > 1000) {
      existingLogs.splice(0, existingLogs.length - 1000);
    }
    
    // Save to localStorage
    localStorage.setItem('jobPortalLogs', JSON.stringify(existingLogs));
    
    // Update hidden DOM element for automation access
    const logElement = document.getElementById('automation-logs');
    if (logElement) {
      logElement.setAttribute('data-logs', JSON.stringify(existingLogs));
      logElement.textContent = JSON.stringify(existingLogs);
    }

    console.log('Action logged:', logEntry);
  };

  const getLogs = () => {
    return JSON.parse(localStorage.getItem('jobPortalLogs') || '[]');
  };

  const clearLogs = () => {
    localStorage.removeItem('jobPortalLogs');
    const logElement = document.getElementById('automation-logs');
    if (logElement) {
      logElement.setAttribute('data-logs', '[]');
      logElement.textContent = '[]';
    }
  };

  // Update DOM element on mount
  useEffect(() => {
    const logs = getLogs();
    const logElement = document.getElementById('automation-logs');
    if (logElement) {
      logElement.setAttribute('data-logs', JSON.stringify(logs));
      logElement.textContent = JSON.stringify(logs);
    }
  }, []);

  const value = {
    logAction,
    getLogs,
    clearLogs
  };

  return (
    <LoggingContext.Provider value={value}>
      {children}
    </LoggingContext.Provider>
  );
};