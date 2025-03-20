import React, { useState, useEffect, useCallback, useMemo } from "react";
import Header from "../components/header";
import PostList from "../components/PostList";
import Pagination from "../components/Pagination";
import { useNavigate } from "react-router-dom";

const Board = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const postsPerPage = 10;

  const navigate = useNavigate();

  const formatDate = useCallback((isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    const koreaTime = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    return koreaTime.toISOString().slice(0, 16).replace("T", " ");
  }, []);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`http://localhost:8080/api/posts?page=${currentPage - 1}&size=${postsPerPage}`);
      if (!response.ok) {
        throw new Error("게시글 데이터를 불러오는 데 실패했습니다.");
      }
      const data = await response.json();
      setPosts(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("게시글 불러오기 오류:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, postsPerPage]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handlePageChange = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
  }, []);

  const handlePostClick = useCallback((postId) => {
    navigate(`/post/${postId}`);
  }, [navigate]);

  const tableHeader = useMemo(() => (
    <div className="flex font-bold text-[#482070] border-b">
      <div className="w-1/12 py-2 px-4 text-center">순번</div>
      <div className="w-6/12 py-2 px-4">제목</div>
      <div className="w-2/12 py-2 px-4 text-center">등록자명</div>
      <div className="w-2/12 py-2 px-4 text-center whitespace-nowrap">등록일</div>
      <div className="w-1/12 py-2 px-4 text-center">조회수</div>
    </div>
  ), []);

  if (loading) {
    return (
      <>
        <Header />
        <div className="bg-white min-h-screen p-32 pt-32 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#482070]"></div>
        </div>
      </>
    );
  }

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
          {error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <>
              {tableHeader}
              <PostList
                posts={posts}
                currentPage={currentPage}
                postsPerPage={postsPerPage}
                onPostClick={handlePostClick}
                formatDate={formatDate}
              />
            </>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="w-1/3"></div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
          <div className="w-1/3 flex justify-end">
            <button
              onClick={() => navigate("/post")}
              className="bg-[#482070] text-white px-4 py-2 rounded hover:bg-purple-900"
            >
              글쓰기
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Board;
