import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';

const CompetitionForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        organizer: '',
        period: '',
        prize: '',
        description: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/api/competitions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                navigate('/competition');
            } else {
                alert('공모전 등록에 실패했습니다.');
            }
        } catch (error) {
            console.error('공모전 등록 실패:', error);
            alert('공모전 등록에 실패했습니다.');
        }
    };

    return (
        <>
            <Header />
            <div className="bg-white min-h-screen p-32 pt-32">
                <h1 className="text-3xl font-bold text-[#482070]">공모전 등록</h1>
                <form onSubmit={handleSubmit} className="mt-8 max-w-2xl">
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">제목</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">주최기관</label>
                            <input
                                type="text"
                                value={formData.organizer}
                                onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">기간</label>
                            <input
                                type="text"
                                value={formData.period}
                                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                required
                                placeholder="예: 2024.04.01 ~ 2024.05.31"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">상금</label>
                            <input
                                type="text"
                                value={formData.prize}
                                onChange={(e) => setFormData({ ...formData, prize: e.target.value })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                placeholder="예: 대상 1,000만원"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">설명</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                                required
                            />
                        </div>
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="bg-[#482070] text-white px-4 py-2 rounded hover:bg-purple-900"
                            >
                                등록하기
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/competition')}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                            >
                                취소
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <Footer />
        </>
    );
};

export default CompetitionForm; 