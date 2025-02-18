import React, { useState } from "react";
import "../styles/sign-up.css";

function Signup() {
  // 상태 관리
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [agree, setAgree] = useState(false);

  // 폼 제출 처리
  const handleSubmit = (e) => {
    e.preventDefault();

    // 유효성 검사 (예시)
    if (password !== confirmPassword) {
      alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }
    if (!agree) {
      alert("개인정보 동의를 확인해주세요.");
      return;
    }

    // 유효성 검사 통과 후 서버로 데이터 전송
    console.log("회원가입 정보:", { userId, password, name, email, phone });
  };

  return (
    <form onSubmit={handleSubmit} id="signup-form">
      <div>
        <label htmlFor="userId">아이디(학번):</label>
        <input
          type="text"
          name="userId"
          id="userId"
          placeholder="학번을 입력하세요"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="password">비밀번호:</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="비밀번호를 입력하세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="confirmPassword">비밀번호 확인:</label>
        <input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          placeholder="비밀번호를 확인하세요"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="name">이름(닉네임):</label>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="이름을 입력하세요"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="email">이메일:</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="이메일을 입력하세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="phone">전화번호:</label>
        <input
          type="text"
          name="phone"
          id="phone"
          placeholder="전화번호를 입력하세요"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            name="agree"
            checked={agree}
            onChange={() => setAgree(!agree)}
          />
          개인정보 동의
        </label>
      </div>

      <div>
        <button type="submit">회원가입</button>
      </div>
    </form>
  );
}

export default Signup;
