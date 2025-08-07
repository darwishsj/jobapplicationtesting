import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormGroup,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  Alert,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  DragHandle,
  AttachFile,
  CheckCircle,
  Error as ErrorIcon
} from '@mui/icons-material';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLogging } from '../context/LoggingContext';

// Import data
import jobsData from '../data/jobs.json';
import companiesData from '../data/companies.json';
import skillsData from '../data/skills.json';
import educationData from '../data/education.json';
import experienceData from '../data/experience.json';

// Draggable skill item component
const DraggableSkill = ({ skill, index, moveSkill, removeSkill }) => {
  const ref = useRef(null);
  
  const [{ handlerId }, drop] = useDrop({
    accept: 'skill',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveSkill(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'skill',
    item: () => {
      return { id: skill, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;
  drag(drop(ref));

  return (
    <ListItem 
      ref={ref}
      data-handler-id={handlerId}
      sx={{ 
        opacity,
        border: '1px solid #e0e0e0',
        borderRadius: 1,
        mb: 1,
        backgroundColor: 'background.paper',
        cursor: 'move'
      }}
      data-testid={`selected-skill-${index}`}
    >
      <DragHandle sx={{ mr: 1, color: 'text.secondary' }} />
      <ListItemText primary={skill} />
      <ListItemSecondaryAction>
        <IconButton 
          edge="end" 
          aria-label="delete" 
          onClick={() => removeSkill(index)}
          data-testid={`remove-skill-${index}`}
        >
          <Delete />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

// File upload dropzone component
const FileUploadZone = ({ onFilesChange, accept, multiple, label, files, testId }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(file => {
      if (accept && !accept.split(',').some(type => file.type.includes(type.trim()))) {
        return false;
      }
      return true;
    });

    if (multiple) {
      onFilesChange([...files, ...validFiles]);
    } else {
      onFilesChange(validFiles.slice(0, 1));
    }
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (multiple) {
      onFilesChange([...files, ...selectedFiles]);
    } else {
      onFilesChange(selectedFiles);
    }
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  return (
    <Box>
      <Box
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        sx={{
          border: `2px dashed ${isDragOver ? '#1976d2' : '#e0e0e0'}`,
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragOver ? '#f5f5f5' : 'transparent',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: '#1976d2',
            backgroundColor: '#f5f5f5'
          }
        }}
        data-testid={testId}
      >
        <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
        <Typography variant="h6" gutterBottom>
          {label}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Drag and drop files here, or click to browse
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
          {accept && `Accepted formats: ${accept}`}
        </Typography>
      </Box>
      
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        data-testid={`${testId}-input`}
      />

      {files.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Selected Files:
          </Typography>
          {files.map((file, index) => (
            <Box 
              key={index} 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                p: 1,
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                mb: 1
              }}
              data-testid={`selected-file-${index}`}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AttachFile sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">{file.name}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </Typography>
              </Box>
              <IconButton 
                size="small" 
                onClick={() => removeFile(index)}
                data-testid={`remove-file-${index}`}
              >
                <Delete />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

const JobApplication = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { logAction } = useLogging();
  
  const [job, setJob] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    coverLetter: '',
    willingToRelocate: '',
    education: '',
    experience: ''
  });

  // Skills management
  const [availableSkills, setAvailableSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);

  // File uploads
  const [resumeFiles, setResumeFiles] = useState([]);
  const [supportingFiles, setSupportingFiles] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const jobId = parseInt(id);
    const foundJob = jobsData.find(j => j.id === jobId);
    
    if (foundJob) {
      setJob(foundJob);
      const foundCompany = companiesData.find(c => c.id === foundJob.companyId);
      setCompany(foundCompany);
      
      // Check if user already applied
      const applications = JSON.parse(localStorage.getItem('jobApplications') || '[]');
      const hasApplied = applications.some(app => app.userId === user?.id && app.jobId === jobId);
      
      if (hasApplied) {
        setError('You have already applied for this position.');
      }

      // Pre-fill user data
      setFormData(prev => ({
        ...prev,
        name: user?.name || '',
        email: user?.email || ''
      }));

      logAction('application_form_view', { jobId, jobTitle: foundJob.title });
    } else {
      setError('Job not found.');
    }
    
    setAvailableSkills(skillsData);
    setLoading(false);
  }, [id, isAuthenticated, navigate, user, logAction]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillToggle = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
      logAction('skill_deselected', { skill });
    } else {
      setSelectedSkills([...selectedSkills, skill]);
      logAction('skill_selected', { skill });
    }
  };

  const moveSkill = (dragIndex, hoverIndex) => {
    const draggedSkill = selectedSkills[dragIndex];
    const newSkills = [...selectedSkills];
    newSkills.splice(dragIndex, 1);
    newSkills.splice(hoverIndex, 0, draggedSkill);
    setSelectedSkills(newSkills);
    logAction('skill_reordered', { from: dragIndex, to: hoverIndex });
  };

  const removeSkill = (index) => {
    const removedSkill = selectedSkills[index];
    setSelectedSkills(selectedSkills.filter((_, i) => i !== index));
    logAction('skill_removed_from_list', { skill: removedSkill });
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.name.trim()) errors.push('Name is required');
    if (!formData.email.trim()) errors.push('Email is required');
    if (!formData.coverLetter.trim()) errors.push('Cover letter is required');
    if (!formData.willingToRelocate) errors.push('Please specify if you are willing to relocate');
    if (!formData.education) errors.push('Please select your education level');
    if (!formData.experience) errors.push('Please select your years of experience');
    if (selectedSkills.length === 0) errors.push('Please select at least one skill');
    if (resumeFiles.length === 0) errors.push('Please upload your resume');

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join('. '));
      setSubmitting(false);
      logAction('application_validation_failed', { errors: validationErrors });
      return;
    }

    try {
      // Check for duplicate application
      const applications = JSON.parse(localStorage.getItem('jobApplications') || '[]');
      const hasApplied = applications.some(app => app.userId === user.id && app.jobId === job.id);
      
      if (hasApplied) {
        throw new Error('You have already applied for this position.');
      }

      // Create application object
      const application = {
        id: Date.now(),
        userId: user.id,
        jobId: job.id,
        jobTitle: job.title,
        companyName: company?.name,
        ...formData,
        skills: selectedSkills,
        resumeFileName: resumeFiles[0]?.name,
        supportingFilesCount: supportingFiles.length,
        supportingFileNames: supportingFiles.map(f => f.name),
        submittedAt: new Date().toISOString()
      };

      // Save application
      applications.push(application);
      localStorage.setItem('jobApplications', JSON.stringify(applications));

      logAction('application_submitted', { 
        jobId: job.id, 
        applicationId: application.id,
        skillsCount: selectedSkills.length,
        hasResume: resumeFiles.length > 0,
        supportingFilesCount: supportingFiles.length
      });

      setSuccess(true);
      
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);

    } catch (err) {
      setError(err.message);
      logAction('application_submission_failed', { error: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!job) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">Job not found.</Alert>
      </Container>
    );
  }

  if (success) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }} data-testid="application-success">
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Application Submitted Successfully!
          </Typography>
          <Typography variant="body1" paragraph>
            Thank you for applying to {job.title} at {company?.name}. 
            We will review your application and get back to you soon.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Redirecting to dashboard in 3 seconds...
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }} data-testid="job-application-container">
      <Paper elevation={2} sx={{ p: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom data-testid="application-title">
            Apply for {job.title}
          </Typography>
          {company && (
            <Typography variant="h6" color="primary" gutterBottom data-testid="application-company">
              {company.name}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary">
            Please fill out all fields below to submit your application.
          </Typography>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }} 
            data-testid="application-error"
            icon={<ErrorIcon />}
          >
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} data-testid="application-form">
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                id="name"
                name="name"
                label="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                data-testid="name-input"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                id="email"
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                data-testid="email-input"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                multiline
                rows={4}
                id="coverLetter"
                name="coverLetter"
                label="Cover Letter"
                placeholder="Tell us why you're the perfect fit for this role..."
                value={formData.coverLetter}
                onChange={handleInputChange}
                data-testid="cover-letter-input"
              />
            </Grid>

            {/* Relocation Question */}
            <Grid item xs={12}>
              <FormControl component="fieldset" required>
                <FormLabel component="legend" data-testid="relocation-label">
                  Are you willing to relocate?
                </FormLabel>
                <RadioGroup
                  row
                  name="willingToRelocate"
                  value={formData.willingToRelocate}
                  onChange={handleInputChange}
                  data-testid="relocation-radio-group"
                >
                  <FormControlLabel 
                    value="yes" 
                    control={<Radio />} 
                    label="Yes" 
                    data-testid="relocation-yes"
                  />
                  <FormControlLabel 
                    value="no" 
                    control={<Radio />} 
                    label="No" 
                    data-testid="relocation-no"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            {/* Education and Experience */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Education Level</InputLabel>
                <Select
                  name="education"
                  value={formData.education}
                  label="Education Level"
                  onChange={handleInputChange}
                  data-testid="education-select"
                >
                  {educationData.map((level, index) => (
                    <MenuItem key={index} value={level} data-testid={`education-option-${index}`}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Years of Experience</InputLabel>
                <Select
                  name="experience"
                  value={formData.experience}
                  label="Years of Experience"
                  onChange={handleInputChange}
                  data-testid="experience-select"
                >
                  {experienceData.map((level, index) => (
                    <MenuItem key={index} value={level} data-testid={`experience-option-${index}`}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Skills Selection */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Skills
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Select your relevant skills from the list below:
              </Typography>
              
              <Box sx={{ mb: 3, maxHeight: 200, overflow: 'auto', border: '1px solid #e0e0e0', borderRadius: 1, p: 2 }}>
                <FormGroup data-testid="skills-checkbox-group">
                  {availableSkills.map((skill, index) => (
                    <FormControlLabel
                      key={index}
                      control={
                        <Checkbox
                          checked={selectedSkills.includes(skill)}
                          onChange={() => handleSkillToggle(skill)}
                          data-testid={`skill-checkbox-${index}`}
                        />
                      }
                      label={skill}
                    />
                  ))}
                </FormGroup>
              </Box>

              {/* Selected Skills Reordering */}
              {selectedSkills.length > 0 && (
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Selected Skills (drag to reorder by priority):
                  </Typography>
                  <Box 
                    sx={{ 
                      border: '1px solid #e0e0e0', 
                      borderRadius: 1, 
                      p: 2, 
                      backgroundColor: '#f9f9f9',
                      minHeight: 100
                    }}
                    data-testid="selected-skills-container"
                  >
                    <List dense>
                      {selectedSkills.map((skill, index) => (
                        <DraggableSkill
                          key={skill}
                          skill={skill}
                          index={index}
                          moveSkill={moveSkill}
                          removeSkill={removeSkill}
                        />
                      ))}
                    </List>
                  </Box>
                </Box>
              )}
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            {/* Resume Upload */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Resume Upload *
              </Typography>
              <FileUploadZone
                onFilesChange={setResumeFiles}
                accept=".pdf,.doc,.docx"
                multiple={false}
                label="Upload Your Resume"
                files={resumeFiles}
                testId="resume-upload"
              />
            </Grid>

            {/* Supporting Documents */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Supporting Documents (Optional)
              </Typography>
              <FileUploadZone
                onFilesChange={setSupportingFiles}
                accept=".pdf,.doc,.docx,.txt"
                multiple={true}
                label="Upload Supporting Documents"
                files={supportingFiles}
                testId="supporting-docs-upload"
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={submitting}
                data-testid="submit-application-button"
                sx={{ py: 1.5 }}
              >
                {submitting ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Submitting Application...
                  </>
                ) : (
                  'Submit Application'
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default JobApplication;