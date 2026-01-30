import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import StudentHome from './pages/StudentHome';
import QuizPage from './pages/QuizPage';
import HistoryPage from './pages/HistoryPage';

const ProtectedRoute = ({ children, role }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    if (role && user.role !== role) {
        return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/home'} />;
    }
    return children;
};

const RootRedirect = () => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/home'} />;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/admin" element={
                        <ProtectedRoute role="ADMIN">
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/home" element={
                        <ProtectedRoute role="USER">
                            <StudentHome />
                        </ProtectedRoute>
                    } />
                    <Route path="/quiz/:topicId" element={
                        <ProtectedRoute role="USER">
                            <QuizPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/history" element={
                        <ProtectedRoute role="USER">
                            <HistoryPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/" element={<RootRedirect />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
