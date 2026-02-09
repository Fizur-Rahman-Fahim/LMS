import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, ArrowRight, Mail, Lock, User, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/authContext';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        role: 'student',
    });
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setErrors({});
        setLoading(true);

        try {
            await register(formData);
            navigate('/dashboard');
        } catch (err) {
            if (err.response?.data) {
                // Handle field-specific errors from Django REST Framework
                const data = err.response.data;
                if (data.detail) {
                    setError(data.detail);
                } else {
                    setErrors(data);
                    setError('Please check the form for errors.');
                }
            } else {
                setError('Registration failed. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white dark:bg-gray-950">
            {/* Left Side - Visual */}
            <div className="hidden lg:flex lg:w-1/2 bg-brand-900 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-600 to-brand-900 opacity-90"></div>
                <div className="relative z-10 flex flex-col justify-center px-12 text-white">
                    <div className="mb-8">
                        <div className="inline-flex p-3 bg-white/10 rounded-xl backdrop-blur-sm mb-6">
                            <UserPlus className="w-12 h-12 text-white" />
                        </div>
                        <h1 className="text-5xl font-bold mb-6 leading-tight">Join Our Global<br />Learning Community</h1>
                        <p className="text-xl text-brand-100 max-w-md leading-relaxed">
                            Create your account to start your journey today. Manage courses, track progress, and learn anything.
                        </p>
                    </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -ml-32 -mb-32"></div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm lg:w-96 animate-fade-in">
                    <div className="lg:hidden mb-8 text-center">
                        <div className="inline-block p-2 bg-brand-100 rounded-lg mb-2">
                            <GraduationCap className="w-8 h-8 text-brand-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">LMS Portal</h2>
                    </div>

                    <div className="text-center lg:text-left mb-10">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Create account</h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Fill in your details to get started
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-md animate-slide-up">
                            <p className="font-medium">Problem detected</p>
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                                <input
                                    type="text"
                                    required
                                    className={`input-field mt-1 ${errors.first_name ? 'border-red-500' : ''}`}
                                    value={formData.first_name}
                                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                />
                                {errors.first_name && <p className="mt-1 text-xs text-red-600">{errors.first_name[0]}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                                <input
                                    type="text"
                                    required
                                    className={`input-field mt-1 ${errors.last_name ? 'border-red-500' : ''}`}
                                    value={formData.last_name}
                                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                />
                                {errors.last_name && <p className="mt-1 text-xs text-red-600">{errors.last_name[0]}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
                            <div className="mt-1 relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="email"
                                    required
                                    className={`input-field pl-10 ${errors.email ? 'border-red-500' : ''}`}
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email[0]}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                            <div className="mt-1 relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <select
                                    className={`input-field pl-10 appearance-none bg-white font-medium ${errors.role ? 'border-red-500' : ''}`}
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="student">Learning as Student</option>
                                    <option value="instructor">Teaching as Instructor</option>
                                </select>
                            </div>
                            {errors.role && <p className="mt-1 text-xs text-red-600">{errors.role[0]}</p>}
                        </div>

                        {/* Theme selection removed; app uses single light theme */}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Choose Password</label>
                            <div className="mt-1 relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="password"
                                    required
                                    minLength={8}
                                    className={`input-field pl-10 ${errors.password ? 'border-red-500' : ''}`}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password[0]}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-3 flex justify-center items-center gap-2 mt-4"
                        >
                            {loading ? 'Creating account...' : (
                                <>
                                    Create Free Account <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-brand-600 hover:text-brand-500">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
