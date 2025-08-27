# Skill Share

A comprehensive skill-sharing and learning platform built with Spring Boot and React, where users can share knowledge, track learning progress, and engage with a community of learners.
This project implements a full-stack web application that enables users to share skills, create learning plans, track progress, and interact with other learners through a social platform.

## 🚀 Features

### Core Functionalities
- **Skill Sharing Posts**: Upload photos/videos (max 30 sec) with descriptions
- **Learning Progress Updates**: Track and share learning journey with predefined templates
- **Learning Plan Management**: Create structured plans with topics, resources, and timelines
- **Social Interaction**: Like, comment, edit, and delete interactions
- **User Profiles**: Public profiles showcasing skills and activities
- **Follow System**: Follow other users to see their posts
- **Real-time Notifications**: Get notified for likes and comments
- **OAuth 2.0 Authentication**: Secure login with social media accounts

### Technical Features
- RESTful API architecture
- Responsive React frontend
- Spring Security integration
- GitHub Workflow CI/CD
- Version-controlled development

## 🛠 Technology Stack

### Backend
- **Framework**: Spring Boot
- **Security**: Spring Security with OAuth 2.0
- **Database**: MongoDB
- **Build Tool**: Maven/Gradle

### Frontend
- **Framework**: React
- **Styling**: Tailwind CSS
- **HTTP Client**: [Axios/Fetch API]

### DevOps
- **Version Control**: Git & GitHub

## 📁 Project Structure

```
skill-share/
├── backend/
│   ├── src/main/java/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── models/
│   │   └── config/
│   ├── src/main/resources/
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   ├── public/
│   └── package.json
├── docs/
├── README.md
└── .gitignore
```

## ⚙️ Installation & Setup

### Prerequisites
- Java 11 or higher
- Node.js 14+ and npm
- Git
- Database - MongoDB

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/RashmiFernando/SkillShare.git
cd SkillShare/backend

# Install dependencies and run
./mvnw spring-boot:run
# OR
mvn spring-boot:run
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Start development server
npm start
```

### Environment Variables
Create `.env` files for configuration:

**Backend (.env)**
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=skillshare
DB_USERNAME=your_username
DB_PASSWORD=your_password
OAUTH_CLIENT_ID=your_oauth_client_id
OAUTH_CLIENT_SECRET=your_oauth_client_secret
```

**Frontend (.env)**
```
REACT_APP_API_BASE_URL=http://localhost:8080/api
REACT_APP_OAUTH_CLIENT_ID=your_oauth_client_id
```


## 🧪 Testing

### Backend Testing
```bash
# Run unit tests
./mvnw test

# Run integration tests
./mvnw verify
```

### Frontend Testing
```bash
# Run React tests
npm test

# Run coverage tests
npm run test:coverage
```

## 📊 System Architecture

### Overall Architecture
- **Client Tier**: React Web Application
- **Application Tier**: Spring Boot REST API
- **Data Tier**: MongoDB

### REST API Architecture
- **Controller Layer** (REST endpoints)
- **Service Layer** (Business logic)
- **Repository Layer** (Data access)
- **Model Layer** (Entity definitions)

## 🔐 Security Features

- OAuth 2.0 authentication integration
- JWT token-based authorization
- CORS configuration
- Input validation and sanitization
- Secure file upload handling

## 🎨 UI/UX Features

- Responsive design for all screen sizes
- Intuitive navigation and user flow
- Modern and clean interface
- Loading states and error handling
- Accessibility considerations

## 🚦 GitHub Workflow

The project uses GitHub Actions for:
- Automated testing on pull requests
- Code quality checks
- Deployment pipeline
- Dependency security scanning

## 📝 Documentation

- **Initial Documentation**: Requirements analysis and system design
- **API Documentation**: Detailed endpoint specifications
- **User Guide**: Platform usage instructions
- **Technical Documentation**: Implementation details
