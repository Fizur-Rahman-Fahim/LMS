import { useAuth } from '../../context/authContext';
import AdminDashboard from './adminDashboard';
import InstructorDashboard from './InstructorDashboard';
import StudentDashboard from './StudentDashboard';

const Dashboard = () => {
    const { user } = useAuth();

    if (!user) return <div>Loading...</div>;

    const effectiveRole = user.is_superuser ? 'admin' : user.role;

    switch (effectiveRole) {
        case 'admin':
            return <AdminDashboard />;
        case 'instructor':
            return <InstructorDashboard />;
        case 'student':
            return <StudentDashboard />;
        default:
            return <div>Unknown Role</div>;
    }
};

export default Dashboard;