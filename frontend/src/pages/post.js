import React, { useState } from "react";
import axios from "axios";

function PostCreatePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  // 게시글 제출 함수
  const handleSubmit = (e) => {
    e.preventDefault();

    // 빈 필드 체크
    if (!title || !content) {
      setMessage("모든 필드를 입력하세요.");
      return;
    }

    // 토큰 가져오기
    const token = localStorage.getItem("token");

    // 토큰이 없으면 로그인 페이지로 리디렉션
    if (!token) {
      setMessage("로그인 후 다시 시도해주세요.");
      return;
    }

    // POST 요청으로 게시글 작성
    axios
      .post(
        "http://localhost:8080/api/posts", // API 엔드포인트
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        setMessage("게시글이 성공적으로 작성되었습니다!");
        setTitle("");
        setContent("");
      })
      .catch((error) => {
        console.error("❌ 오류:", error);
        if (error.response) {
          if (error.response.status === 403) {
            setMessage("접근 권한이 없습니다. 다시 로그인하세요.");
          } else {
            setMessage(`게시글 작성 실패: ${error.response.data.message || "알 수 없는 오류"}`);
          }
        } else {
          setMessage("서버에 연결할 수 없습니다.");
        }
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          게시글 작성
        </h2>
        <form onSubmit={handleSubmit}>
          {/* 제목 입력 */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">
              제목
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="게시글 제목을 입력하세요"
            />
          </div>

          {/* 내용 입력 */}
          <div className="mb-4">
            <label htmlFor="content" className="block text-gray-700 font-semibold mb-2">
              내용
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="6"
              placeholder="게시글 내용을 입력하세요"
            />
          </div>

          {/* 제출 버튼 */}
          <div className="mb-4 text-center">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              게시글 작성
            </button>
          </div>

          {/* 결과 메시지 */}
          {message && (
            <div
              className={`text-center p-3 mt-4 ${
                message.includes("성공") ? "text-green-500" : "text-red-500"
              }`}
            >
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default PostCreatePage;
