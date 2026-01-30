import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Plus, Trash2, CheckCircle2, HelpCircle } from 'lucide-react';
import api from '../services/api';

const CreateQuizModal = ({ isOpen, onClose, onRefresh }) => {
    const [step, setStep] = useState(1);
    const [topicData, setTopicData] = useState({ name: '', description: '', icon: '📝' });
    const [questions, setQuestions] = useState([
        { content: '', options: ['', '', '', ''], correctOption: '', difficulty: 'MEDIUM' }
    ]);
    const [loading, setLoading] = useState(false);

    const handleAddQuestion = () => {
        setQuestions([...questions, { content: '', options: ['', '', '', ''], correctOption: '', difficulty: 'MEDIUM' }]);
    };

    const handleRemoveQuestion = (index) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const updateQuestion = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const updateOption = (qIdx, optIdx, value) => {
        const newQuestions = [...questions];
        newQuestions[qIdx].options[optIdx] = value;
        setQuestions(newQuestions);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // 1. Create the Topic
            const topicRes = await api.post('/topics', topicData);
            const createdTopic = topicRes.data;

            // 2. Create the Questions
            for (const q of questions) {
                await api.post('/questions', {
                    ...q,
                    topic: { id: createdTopic.id }
                });
            }

            alert("Quiz created successfully!");
            onRefresh();
            onClose();
        } catch (err) {
            console.error(err);
            alert("Failed to create quiz. Check if the topic name is unique.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm font-inter">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Create New Quiz</h2>
                        <p className="text-slate-500 text-sm">Step {step} of 2: {step === 1 ? 'Topic Details' : 'Add Questions'}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={24} className="text-slate-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto flex-grow bg-slate-50/50">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-6 max-w-lg mx-auto"
                            >
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Quiz Topic Name</label>
                                    <input
                                        type="text" className="input-field" placeholder="e.g. Advanced Java Patterns"
                                        value={topicData.name} onChange={e => setTopicData({ ...topicData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Description</label>
                                    <textarea
                                        className="input-field min-h-[120px]" placeholder="What will students test their knowledge on?"
                                        value={topicData.description} onChange={e => setTopicData({ ...topicData, description: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Category Icon (Emoji)</label>
                                    <input
                                        type="text" className="input-field text-2xl" placeholder="☕"
                                        value={topicData.icon} onChange={e => setTopicData({ ...topicData, icon: e.target.value })}
                                    />
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                {questions.map((q, qIdx) => (
                                    <div key={qIdx} className="glass-card p-6 rounded-2xl relative bg-white border border-slate-200">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="bg-primary-600 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold">
                                                {qIdx + 1}
                                            </span>
                                            {questions.length > 1 && (
                                                <button onClick={() => handleRemoveQuestion(qIdx)} className="text-slate-300 hover:text-red-500">
                                                    <Trash2 size={20} />
                                                </button>
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            <input
                                                type="text" className="input-field font-semibold" placeholder="Enter question text..."
                                                value={q.content} onChange={e => updateQuestion(qIdx, 'content', e.target.value)}
                                            />

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {q.options.map((opt, oIdx) => (
                                                    <div key={oIdx} className="relative group">
                                                        <input
                                                            type="text" className={`input-field pr-10 ${q.correctOption === opt && opt !== '' ? 'border-emerald-500 ring-2 ring-emerald-100' : ''}`}
                                                            placeholder={`Option ${oIdx + 1}`}
                                                            value={opt} onChange={e => updateOption(qIdx, oIdx, e.target.value)}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => updateQuestion(qIdx, 'correctOption', opt)}
                                                            className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors ${q.correctOption === opt && opt !== '' ? 'text-emerald-500 bg-emerald-50' : 'text-slate-300 hover:text-primary-500'}`}
                                                            title="Mark as correct"
                                                        >
                                                            <CheckCircle2 size={18} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex justify-end pt-2">
                                                <select
                                                    className="text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-500 px-3 py-1.5 rounded-lg border-none focus:ring-0"
                                                    value={q.difficulty} onChange={e => updateQuestion(qIdx, 'difficulty', e.target.value)}
                                                >
                                                    <option value="EASY">Easy</option>
                                                    <option value="MEDIUM">Medium</option>
                                                    <option value="HARD">Hard</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    onClick={handleAddQuestion}
                                    className="w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl text-slate-400 hover:text-primary-600 hover:border-primary-300 hover:bg-primary-50 transition-all flex items-center justify-center gap-2 font-bold"
                                >
                                    <Plus size={20} /> Add Another Question
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-100 bg-white flex justify-between gap-4">
                    {step === 2 && (
                        <button
                            onClick={() => setStep(1)}
                            className="px-6 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                        >
                            Back
                        </button>
                    )}
                    <div className="flex gap-4 ml-auto">
                        {step === 1 ? (
                            <button
                                onClick={() => step === 1 && topicData.name ? setStep(2) : alert("Please enter topic name")}
                                className="btn-primary px-10 py-3 rounded-xl flex items-center gap-2"
                            >
                                Next Step <Plus size={20} />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="btn-primary px-10 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2"
                            >
                                {loading ? "Creating..." : "Save Quiz & Launch"} <Save size={20} />
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default CreateQuizModal;
