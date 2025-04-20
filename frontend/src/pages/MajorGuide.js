import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';

const MajorGuide = () => {
    return (
        <>
            <Header />
            <div className="bg-white min-h-screen p-8 md:p-16 lg:p-32 pt-32">
                {/* 타이틀 섹션 */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold text-[#482070] mb-8">
                        Major Guide
                    </h1>
                    <div className="flex justify-center gap-6 text-lg font-medium">
                        <a href="#basic" className="hover:text-[#482070] transition-colors hover:font-bold">기본정보</a>
                        <span className="text-gray-300">|</span>
                        <a href="#graduation" className="hover:text-[#482070] transition-colors hover:font-bold">졸업요건</a>
                        <span className="text-gray-300">|</span>
                        <a href="#curriculum" className="hover:text-[#482070] transition-colors hover:font-bold">학업이수</a>
                        <span className="text-gray-300">|</span>
                        <a href="#career" className="hover:text-[#482070] transition-colors hover:font-bold">진로 및 취업분야</a>
                    </div>
                </div>

                {/* 연계전공 소개 */}
                <div className="bg-gradient-to-br from-[#482070]/5 to-[#482070]/10 rounded-2xl p-8 mb-12 shadow-lg">
                    <h2 className="text-2xl font-bold text-[#482070] mb-6 text-center">연계전공이란?</h2>
                    <p className="text-gray-700 text-lg leading-relaxed text-center max-w-4xl mx-auto">
                        2개 이상의 학부, 학과 또는 전공이 연계하여 제공하는 전공입니다.
                        단일 학문의 영역을 초월하여 다양한 성격의 학문을 접할 수 있는 기회를 제공함으로써
                        교육 경쟁력을 강화합니다. 또한, 급변하는 사회적 요구에 능동적으로 대처할 수 있는
                        융합형 인재 양성을 목표로 합니다.
                    </p>
                </div>

                {/* 기본정보 섹션 */}
                <section id="basic" className="mb-16 scroll-mt-32">
                    <div className="border-l-4 border-[#482070] pl-4 mb-8">
                        <h2 className="text-3xl font-bold text-[#482070]">기본정보</h2>
                    </div>
                    <div className="space-y-8 bg-white rounded-2xl p-8 shadow-lg">
                        <div>
                            <h3 className="text-xl font-semibold mb-4 text-[#482070]">학위명</h3>
                            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                                <li>융합소프트웨어 학사</li>
                                <li>Bachelor of Science in Software Convergence</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-4 text-[#482070]">학과개요</h3>
                            <p className="text-gray-700 leading-relaxed">
                                IT 비전공자들을 위한 융합교육과정으로서 현대 사회에서 나타나는 복잡한 공학적 현실문제와
                                산업체에서 요구하는 문제를 해결할 수 있는 융합적 인재양성을 목적으로 합니다.
                                현재 이 연계전공에서는 인문/사회/예술/경영 등 다양한 전공의 재학생들이 소속되어 있으며,
                                강의 전담교수와 컴퓨터 공학교수 그리고 관련된 산업체 기술자들이 참여하고 있습니다.
                                IT분야 기초지식 함양을 위한 교과목부터 심화학습을 위한 교과목까지 비전공자들에게
                                융합에 필요한 IT전공관련 교육과정을 핵심으로 운영합니다.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 졸업요건 섹션 */}
                <section id="graduation" className="mb-16 scroll-mt-32">
                    <div className="border-l-4 border-[#482070] pl-4 mb-8">
                        <h2 className="text-3xl font-bold text-[#482070]">졸업요건</h2>
                    </div>
                    <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-[#482070]/20">
                        <ul className="space-y-6 text-lg">
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-[#482070] rounded-full mr-4"></span>
                                전공필수 18학점 + 전공선택 18학점 = 36학점
                            </li>
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-[#482070] rounded-full mr-4"></span>
                                교과목 평점 평균 2.0 이상 취득
                            </li>
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-[#482070] rounded-full mr-4"></span>
                                졸업논문: 융합캡스톤디자인의 최종 보고서가 학위 논문을 대체함
                            </li>
                            <li className="text-sm text-gray-600 mt-4 pl-6">
                                *융합캡스톤디자인 필수 선수강 과목: 융합프로그래밍1/2, 컴퓨터시스템,
                                자료구조 및 알고리즘1, 오픈소스소프트웨어 프로젝트
                            </li>
                        </ul>
                    </div>
                </section>

                {/* 학업이수 섹션 */}
                <section id="curriculum" className="mb-16 scroll-mt-32">
                    <div className="border-l-4 border-[#482070] pl-4 mb-8">
                        <h2 className="text-3xl font-bold text-[#482070]">학업이수</h2>
                    </div>
                    <div className="space-y-12">
                        {/* 이수체계도 */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg">
                            <h3 className="text-2xl font-semibold mb-6 text-[#482070] text-center">이수체계도</h3>
                            <img src="/img/sub-guide.jpeg" alt="이수체계도" className="w-full max-w-4xl mx-auto rounded-lg shadow-md" />
                        </div>

                        {/* 과목소개 */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg">
                            <h3 className="text-2xl font-semibold mb-6 text-[#482070] text-center">과목소개</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                                    <thead>
                                        <tr className="bg-[#482070] text-white">
                                            <th className="px-6 py-4 border">1학기</th>
                                            <th className="px-6 py-4 border">2학기</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="px-6 py-4 border">
                                                <b>웹프로그래밍</b><br />
                                                웹페이지를 만들기 위한 언어(HTML)를 학습하고 홈페이지를 만들어봅니다.
                                            </td>
                                            <td className="px-6 py-4 border">
                                                <b>오픈소스 소프트웨어 실습</b><br />
                                                오픈소스 소프트웨어 개발 환경과 도구에 대해 학습합니다. ex) github
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 border">
                                                <b>컴퓨터네트워크 및 보안</b><br />
                                                컴퓨터 네트워크 기초 지식 습득 후 컴퓨터 보안 이론과 사례 연구를 학습합니다.
                                            </td>
                                            <td className="px-6 py-4 border">
                                                <b>웹서버실습</b><br />
                                                모바일 앱, 웹페이지를 서버화하기 위한 서버의 기초 지식과 기법을 배웁니다.
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 border">
                                                <b>인공지능입문</b><br />
                                                가장 핫한 주제인 AI를 배우기 위해 머신러닝을 학습합니다.
                                            </td>
                                            <td className="px-6 py-4 border">
                                                <b>모바일 프로그래밍</b><br />
                                                안드로이드를 기반의 어플리케이션을 제작합니다.
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 border">
                                                <b>사물인터넷기초</b><br />
                                                인터넷에 연결되는 모든 것을 뜻하는 IOT의 전반적인 이해를 목표로 합니다.
                                            </td>
                                            <td className="px-6 py-4 border">
                                                <b>머신러닝 및 딥러닝</b><br />
                                                스스로 학습하는 머신러닝과 그 기본인 딥러닝을 학습합니다.
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 border">
                                                <b>사물인터넷 프로젝트</b><br />
                                                센싱, 동작, 처리, 통신과 관련된 장치를 활용하여 IOT 제품 및 서비스의 개발을 합니다.
                                            </td>
                                            <td className="px-6 py-4 border">
                                                <b>사물인터넷 프로젝트</b><br />
                                                센싱, 동작, 처리, 통신과 관련된 장치를 활용하여 IOT 제품 및 서비스의 개발을 합니다.
                                            </td>
                                        </tr>
                                        <tr className="bg-primary text-white">
                                            <th colSpan="2" className="px-4 py-2 border">양학기 개설 과목</th>
                                        </tr>
                                        <tr>
                                            <td colSpan="2" className="px-4 py-2 border">
                                                <b>인공지능수학</b><br />
                                                머신러닝 및 데이터사이언스를 포함한 컴퓨터과학 분야 전공을 위해 필요한 수학적 기본 개념과 기초 이론을 학습합니다. ex)선형대수학, 미적분학, 확률통계
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="2" className="px-4 py-2 border">
                                                <b>파이썬 프로그래밍</b><br />
                                                프로그래밍 언어중 하나인 python의 기초를 학습합니다.
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="2" className="px-4 py-2 border">
                                                <b>데이터베이스</b><br />
                                                데이터를 체계적이고 효율적으로 관리하기 위해 개발된 데이터베이스에 대한 기본개념을 비롯한 데이터베이스 관리 시스템을 학습합니다.
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="2" className="px-4 py-2 border">
                                                <b>자료구조 및 알고리즘 2</b><br />
                                                자료구조 및 알고리즘 1에서 배운 내용을 통해 문제 해결에 도전합니다.
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="2" className="px-4 py-2 border">
                                                <b>데이터사이언스개론</b><br />
                                                머신러닝, 통계적 추론 및 데이터 시각화에 대해 다루고 탐색적 데이터 분석, 데이터 획득, 전처리에 대해서 학습합니다.
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="2" className="px-4 py-2 border">
                                                <b>머신러닝과 데이터사이언스</b><br />
                                                머신러닝 (그리고 data mining)의 원리에 대해, 특히 다수의 머신러닝 알고리즘과 응용에 대해 학습합니다.
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 진로 및 취업분야 섹션 */}
                <section id="career" className="mb-16 scroll-mt-32">
                    <div className="border-l-4 border-[#482070] pl-4 mb-8">
                        <h2 className="text-3xl font-bold text-[#482070]">진로 및 취업분야</h2>
                    </div>
                    <div className="bg-white rounded-2xl p-8 shadow-lg">
                        <h3 className="text-2xl font-semibold mb-6 text-[#482070] text-center">트랙 소개</h3>
                        <img src="/img/track.png" alt="트랙 소개" className="w-full max-w-4xl mx-auto mb-8 rounded-lg shadow-md" />
                        <div className="text-center text-xl">
                            자세한 내용은 {' '}
                            <Link to="/careerpath" className="text-[#482070] hover:text-[#482070]/80 font-semibold underline">
                                Career Path
                            </Link>
                            {' '}참고
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
};

export default MajorGuide; 