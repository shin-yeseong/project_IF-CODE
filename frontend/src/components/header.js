import React from "react";
import "../styles/header.css"; 

function Header() {
  return (
    <header id="header">
      <div className="left">
        <input type="checkbox" id="menuicon" />
        <label htmlFor="menuicon">
          <span></span>
          <span></span>
          <span></span>
        </label>
        <div className="sidebar">
          <div className="sidebar-content">
            <h2>MENU</h2>
            <ul>
              <li><a href="introduction.html">Introduction</a></li>
              <li><a href="majorguide.html">Major Guide</a></li>
              <li><a href="board.html">Algorithm Study</a></li>
              <li><a href="competition.html">Competitions</a></li>
              <li><a href="careerpath.html">Career Path</a></li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="center">
        <a href="home.html">
          <img src="img/if-code-name.png" style={{ width: "150px", height: "45px" }} alt="IF-CODE Logo" />
        </a>
      </div>

      <div className="right">
        <div className="sign-box">
          <a href="#로그인화면링크" className="s-i">SIGN-IN</a>
          <span className="divider">|</span>
          <a href="#회원가입화면링크" className="s-u">SIGN-UP</a>
        </div>
      </div>
    </header>
  );
}


export default Header;
