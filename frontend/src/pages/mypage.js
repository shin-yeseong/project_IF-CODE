import React, { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
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
    <div>
      <h2>프로필 페이지</h2>
      {userData ? (
        <div>
          <p><strong>학번:</strong> {userData.userId}</p>
          <p><strong>이름:</strong> {userData.username}</p>
          <p><strong>이메일:</strong> {userData.email}</p>
          <p><strong>전화번호:</strong> {userData.phone}</p>
        </div>
      ) : (
        <p>로그인 필요</p>
      )}
    </div>
  );
}

export default Profile;
