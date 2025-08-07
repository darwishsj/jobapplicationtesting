# Job Application Portal

A comprehensive React web application built for automation testing and hackathon challenges. This portal serves as a testing ground for Selenium/Cucumber automation scripts with a focus on providing robust selectors and realistic user workflows.

## 🚀 Features

### 🔐 User Authentication
- **Registration and Login** with form validation
- **SVG Captcha** - Dynamically generated mathematical captcha for login
- **Session Management** using localStorage
- **Duplicate Prevention** for user registrations

### 📋 Job Listings
- **Comprehensive Job Display** with search and filtering capabilities
- **Company Information** with hover tooltips and detailed iframe popups
- **Advanced Filtering** by location, company, and skills
- **Responsive Cards** with modern Material-UI design
- **Job Details** opening in new tabs/windows

### 📝 Job Application Form
- **Complete Form** with all required fields:
  - Personal information (Name, Email, Cover Letter)
  - Radio buttons for relocation willingness
  - Multiple skill selection with checkboxes
  - Education level and experience dropdowns
- **File Upload System**:
  - **Resume Upload**: Single file drag-and-drop with file picker
  - **Supporting Documents**: Multi-file upload with drag-and-drop
  - File validation and removal capabilities
- **Skills Reordering**: Drag-and-drop interface for prioritizing selected skills
- **Duplicate Application Prevention**
- **Form Validation** with visible error messages

### 📊 User Dashboard
- **Application Tracking** showing submitted applications
- **Activity Logging** displaying recent user actions
- **Personal Statistics** and application status

### 🔍 Automation-Friendly Design
- **Unique Selectors**: All interactive elements have `data-testid` or `id` attributes
- **Accessible DOM**: Hidden logging element for automation access
- **Comprehensive Logging**: All user actions logged to localStorage
- **Visible Validation**: Error messages and states exposed in DOM

## 🛠️ Technology Stack

- **Frontend**: React 18 with Vite
- **UI Framework**: Material-UI (MUI) v5
- **Routing**: React Router DOM
- **Drag & Drop**: React DnD with HTML5 Backend
- **State Management**: React Context API
- **Data Storage**: Local JSON files + localStorage
- **Styling**: Material-UI theme system with custom components

## 📁 Project Structure

```
src/
├── components/
│   ├── Dashboard.jsx          # User dashboard with applications
│   ├── JobApplication.jsx     # Comprehensive application form
│   ├── JobDetails.jsx         # Detailed job view (opens in new tab)
│   ├── JobListings.jsx        # Job search and listing with filters
│   ├── Login.jsx              # Login form with SVG captcha
│   ├── Navbar.jsx             # Navigation component
│   └── Register.jsx           # User registration form
├── context/
│   ├── AuthContext.jsx        # Authentication state management
│   └── LoggingContext.jsx     # Action logging system
├── data/
│   ├── companies.json         # Company information (6 companies)
│   ├── education.json         # Education levels
│   ├── experience.json        # Experience levels
│   ├── jobs.json             # Job listings (12 comprehensive jobs)
│   └── skills.json           # Available skills (50+ skills)
└── App.jsx                   # Main application component
```

## 🎯 Sample Data

The application includes comprehensive, realistic sample data:

- **12 Job Listings** across various industries and roles
- **6 Companies** with detailed information and descriptions
- **50+ Skills** covering technology, management, and soft skills
- **Education Levels** from high school to doctoral degrees
- **Experience Ranges** from entry-level to senior positions

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/darwishsj/jobapplicationtesting.git
   cd jobapplicationtesting
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🧪 Testing & Automation

### Key Selectors for Automation

All interactive elements include unique `data-testid` attributes:

#### Authentication
- `login-form`, `register-form`
- `email-input`, `password-input`, `captcha-input`
- `captcha-svg`, `captcha-correct-answer`
- `login-submit-button`, `register-submit-button`

#### Job Listings
- `job-listings-container`, `job-card-{id}`
- `job-search-input`, `location-filter`, `company-filter`
- `apply-button-{id}`, `view-job-description-{id}`
- `company-info-{id}`, `company-info-iframe`

#### Job Application
- `job-application-container`, `application-form`
- `name-input`, `email-input`, `cover-letter-input`
- `relocation-radio-group`, `skills-checkbox-group`
- `resume-upload`, `supporting-docs-upload`
- `selected-skills-container`, `submit-application-button`

#### File Upload
- Drag-and-drop zones with `data-testid`
- File selection and removal buttons
- File list display with unique selectors

### Logging System

All user actions are automatically logged to localStorage and exposed via:
- Hidden DOM element: `#automation-logs`
- Accessible via `data-testid="automation-logs"`
- JSON format with timestamps and action details

### Captcha System

The login captcha is fully automation-accessible:
- SVG captcha with programmatically generated math problems
- Correct answer exposed in hidden input: `data-testid="captcha-correct-answer"`
- No external dependencies or image files required

## 🎨 Design Features

- **Modern Material Design** with consistent theming
- **Responsive Layout** for all screen sizes
- **Professional Appearance** suitable for real-world applications
- **Smooth Animations** and hover effects
- **Accessible UI** with proper ARIA labels and semantic HTML

## 📝 User Workflows

### Registration Flow
1. Navigate to registration page
2. Fill out form with validation
3. Automatic login after successful registration
4. Redirect to job listings

### Login Flow
1. Navigate to login page
2. Enter credentials
3. Solve SVG captcha
4. Successful login redirects to jobs page

### Job Application Flow
1. Browse job listings with search/filter
2. View company information in tooltips/popups
3. Click "Apply" (requires authentication)
4. Fill comprehensive application form
5. Upload resume and supporting documents
6. Select and reorder skills
7. Submit application
8. View confirmation and redirect to dashboard

## 🔒 Data Privacy & Security

- All data stored locally (no backend required)
- No external API calls or data transmission
- User passwords stored in localStorage (for demo purposes only)
- File uploads handled client-side only

## 🚀 Hackathon Challenge Ready

This application is specifically designed for automation testing challenges:

- **Comprehensive Test Scenarios**: Registration, login, search, application submission
- **Complex Interactions**: Drag-and-drop, file uploads, dynamic content
- **Real-world Workflows**: Multi-step processes with validation
- **Robust Selectors**: Unique identifiers for reliable automation
- **Error Handling**: Visible validation messages and error states
- **Logging System**: Complete audit trail of user actions

## 🤝 Contributing

This project is designed for educational and testing purposes. Feel free to fork and modify for your automation testing needs.

## 📄 License

This project is open source and available under the MIT License.
