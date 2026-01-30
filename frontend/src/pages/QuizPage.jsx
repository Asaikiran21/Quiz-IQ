import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { topicService, quizService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { CheckCircle2, ChevronRight, ChevronLeft, Send, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QuizPage = () => {
    const { topicId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [topic, setTopic] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({}); // { questionId: selectedOptionContent }
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const [tRes, qRes] = await Promise.all([
                    topicService.getById(topicId),
                    topicService.getQuestions(topicId)
                ]);
                setTopic(tRes.data);
                setQuestions(qRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [topicId]);

    const handleSelect = (option) => {
        setAnswers({ ...answers, [questions[currentIndex].id]: option });
    };

    const handleSubmit = async () => {
        if (Object.keys(answers).length < questions.length) {
            if (!window.confirm("You haven't answered all questions. Submit anyway?")) return;
        }

        setSubmitting(true);
        try {
            if (!user?.id) {
                alert("Session expired. Please login again.");
                navigate('/login');
                return;
            }

            const submission = {
                topicId: parseInt(topicId),
                userId: user.id,
                answers: answers
            };
            console.log("Submitting quiz:", submission);
            const res = await quizService.submit(submission);
            setResult(res.data);
        } catch (err) {
            console.error(err);
            alert("Failed to submit results. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <Loader2 className="animate-spin text-primary-600" size={48} />
        </div>
    );

    if (result) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />
                <main className="max-w-3xl mx-auto p-8 pt-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card p-12 rounded-[3rem] bg-white shadow-2xl"
                    >
                        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
                            <CheckCircle2 size={48} />
                        </div>
                        <h1 className="text-4xl font-black text-slate-800 mb-2">Quiz Completed!</h1>
                        <p className="text-slate-500 mb-8 font-medium">Topic: {topic?.name}</p>

                        <div className="grid grid-cols-2 gap-6 mb-12">
                            <div className="p-6 bg-slate-50 rounded-3xl">
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Score</p>
                                <p className="text-3xl font-black text-slate-800">{result.score} / {result.totalQuestions}</p>
                            </div>
                            <div className="p-6 bg-primary-50 rounded-3xl">
                                <p className="text-sm font-bold text-primary-400 uppercase tracking-widest mb-1">Accuracy</p>
                                <p className="text-3xl font-black text-primary-600">{result.percentage.toFixed(1)}%</p>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/home')}
                            className="btn-primary px-12 py-4 rounded-2xl font-bold text-lg"
                        >
                            Back to Dashboard
                        </button>
                    </motion.div>
                </main>
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];

    return (
        <div className="min-h-screen bg-slate-50 font-inter">
            <Navbar />
            <div className="max-w-4xl mx-auto p-8 pt-12">
                {/* Progress Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-lg font-black text-slate-400 uppercase tracking-widest">{topic?.name}</h2>
                        <h1 className="text-2xl font-bold text-slate-800">Question {currentIndex + 1} of {questions.length}</h1>
                    </div>
                    <div className="text-right">
                        <span className="text-sm font-bold text-primary-600 bg-primary-50 px-4 py-2 rounded-full">
                            {Math.round(((currentIndex + 1) / questions.length) * 100)}% Progress
                        </span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-3 bg-slate-200 rounded-full mb-12 overflow-hidden">
                    <motion.div
                        className="h-full bg-primary-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                    />
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        <div className="glass-card p-10 rounded-[2.5rem] bg-white shadow-lg border border-slate-100">
                            <h3 className="text-2xl font-bold text-slate-800 mb-10 leading-tight">
                                {currentQuestion?.content}
                            </h3>

                            <div className="grid grid-cols-1 gap-4">
                                {currentQuestion?.options.map((opt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSelect(opt)}
                                        className={`p-6 rounded-2xl text-left transition-all duration-200 flex items-center justify-between group ${answers[currentQuestion.id] === opt
                                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-200 ring-4 ring-primary-100'
                                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:translate-x-1'
                                            }`}
                                    >
                                        <span className="font-semibold text-lg">{opt}</span>
                                        {answers[currentQuestion.id] === opt && <CheckCircle2 size={24} />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Footer */}
                <div className="flex justify-between items-center mt-12">
                    <button
                        disabled={currentIndex === 0}
                        onClick={() => setCurrentIndex(currentIndex - 1)}
                        className="flex items-center gap-2 font-bold text-slate-400 hover:text-slate-600 disabled:opacity-30 transition-colors"
                    >
                        <ChevronLeft size={24} /> Previous
                    </button>

                    {currentIndex === questions.length - 1 ? (
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="btn-primary px-10 py-4 flex items-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
                        >
                            {submitting ? 'Submitting...' : 'Finish & View Result'} <Send size={20} />
                        </button>
                    ) : (
                        <button
                            onClick={() => setCurrentIndex(currentIndex + 1)}
                            className="btn-primary px-10 py-4 flex items-center gap-2 rounded-2xl shadow-primary-200"
                        >
                            Next Question <ChevronRight size={24} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuizPage;
