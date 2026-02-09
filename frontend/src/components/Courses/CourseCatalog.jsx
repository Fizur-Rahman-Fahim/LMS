import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Clock, Users, ChevronRight } from 'lucide-react';
import api from '../../services/api';

const CourseCatalog = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCourses();
        fetchCategories();
    }, [selectedCategory]);

    const fetchCourses = async () => {
        try {
            let url = '/lms/courses/';
            const params = new URLSearchParams();
            if (searchTerm) params.append('search', searchTerm);
            if (selectedCategory) params.append('category', selectedCategory);

            if (params.toString()) url += `?${params.toString()}`;

            const response = await api.get(url);
            setCourses(response.data.results || response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching courses:', error);
            setError('Failed to load courses. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get('/lms/categories/');
            setCategories(response.data.results || response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            // Don't set error state for categories - not critical
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchCourses();
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
                    <div className="flex justify-between items-center">
                        <p>{error}</p>
                        <button onClick={fetchCourses} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                            Retry
                        </button>
                    </div>
                </div>
            )}
            {/* Header Section */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 dark:bg-brand-900/10 rounded-full -mr-16 -mt-16 opacity-50"></div>

                <div className="relative z-10">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Explore Courses</h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-2xl">Discover a wide range of courses tailored to help you master new skills and achieve your goals.</p>

                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="What do you want to learn?"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="input-field pl-10 py-3"
                            />
                        </div>
                        <div className="md:w-64 relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="input-field pl-10 py-3 appearance-none cursor-pointer"
                            >
                                <option value="">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="btn-primary py-3 px-8">
                            Search
                        </button>
                    </form>
                </div>
            </div>

            {/* Course Grid */}
            {loading ? (
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto"></div>
                    <p className="mt-4 text-gray-500 dark:text-gray-400">Finding best courses for you...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course, index) => (
                        <div
                            key={course.id}
                            className="card group flex flex-col h-full overflow-hidden hover:-translate-y-1 transition-transform duration-300"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="relative h-48 bg-gray-200 overflow-hidden">
                                {course.thumbnail ? (
                                    <img
                                        src={course.thumbnail}
                                        alt={course.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-brand-50 dark:bg-brand-900/20 text-brand-300 dark:text-brand-700">
                                        <BookOpen className="w-16 h-16" />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4">
                                    <span className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-brand-700 dark:text-brand-400 shadow-sm">
                                        {course.category_name}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                                    {course.title}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4 flex-1">
                                    {course.description}
                                </p>

                                <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500 mb-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{course.duration_hours}h</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Users className="w-4 h-4" />
                                        <span>{course.enrollment_count || 0} students</span>
                                    </div>
                                </div>

                                <Link
                                    to={`/courses/${course.id}`}
                                    className="btn-secondary w-full flex justify-center items-center gap-2 group/btn"
                                >
                                    View Details
                                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    ))}
                    {courses.length === 0 && (
                        <div className="col-span-full text-center py-20 bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                            <div className="bg-gray-50 dark:bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No courses found</h3>
                            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or category filter.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CourseCatalog;