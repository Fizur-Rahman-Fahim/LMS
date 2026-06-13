import { useState, useEffect, useRef } from 'react';
import api, { createFormDataRequest } from '../../services/api';
import { useAuth } from '../../context/authContext';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

const Profile = () => {
    const { user: authUser, updateUser } = useAuth();
    const [profile, setProfile] = useState({
        first_name: '',
        last_name: '',
        email: '',
        bio: '',
        role: '',
        profile_picture: null,
        theme: 'light'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [picturePreview, setPicturePreview] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/api/auth/profile/');
            setProfile(response.data);
            if (response.data.profile_picture) {
                // Add full URL for image display
                const picUrl = response.data.profile_picture.startsWith('http')
                    ? response.data.profile_picture
                    : `http://localhost:8000${response.data.profile_picture}`;
                setPicturePreview(picUrl);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            setMessageType('error');
            setMessage('Failed to load profile. Please refresh the page.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const validateImage = (file) => {
        const MAX_SIZE = 5 * 1024 * 1024; // 5MB
        const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

        if (file.size > MAX_SIZE) {
            setMessageType('error');
            setMessage('Image size must be less than 5MB');
            return false;
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            setMessageType('error');
            setMessage('Only JPG, PNG, and WebP formats are allowed');
            return false;
        }

        return true;
    };

    const handlePictureSelect = (e) => {
        const file = e.target.files?.[0];
        if (file && validateImage(file)) {
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPicturePreview(reader.result);
            };
            reader.readAsDataURL(file);

            // Store file for upload
            setProfile({ ...profile, profile_picture: file });
            setMessage('');
        }
    };

    const handleDeletePicture = async () => {
        if (window.confirm('Are you sure you want to delete your profile picture?')) {
            setSaving(true);
            try {
                const formData = new FormData();
                formData.append('profile_picture', ''); // Empty to delete
                formData.append('first_name', profile.first_name);
                formData.append('last_name', profile.last_name);
                formData.append('bio', profile.bio);

                const formApi = createFormDataRequest();
                const response = await formApi.put('/api/auth/profile/', formData);
                
                setProfile({ ...response.data, profile_picture: null });
                setPicturePreview('');
                setMessageType('success');
                setMessage('Profile picture deleted successfully');
                updateUser(response.data);
            } catch (error) {
                console.error('Error deleting picture:', error);
                const errorMsg = error.response?.data?.detail || 'Failed to delete picture.';
                setMessageType('error');
                setMessage(errorMsg);
            } finally {
                setSaving(false);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            const formData = new FormData();
            // Only send editable fields
            formData.append('first_name', profile.first_name);
            formData.append('last_name', profile.last_name);
            formData.append('bio', profile.bio || '');
            formData.append('theme', profile.theme || 'light');

            // Only append file if it's a File object (newly selected)
            if (profile.profile_picture instanceof File) {
                formData.append('profile_picture', profile.profile_picture);
            }

            const { createFormDataRequest } = await import('../../services/api.js');
            const formApi = createFormDataRequest();
            const response = await formApi.put('/api/auth/profile/', formData);
            
            setProfile(response.data);
            if (response.data.profile_picture) {
                setPicturePreview(response.data.profile_picture);
            }
            
            setMessageType('success');
            setMessage('Profile updated successfully!');
            updateUser(response.data);
        } catch (error) {
            console.error('Error updating profile:', error);
            const errorMsg = error.response?.data?.detail || error.response?.data?.first_name?.[0] || 'Failed to update profile.';
            setMessageType('error');
            setMessage(errorMsg);
        } finally {
            setSaving(false);
            setUploadProgress(0);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
                    <p className="text-gray-500 dark:text-gray-400">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="p-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Profile</h1>

                {message && (
                    <div className={`p-4 rounded-md mb-6 flex justify-between items-start ${
                        messageType === 'success'
                            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                    }`}>
                        <p>{message}</p>
                        <button
                            onClick={() => setMessage('')}
                            className="ml-4 text-current opacity-70 hover:opacity-100"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Profile Picture Upload */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Profile Picture</label>
                        <div className="flex flex-col sm:flex-row gap-6">
                            {/* Picture Preview */}
                            <div className="flex-shrink-0">
                                {picturePreview ? (
                                    <div className="relative">
                                        <img
                                            src={picturePreview}
                                            alt="Profile"
                                            className="w-32 h-32 rounded-lg object-cover border-2 border-brand-200 dark:border-brand-700"
                                        />
                                        {profile.profile_picture && (
                                            <button
                                                type="button"
                                                onClick={handleDeletePicture}
                                                disabled={saving}
                                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-full p-1 transition-colors"
                                                title="Delete picture"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="w-32 h-32 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                                        <ImageIcon className="w-12 h-12 text-gray-400 dark:text-gray-600" />
                                    </div>
                                )}
                            </div>

                            {/* Upload Area */}
                            <div className="flex-1 flex flex-col justify-center">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={handlePictureSelect}
                                    disabled={saving}
                                    className="hidden"
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={saving}
                                    className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Upload className="w-4 h-4" />
                                    Choose Image
                                </button>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                    JPG, PNG, or WebP. Max 5MB.
                                </p>
                                {uploadProgress > 0 && uploadProgress < 100 && (
                                    <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-brand-600 h-2 rounded-full transition-all"
                                            style={{ width: `${uploadProgress}%` }}
                                        ></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Personal Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                            <input
                                type="text"
                                name="first_name"
                                value={profile.first_name}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                            <input
                                type="text"
                                name="last_name"
                                value={profile.last_name}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm p-2"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                        <input
                            type="email"
                            value={profile.email}
                            disabled
                            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 shadow-sm sm:text-sm p-2 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                        <input
                            type="text"
                            value={profile.role}
                            disabled
                            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 shadow-sm sm:text-sm p-2 cursor-not-allowed capitalize"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
                        <textarea
                            name="bio"
                            rows={4}
                            value={profile.bio || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm p-2"
                            placeholder="Tell us about yourself..."
                        />
                    </div>

                    
                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            disabled={saving}
                            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors whitespace-nowrap"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center justify-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors whitespace-nowrap min-w-fit"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;