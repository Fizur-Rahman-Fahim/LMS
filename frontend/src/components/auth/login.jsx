import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, ArrowRight, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/authContext';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(formData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.detail || 'Login failed');
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
                            <GraduationCap className="w-12 h-12 text-white" />
                        </div>
                        <h1 className="text-5xl font-bold mb-6 leading-tight">Master New Skills<br />Advance Your Career</h1>
                        <p className="text-xl text-brand-100 max-w-md leading-relaxed">
                            Join our learning platform today and access world-class courses taught by industry experts.
                        </p>
                    </div>
                </div>

                {/* Decorative Circles */}
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
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
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Welcome back</h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Please enter your details to sign in
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-md animate-slide-up">
                            <p className="font-medium">Authentication Failed</p>
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email address</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="input-field pl-10"
                                    placeholder="E-mail"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="input-field pl-10"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <Link to="/forgot-password" className="font-medium text-brand-600 hover:text-brand-500">
                                    Forgot password?
                                </Link>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary flex justify-center items-center gap-2"
                        >
                            {loading ? 'Signing in...' : (
                                <>
                                    Sign in <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-medium text-brand-600 hover:text-brand-500">
                                Create free account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default Login;