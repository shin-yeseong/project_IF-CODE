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
import Introduction from "./pages/introduction";
import CareerPath from "./pages/careerpath";
import Competition from "./pages/competition";
import JobPosting from "./pages/jobposting";
import CompetitionForm from './pages/CompetitionForm';
import JobPostingForm from './pages/JobPostingForm';
import JobPostingDetail from './pages/JobPostingDetail';
import CompetitionDetail from './pages/CompetitionDetail';
import MajorGuide from "./pages/MajorGuide";

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
        <Route path="/introduction" element={<Introduction />} />
        <Route path="/careerpath" element={<CareerPath />} />
        <Route path="/competition" element={<Competition />} />
        <Route path="/competition/new" element={<CompetitionForm />} />
        <Route path="/competition/:id" element={<CompetitionDetail />} />
        <Route path="/jobposting" element={<JobPosting />} />
        <Route path="/jobposting/new" element={<JobPostingForm />} />
        <Route path="/jobposting/:id" element={<JobPostingDetail />} />
        <Route path="/major-guide" element={<MajorGuide />} />
      </Routes>
    </Router>
  );
}

export default App;
