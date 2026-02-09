import { Outlet } from 'react-router-dom';
import Navbar from './navbar';

const Layout = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
            <Navbar />
            <main className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;