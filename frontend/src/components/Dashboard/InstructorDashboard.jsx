import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const InstructorDashboard = () => {
    const [stats, setStats] = useState({
        my_courses: 0,
        total_students: 0,
        total_enrollments: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/lms/dashboard/stats/');
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <div className="text-center py-8">Loading dashboard...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Instructor Dashboard</h1>
                <Link
                    to="/courses/create"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                    Create New Course
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">My Courses</h3>
                    <p className="text-3xl text-center font-bold text-gray-900 dark:text-white mt-2">{stats.my_courses}</p>
                </div>
                <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Students</h3>
                    <p className="text-3xl text-center font-bold text-gray-900 dark:text-white mt-2">{stats.total_students}</p>
                </div>
                <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Enrollments</h3>
                    <p className="text-3xl text-center font-bold text-gray-900 dark:text-white mt-2">{stats.total_enrollments}</p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                        to="/my-courses"
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex items-center justify-between group"
                    >
                        <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Manage My Courses</span>
                        <span className="text-gray-400 dark:text-gray-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">→</span>
                    </Link>
                    <Link
                        to="/profile"
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex items-center justify-between group"
                    >
                        <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Update Profile</span>
                        <span className="text-gray-400 dark:text-gray-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">→</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default InstructorDashboard;