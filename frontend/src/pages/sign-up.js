import React, { useState } from "react";
import styles from "../styles/signup.module.css";
import Header from "../components/header";

function Signup() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [agree, setAgree] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }
    if (!agree) {
      alert("개인정보 동의를 확인해주세요.");
      return;
    }
    console.log("회원가입 정보:", { userId, password, name, email, phone });
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
            <form onSubmit={handleSubmit} className={styles.signupForm}>
             
            </form>
          </div>
        </div>
      </main>
    </>
  );
}

export default Signup;
