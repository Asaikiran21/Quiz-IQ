import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Plus, Users, BookOpen, BarChart, Trash2, Edit3 } from 'lucide-react';
import { topicService } from '../services/api';
import api from '../services/api';
import CreateQuizModal from '../components/CreateQuizModal';

const AdminDashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTopics = async () => {
        try {
            const res = await topicService.getAll();
            console.log("Topics fetched:", res.data);
            setTopics(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Fetch topics error:", err);
            setTopics([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTopics();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Delete this topic and all its questions?")) {
            await api.delete(`/topics/${id}`);
            fetchTopics();
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-inter">
            <Navbar />
            <main className="max-w-7xl mx-auto p-8">
                <header className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Administrator Dashboard</h1>
                        <p className="text-slate-500 mt-1">Global system overview and quiz management.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="glass-card p-6 rounded-3xl bg-white border border-slate-100">
                        <div className="flex justify-between items-center mb-4">
                            <div className="p-3 bg-primary-50 rounded-2xl text-primary-600">
                                <BookOpen size={24} />
                            </div>
                            <span className="text-3xl font-black text-slate-800">{topics.length}</span>
                        </div>
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Active Topics</p>
                    </div>
                    <div className="glass-card p-6 rounded-3xl bg-white border border-slate-100">
                        <div className="flex justify-between items-center mb-4">
                            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                                <Users size={24} />
                            </div>
                            <span className="text-3xl font-black text-slate-800">12</span>
                        </div>
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Graduated Students</p>
                    </div>
                    <div className="glass-card p-6 rounded-3xl bg-white border border-slate-100">
                        <div className="flex justify-between items-center mb-4">
                            <div className="p-3 bg-amber-50 rounded-2xl text-amber-600">
                                <BarChart size={24} />
                            </div>
                            <span className="text-3xl font-black text-slate-800">72%</span>
                        </div>
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Global Success Rate</p>
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-slate-800">Quiz Management</h2>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="btn-primary py-2.5 px-6 rounded-xl flex items-center gap-2 font-bold"
                        >
                            <Plus size={20} /> Create New Quiz
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Topic</th>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Description</th>
                                    <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {Array.isArray(topics) && topics.map(t => (
                                    <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">{t.icon || '📝'}</span>
                                                <span className="font-bold text-slate-700">{t.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <p className="text-sm text-slate-500 max-w-md truncate">{t.description}</p>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg">
                                                    <Edit3 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(t.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {topics.length === 0 && !loading && (
                                    <tr>
                                        <td colSpan="3" className="px-8 py-20 text-center text-slate-400 font-medium">
                                            No quizzes found. Create your first one above!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            <CreateQuizModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onRefresh={fetchTopics}
            />
        </div>
    );
};

export default AdminDashboard;
