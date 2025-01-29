import React from "react";
import "../styles/footer.css"; 

function Footer() {
  return (
    <footer id="bottom-info">
      <div className="left">
        <div className="box">
          <div className="s-b">
            <a href="https://education.dongguk.edu/main" className="re">
              공식홈페이지
            </a>
            <a
              href="https://www.instagram.com/dongguk._.education?igsh=MXBwbHUxY3hsMjFkbw=="
              className="re"
            >
              공식SNS
            </a>
          </div>
          <div className="site">관련사이트</div>
        </div>

        <div className="developer">
          <h3>DEVELOPER</h3>
          <p>19 신예성</p>
          <p>23 유시은</p>
          <p>23 이예진</p>
        </div>
      </div>

      <div className="right">
        <img src="img/if-code-logo.png" alt="Logo" />
      </div>
    </footer>
  );
}

export default Footer;
