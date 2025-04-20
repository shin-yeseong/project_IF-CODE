import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';

const Competition = () => {
    const [competitions, setCompetitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCompetitions = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:8080/api/competitions?page=${currentPage}&size=9`);
                if (response.ok) {
                    const data = await response.json();
                    setCompetitions(data.content);
                    setTotalPages(data.totalPages);
                }
            } catch (error) {
                console.error('공모전 목록 불러오기 실패:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCompetitions();
    }, [currentPage]);

    if (loading) {
        return (
            <>
                <Header />
                <div className="bg-white min-h-screen p-32 pt-32 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#482070]"></div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="bg-white min-h-screen p-32 pt-32">
                <h1 className="text-3xl font-bold text-[#482070]">Competition |</h1>
                <p className="text-lg text-[#482070] mt-10">
                    본 게시판은 융합소프트웨어 연계전공생들을 위한 공모전 게시판입니다. <br />
                    다양한 IT/SW 공모전 정보를 확인하고 참여할 수 있습니다.
                </p>

                <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {competitions.length > 0 ? (
                        competitions.map((competition) => (
                            <div key={competition.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-purple-900 mb-2">{competition.title}</h3>
                                    <div className="space-y-2 text-gray-600">
                                        <p><span className="font-semibold">주최:</span> {competition.organizer}</p>
                                        <p><span className="font-semibold">기간:</span> {competition.period}</p>
                                        <p><span className="font-semibold">상금:</span> {competition.prize}</p>
                                        <p className="mt-4 text-gray-700">{competition.description}</p>
                                    </div>
                                    <button
                                        onClick={() => navigate(`/competition/${competition.id}`)}
                                        className="mt-4 w-full bg-purple-800 text-white py-2 rounded-lg hover:bg-purple-900 transition-colors duration-200"
                                    >
                                        자세히 보기
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-3 text-center py-10">
                            <p className="text-xl text-gray-500">등록된 공모전이 없습니다.</p>
                            <p className="text-gray-400 mt-2">새로운 공모전을 등록해보세요!</p>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-between items-center">
                    <div className="flex gap-2">
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i)}
                                className={`px-4 py-2 rounded ${currentPage === i
                                    ? 'bg-[#482070] text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => navigate('/competition/new')}
                        className="bg-[#482070] text-white px-4 py-2 rounded hover:bg-purple-900"
                    >
                        공모전 등록
                    </button>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Competition; 