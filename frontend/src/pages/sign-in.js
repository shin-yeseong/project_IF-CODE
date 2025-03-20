import React, { useState } from "react";
import styles from "../styles/signin.module.css"; // ✅ 모듈 CSS 적용
import Header from "../components/header";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Signin() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      console.log("로그인 요청 데이터:", { userId, password });
      const response = await axios.post(
        "http://localhost:8080/api/login",
        { userId, password },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("✅ 로그인 성공! 응답 데이터:", response.data);

      // ✅ 응답 데이터에서 userId 확인
      const userIdFromResponse = response.data.userId;
      if (!userIdFromResponse) {
        console.error("❌ userId가 응답 데이터에 없음:", response.data);
        setError("로그인에 실패했습니다. 관리자에게 문의하세요.");
        return;
      }

      // ✅ localStorage에 저장
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", userIdFromResponse);

      console.log("📢 저장된 userId:", localStorage.getItem("userId"));

      navigate("/");
    } catch (err) {
      console.error("❌ 로그인 실패", err.response?.data);
      setError("이메일 또는 비밀번호가 잘못되었습니다.");
    }
  };


  return (
    <>
      <Header />
      <main className={styles.signinMain}>
        <div className={styles.container}>
          <div className={styles.loginBanner}>
            <Link to="/">
              <img src="img/if-code-white.png" style={{ width: "200px", height: "150px" }} alt="IF=CODE" />
            </Link>
          </div>
          <div className={styles.loginWrapper}>
            <form id="login-form" className={styles.loginForm} onSubmit={handleLogin}>
              {error && <p style={{ color: "red" }}>{error}</p>} {/* 로그인 실패 시 에러 메시지 표시 */}
              <input
                type="text"
                name="userId"
                placeholder="이메일"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
              <input
                type="password"
                name="userPassword"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input type="submit" className={styles.submit} value="로그인" />
            </form>
            <div className={styles.signupLink}>
              <Link to="/signup">회원가입</Link>
            </div>
          </div>
          <div className={styles.loginBelow1}><b>Infinite Fervor Code</b></div>
          <div className={styles.loginBelow2}><b>우리의 열정은 무한한 가능성을 창출합니다.</b></div>
        </div>
      </main>
    </>
  );
}

export default Signin;
