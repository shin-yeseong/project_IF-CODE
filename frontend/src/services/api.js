import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

// Auth 관련 API
export const authAPI = {
    login: (credentials) => axios.post(`${BASE_URL}/users/login`, credentials),
    register: (userData) => axios.post(`${BASE_URL}/users/register`, userData),
    getProfile: () => axios.get(`${BASE_URL}/users/profile`),
};

// 게시판 관련 API
export const boardAPI = {
    getPosts: () => axios.get(`${BASE_URL}/posts`),
    getPost: (id) => axios.get(`${BASE_URL}/posts/${id}`),
    createPost: (postData) => axios.post(`${BASE_URL}/posts`, postData),
    updatePost: (id, postData) => axios.put(`${BASE_URL}/posts/${id}`, postData),
    deletePost: (id) => axios.delete(`${BASE_URL}/posts/${id}`),
};

// 공모전 관련 API
export const competitionAPI = {
    getCompetitions: (page = 0, size = 10) =>
        axios.get(`${BASE_URL}/competitions?page=${page}&size=${size}`),
    getCompetition: (id) => axios.get(`${BASE_URL}/competitions/${id}`),
    createCompetition: (data) => axios.post(`${BASE_URL}/competitions`, data),
};

// 채용공고 관련 API
export const jobAPI = {
    getJobs: (page = 0, size = 10) =>
        axios.get(`${BASE_URL}/jobs?page=${page}&size=${size}`),
    getJob: (id) => axios.get(`${BASE_URL}/jobs/${id}`),
    createJob: (data) => axios.post(`${BASE_URL}/jobs`, data),
};

// axios 인터셉터 설정
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
); 