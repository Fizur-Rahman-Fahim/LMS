import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/authContext';

const Profile = () => {
    const { user: authUser, updateUser } = useAuth();
    const [profile, setProfile] = useState({
        first_name: '',
        last_name: '',
        email: '',
        bio: '',
        role: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/api/auth/profile/');
            setProfile(response.data);
        } catch (error) {
            console.error('Error fetching profile:', error);
            setMessage('Failed to load profile. Please refresh the page.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        try {
            await api.put('/api/auth/profile/', profile);
            setMessage('Profile updated successfully!');
            updateUser(profile);
        } catch (error) {
            console.error('Error updating profile:', error);
            const errorMsg = error.response?.data?.detail || 'Failed to update profile.';
            setMessage(errorMsg);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading profile...</div>;

    return (
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="p-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Profile</h1>

                {message && (
                    <div className={`p-4 rounded-md mb-6 ${message.includes('success') ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                            <input
                                type="text"
                                name="first_name"
                                value={profile.first_name}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                            <input
                                type="text"
                                name="last_name"
                                value={profile.last_name}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                        <input
                            type="email"
                            value={profile.email}
                            disabled
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 shadow-sm sm:text-sm p-2 border cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                        <input
                            type="text"
                            value={profile.role}
                            disabled
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 shadow-sm sm:text-sm p-2 border cursor-not-allowed capitalize"
                        />
                    </div>

                    {/* Preferred theme selection removed; app uses single light theme */}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
                        <textarea
                            name="bio"
                            rows={4}
                            value={profile.bio || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
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