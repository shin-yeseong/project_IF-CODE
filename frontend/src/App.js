import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import Main from "./pages/main";
import SignUp from './pages/sign-up'; 
import SignIn from './pages/sign-in';

function App() {
  return (
    <Router>  
      <Routes>
        <Route path="/" element={<Main />} />  
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn/>} />
      </Routes>
    </Router>
  );
}

export default App;
