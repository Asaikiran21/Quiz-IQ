import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { LogOut, BrainCircuit } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const link = user?.role === 'ADMIN' ? '/admin' : '/home';

    return (
        <nav className="glass-card sticky top-0 z-50 px-6 py-4 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-slate-100">
            <div className="flex items-center gap-8">
                <Link to={link} className="flex items-center gap-2">
                    <BrainCircuit className="text-primary-600" size={28} />
                    <span className="text-xl font-bold text-slate-800 tracking-tight">QuizIQ</span>
                </Link>

                {user?.role === 'USER' && (
                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/home" className="text-sm font-bold text-slate-500 hover:text-primary-600 transition-colors">Dashboard</Link>
                        <Link to="/history" className="text-sm font-bold text-slate-500 hover:text-primary-600 transition-colors">My History</Link>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">{user?.role}</p>
                    <p className="text-sm font-bold text-slate-700 leading-none">{user?.username}</p>
                </div>
                <div className="h-8 w-px bg-slate-100 mx-2"></div>
                <button onClick={logout} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                    <LogOut size={20} />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
