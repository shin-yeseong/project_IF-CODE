import Header from "../components/header";
import Footer from "../components/footer";
import React, { useState, useEffect } from "react";


const MyPage = () => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token"); // 저장된 JWT 토큰 가져오기
      if (!token) {
        console.error("로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:8080/api/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("사용자 정보를 가져오는 데 실패했습니다.");
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("프로필 정보 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) return <p className="text-white p-32">로딩 중...</p>;
  if (!user) return <p className="text-white p-32">사용자 정보를 불러올 수 없습니다.</p>;

  return (
    <>
      <Header />
      

      <div className=" min-h-screen p-32 pt-32 bg-[#482070]">
      <div className="w-full max-w-4xl text-left  mb-10">
      <h1 className="text-3xl font-bold text-[#ffffff]">My Page |</h1> 
        <p className="text-lg text-[#ffffff] mt-2">
          프로필 확인 및 수정이 가능한 페이지입니다. <br /> 
        </p>
        </div>
        <div className="w-full max-w-6xl max-h-96 flex bg-white text-black rounded-lg shadow-lg overflow-hidden">
          <div className="w-1/3 bg-gray-100 p-6 flex flex-col items-center">
            <img
              src="https://via.placeholder.com/100"
              alt="profile"
              className="w-24 h-24 rounded-full border-2 border-gray-400"
            />
            <h2 className="mt-4 text-lg font-bold">{user.username}</h2>
            <p className="text-gray-600">{user.userId}</p>
            <nav className="mt-6 w-full text-center">
              <ul className="space-y-4">
                <li className="text-purple-800 font-semibold cursor-pointer">개인정보</li>
                <li className="text-gray-600 cursor-pointer hover:text-purple-800">내 게시글</li>
                <li className="text-gray-600 cursor-pointer hover:text-purple-800">내 메모</li>
                <li className="text-red-600 cursor-pointer hover:text-red-800">회원탈퇴</li>
              </ul>
            </nav>
          </div>

          {/* 오른쪽 콘텐츠 영역 */}
          <div className="w-2/3 p-6">
            <h2 className="text-lg font-bold text-purple-800">🔒 개인정보 |</h2>
            <div className="flex items-center mt-4">
              <img
                src="https://via.placeholder.com/80"
                alt="profile"
                className="w-20 h-20 rounded-full border-2 border-gray-400"
              />
              <div className="ml-4">
                <p className="text-gray-800 font-semibold">PROFILE 프로필</p>
                <p className="text-gray-600"><strong>이름(닉네임)</strong> | {user.username}</p>
                <p className="text-gray-600"><strong>메일</strong> | {user.email}</p>
                <p className="text-gray-600"><strong>전화번호</strong> | {user.phone}</p>
                <p className="text-gray-600"><strong>학번</strong> | {user.userId}</p>

              </div>
            </div>

            <h2 className="mt-6 text-lg font-bold text-purple-800">📂 내 게시글 |</h2>
            <h2 className="mt-4 text-lg font-bold text-purple-800">📝 내 메모 |</h2>
          </div>
        </div>

       
      </div>

      <Footer />
    </>
  );
};

export default MyPage;
