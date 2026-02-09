import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle, Clock } from 'lucide-react';
import api from '../../services/api';

// Stat Card Component
const StatCard = ({ label, value, icon: Icon, colorClass }) => (
    <div className="card p-6 flex items-center gap-4">
        <div className={`p-3 rounded-xl ${colorClass}`}>
            <Icon className="w-7 h-7" />
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
        </div>
    </div>
);

const StudentDashboard = () => {
    const [stats, setStats] = useState({
        enrolled_courses: 0,
        completed_courses: 0,
        in_progress: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/lms/dashboard/stats/');
                setStats(response.data);
                setError(null);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
                setError('Failed to load dashboard stats.');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
                    <p className="text-gray-500 dark:text-gray-400">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
                <p className="font-medium">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <header>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="text-gray-500 dark:text-gray-400">Welcome back! Here's an overview of your learning progress.</p>
            </header>

            <div className="grid text-center grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    label="Enrolled Courses"
                    value={stats.enrolled_courses}
                    icon={BookOpen}
                    colorClass="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                />
                <StatCard
                    label="In Progress"
                    value={stats.in_progress}
                    icon={Clock}
                    colorClass="bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400"
                />
                <StatCard
                    label="Completed"
                    value={stats.completed_courses}
                    icon={CheckCircle}
                    colorClass="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Quick Actions */}
                <div className="card p-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
                    <div className="space-y-4">
                        <Link
                            to="/courses"
                            className="block p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-brand-200 dark:hover:border-brand-700 hover:bg-brand-50/50 dark:hover:bg-brand-900/20 transition-all group"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-brand-700 dark:group-hover:text-brand-400">Browse New Courses</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Find your next topic to master</p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500 group-hover:text-brand-600 dark:group-hover:text-brand-400 shadow-sm">
                                    →
                                </div>
                            </div>
                        </Link>
                        <Link
                            to="/my-courses"
                            className="block p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-brand-200 dark:hover:border-brand-700 hover:bg-brand-50/50 dark:hover:bg-brand-900/20 transition-all group"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-brand-700 dark:group-hover:text-brand-400">Continue Learning</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Pick up where you left off</p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500 group-hover:text-brand-600 dark:group-hover:text-brand-400 shadow-sm">
                                    →
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Placeholder for Recent Activity or Recommendations */}
                <div className="card p-6 flex flex-col justify-center items-center text-center bg-gray-50 dark:bg-gray-900/50 border-dashed">
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-sm mb-4">
                        <BookOpen className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">No activity yet</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mt-2">
                        Start enrolling in courses to see your recent activity and progress here.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;