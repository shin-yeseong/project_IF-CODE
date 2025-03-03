import Header from "../components/header";
import Footer from "../components/footer";

function CareerPath() {
    return (
        <>
            <Header />
            <div className="bg-white min-h-screen p-32 pt-32">
                {/* Title */}
                <h1 className="text-3xl font-bold text-[#482070]">Career Path |</h1>


                {/* Content Sections */}
                <div className="mt-12 border-t-2 border-[#ab90bf]">
                    <img src="img/career.png" alt="IF-CODE" className="mx-auto mb-4" />
                </div>

                <div className="mt-20 border-t-2 border-[#ab90bf]">
                    <div id="Career1" className="font-bold text-xl text-[#482070] mb-10 mt-10">| 트랙별 진로 |</div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
                        <div className="bg-white p-6 border-2 border-[#482070] rounded-lg">
                        <strong className="text-xl font-bold italic">데이터 사이언스</strong>
                        <p className="mt-4">
                            정보분석 능력을 요구하는 금융기관, 여론조사기관, 기업체의 연구조사분야, 정보통신분야 등 다양한 분야로 진출할 수 있는 것이 큰 특징이다.
                            앞으로 빅데이터 분석의 요구가 증가하고 정보화 사회의 요청에 따라 전문적인 연구조사기관이 많이 생겨 연구조사분야에 대한 활발한 진출이 기대된다.
                        </p>
                        <p className="mt-4 text-[#482070] font-semibold">산업계: 빅데이터 분석가, 금융데이터 분석가</p>
                        <p className="text-[#482070] font-semibold">공공기관: 통계청 및 중앙정부 부처, 지방자치단체의 통계직</p>
                        </div>

                        <div className="bg-white p-6 border-2 border-[#482070] rounded-lg">
                        <strong className="text-xl font-bold italic">IOT</strong>
                        <p className="mt-4">
                         사물인터넷(IoT) 전문가는 다양한 디바이스와 네트워크를 연결하여 데이터를 수집, 분석하고 이를 바탕으로 효율적인 시스템을 구축하는 역할을 담당한다.
                            IoT 전문가는 스마트 홈, 스마트 시티, 헬스케어, 제조업, 농업 등에서 IoT 기술을 적용해 새로운 가치를 창출한다.
                        </p>
                        <p className="mt-4 text-[#482070] font-semibold">IOT 엔지니어, 데이터 분석가, 보안 전문가, 제품 관리자, 연구원, 스마트홈 설계자</p>
                        </div>

                        <div className="bg-white p-6 border-2 border-[#482070] rounded-lg">
                        <strong className="text-xl font-bold italic">AI</strong>
                        <p className="mt-4">
                            인공지능(AI) 분야는 빠르게 성장하고 있으며, 다양한 산업에서 AI 기술이 적용되고 있다.
                            AI 관련 직업은 데이터 과학, 머신러닝, 자연어 처리(NLP) 등 여러 분야로 세분화되며, 기술 혁신과 함께 새로운 직업 기회도 계속 생겨나고 있다.
                        </p>
                        <p className="mt-4 text-[#482070] font-semibold">AI 연구원, 머신러닝 엔지니어, 데이터 과학자, AI 제품 관리자, 컴퓨터 비전 엔지니어</p>
                        </div>

                        <div className="bg-white p-6 border-2 border-[#482070] rounded-lg">
                        <strong className="text-xl font-bold italic">웹/앱 개발자</strong>
                        <p className="mt-4">
                            웹사이트와 모바일 애플리케이션을 설계하고 개발하며, 사용자 경험을 최적화하는 작업을 수행한다.
                            웹 개발자와 앱 개발자는 각기 다른 플랫폼과 기술 스택을 사용하지만, 그 목적은 사용자가 쉽게 접근하고 사용할 수 있는 소프트웨어를 만드는 것이다.
                        </p>
                        <p className="mt-4 text-[#482070] font-semibold">프론트엔드, 백엔드, 풀스택 개발자</p>
                        </div>
                    </div>
                    </div>

                <div className="mt-20 border-t-2 border-[#ab90bf]">
                        <div id="c3" className="font-bold text-xl text-[#482070] mb-10 mt-10">| 졸업자 취업 현황 |</div>
                        <div className="flex justify-center space-x-8">
                        <img src="img/career-path.png" alt="IF-CODE" className="w-1/2 h-120 object-contain mb-4" />
                        <img src="img/career-path-dgu.png" alt="IF-CODE" className="w-1/2 h-100 object-contain mb-4" />
                    </div>
                </div>



                <div className="mt-20 border-t-2 border-[#ab90bf]">
                    <div id="c4" className="font-bold text-xl text-[#482070] mb-10 mt-10">| 교육학과 취업자는? |</div>
                    <div className="bg-[#e7dced] p-6 border border-[#e7dced] rounded-md">
                        <p>교육학과 취업자 내용 입력 ...</p>
                    </div>
                </div>
            </div>  
            <Footer />
        </>
    );
}

export default CareerPath;
