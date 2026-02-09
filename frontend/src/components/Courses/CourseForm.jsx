import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const CourseForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        duration_hours: 0,
        is_published: true
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    useEffect(() => {
        fetchCategories();
        if (isEditing) {
            fetchCourse();
        }
    }, [id]);

    const validateForm = () => {
        const errors = {};
        if (!formData.title.trim()) errors.title = 'Title is required';
        if (!formData.description.trim()) errors.description = 'Description is required';
        if (!formData.category) errors.category = 'Category is required';
        if (formData.duration_hours <= 0) errors.duration_hours = 'Duration must be greater than 0';
        return errors;
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get('/lms/categories/');
            setCategories(response.data.results || response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchCourse = async () => {
        try {
            const response = await api.get(`/lms/courses/${id}/`);
            const { title, description, category, duration_hours, is_published } = response.data;
            setFormData({
                title,
                description,
                category: category.id || category,
                duration_hours,
                is_published
            });
        } catch (error) {
            console.error('Error fetching course:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            setError('Please fix the errors below.');
            return;
        }
        
        setLoading(true);
        setError(null);
        setValidationErrors({});
        
        try {
            if (isEditing) {
                await api.put(`/lms/courses/${id}/`, formData);
            } else {
                await api.post('/lms/courses/', formData);
            }
            navigate('/my-courses');
        } catch (error) {
            console.error('Error saving course:', error);
            const errorMsg = error.response?.data?.detail || 'Failed to save course. Please try again.';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-360 mx-auto bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 animate-fade-in relative overflow-hidden">
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">{isEditing ? 'Edit Course' : 'Create New Course'}</h1>

            {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
                    <p className="font-medium">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Course Title</label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={formData.title}
                            onChange={handleChange}
                            className={`input-field ${validationErrors.title ? 'border-red-500 focus:border-red-500' : ''}`}
                            placeholder="e.g. Advanced Web Development"
                        />
                        {validationErrors.title && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.title}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                        <select
                            name="category"
                            required
                            value={formData.category}
                            onChange={handleChange}
                            className={`input-field cursor-pointer ${validationErrors.category ? 'border-red-500 focus:border-red-500' : ''}`}
                        >
                            <option value="">Select a category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        {validationErrors.category && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.category}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                    <textarea
                        name="description"
                        required
                        rows={4}
                        value={formData.description}
                        onChange={handleChange}
                        className={`input-field ${validationErrors.description ? 'border-red-500 focus:border-red-500' : ''}`}
                        placeholder="Tell students what they will learn..."
                    />
                    {validationErrors.description && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.description}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Duration (Hours)</label>
                        <input
                            type="number"
                            name="duration_hours"
                            min="0"
                            step="0.5"
                            value={formData.duration_hours}
                            onChange={handleChange}
                            className={`input-field ${validationErrors.duration_hours ? 'border-red-500 focus:border-red-500' : ''}`}
                        />
                        {validationErrors.duration_hours && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.duration_hours}</p>}
                    </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                    <input
                        type="checkbox"
                        name="is_published"
                        id="is_published"
                        checked={formData.is_published}
                        onChange={handleChange}
                        className="h-5 w-5 text-brand-600 focus:ring-brand-500 border-gray-300 rounded-md cursor-pointer transition-all"
                    />
                    <label htmlFor="is_published" className="text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer">
                        Publish this course immediately (Visible to all students)
                    </label>
                </div>

                <div className="flex justify-end items-center gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <button
                        type="button"
                        onClick={() => navigate('/my-courses')}
                        className="btn-secondary"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary min-w-35"
                    >
                        {loading ? 'Saving...' : (isEditing ? 'Update Course' : 'Create Course')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CourseForm;