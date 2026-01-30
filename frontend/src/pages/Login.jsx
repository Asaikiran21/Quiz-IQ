import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

const Login = () => {
    const [creds, setCreds] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await login(creds);
            navigate(user.role === 'ADMIN' ? '/admin' : '/home');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="glass-card w-full max-w-md p-8 rounded-2xl">
                <h1 className="text-3xl font-bold text-center mb-8">Login to QuizIQ</h1>
                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text" placeholder="Username" required className="input-field"
                        value={creds.username} onChange={e => setCreds({ ...creds, username: e.target.value })}
                    />
                    <input
                        type="password" placeholder="Password" required className="input-field"
                        value={creds.password} onChange={e => setCreds({ ...creds, password: e.target.value })}
                    />
                    <button type="submit" className="btn-primary w-full py-3 flex justify-center items-center gap-2">
                        <LogIn size={20} /> Login
                    </button>
                    <p className="text-center text-sm text-slate-500">
                        Don't have an account? <Link to="/register" className="text-primary-600 font-bold">Register</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
