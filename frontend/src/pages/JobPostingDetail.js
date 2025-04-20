import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import axios from 'axios';

const JobPostingDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJobDetail = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/jobs/${id}`);
                setJob(response.data);
            } catch (error) {
                console.error('채용공고 상세 정보 불러오기 실패:', error);
                setError('채용공고 정보를 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchJobDetail();
    }, [id]);

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

    if (error || !job) {
        return (
            <>
                <Header />
                <div className="bg-white min-h-screen p-32 pt-32 flex justify-center items-center">
                    <div className="text-red-500">{error || '채용공고를 찾을 수 없습니다.'}</div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="bg-white min-h-screen p-32 pt-32">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-[#482070] mb-4">{job.position}</h1>
                        <div className="text-xl text-gray-600">{job.company}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h2 className="font-bold text-gray-700 mb-2">근무 위치</h2>
                            <p>{job.location}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h2 className="font-bold text-gray-700 mb-2">경력 요건</h2>
                            <p>{job.experience}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h2 className="font-bold text-gray-700 mb-2">기술 스택</h2>
                            <div className="flex flex-wrap gap-2">
                                {job.stack.map((tech, index) => (
                                    <span key={index} className="bg-[#482070] text-white px-3 py-1 rounded-full text-sm">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h2 className="font-bold text-gray-700 mb-2">마감일</h2>
                            <p>{new Date(job.deadline).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <h2 className="text-xl font-bold text-[#482070] mb-4">주요 업무</h2>
                            <div className="bg-gray-50 p-6 rounded-lg whitespace-pre-wrap">{job.description}</div>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-[#482070] mb-4">자격 요건</h2>
                            <div className="bg-gray-50 p-6 rounded-lg whitespace-pre-wrap">{job.requirements}</div>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-[#482070] mb-4">복리후생</h2>
                            <div className="bg-gray-50 p-6 rounded-lg whitespace-pre-wrap">{job.benefits}</div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end space-x-4">
                        <button
                            onClick={() => navigate('/jobposting')}
                            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                        >
                            목록으로
                        </button>
                        <button
                            onClick={() => window.open(job.applyUrl, '_blank')}
                            className="bg-[#482070] text-white px-6 py-2 rounded hover:bg-purple-900"
                        >
                            지원하기
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default JobPostingDetail; 