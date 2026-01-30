import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { topicService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, Clock, BookOpen } from 'lucide-react';

const StudentHome = () => {
    const [topics, setTopics] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await topicService.getAll();
                console.log("Student Topics fetched:", res.data);
                setTopics(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error("Fetch topics error:", err);
                // Fallback mock
                setTopics([
                    { id: 1, name: 'Java Basics', description: 'Test your core Java knowledge.', icon: '☕' },
                    { id: 2, name: 'React Hooks', description: 'Advanced UI patterns.', icon: '⚛️' }
                ]);
            }
        };
        fetch();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main className="max-w-7xl mx-auto p-8 text-inter">
                <header className="mb-12">
                    <h1 className="text-3xl font-bold text-slate-800">Available Quizzes</h1>
                    <p className="text-slate-500 mt-2">Choose a topic to test your skills today.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Array.isArray(topics) && topics.map(topic => (
                        <div
                            key={topic.id}
                            onClick={() => navigate(`/quiz/${topic.id}`)}
                            className="glass-card p-8 rounded-3xl group hover:border-primary-300 transition-all cursor-pointer bg-white border border-slate-100 shadow-sm"
                        >
                            <div className="text-5xl mb-6 bg-primary-50 w-20 h-20 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform">
                                {topic.icon || '📚'}
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-3">{topic.name}</h3>
                            <p className="text-slate-500 mb-6 leading-relaxed line-clamp-2 h-12">{topic.description}</p>
                            <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-1 text-slate-400 text-sm font-semibold">
                                        <BookOpen size={16} /> Start Quiz
                                    </div>
                                </div>
                                <button className="text-primary-600 group-hover:translate-x-2 transition-transform">
                                    <PlayCircle size={32} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default StudentHome;
