import React from "react";
import styles from "../styles/main.module.css"; // ✅ 올바른 import 방식
import Header from "../components/header";
import Footer from "../components/footer";

function Main() {
  return (
    <>
      <Header />
      <main className={styles.homeMain}>
        <div className={styles.mainImg}>
          <img src="img/main-img.png" alt="img"></img>
        </div>
        <div className={styles.boxTitle}>New.</div>

        <div className={styles.box}>
          {[
            { text: "#STUDY", link: "게시글링크" },
            { text: "#COMPETITION", link: "게시글링크" },
            { text: "#JOB POSTING", link: "#게시글링크" }
          ].map((item, index) => (
            <a key={index} href={item.link} className={styles.block}>
              <div className={styles.bt}>{item.text}</div>
              <div className={styles.bb}></div>
            </a>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Main;
