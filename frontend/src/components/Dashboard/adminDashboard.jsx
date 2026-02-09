import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, GraduationCap, BarChart3 } from 'lucide-react';
import { courseService } from '../../services/courseServices';
import { useAuth } from '../../context/authContext';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const data = await courseService.getDashboardStats();
            setStats(data);
        } catch (error) {
            console.error('Failed to load stats:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // debug: log stats and current user to verify backend response shape
        console.log('AdminDashboard: stats=', stats, 'user=', user);
    }, [stats, user]);

    if (loading) return (
        <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h2>

            {/* Debug: show raw stats returned from API for verification
            {stats && (
                <pre className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/40 rounded-md text-sm text-gray-700 dark:text-gray-200 overflow-auto">{JSON.stringify(stats, null, 2)}</pre>
            )} */}

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card p-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
                        <p className="text-3xl text-center font-bold text-gray-900 dark:text-white mt-1">{stats && stats.total_users !== undefined ? stats.total_users : '—'}</p>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400">
                        <Users className="w-8 h-8" />
                    </div>
                </div>

                <div className="card p-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Courses</p>
                        <p className="text-3xl text-center font-bold text-gray-900 dark:text-white mt-1">{stats && stats.total_courses !== undefined ? stats.total_courses : '—'}</p>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-green-600 dark:text-green-400">
                        <BookOpen className="w-8 h-8" />
                    </div>
                </div>

                <div className="card p-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Enrollments</p>
                        <p className="text-3xl text-center font-bold text-gray-900 dark:text-white mt-1">{stats && stats.total_enrollments !== undefined ? stats.total_enrollments : '—'}</p>
                    </div>
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-purple-600 dark:text-purple-400">
                        <GraduationCap className="w-8 h-8" />
                    </div>
                </div>

                <div className="card p-6 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Instructors</p>
                        <p className="text-3xl text-center font-bold text-gray-900 dark:text-white mt-1">{stats && stats.instructor_count !== undefined ? stats.instructor_count : '—'}</p>
                    </div>
                    <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-orange-600 dark:text-orange-400">
                        <BarChart3 className="w-8 h-8" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* User Distribution Card */}
                <div className="card p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">User Distribution</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                            <span className="text-gray-600 dark:text-gray-400 font-medium">Administrators</span>
                            <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm font-bold text-gray-900 dark:text-white">
                                {stats?.admin_count}
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                            <span className="text-gray-600 dark:text-gray-400 font-medium">Instructors</span>
                            <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm font-bold text-gray-900 dark:text-white">
                                {stats?.instructor_count}
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                            <span className="text-gray-600 dark:text-gray-400 font-medium">Students</span>
                            <span className="px-3 py-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm font-bold text-gray-900 dark:text-white">
                                {stats?.student_count}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions Card */}
                <div className="card p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h3>
                    <div className="space-y-4">
                        <Link
                            to="/courses/create"
                            className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-brand-200 dark:hover:border-brand-700 hover:bg-brand-50/50 dark:hover:bg-brand-900/10 group transition-all"
                        >
                            <span className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-brand-700 dark:group-hover:text-brand-400">Create New Course</span>
                            <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                        <Link
                            to="/my-courses"
                            className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-brand-200 dark:hover:border-brand-700 hover:bg-brand-50/50 dark:hover:bg-brand-900/10 group transition-all"
                        >
                            <span className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-brand-700 dark:group-hover:text-brand-400">Manage All System Courses</span>
                            <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                        <Link
                            to="/profile"
                            className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-brand-200 dark:hover:border-brand-700 hover:bg-brand-50/50 dark:hover:bg-brand-900/10 group transition-all"
                        >
                            <span className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-brand-700 dark:group-hover:text-brand-400">Edit System Profile</span>
                            <span className="text-gray-400 group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;