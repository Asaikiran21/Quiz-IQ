import React, { useState, useEffect } from 'react';
import { quizService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Calendar, Award, BookOpen, ChevronRight, History } from 'lucide-react';
import { motion } from 'framer-motion';

const HistoryPage = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await quizService.getHistory(user.id);
                // Filter out any orphaned records where the topic no longer exists
                const validHistory = (res.data || []).filter(item => item.topic);
                setHistory(validHistory);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (user?.id) fetch();
    }, [user]);

    return (
        <div className="min-h-screen bg-slate-50 font-inter">
            <Navbar />
            <main className="max-w-5xl mx-auto p-8 pt-12">
                <header className="mb-12 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-black text-slate-800 tracking-tight">Your Quiz History</h1>
                        <p className="text-slate-500 font-medium mt-2">Track your progress and review previous assessments.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 gap-6">
                    {history.map((record, idx) => (
                        <motion.div
                            key={record.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="glass-card p-8 rounded-[2rem] bg-white border border-slate-100 flex flex-col md:flex-row items-center justify-between shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center gap-6 mb-4 md:mb-0">
                                <div className="p-4 bg-primary-50 rounded-2xl text-primary-600">
                                    <BookOpen size={32} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">{record.topic?.name || 'Deleted Topic'}</h3>
                                    <div className="flex items-center gap-4 text-sm text-slate-400 font-bold mt-1">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            {new Date(record.completedAt).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Award size={14} />
                                            {record.totalQuestions} Questions
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-12 text-center">
                                <div>
                                    <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest mb-1">Score</p>
                                    <p className="text-2xl font-black text-slate-700">{record.score} / {record.totalQuestions}</p>
                                </div>
                                <div className="w-[120px]">
                                    <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest mb-1">Percentage</p>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-2xl font-black ${record.percentage >= 60 ? 'text-emerald-500' : 'text-amber-500'}`}>
                                            {record.percentage.toFixed(0)}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {history.length === 0 && !loading && (
                        <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <History size={40} className="text-slate-300" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-700">No Assessment History</h2>
                            <p className="text-slate-400 mt-2">Take your first quiz to see results here.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default HistoryPage;
