import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const JobDetails = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }} data-testid="job-details-container">
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom data-testid="job-details-title">
          Job Details
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Job details coming soon...
        </Typography>
      </Box>
    </Container>
  );
};

export default JobDetails;