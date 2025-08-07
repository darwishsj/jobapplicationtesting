import React, { useState, useEffect } from 'react';
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

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    captchaAnswer: ''
  });
  const [captchaValue, setCaptchaValue] = useState(0);
  const [captchaNumbers, setCaptchaNumbers] = useState({ num1: 0, num2: 0 });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, isAuthenticated } = useAuth();
  const { logAction } = useLogging();
  const navigate = useNavigate();

  // Generate a new captcha
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 50) + 1;
    const num2 = Math.floor(Math.random() * 50) + 1;
    const result = num1 + num2;
    setCaptchaValue(result);
    setCaptchaNumbers({ num1, num2 });
    return { num1, num2, result };
  };

  // Initialize captcha on component mount
  useEffect(() => {
    generateCaptcha();
  }, []);

  // Generate SVG captcha image
  const generateCaptchaSVG = () => {
    return (
      <svg 
        width="200" 
        height="60" 
        viewBox="0 0 200 60" 
        data-testid="captcha-svg"
        data-captcha-answer={captchaValue}
        style={{ border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#f9f9f9' }}
      >
        {/* Background noise lines */}
        <line x1="10" y1="15" x2="190" y2="45" stroke="#e0e0e0" strokeWidth="1" />
        <line x1="20" y1="45" x2="180" y2="15" stroke="#e0e0e0" strokeWidth="1" />
        <line x1="50" y1="10" x2="150" y2="50" stroke="#e0e0e0" strokeWidth="1" />
        
        {/* Question text */}
        <text 
          x="10" 
          y="30" 
          fill="#333" 
          fontSize="18" 
          fontFamily="Arial, sans-serif"
          fontWeight="bold"
        >
          {captchaNumbers.num1} + {captchaNumbers.num2} = ?
        </text>
        
        {/* Background dots */}
        <circle cx="160" cy="20" r="2" fill="#ddd" />
        <circle cx="170" cy="40" r="2" fill="#ddd" />
        <circle cx="30" cy="50" r="2" fill="#ddd" />
      </svg>
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      logAction('login_attempt', { 
        email: formData.email,
        captchaAttempt: formData.captchaAnswer,
        correctAnswer: captchaValue
      });

      await login(formData.email, formData.password, formData.captchaAnswer, captchaValue);
      
      logAction('login_success', { email: formData.email });
      navigate('/jobs');
    } catch (err) {
      setError(err.message);
      logAction('login_failed', { 
        email: formData.email, 
        error: err.message,
        captchaAttempt: formData.captchaAnswer,
        correctAnswer: captchaValue
      });
      
      // Generate new captcha on failed attempt
      generateCaptcha();
      setFormData(prev => ({ ...prev, captchaAnswer: '' }));
    } finally {
      setLoading(false);
    }
  };

  const refreshCaptcha = () => {
    generateCaptcha();
    setFormData(prev => ({ ...prev, captchaAnswer: '' }));
    logAction('captcha_refresh');
  };

  if (isAuthenticated) {
    return <Navigate to="/jobs" replace />;
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }} data-testid="login-container">
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom data-testid="login-title">
            Login
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please enter your credentials to access the job portal
          </Typography>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 2 }} 
            data-testid="login-error"
          >
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} data-testid="login-form">
          <Grid container spacing={3}>
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
                data-testid="password-input"
                autoComplete="current-password"
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Please solve the captcha:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  {generateCaptchaSVG()}
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={refreshCaptcha}
                    data-testid="refresh-captcha-button"
                  >
                    Refresh
                  </Button>
                </Box>
              </Box>
              <TextField
                fullWidth
                id="captchaAnswer"
                name="captchaAnswer"
                label="Captcha Answer"
                type="number"
                value={formData.captchaAnswer}
                onChange={handleChange}
                required
                data-testid="captcha-input"
                placeholder="Enter the sum"
              />
              {/* Hidden input for automation access to correct answer */}
              <input
                type="hidden"
                id="captcha-correct-answer"
                data-testid="captcha-correct-answer"
                value={captchaValue}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                data-testid="login-submit-button"
                sx={{ py: 1.5 }}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </Grid>
          </Grid>
        </form>

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2">
            Don't have an account?{' '}
            <Button 
              variant="text" 
              onClick={() => navigate('/register')}
              data-testid="go-to-register-button"
            >
              Register here
            </Button>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;