import React from "react";
import styles from "../styles/signin.module.css"; // ✅ 모듈 CSS 적용
import Header from "../components/header";
import { Link } from "react-router-dom";

function Signin(){
return(
    <>
   <Header/>
   <main className={styles.signinMain}> 
   <div className={styles.container}>  
      <div className={styles.loginBanner}>
        <Link to="/">
          <img src="img/if-code-white.png" style={{width: "200px", height: "150px"}} alt="IF=CODE" />
        </Link>
      </div>
      <div className={styles.loginWrapper}>  

      <form method="post" action="서버의url" id="login-form" className={styles.loginForm}>
        <input type="text" name="userName" placeholder="아이디" />
        <input type="password" name="userPassword" placeholder="비밀번호" />
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
