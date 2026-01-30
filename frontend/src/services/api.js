import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    login: (creds) => api.post('/auth/login', creds),
    register: (data) => api.post('/auth/register', data),
};

export const topicService = {
    getAll: () => api.get('/topics'),
    getById: (id) => api.get(`/topics/${id}`),
    getQuestions: (id) => api.get(`/questions/topic/${id}`), // New
};

export const quizService = {
    getQuiz: (topicId, difficulty, count) =>
        api.get('/questions/quiz', { params: { topicId, difficulty, count } }),
    submit: (result) => api.post('/quiz/submit', result),
    getHistory: (userId) => api.get(`/quiz/history/${userId}`), // New
};

export default api;
