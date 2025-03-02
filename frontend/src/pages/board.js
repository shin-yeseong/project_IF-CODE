import React, { useState, useEffect } from "react";
import Header from "../components/header";
import { useNavigate } from "react-router-dom";


const Board = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const formatDate = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);

    const koreaTime = new Date(date.getTime() + 9 * 60 * 60 * 1000);

    return koreaTime.toISOString().slice(0, 16).replace("T", " ");
  };

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/posts");
        if (!response.ok) throw new Error("게시글 데이터를 불러오는 데 실패했습니다.");
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("게시글 불러오기 오류:", error);
      }
    };

    fetchPosts();
  }, []);

  const totalPages = Math.ceil(posts.length / postsPerPage);
  const reversedPosts = [...posts].reverse(); // 전체 데이터를 역순으로 정렬
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = reversedPosts.slice(indexOfFirstPost, indexOfLastPost); // 여기서 페이지네이션 적용


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

        <div className="mt-16 bg-gray-100 p-6 rounded-lg shadow-md mb-20">
          <div className="flex font-bold text-[#482070] border-b">
            <div className="w-1/12 py-2 px-4 text-center">순번</div>
            <div className="w-6/12 py-2 px-4">제목</div>
            <div className="w-2/12 py-2 px-4 text-center">등록자명</div>
            <div className="w-2/12 py-2 px-4 text-center whitespace-nowrap">등록일</div>
            <div className="w-1/12 py-2 px-4 text-center">조회수</div>
          </div>

          {[...currentPosts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((post, index) => (
            <div key={post.id} className="flex border-t">
              <div className="w-1/12 py-2 px-4 text-center">{indexOfFirstPost + index + 1}</div>
              <div
                className="w-6/12 py-2 px-4 cursor-pointer text-blue-600 hover:underline"
                onClick={() => navigate(`/post/${post.id}`)}
              >
                {post.title}
              </div>
              <div className="w-2/12 py-2 px-4 text-center">{post.userName}</div>
              <div className="w-2/12 py-2 px-4 text-center whitespace-nowrap">{formatDate(post.createdAt)}</div>
              <div className="w-1/12 py-2 px-4 text-center">{post.views}</div>
            </div>
          ))}


        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="w-1/3"></div>

          <div className="w-1/3 flex justify-center">
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
                className={`px-4 py-2 mx-2 ${currentPage === index + 1 ? "bg-[#482070] text-white" : "bg-gray-200 text-[#482070]"
                  }`}
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

          <div className="w-1/3 flex justify-end">
            <button
              onClick={() => navigate("/post")}
              className="bg-[#482070] text-white px-4 py-2 rounded hover:bg-purple-900"
            >
              글쓰기
            </button>
          </div>
        </div>

      </div >
    </>
  );
};

export default Board;
