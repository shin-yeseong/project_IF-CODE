import React, { useEffect, useState } from "react";
import axios from "axios";

function MyPage() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:8080/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error("❌ 프로필 불러오기 실패:", error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-center text-blue-600">마이페이지</h2>
        {userData ? (
          <div className="mt-6 text-center">
            <div className="mb-4">
              <img
                src="https://via.placeholder.com/100"
                alt="프로필 사진"
                className="w-24 h-24 rounded-full mx-auto border"
              />
            </div>
            <p className="text-lg font-semibold">{userData.username}</p>
            <p className="text-gray-600">📧 {userData.email}</p>
            <p className="text-gray-600">📞 {userData.phone}</p>
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              프로필 수정
            </button>
          </div>
        ) : (
          <p className="text-center text-gray-500">로그인이 필요합니다.</p>
        )}
      </div>
    </div>
  );
}

export default MyPage;
