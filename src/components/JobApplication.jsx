import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const JobApplication = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }} data-testid="job-application-container">
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom data-testid="job-application-title">
          Job Application
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Job application form coming soon...
        </Typography>
      </Box>
    </Container>
  );
};

export default JobApplication;