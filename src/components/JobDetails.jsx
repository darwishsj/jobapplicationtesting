import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert
} from '@mui/material';
import {
  LocationOn,
  Work,
  AttachMoney,
  Business,
  CalendarToday,
  CheckCircle,
  Schedule
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLogging } from '../context/LoggingContext';

// Import data
import jobsData from '../data/jobs.json';
import companiesData from '../data/companies.json';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { logAction } = useLogging();
  
  const [job, setJob] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const jobId = parseInt(id);
    const foundJob = jobsData.find(j => j.id === jobId);
    
    if (foundJob) {
      setJob(foundJob);
      const foundCompany = companiesData.find(c => c.id === foundJob.companyId);
      setCompany(foundCompany);
      logAction('job_details_view', { jobId, jobTitle: foundJob.title });
    }
    
    setLoading(false);
  }, [id, logAction]);

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    logAction('apply_from_details', { jobId: job.id });
    navigate(`/jobs/${job.id}/apply`);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!job) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }} data-testid="job-not-found">
        <Alert severity="error">
          Job not found. The position you're looking for may have been removed or the link is invalid.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }} data-testid="job-details-container">
      <Paper elevation={2} sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom data-testid="job-details-title">
            {job.title}
          </Typography>
          
          {company && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Business sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h5" color="primary" data-testid="company-name">
                {company.name}
              </Typography>
            </Box>
          )}

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body1" data-testid="job-location">
                  {job.location}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Work sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body1" data-testid="job-type">
                  {job.type}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AttachMoney sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body1" data-testid="job-salary">
                  {job.salary}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body1" data-testid="posted-date">
                  Posted {new Date(job.postedDate).toLocaleDateString()}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Required Skills:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {job.skills.map((skill, index) => (
                <Chip 
                  key={index}
                  label={skill}
                  color="primary"
                  variant="outlined"
                  data-testid={`skill-chip-${index}`}
                />
              ))}
            </Box>
          </Box>

          <Button
            variant="contained"
            size="large"
            onClick={handleApplyClick}
            data-testid="apply-now-button"
            sx={{ mb: 3 }}
          >
            Apply for This Position
          </Button>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Job Description */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom data-testid="description-section">
            Job Description
          </Typography>
          <Typography variant="body1" paragraph data-testid="job-description">
            {job.description}
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Requirements */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom data-testid="requirements-section">
            Requirements
          </Typography>
          <List data-testid="requirements-list">
            {job.requirements.map((requirement, index) => (
              <ListItem key={index} data-testid={`requirement-${index}`}>
                <ListItemIcon>
                  <CheckCircle color="primary" />
                </ListItemIcon>
                <ListItemText primary={requirement} />
              </ListItem>
            ))}
          </List>
        </Box>

        {company && (
          <>
            <Divider sx={{ mb: 4 }} />
            
            {/* Company Information */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom data-testid="company-section">
                About {company.name}
              </Typography>
              <Typography variant="body1" paragraph data-testid="company-description">
                {company.description}
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Industry:</strong> {company.industry}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Company Size:</strong> {company.size}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Founded:</strong> {company.founded}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Location:</strong> {company.location}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </>
        )}

        <Divider sx={{ mb: 4 }} />

        {/* Application Deadline */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Schedule sx={{ mr: 1, color: 'warning.main' }} />
            <Typography variant="body2" color="text.secondary" data-testid="application-deadline">
              Application deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            size="large"
            onClick={handleApplyClick}
            data-testid="apply-bottom-button"
          >
            Apply Now
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default JobDetails;