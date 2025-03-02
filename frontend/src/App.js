import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./pages/main";
import SignUp from "./pages/sign-up";
import SignIn from "./pages/sign-in";
import MyPage from "./pages/mypage";
import Post from "./pages/post";
import Board from "./pages/board";
import PostedPage from "./pages/postedpage";
import EditPost from "./pages/editpost";
import "./index.css";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/post" element={<Post />} />
        <Route path="/board" element={<Board />} />
        <Route path="/post/:id" element={<PostedPage />} />
        <Route path="/editpost/:id" element={<EditPost />} />
      </Routes>
    </Router>
  );
}

export default App;
