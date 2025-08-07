import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from '@mui/material';
import {
  LocationOn,
  Work,
  AttachMoney,
  Business,
  Search,
  FilterList,
  OpenInNew,
  Info
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLogging } from '../context/LoggingContext';

// Import data
import jobsData from '../data/jobs.json';
import companiesData from '../data/companies.json';
import skillsData from '../data/skills.json';

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [companyDialogOpen, setCompanyDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [hoveredCompany, setHoveredCompany] = useState(null);

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { logAction } = useLogging();

  useEffect(() => {
    setJobs(jobsData);
    setCompanies(companiesData);
    setFilteredJobs(jobsData);
    logAction('page_view', { page: 'job_listings', jobCount: jobsData.length });
  }, [logAction]);

  useEffect(() => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.requirements.some(req => 
          req.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (locationFilter) {
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (companyFilter) {
      filtered = filtered.filter(job => job.companyId === parseInt(companyFilter));
    }

    if (skillFilter) {
      filtered = filtered.filter(job =>
        job.skills.some(skill => skill.toLowerCase().includes(skillFilter.toLowerCase()))
      );
    }

    setFilteredJobs(filtered);
    logAction('job_search', { 
      searchTerm, 
      locationFilter, 
      companyFilter, 
      skillFilter,
      resultCount: filtered.length 
    });
  }, [searchTerm, locationFilter, companyFilter, skillFilter, jobs, logAction]);

  const getCompanyById = (companyId) => {
    return companies.find(company => company.id === companyId);
  };

  const handleApplyClick = (jobId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    logAction('apply_button_click', { jobId });
    navigate(`/jobs/${jobId}/apply`);
  };

  const handleViewDetails = (jobId) => {
    logAction('view_job_details', { jobId });
    // Open in new tab
    window.open(`/jobs/${jobId}/details`, '_blank');
  };

  const handleCompanyInfoClick = (company, event) => {
    event.stopPropagation();
    setSelectedCompany(company);
    setCompanyDialogOpen(true);
    logAction('company_info_click', { companyId: company.id });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setLocationFilter('');
    setCompanyFilter('');
    setSkillFilter('');
    logAction('clear_filters');
  };

  const uniqueLocations = [...new Set(jobs.map(job => job.location))];
  const uniqueSkills = [...new Set(jobs.flatMap(job => job.skills))];

  const CompanyTooltip = ({ company, children }) => (
    <Tooltip
      title={
        <Box sx={{ p: 1, maxWidth: 300 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
            {company.name}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {company.description}
          </Typography>
          <Typography variant="caption" color="inherit">
            {company.industry} • {company.size}
          </Typography>
          <br />
          <Typography variant="caption" color="inherit">
            Founded: {company.founded}
          </Typography>
        </Box>
      }
      arrow
      placement="top"
      onOpen={() => {
        setHoveredCompany(company);
        logAction('company_tooltip_hover', { companyId: company.id });
      }}
    >
      {children}
    </Tooltip>
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }} data-testid="job-listings-container">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom data-testid="job-listings-title">
          Job Opportunities
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Discover your next career opportunity from our curated selection of {jobs.length} available positions.
        </Typography>

        {/* Search and Filters */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              data-testid="job-search-input"
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Location</InputLabel>
              <Select
                value={locationFilter}
                label="Location"
                onChange={(e) => setLocationFilter(e.target.value)}
                data-testid="location-filter"
              >
                <MenuItem value="">All Locations</MenuItem>
                {uniqueLocations.map((location, index) => (
                  <MenuItem key={index} value={location}>{location}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Company</InputLabel>
              <Select
                value={companyFilter}
                label="Company"
                onChange={(e) => setCompanyFilter(e.target.value)}
                data-testid="company-filter"
              >
                <MenuItem value="">All Companies</MenuItem>
                {companies.map((company) => (
                  <MenuItem key={company.id} value={company.id}>{company.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Skill</InputLabel>
              <Select
                value={skillFilter}
                label="Skill"
                onChange={(e) => setSkillFilter(e.target.value)}
                data-testid="skill-filter"
              >
                <MenuItem value="">All Skills</MenuItem>
                {uniqueSkills.map((skill, index) => (
                  <MenuItem key={index} value={skill}>{skill}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button 
              variant="outlined" 
              startIcon={<FilterList />}
              onClick={clearFilters}
              data-testid="clear-filters-button"
              sx={{ height: '56px' }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>

        {/* Results count */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }} data-testid="results-count">
          Showing {filteredJobs.length} of {jobs.length} jobs
        </Typography>
      </Box>

      {filteredJobs.length === 0 ? (
        <Alert severity="info" data-testid="no-jobs-message">
          No jobs found matching your criteria. Try adjusting your filters.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredJobs.map((job) => {
            const company = getCompanyById(job.companyId);
            return (
              <Grid item xs={12} md={6} lg={4} key={job.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}
                  data-testid={`job-card-${job.id}`}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" component="h2" data-testid={`job-title-${job.id}`}>
                        {job.title}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleViewDetails(job.id)}
                        data-testid={`view-details-${job.id}`}
                        aria-label="View job details in new tab"
                      >
                        <OpenInNew fontSize="small" />
                      </IconButton>
                    </Box>

                    {company && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <CompanyTooltip company={company}>
                          <Box 
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              cursor: 'pointer',
                              '&:hover': { color: 'primary.main' }
                            }}
                            onClick={(e) => handleCompanyInfoClick(company, e)}
                            data-testid={`company-info-${job.id}`}
                          >
                            <Business sx={{ mr: 1, fontSize: 20 }} />
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {company.name}
                            </Typography>
                            <Info sx={{ ml: 0.5, fontSize: 16 }} />
                          </Box>
                        </CompanyTooltip>
                      </Box>
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOn sx={{ mr: 1, fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary" data-testid={`job-location-${job.id}`}>
                        {job.location}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Work sx={{ mr: 1, fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary" data-testid={`job-type-${job.id}`}>
                        {job.type}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AttachMoney sx={{ mr: 1, fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary" data-testid={`job-salary-${job.id}`}>
                        {job.salary}
                      </Typography>
                    </Box>

                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                      data-testid={`job-description-${job.id}`}
                    >
                      {job.description}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                        Required Skills:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {job.skills.slice(0, 4).map((skill, index) => (
                          <Chip 
                            key={index}
                            label={skill}
                            size="small"
                            variant="outlined"
                            data-testid={`job-skill-${job.id}-${index}`}
                          />
                        ))}
                        {job.skills.length > 4 && (
                          <Chip 
                            label={`+${job.skills.length - 4} more`}
                            size="small"
                            variant="outlined"
                            data-testid={`job-skills-more-${job.id}`}
                          />
                        )}
                      </Box>
                    </Box>

                    <Typography variant="caption" color="text.secondary">
                      Posted: {new Date(job.postedDate).toLocaleDateString()}
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => handleApplyClick(job.id)}
                      data-testid={`apply-button-${job.id}`}
                      sx={{ mr: 1 }}
                    >
                      Apply Now
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => handleViewDetails(job.id)}
                      data-testid={`view-job-description-${job.id}`}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Company Information Dialog with iframe */}
      <Dialog 
        open={companyDialogOpen} 
        onClose={() => setCompanyDialogOpen(false)}
        maxWidth="md"
        fullWidth
        data-testid="company-info-dialog"
      >
        {selectedCompany && (
          <>
            <DialogTitle data-testid="company-dialog-title">
              {selectedCompany.name}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body1" paragraph data-testid="company-dialog-description">
                    {selectedCompany.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    <strong>Industry:</strong> {selectedCompany.industry}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    <strong>Company Size:</strong> {selectedCompany.size}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    <strong>Founded:</strong> {selectedCompany.founded}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Location:</strong> {selectedCompany.location}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box 
                    sx={{ 
                      width: '100%', 
                      height: 300, 
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      overflow: 'hidden'
                    }}
                  >
                    <iframe
                      src={`data:text/html,<html><body style="font-family: Arial, sans-serif; padding: 20px; margin: 0; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);"><h2 style="color: #333; margin-top: 0;">${selectedCompany.name}</h2><p style="color: #666; line-height: 1.6;">${selectedCompany.description}</p><div style="background: white; padding: 15px; border-radius: 8px; margin-top: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"><h3 style="color: #333; margin-top: 0;">Company Details</h3><p><strong>Industry:</strong> ${selectedCompany.industry}</p><p><strong>Size:</strong> ${selectedCompany.size}</p><p><strong>Founded:</strong> ${selectedCompany.founded}</p><p><strong>Location:</strong> ${selectedCompany.location}</p></div></body></html>`}
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      title={`${selectedCompany.name} Company Information`}
                      data-testid="company-info-iframe"
                    />
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={() => setCompanyDialogOpen(false)}
                data-testid="close-company-dialog"
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default JobListings;