import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';

const Register = () => {
    const [data, setData] = useState({ username: '', email: '', password: '', role: 'USER' });
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await register(data);
            navigate(user.role === 'ADMIN' ? '/admin' : '/home');
        } catch (err) {
            alert('Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="glass-card w-full max-w-md p-8 rounded-2xl">
                <h1 className="text-3xl font-bold text-center mb-8">Create Account</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text" placeholder="Username" required className="input-field"
                        value={data.username} onChange={e => setData({ ...data, username: e.target.value })}
                    />
                    <input
                        type="email" placeholder="Email" required className="input-field"
                        value={data.email} onChange={e => setData({ ...data, email: e.target.value })}
                    />
                    <input
                        type="password" placeholder="Password" required className="input-field"
                        value={data.password} onChange={e => setData({ ...data, password: e.target.value })}
                    />
                    <select
                        className="input-field" value={data.role}
                        onChange={e => setData({ ...data, role: e.target.value })}
                    >
                        <option value="USER">Student</option>
                        <option value="ADMIN">Administrator</option>
                    </select>
                    <button type="submit" className="btn-primary w-full py-3 flex justify-center items-center gap-2">
                        <UserPlus size={20} /> Register
                    </button>
                    <p className="text-center text-sm text-slate-500">
                        Already have an account? <Link to="/login" className="text-primary-600 font-bold">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
