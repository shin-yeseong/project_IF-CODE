import logo from './logo.svg';
import './App.css';
import React from "react";
import Header from "./components/header";
import Main from "./components/main";
import Footer from "./components/footer";


function App() {
  return (
    <div>
      <Header />
      <Main />
      <Footer />
    </div>
  ); 
}

export default App;

/* function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App; */ 
