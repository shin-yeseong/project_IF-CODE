import React from "react";
import "../styles/main.css";
import Header from "../components/header";
import Footer from "../components/footer";

function Main() {
  return (
    <>
<Header />
    <main>
      <div className="mainimg">
        <img src="img/main-img.png" alt="img"></img>
      </div>
      <div className="box-title">New.</div>

      <div id="box">
        {[
          { text: "#STUDY", link: "게시글링크" },
          { text: "#COMPETITION", link: "게시글링크" },
          { text: "#JOB POSTING", link: "#게시글링크" }
        ].map((item, index) => (
          <a key={index} href={item.link} className="block">
            <div className="bt">{item.text}</div>
            <div className="bb"></div>
          </a>
        ))}
      </div>
    </main>
    
 <Footer />
          </>

  );
}

export default Main;
