import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/authContext';

const CourseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [error, setError] = useState(null);
    const [enrollmentError, setEnrollmentError] = useState(null);

    useEffect(() => {
        if (!user) return;
        fetchCourse();
        if (user.role === 'student') {
            checkEnrollment();
        }
    }, [id, user]);

    const fetchCourse = async () => {
        try {
            const response = await api.get(`/lms/courses/${id}/`);
            setCourse(response.data);
            setError(null);
        } catch (error) {
            console.error('Error fetching course:', error);
            setError('Failed to load course. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const checkEnrollment = async () => {
        try {
            // This is a naive check. Ideally the backend provides this info on the course object or a separate endpoint
            // For now, we rely on the enrollment error or success from the backend if we try to enroll,
            // OR we can fetch my_enrollments and check.
            const response = await api.get('/lms/enrollments/my_enrollments/');
            const enrolled = response.data.some(e => e.course === parseInt(id));
            setIsEnrolled(enrolled);
        } catch (error) {
            console.error('Error checking enrollment:', error);
        }
    };

    const handleEnroll = async () => {
        setEnrolling(true);
        setEnrollmentError(null);
        try {
            await api.post('/lms/enrollments/', { course: id });
            setIsEnrolled(true);
            setEnrollmentError(null);
            // Redirect after a brief delay to show success
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (error) {
            console.error('Error enrolling:', error);
            const errorMsg = error.response?.data?.detail || 'Failed to enroll. You might already be enrolled.';
            setEnrollmentError(errorMsg);
        } finally {
            setEnrolling(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400 ml-4">Loading course details...</p>
        </div>
    );
    
    if (error) return (
        <div className="max-w-6xl mx-auto">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
                <p className="font-medium">{error}</p>
                <button onClick={fetchCourse} className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                    Retry
                </button>
            </div>
        </div>
    );
    
    if (!course) return (
        <div className="max-w-6xl mx-auto">
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-yellow-700 dark:text-yellow-400">
                <p className="font-medium">Course not found. It may have been deleted or you don't have access to it.</p>
            </div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="md:flex">
                <div className="md:shrink-0 md:w-1/3">
                    {course.thumbnail ? (
                        <img className="h-48 w-full object-cover md:h-full" src={course.thumbnail} alt={course.title} />
                    ) : (
                        <div className="h-full w-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400">
                            No Image
                        </div>
                    )}
                </div>
                <div className="p-8 md:w-2/3">
                    <div className="uppercase tracking-wide text-sm text-indigo-500 dark:text-indigo-400 font-semibold">{course.category_name}</div>
                    <h1 className="block mt-1 text-2xl leading-tight font-bold text-gray-900 dark:text-white">{course.title}</h1>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">{course.description}</p>

                    <div className="mt-6 flex items-center">
                        <span className="text-gray-600 dark:text-gray-400 mr-2">Instructor:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{course.instructor_name || 'Unknown'}</span>
                    </div>

                    <div className="mt-2 flex items-center">
                        <span className="text-gray-600 dark:text-gray-400 mr-2">Duration:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{course.duration_hours} Hours</span>
                    </div>

                    {enrollmentError && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 mb-4">
                            {enrollmentError}
                        </div>
                    )}

                    <div className="mt-8">
                        {user.role === 'student' ? (
                            isEnrolled ? (
                                <button
                                    disabled
                                    className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-6 py-3 rounded-md font-medium cursor-default"
                                >
                                    Already Enrolled
                                </button>
                            ) : (
                                <button
                                    onClick={handleEnroll}
                                    disabled={enrolling}
                                    className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50"
                                >
                                    {enrolling ? 'Enrolling...' : 'Enroll Now'}
                                </button>
                            )
                        ) : (
                            <div className="text-gray-500 dark:text-gray-400 italic">
                                Log in as a student to enroll.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;