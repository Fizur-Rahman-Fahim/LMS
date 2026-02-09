import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './components/auth/login';
import Register from './components/auth/register';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import Dashboard from './components/Dashboard/Dashboard';
import CourseList from './components/Courses/CourseList';
import CourseForm from './components/Courses/CourseForm';
import CourseCatalog from './components/Courses/CourseCatalog';
import CourseDetail from './components/Courses/CourseDetail';
import Profile from './components/Profile/Profile';

// ThemeProvider removed — app now uses single light theme

function App() {
    return (
    <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Course Management */}
              <Route path="/courses" element={<CourseCatalog />} />
              <Route path="/courses/:id" element={<CourseDetail />} />
              <Route path="/my-courses" element={<CourseList />} />
              <Route path="/courses/my-courses" element={<Navigate to="/my-courses" replace />} />
              <Route path="/courses/create" element={<CourseForm />} />
              <Route path="/courses/edit/:id" element={<CourseForm />} />

              {/* User Management */}
              <Route path="/profile" element={<Profile />} />
            </Route>

            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </BrowserRouter>
    </AuthProvider>
  );
}

export default App;