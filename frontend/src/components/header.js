
import React, { useEffect, useState } from "react";
import "../styles/header.css"; 
import { Link, useNavigate } from "react-router-dom";

function Header() {

  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); 
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    setIsLoggedIn(false); 
    navigate("/"); 
  };

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
        <Link to="/">
          <img src="img/if-code-name.png" style={{ width: "150px", height: "45px" }} alt="IF-CODE Logo" />
          </Link>
      </div>

      <div className="right">
        <div className="sign-box">
        {isLoggedIn ? (
          <>
            <Link to="/mypage" className="s-u">MyPage</Link>
            <span className="s-u" onClick={handleLogout} style={{ cursor: "pointer" }}>
            로그아웃
          </span>
          </>
          ) : (
            <>
              <Link to="/signin" className="s-i">SIGN-IN</Link>
              <span className="divider">|</span>
              <Link to="/signup" className="s-u">SIGN-UP</Link>
            </>
          )}    
          </div>
      </div>
    </header>
  );
}


export default Header;
