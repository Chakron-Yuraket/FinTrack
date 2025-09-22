import React from 'react';
import { Link } from 'react-router-dom'; 
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

function MainLayout({ children }) {
    const user = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <aside className="w-64 bg-white shadow-md">
                <div className="p-6">
                    <h1 className="text-2xl font-bold text-blue-600">FinTrack</h1>
                </div>
                <nav className="mt-6">
                    <Link to="/dashboard" className="block py-2.5 px-6 text-gray-700 hover:bg-blue-50">
                        Dashboard
                    </Link>
                    <Link to="/transactions" className="block py-2.5 px-6 text-gray-700 hover:bg-blue-50">
                        Transactions
                    </Link>
                    <Link to="/reports" className="block py-2.5 px-6 text-gray-700 hover:bg-blue-50">
                        Reports
                    </Link>
                    <Link to="/settings" className="block py-2.5 px-6 text-gray-700 hover:bg-blue-50">
                        Settings
                    </Link>
                </nav>
            </aside>

            <div className="flex-1 flex flex-col">
                <header className="flex justify-end items-center p-4 bg-white border-b">
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-600">Welcome, {user ? user.name : 'Guest'}</span>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                        >
                            Logout
                        </button>
                        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    </div>
                </header>

                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default MainLayout;