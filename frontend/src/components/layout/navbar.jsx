import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, Home, BookOpen, LogOut, Menu, X, Moon, Sun } from 'lucide-react';
import { useAuth } from '../../context/authContext';

const Navbar = () => {
    const { user, logout, theme, toggleTheme } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    const NavLink = ({ to, icon: Icon, children }) => (
        <Link
            to={to}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
            ${isActive(to)
                    ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
        >
            <Icon className={`w-4 h-4 ${isActive(to) ? 'text-brand-600 dark:text-brand-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-brand-600 dark:group-hover:text-brand-400'}`} />
            {children}
        </Link>
    );

    return (
        <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/dashboard" className="flex items-center gap-3 group">
                        <div className="p-2 bg-brand-100 rounded-lg group-hover:bg-brand-200 transition-colors">
                            <GraduationCap className="w-6 h-6 text-brand-700" />
                        </div>
                        <span className="text-xl font-bold bg-linear-to-r from-brand-700 to-brand-500 dark:from-brand-400 dark:to-brand-600 bg-clip-text ">
                            LMS Portal
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-2">
                        <NavLink to="/dashboard" icon={Home}>Dashboard</NavLink>
                        <NavLink to="/courses" icon={BookOpen}>Catalogue</NavLink>

                        {user && (
                            <Link
                                to="/my-courses"
                                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ml-2
                                ${isActive('/my-courses')
                                        ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                            >
                                <BookOpen className={`w-4 h-4 ${isActive('/my-courses') ? 'text-brand-600 dark:text-brand-400' : 'text-gray-400 dark:text-gray-500'}`} />
                                <span>My Courses</span>
                            </Link>
                        )}
                    </div>

                    {/* User Menu & Logout */}
                    <div className="hidden md:flex items-center gap-4 pl-6 border-l border-gray-200 dark:border-gray-700 ml-4">
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden lg:block">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{user?.first_name} {user?.last_name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
                            </div>
                            <Link to="/profile" className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                {user?.profile_picture ? (
                                    <img
                                        src={`http://localhost:8000${user.profile_picture}`}  // Add full URL
                                        alt="Profile"
                                        className="w-8 h-8 rounded-full object-cover border border-brand-200 dark:border-brand-800"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextElementSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center text-brand-600 dark:text-brand-400 font-bold border border-brand-200 dark:border-brand-800">
                                        {user?.first_name?.[0] || 'U'}
                                    </div>
                                )}
                            </Link>
                        </div>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
                            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                        >
                            {theme === 'light' ? (
                                <Moon className="w-5 h-5" />
                            ) : (
                                <Sun className="w-5 h-5" />
                            )}
                        </button>

                        <button
                            onClick={handleLogout}
                            className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center gap-2">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
                            title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
                        >
                            {theme === 'light' ? (
                                <Moon className="h-5 w-5" />
                            ) : (
                                <Sun className="h-5 w-5" />
                            )}
                        </button>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;