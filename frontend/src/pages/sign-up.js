import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../styles/signup.module.css"; 
import Header from "../components/header";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Signup() {
  const navigate = useNavigate();  
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [agree, setAgree] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};

    if (!/^\d{10}$/.test(userId)){
      newErrors.userId = "아이디는 학번 10자리여야 합니다."
    }

    if (!/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+]).{8,}$/.test(password)) {
      newErrors.password = "비밀번호는 8자 이상, 영문+숫자+특수문자를 포함해야 합니다.";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      newErrors.email = "올바른 이메일 형식을 입력해주세요.";
    }

    if (!agree) {
      newErrors.agree = "개인정보 동의를 확인해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; 
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await axios.post("http://localhost:8080/api/register", {
        userId,
        password,
        username,
        email,
        phone,
        privacyConsent: agree,
      });

      console.log("✅ 회원가입 성공:", response.data);
      toast.success("🎉 회원가입이 완료되었습니다!", {
        position: "top-center",
        autoClose: 1500,  
      }); 

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (err) {
      console.error("❌ 회원가입 실패:", err.response?.data);
      setErrors({ api: err.response?.data || "회원가입에 실패했습니다." });

      toast.error(`❌ 회원가입 실패: ${err.response?.data || "서버 오류"}`, {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };
  

  return (
    <>
      <Header />
      <main className={styles.signupMain}>
      <div className={styles.loginUp1}><b>Infinite Fervor Code</b></div>
      <div className={styles.loginUp2}>우리의 열정은 무한한 가능성을 창출합니다</div>
      <div className={styles.container}>
        <div className={styles.signupWrapper}>
          <h2>회원가입</h2>
          <ToastContainer />
          <form onSubmit={handleSubmit} className={styles.signupForm}>
            <div>
              <input
                type="text"
                name="userId"
                id="userId"
                placeholder="아이디(학번 10자리)"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
               {errors.userId && <p className={styles.error}>{errors.userId}</p>}
            </div>

            <div>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
               {errors.password && <p className={styles.error}>{errors.password}</p>}
            </div>

            <div>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                placeholder="비밀번호 확인"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {errors.confirmPassword && <p className={styles.error}>{errors.confirmPassword}</p>}
            </div>

            <div>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="이름(닉네임)"
                value={username}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="이메일(본인 확인용)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <input
                type="text"
                name="phone"
                id="phone"
                placeholder="전화번호(본인 확인용)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className={styles.termsContainer}>
                <input
                  type="checkbox"
                  name="agree"
                  checked={agree}
                  onChange={() => setAgree(!agree)}
                />
                <label htmlFor="agree" className={styles.checkboxLabel}>
                개인정보 동의
                </label>
                <div
                  className={styles.termsBox}
                  onClick={() => setShowTerms(!showTerms)}
                >
                  <span className={styles.arrow}>▼</span>
                </div>
              </div>
              {errors.agree && <p className={styles.error}>{errors.agree}</p>}

              {showTerms && (
  <div className={styles.termsPopup}>
    <h3>개인정보 처리방침</h3>

    <div className={styles.termsSection}>
      <h4>1. 개인정보의 수집 항목</h4>
      <p>
        당사는 서비스 제공을 위해 아래와 같은 개인정보를 수집합니다:
        <ul>
          <li>필수 항목: 이름, 이메일 주소, 연락처, 생년월일</li>
          <li>선택 항목: 성별, 주소</li>
        </ul>
      </p>
    </div>

    <div className={styles.termsSection}>
      <h4>2. 개인정보의 수집 목적</h4>
      <p>
        수집된 개인정보는 다음과 같은 목적으로 사용됩니다:
        <ul>
          <li>서비스 제공 및 개선</li>
          <li>이용자의 문의 사항 처리</li>
          <li>이벤트 및 프로모션 안내</li>
          <li>서비스 이용 관련 통계 분석</li>
        </ul>
      </p>
    </div>

    <div className={styles.termsSection}>
      <h4>3. 개인정보의 보유 및 이용 기간</h4>
      <p>
        당사는 개인정보의 수집 목적이 달성되면 해당 개인정보를 즉시 파기합니다.
        단, 법령에 의해 일정 기간 보관해야 할 경우 해당 기간 동안 보관됩니다.
      </p>
    </div>

    <div className={styles.termsSection}>
      <h4>4. 개인정보의 제공 및 공유</h4>
      <p>
        당사는 이용자의 개인정보를 외부에 제공하지 않으며, 제3자와 공유하지 않습니다.
        다만, 법령에 의한 요청이 있을 경우 제공될 수 있습니다.
      </p>
    </div>

    <div className={styles.termsSection}>
      <h4>5. 개인정보의 안전성 확보 조치</h4>
      <p>
        당사는 이용자의 개인정보를 보호하기 위해 기술적, 관리적 보호 조치를 취하고 있습니다:
        <ul>
          <li>개인정보 암호화</li>
          <li>해킹 등의 위협으로부터 보호하기 위한 방화벽 설정</li>
          <li>정기적인 보안 점검 및 업데이트</li>
        </ul>
      </p>
    </div>

    <div className={styles.termsSection}>
      <h4>6. 개인정보의 열람, 정정, 삭제</h4>
      <p>
        이용자는 언제든지 자신의 개인정보를 열람, 정정, 삭제 요청할 수 있습니다.
        요청은 고객센터 또는 이메일을 통해 접수할 수 있습니다.
      </p>
    </div>

    <div className={styles.termsSection}>
      <h4>7. 동의 거부 권리</h4>
      <p>
        이용자는 개인정보 수집에 동의하지 않을 권리가 있습니다. 그러나 동의하지 않으실 경우 서비스 제공에 제한이 있을 수 있습니다.
      </p>
    </div>

    <div className={styles.termsSection}>
      <h4>8. 약관의 변경</h4>
      <p>
        본 개인정보 처리방침은 법령의 변경이나 서비스의 변화에 따라 변경될 수 있습니다. 변경된 약관은 웹사이트에 게시되며, 중요한 변경 사항에 대해서는 별도로 공지할 예정입니다.
      </p>
    </div>
  </div>
)}


            <div>
              <button type="submit">회원가입</button>
            </div>
          </form>
        </div>
      </div>
      </main>
    </>

  );
}

export default Signup;
