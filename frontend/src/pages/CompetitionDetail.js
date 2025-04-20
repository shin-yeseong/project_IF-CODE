import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/header';
import Footer from '../components/footer';

const CompetitionDetail = () => {
    const { id } = useParams();
    const [competition, setCompetition] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCompetition = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/competitions/${id}`);
                setCompetition(response.data);
            } catch (error) {
                console.error('공모전 정보를 불러오는데 실패했습니다:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCompetition();
    }, [id]);

    if (loading) return <div className="min-h-screen bg-white p-4 flex items-center justify-center">
        <p className="text-gray-600">로딩 중...</p>
    </div>;

    if (!competition) return <div className="min-h-screen bg-white p-4 flex items-center justify-center">
        <p className="text-gray-600">공모전을 찾을 수 없습니다.</p>
    </div>;

    return (
        <>
            <Header />
            <div className="min-h-screen bg-white pt-24">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="border-b border-gray-200 pb-8 mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">{competition.title}</h1>
                        <p className="text-lg text-purple-800">{competition.organizer}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">접수기간</h2>
                            <p className="text-gray-700">{competition.period}</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">참가대상</h2>
                            <p className="text-gray-700">{competition.target}</p>
                        </div>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">시상내역</h2>
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <p className="text-gray-700 whitespace-pre-wrap">{competition.prize}</p>
                        </div>
                    </div>

                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">공모전 내용</h2>
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{competition.description}</p>
                        </div>
                    </div>

                    {competition.applyUrl && (
                        <div className="text-center py-8">
                            <a
                                href={competition.applyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block bg-purple-800 text-white px-12 py-4 text-lg font-semibold rounded-lg hover:bg-purple-900 transition-colors duration-200 shadow-lg hover:shadow-xl"
                            >
                                지원하기
                            </a>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default CompetitionDetail; 