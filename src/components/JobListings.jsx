import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const JobListings = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }} data-testid="job-listings-container">
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom data-testid="job-listings-title">
          Job Listings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Job listings coming soon...
        </Typography>
      </Box>
    </Container>
  );
};

export default JobListings;