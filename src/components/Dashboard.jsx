import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLogging } from '../context/LoggingContext';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { getLogs } = useLogging();
  const [applications, setApplications] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Get user's applications from localStorage
      const userApplications = JSON.parse(localStorage.getItem('jobApplications') || '[]')
        .filter(app => app.userId === user.id);
      setApplications(userApplications);
      
      // Get logs
      setLogs(getLogs().slice(-10)); // Show last 10 actions
    }
  }, [isAuthenticated, user, getLogs]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }} data-testid="dashboard-container">
      <Typography variant="h4" component="h1" gutterBottom data-testid="dashboard-title">
        Dashboard
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3 }} data-testid="welcome-message">
        Welcome back, {user?.name}!
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom data-testid="applications-title">
              Your Applications ({applications.length})
            </Typography>
            
            {applications.length === 0 ? (
              <Typography color="text.secondary" data-testid="no-applications">
                You haven't applied to any jobs yet.
              </Typography>
            ) : (
              <List data-testid="applications-list">
                {applications.map((app, index) => (
                  <ListItem key={index} divider data-testid={`application-${index}`}>
                    <ListItemText
                      primary={app.jobTitle}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Applied on: {new Date(app.submittedAt).toLocaleDateString()}
                          </Typography>
                          <Box sx={{ mt: 1 }}>
                            {app.skills?.slice(0, 3).map((skill, skillIndex) => (
                              <Chip 
                                key={skillIndex} 
                                label={skill} 
                                size="small" 
                                sx={{ mr: 0.5, mb: 0.5 }}
                              />
                            ))}
                            {app.skills?.length > 3 && (
                              <Chip 
                                label={`+${app.skills.length - 3} more`} 
                                size="small" 
                                variant="outlined"
                              />
                            )}
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom data-testid="activity-title">
              Recent Activity
            </Typography>
            
            {logs.length === 0 ? (
              <Typography color="text.secondary" data-testid="no-activity">
                No recent activity.
              </Typography>
            ) : (
              <List dense data-testid="activity-list">
                {logs.slice().reverse().map((log, index) => (
                  <ListItem key={index} data-testid={`activity-${index}`}>
                    <ListItemText
                      primary={log.action.replace(/_/g, ' ').toUpperCase()}
                      secondary={new Date(log.timestamp).toLocaleString()}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;