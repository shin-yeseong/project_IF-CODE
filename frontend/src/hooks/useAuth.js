import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { tokenUtils } from '../utils/helpers';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            if (tokenUtils.isAuthenticated()) {
                try {
                    const response = await authAPI.getProfile();
                    setUser(response.data);
                } catch (error) {
                    console.error('인증 확인 실패:', error);
                    tokenUtils.removeToken();
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (credentials) => {
        try {
            const response = await authAPI.login(credentials);
            const { token, user: userData } = response.data;
            tokenUtils.setToken(token);
            setUser(userData);
            navigate('/');
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || '로그인에 실패했습니다.'
            };
        }
    };

    const logout = () => {
        tokenUtils.removeToken();
        setUser(null);
        navigate('/login');
    };

    const register = async (userData) => {
        try {
            const response = await authAPI.register(userData);
            const { token, user: newUser } = response.data;
            tokenUtils.setToken(token);
            setUser(newUser);
            navigate('/');
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || '회원가입에 실패했습니다.'
            };
        }
    };

    return {
        user,
        loading,
        login,
        logout,
        register,
        isAuthenticated: tokenUtils.isAuthenticated()
    };
}; 