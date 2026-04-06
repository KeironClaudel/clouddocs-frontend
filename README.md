# CloudDocs - Document Management System

A modern, secure, and scalable document management system built with React and Vite. CloudDocs provides organizations with a comprehensive solution for managing, organizing, and securing their digital documents with role-based access control and audit capabilities.

## 🚀 Features

### Core Functionality

- **Document Management**: Upload, organize, and manage documents with advanced search and filtering
- **Role-Based Access Control**: Granular permissions system with Admin, User, and custom roles
- **Secure Authentication**: HTTP-only cookies with JWT tokens for enhanced security
- **Real-time Dashboard**: Comprehensive analytics and document insights
- **Audit Logging**: Complete tracking of all document operations and user activities

### Document Organization

- **Categories & Types**: Flexible categorization system for document classification
- **Access Levels**: Multiple security levels (Public, Internal, Confidential, Restricted)
- **Department Management**: Organize documents by organizational departments
- **Metadata Management**: Rich document metadata and tagging system

### User Experience

- **Responsive Design**: Modern UI built with Tailwind CSS
- **Internationalization**: Multi-language support (Currently Spanish, code-ready for English addition)
- **Real-time Notifications**: Instant feedback on operations
- **Advanced Search**: Full-text search with filters and sorting

### Security & Compliance

- **HTTPS Support**: Secure development environment with SSL certificates
- **Session Management**: Automatic session handling and timeout
- **Data Encryption**: Secure data transmission and storage
- **Audit Trails**: Complete compliance logging

## 🛠️ Technology Stack

### Frontend Framework

- **React 18** - Modern React with hooks and concurrent features
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing and navigation

### UI & Styling

- **Tailwind CSS** - Utility-first CSS framework
- **FontAwesome** - Icon library for consistent UI elements
- **Responsive Design** - Mobile-first approach

### HTTP & API

- **Axios** - HTTP client with interceptors and error handling
- **RESTful API** - Clean API design with proper error responses

### Development Tools

- **ESLint** - Code linting and quality assurance
- **Vite Plugins** - Hot module replacement and optimization
- **Environment Configuration** - Secure environment variable management

### Security

- **HTTP-Only Cookies** - Secure token storage
- **JWT Authentication** - Stateless authentication
- **CORS Configuration** - Cross-origin resource sharing

## 📁 Project Structure

```
src/
├── api/                 # API configuration and interceptors
├── components/          # Reusable UI components
│   ├── AdminRoute.jsx   # Admin-only route protection
│   ├── AppLayout.jsx    # Main application layout
│   ├── DataTable.jsx    # Data display component
│   ├── Navbar.jsx       # Navigation component
│   └── ProtectedRoute.jsx # Authentication route guard
├── context/             # React context providers
│   └── AuthContext.jsx  # Authentication state management
├── hooks/               # Custom React hooks
├── i18n/                # Internationalization files
├── pages/               # Application pages/routes
│   ├── DashboardPage.jsx
│   ├── DocumentsPage.jsx
│   ├── LoginPage.jsx
│   ├── ProfilePage.jsx
│   └── UsersPage.jsx
├── services/            # API service layer
├── utils/               # Utility functions
└── assets/              # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API server running
- Modern web browser

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd clouddocs-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:

   ```env
   VITE_API_BASE_URL=https://your-api-domain.com/api
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

## 🔒 Security Features

### Authentication Flow

1. **Login**: Secure credential validation
2. **Token Management**: HTTP-only cookies prevent XSS attacks
3. **Session Validation**: Server-side session verification
4. **Automatic Logout**: Session timeout and invalidation

### Data Protection

- **Encrypted Transmission**: HTTPS-only communication
- **Input Validation**: Client and server-side validation
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Sanitized user inputs

## 🌐 Internationalization

The application supports multiple languages:

- **Spanish (es)** - Primary language
- **English (en)** - Secondary language (PENDING TO BE ADDED)

Language files are located in `src/i18n/` and can be easily extended.

## 📊 API Integration

### Authentication Endpoints

- `POST /auth/login` - User authentication
- `POST /auth/logout` - Session termination
- `GET /auth/me` - Current user information
- `POST /auth/refresh-token` - Token refresh

### Document Management

- `GET /documents` - List documents with pagination
- `POST /documents` - Upload new document
- `GET /documents/:id` - Get document details
- `PUT /documents/:id` - Update document
- `DELETE /documents/:id` - Delete document

### Administrative Endpoints

- `GET /users` - User management
- `GET /audit-logs` - Audit trail access
- `GET /categories` - Document categories
- `GET /departments` - Department management

## 📝 License

This project is proprietary software. All rights reserved.

## 🔄 Recent Updates

- Migrated to HTTP-only cookies for enhanced security
- Implemented HTTPS development environment
- Updated authentication flow
- Improved session management

---

**Built with ❤️ using React, Vite, and modern web technologies**
