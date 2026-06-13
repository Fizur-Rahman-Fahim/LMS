import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import api, { createFormDataRequest } from '../../services/api';

const CourseForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = !!id;
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        duration_hours: 0,
        is_published: true,
        thumbnail: null
    });

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [thumbnailPreview, setThumbnailPreview] = useState('');
    const [existingThumbnail, setExistingThumbnail] = useState('');

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

    const validateImage = (file) => {
        const MAX_SIZE = 2 * 1024 * 1024; // 2MB
        const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

        if (file.size > MAX_SIZE) {
            setError('Thumbnail size must be less than 2MB');
            return false;
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            setError('Only JPG, PNG, and WebP formats are allowed for thumbnails');
            return false;
        }

        return true;
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
            const { title, description, category, duration_hours, is_published, thumbnail } = response.data;
            setFormData({
                title,
                description,
                category: category.id || category,
                duration_hours,
                is_published,
                thumbnail: null
            });
            
            // Store existing thumbnail URL
            if (thumbnail) {
                const thumbnailUrl = thumbnail.startsWith('http')
                    ? thumbnail
                    : `http://localhost:8000${thumbnail}`;
                setExistingThumbnail(thumbnailUrl);
                setThumbnailPreview(thumbnailUrl);
            }
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

    const handleThumbnailSelect = (e) => {
        const file = e.target.files?.[0];
        if (file && validateImage(file)) {
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailPreview(reader.result);
            };
            reader.readAsDataURL(file);

            // Store file
            setFormData(prev => ({ ...prev, thumbnail: file }));
            setError(null);
        }
    };

    const handleDeleteThumbnail = () => {
        setFormData(prev => ({ ...prev, thumbnail: null }));
        setThumbnailPreview('');
        setExistingThumbnail('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
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
            const submitData = new FormData();
            submitData.append('title', formData.title);
            submitData.append('description', formData.description);
            submitData.append('category', formData.category);
            submitData.append('duration_hours', formData.duration_hours);
            submitData.append('is_published', formData.is_published);
            
            // Only append thumbnail if a new file was selected
            if (formData.thumbnail instanceof File) {
                submitData.append('thumbnail', formData.thumbnail);
            }

            const formApi = createFormDataRequest();

            if (isEditing) {
                await formApi.put(`/lms/courses/${id}/`, submitData);
            } else {
                await formApi.post('/lms/courses/', submitData);
            }
            navigate('/my-courses');
        } catch (error) {
            console.error('Error saving course:', error);
            const errorMsg = error.response?.data?.detail || error.response?.data?.thumbnail?.[0] || 'Failed to save course. Please try again.';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-360 mx-auto bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 animate-fade-in relative overflow-hidden">
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">{isEditing ? 'Edit Course' : 'Create New Course'}</h1>

            {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 flex justify-between items-start">
                    <p className="font-medium">{error}</p>
                    <button
                        onClick={() => setError('')}
                        className="ml-2 text-current opacity-70 hover:opacity-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                {/* Thumbnail Upload Section */}
                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Course Thumbnail</label>
                    
                    <div className="flex flex-col sm:flex-row gap-6">
                        {/* Thumbnail Preview */}
                        <div className="flex-shrink-0">
                            {thumbnailPreview ? (
                                <div className="relative">
                                    <img
                                        src={thumbnailPreview}
                                        alt="Course Thumbnail"
                                        className="w-40 h-24 rounded-lg object-cover border-2 border-brand-200 dark:border-brand-700"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleDeleteThumbnail}
                                        disabled={loading}
                                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-full p-1 transition-colors"
                                        title="Delete thumbnail"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="w-40 h-24 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                                    <ImageIcon className="w-8 h-8 text-gray-400 dark:text-gray-600" />
                                </div>
                            )}
                        </div>

                        {/* Upload Area */}
                        <div className="flex-1 flex flex-col justify-center">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleThumbnailSelect}
                                disabled={loading}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={loading}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-fit"
                            >
                                <Upload className="w-4 h-4" />
                                Choose Thumbnail
                            </button>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                JPG, PNG, or WebP. Recommended: 16:9 ratio. Max 2MB.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Course Title & Category */}
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

                {/* Description */}
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

                {/* Duration & Publish */}
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

                {/* Publish Checkbox */}
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

                {/* Action Buttons */}
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