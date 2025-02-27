import React, { useState, useEffect } from "react";
import Header from "../components/header";


function Board() {
  const [posts, setPosts] = useState([]); // 게시물 상태 관리
  const [currentPage, setCurrentPage] = useState(1);

  const postsPerPage = 10;

  useEffect(() => {
    fetch("http://localhost:8080/api/posts")  // 백엔드 API 호출 (백엔드 주소 확인 필수!)
      .then((response) => response.json()) // 응답을 JSON으로 변환
      .then((data) => {
        setPosts(data); // 게시글 상태 업데이트
      })
      .catch((error) => {
        console.error("게시글 불러오기 오류:", error);
      });
  }, []); // 컴포넌트가 처음 렌더링될 때만 실행

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(posts.length / postsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <Header />
      <div className="bg-white min-h-screen p-32 pt-32">
        <h1 className="text-3xl font-bold text-[#482070]">Algorithm Study |</h1> 
        <p className="text-lg text-[#482070] mt-10">
          본 게시판은 융합소프트웨어 연계전공생들을 위한 자유게시판입니다. <br /> 
          프로그래밍 및 알고리즘 관련 소통을 위해 자유롭게 글을 게시하고 댓글을 달며 소통할 수 있습니다.
        </p>

        {/* 게시판 테이블 */}
        <div className="mt-16 bg-gray-100 p-6 rounded-lg shadow-md mb-20">
          <div className="flex font-bold text-[#482070] border-b">
            <div className="flex-3 py-2 px-4 whitespace-nowrap">순번</div>
            <div className="flex-1 py-2 px-4">제목</div>
            <div className="flex-2 py-2 px-4">등록자명</div>
            <div className="flex-2 py-2 px-4">등록일</div>
            <div className="flex-3 py-2 px-4">조회수</div>
          </div>

          {/* 게시물 목록 */}
          {currentPosts.map((post, index) => (
            <div key={post.id} className="flex border-t">
              <div className="flex-3 py-2 px-4 whitespace-nowrap">{indexOfFirstPost + index + 1}</div>
              <div className="flex-1 py-2 px-4">{post.title}</div>
              <div className="flex-2 py-2 px-4 text-center">{post.username}</div>
              <div className="flex-2 py-2 px-4 text-center">{post.createdAt}</div>
              <div className="flex-3 py-2 px-4 text-center">{post.views}</div>
            </div>
          ))}
        </div>

        {/* 페이지 네비게이션 */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 mx-2 text-white bg-[#482070] rounded disabled:bg-gray-400"
          >
            이전
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 mx-2 ${currentPage === index + 1 ? "bg-[#482070] text-white" : "bg-gray-200 text-[#482070]"}`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 mx-2 text-white bg-[#482070] rounded disabled:bg-gray-400"
          >
            다음
          </button>
        </div>
      </div>
    </>
  );
}

export default Board;
