import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Grid
} from '@mui/material';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLogging } from '../context/LoggingContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { register, isAuthenticated } = useAuth();
  const { logAction } = useLogging();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      logAction('registration_validation_failed', { errors: Object.keys(errors) });
      return;
    }

    setLoading(true);

    try {
      logAction('registration_attempt', { 
        email: formData.email,
        name: formData.name
      });

      await register(formData.name, formData.email, formData.password);
      
      logAction('registration_success', { 
        email: formData.email,
        name: formData.name
      });
      
      navigate('/jobs');
    } catch (err) {
      setErrors({ submit: err.message });
      logAction('registration_failed', { 
        email: formData.email, 
        error: err.message 
      });
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/jobs" replace />;
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }} data-testid="register-container">
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom data-testid="register-title">
            Register
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create your account to access the job portal
          </Typography>
        </Box>

        {errors.submit && (
          <Alert 
            severity="error" 
            sx={{ mb: 2 }} 
            data-testid="register-error"
          >
            {errors.submit}
          </Alert>
        )}

        <form onSubmit={handleSubmit} data-testid="register-form">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                error={!!errors.name}
                helperText={errors.name}
                data-testid="name-input"
                autoComplete="name"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                error={!!errors.email}
                helperText={errors.email}
                data-testid="email-input"
                autoComplete="email"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="password"
                name="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                error={!!errors.password}
                helperText={errors.password || 'Password must be at least 6 characters long'}
                data-testid="password-input"
                autoComplete="new-password"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                data-testid="confirm-password-input"
                autoComplete="new-password"
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                data-testid="register-submit-button"
                sx={{ py: 1.5 }}
              >
                {loading ? 'Creating Account...' : 'Register'}
              </Button>
            </Grid>
          </Grid>
        </form>

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2">
            Already have an account?{' '}
            <Button 
              variant="text" 
              onClick={() => navigate('/login')}
              data-testid="go-to-login-button"
            >
              Login here
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;