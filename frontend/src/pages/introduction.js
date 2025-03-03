import Header from "../components/header";
import Footer from "../components/footer";

function Introduction() {
    return (
        <>
            <Header />
            <div className="bg-white min-h-screen p-32 pt-32">
                {/* Title */}
                <h1 className="text-3xl font-bold text-[#482070]">Introduction |</h1>


                {/* Content Sections */}
                <div className="mt-12 border-t-2 border-[#ab90bf]">
                    <div id="c1" className="font-bold text-xl text-[#482070] mb-10 mt-10">| 소개 |</div>
                    <div className="text-center text-2xl italic font-bold text-[#482070] mb-6">"우리의 열정은 무한한 가능성을 창출합니다."</div>
                    <img src="img/if-code-logo.png" alt="IF-CODE" className="mx-auto mb-4" />
                    <div className="bg-[#f0f0f0] text-base p-4 border rounded-md">
                        ‘IF-CODE’는 ‘Infinite Fervor Code’로, 끊임없이 코딩에 대한 열정을 추구하는 사람들이 모인 ‘이프코드’만의 자유로운 커뮤니티 특징을 표현한 이름입니다. 또한 ‘만약’이라는 의미를 가진 ‘IF’와 프로그래밍에서 활용하는 ‘CODE’가 합해져, 우리가 막연하게 생각하는 ‘만약에’의 상상의 나래를 구현하는 프로그래밍의 매력을 이름을 통해 나타내고 있습니다.
                    </div>
                </div>
                
                <div className="mt-20 border-t-2 border-[#ab90bf]">
                    <div id="c2" className="font-bold text-xl text-[#482070] mb-10 mt-10">| 인사말 |</div>
                    <div className="flex justify-center space-x-8">
                        <div className="bg-white p-6 border border-[#ab90bf] rounded-md w-1/2">
                            <strong className="text-xl">🗝️코딩은 미래를 여는 열쇠입니다.</strong>
                            <p className="mt-4">자동차, 가전제품, 인공지능, 빅데이터 분석 등 우리가 상상할 수 있는 모든 미래 기술들은 코딩을 바탕으로 합니다. 이러한 기술은 우리의 생활 방식을 혁신적으로 변화시키고 있으며, 앞으로 그 중요성은 더욱 커질 것입니다.</p>
                        </div>
                        <div className="bg-white p-6 border border-[#ab90bf] rounded-md w-1/2">
                            <strong className="text-xl">💡함께하는 열정으로 가능성을 창출합니다.</strong>
                            <p className="mt-4">동국대학교 융합소프트웨어 전공생을 위한 자유로운 소통 커뮤니티인 'IF-CODE'는 알고리즘 스터디와 더불어 준비생을 위한 전공가이드, 전공생을 위한 프로그래밍 공모전, 커리어 개발 등 소통을 지향합니다.</p>
                        </div>
                    </div>
                </div>

                <div className="mt-20 border-t-2 border-[#ab90bf]">
                    <div id="c3" className="font-bold text-xl text-[#482070] mb-10 mt-10">| IF-CODE |</div>
                    <div className="flex justify-center space-x-8">
                    <div className="bg-[#e7dced] p-6 border border-[#e7dced] rounded-md w-1/2">
                            <strong><a href="majorguide.html" className="text-[#482070] hover:text-[#ab90bf]">🚩Major Guide</a></strong>
                            <p className="mt-4">동국대학교 연계전공 '융합 소프트웨어'에 대해 소개하고, 졸업요건 및 전공과목을 안내하여 이 전공을 고민하는 학우들에게 관련 정보를 제공합니다.</p>
                        </div>
                        <div className="bg-white p-6 border border-[#e7dced] rounded-md w-1/2">
                            <strong><a href="board.html" className="text-[#482070] hover:text-[#ab90bf]">💡Algorithm Study</a></strong>
                            <p className="mt-4">백준 사이트를 활용하여 알고리즘 문제를 해결하고 여러 방식의 풀이를 공유하여 코딩 기술을 익히고 기업 코딩테스트 준비를 위해 스터디를 진행합니다.</p>
                        </div>
                        <div className="bg-[#e7dced] p-6 border border-[#e7dced] rounded-md w-1/2">
                            <strong><a href="competition.html" className="text-[#482070] hover:text-[#ab90bf]">💻Competition</a></strong>
                            <p className="mt-4">프로그래밍과 관련한 공모전 및 동아리 활동을 소개하고, 실제 공모전에 참여하여 프로그래밍 역량을 높이고 경험을 쌓습니다.</p>
                        </div>
                        <div className="bg-white p-6 border border-[#e7dced] rounded-md w-1/2">
                            <strong><a href="careerpath.html" className="text-[#482070] hover:text-[#ab90bf]">👩🏻‍💻Career Path</a></strong>
                            <p className="mt-4">융합소프트웨어 전공을 활용하여 나갈 수 있는 진로 직업에 대한 정보를 제공하고, 실제 졸업생의 취업현황을 안내합니다.</p>
                        </div>
                    </div>
                </div>

                <div className="mt-20 border-t-2 border-[#ab90bf]">
                    <div id="c4" className="font-bold text-xl text-[#482070] mb-10 mt-10">| 개발 |</div>
                    <div className="bg-[#e7dced] p-6 border border-[#e7dced] rounded-md">
                        <p>'IF-CODE'는 동국대학교 융합소프트웨어를 연계전공하고 있는 교육학과 학우들이 함께 만든 웹사이트 입니다. 프론트엔드부터 백엔드, 내용 구성까지 프로그래밍 스터디 활동을 통해 하나하나 쌓아올린 결과물입니다.</p>
                    </div>
                    <div className="flex justify-center space-x-8 mt-8">
                        <div className="bg-white p-6 border border-[#e6e2b6] rounded-md">
                            <strong className="text-lg">19학번 신예성</strong>
                            <div className="text-sm text-gray-500">교육학 / 융합소프트웨어 개발자</div>
                            <div className="mt-2">✉️<u> 1020blue@dongguk.edu</u></div>
                        </div>
                        <div className="bg-white p-6 border border-[#c8debc] rounded-md">
                            <strong className="text-lg">23학번 유시은</strong>
                            <div className="text-sm text-gray-500">교육학 / 융합소프트웨어 개발자</div>
                            <div className="mt-2">✉️<u> se2646594@naver.com</u></div>
                        </div>
                        <div className="bg-white p-6 border border-[#dabdbd] rounded-md">
                            <strong className="text-lg">23학번 이예진</strong>
                            <div className="text-sm text-gray-500">교육학 / 융합소프트웨어 개발자</div>
                            <div className="mt-2">✉️<u> dp040223@dgu.ac.kr</u></div>
                        </div>
                    </div>
                    <div className="flex justify-center space-x-8 mt-8">
                        <div className="bg-white p-6 border border-[#ab90bf] rounded-md">
                            <strong className="text-lg">🧐절찬 모집중🧐</strong>
                            <div className="text-sm text-gray-500">교육학 / 융합소프트웨어 개발자</div>
                            <div className="mt-2">#융합소프트웨어 #전공하고_싶은_사람 #모두모여 #함께_공부하고 #함께_성장하는</div>
                            <div className="mt-4">'IF-CODE'와 함께할 여러분을 기다립니다.</div>
                        </div>
                    </div>
                </div>
            </div>  
            <Footer />
        </>
    );
}

export default Introduction;
