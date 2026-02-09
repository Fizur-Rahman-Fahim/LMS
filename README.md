# Learning Management System (LMS)

A modern, full-stack Learning Management System built with React and Django, enabling instructors to create and manage courses while students can enroll and track their learning progress.

## 📋 Project Overview

This LMS platform provides a complete solution for online education with role-based access control. Administrators manage the system, instructors create and manage courses, and students can enroll, learn, and track their progress. The application features a responsive design with dark mode support and a modern UI built with Tailwind CSS.

## ✨ Features

### For Students
- **Course Catalog**: Browse and search available courses by category
- **Course Enrollment**: Enroll in courses with one click
- **Progress Tracking**: Monitor learning progress with visual indicators
- **Dashboard**: Personalized dashboard showing enrolled courses and statistics
- **Course Details**: View comprehensive course information including instructor details and duration

### For Instructors
- **Course Management**: Create, edit, and publish courses
- **Student Tracking**: Monitor enrolled students and course statistics
- **Course Analytics**: View enrollment counts and student engagement metrics
- **Instructor Dashboard**: Quick overview of courses, students, and enrollments

### For Administrators
- **System Overview**: Complete system statistics and monitoring
- **User Management**: Manage users across all roles
- **Course Moderation**: Approve and manage all courses on the platform
- **Analytics Dashboard**: System-wide analytics and insights

### General Features
- **Authentication**: Secure login/registration with JWT tokens
- **Authorization**: Role-based access control (Admin, Instructor, Student)
- **Responsive Design**: Mobile-friendly interface across all devices
- **Dark Mode**: Built-in dark theme support
- **Real-time Updates**: Live course and enrollment data

## 🛠️ Tech Stack

### Frontend
- **React 18**: Modern UI library with hooks
- **React Router**: Client-side routing and navigation
- **Axios**: HTTP client for API communication
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Modern icon library
- **Vite**: Next-generation build tool

### Backend
- **Django 4+**: Python web framework
- **Django REST Framework**: RESTful API development
- **SQLite/PostgreSQL**: Database
- **JWT Authentication**: Secure token-based authentication
- **CORS**: Cross-Origin Resource Sharing support

### Development Tools
- **ESLint**: JavaScript linting
- **PostCSS**: CSS transformation
- **Node.js & npm**: Frontend package management
- **Python venv**: Python virtual environment

## 🚀 Setup Instructions

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- Git

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API endpoint** (if needed)
   - Update `src/services/api.js` if backend URL differs

4. **Start development server**
   ```bash
   npm run dev
   ```
   - Frontend will be available at `http://localhost:5173`

5. **Build for production**
   ```bash
   npm run build
   ```

### Backend Setup

1. **Create and activate virtual environment**
   ```bash
   python -m venv lmsenv
   
   # On Windows
   lmsenv\Scripts\activate
   
   # On macOS/Linux
   source lmsenv/bin/activate
   ```

2. **Navigate to backend directory**
   ```bash
   cd lms_backend
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   - Create `.env` file in `lms_backend` directory
   ```env
   DEBUG=True
   SECRET_KEY=your-secret-key-here
   ALLOWED_HOSTS=localhost,127.0.0.1
   DATABASE_URL=sqlite:///db.sqlite3
   ```

5. **Run migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create superuser (admin account)**
   ```bash
   python manage.py createsuperuser
   ```

7. **Start development server**
   ```bash
   python manage.py runserver
   ```
   - Backend API will be available at `http://localhost:8000`

### Access the Application

- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:8000/api/`
- **Admin Panel**: `http://localhost:8000/admin/`

## 📁 Project Structure

```
LMS/
├── frontend/                    # React application
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── context/            # Context API (Auth)
│   │   ├── services/           # API services
│   │   ├── App.jsx             # Main app component
│   │   └── main.jsx            # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── lms_backend/                # Django application
│   ├── accounts/               # User management
│   ├── core/                   # Main LMS models & views
│   ├── manage.py
│   └── requirements.txt
│
└── README.md
```

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. User logs in with credentials
2. Backend returns JWT token
3. Token stored in client-side storage
4. Token included in API requests via Authorization header
5. Protected routes check token validity

## 🎯 API Endpoints

### Courses
- `GET /lms/courses/` - List all courses
- `GET /lms/courses/{id}/` - Get course details
- `POST /lms/courses/` - Create course (Instructor/Admin)
- `PUT /lms/courses/{id}/` - Update course
- `DELETE /lms/courses/{id}/` - Delete course

### Enrollments
- `GET /lms/enrollments/` - List enrollments
- `POST /lms/enrollments/` - Enroll in course
- `GET /lms/enrollments/my_enrollments/` - Get user's enrollments

### Dashboard
- `GET /lms/dashboard/stats/` - Get dashboard statistics

## 📱 Screenshots

### Login Page
Users can securely log in with their credentials. The form includes validation and error handling.

### Admin Dashboard
System administrators can view comprehensive statistics including total users, courses, categories, and enrollments.

### Instructor Dashboard
Instructors can see their course count, total students, and enrollment metrics with quick access to create new courses.

### Student Dashboard
Students get an overview of their enrolled courses, in-progress count, completed courses, and learning progress percentage.

### Course Catalog
Browse all available courses with filtering by category. Each course card displays title, category, enrollment count, and more.

### Course Detail Page
View comprehensive course information including description, instructor name, duration, and enrollment options for students.

### Course Management
Instructors can create, edit, and manage their courses with a user-friendly form interface.

## 🔄 Workflow

### Student Workflow
1. Register or login
2. Browse course catalog
3. Select and view course details
4. Enroll in courses
5. Access enrolled courses from dashboard
6. Track learning progress

### Instructor Workflow
1. Register as instructor or request role upgrade
2. Create courses with details and categories
3. Publish courses for students
4. Monitor student enrollments
5. View analytics and statistics

### Admin Workflow
1. Access admin panel
2. Monitor system statistics
3. Manage users and courses
4. Moderate course content
5. View system-wide analytics

## 🚧 Future Enhancements

- [ ] Video lesson uploads
- [ ] Quiz and assessment system
- [ ] Discussion forums
- [ ] Certificate generation
- [ ] Advance payment integration
- [ ] Email notifications
- [ ] Mobile app
- [ ] Social features (likes, comments)

## 📝 License

This project is licensed under the MIT License.

## 👥 Support

For support, please create an issue in the repository or contact the development team.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---
