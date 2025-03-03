import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Header from "../components/header";
import CommentList from "../components/commentlist";

const PostedPage = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [userId, setUserId] = useState(""); // ✅ useState로 userId 관리
    const navigate = useNavigate();
    const isFetched = useRef(false);

    useEffect(() => {
        // ✅ 로그인한 유저 ID 불러오기
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) {
            setUserId(storedUserId);
        } else {
            console.warn("⚠️ userId가 localStorage에 없음. 로그인 필요");
        }

        const fetchPost = async () => {
            if (isFetched.current) return;
            isFetched.current = true;
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`http://localhost:8080/api/posts/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setPost(response.data);
            } catch (error) {
                console.error("❌ 게시글 불러오기 실패:", error);
            }
        };

        fetchPost();
    }, [id]);

    console.log("📢 저장된 토큰:", localStorage.getItem("token"));
    console.log("📢 현재 로그인한 유저 ID:", userId);

    if (!post) return <p className="text-center text-gray-600">게시글을 불러오는 중...</p>;

    console.log("📢 게시글 작성자 ID:", post.userId);

    const formatDate = (isoString) => {
        if (!isoString) return "-";
        const date = new Date(isoString);
        const koreaTime = new Date(date.getTime() + 9 * 60 * 60 * 1000);
        return koreaTime.toISOString().slice(0, 16).replace("T", " ");
    };

    return (
        <>
            <Header />
            <div className="bg-white min-h-screen p-32 pt-32">
                <Link to={"/board"}>
                    <h1 className="text-3xl font-bold text-[#482070]"> Algorithm Study |</h1>
                </Link >

                <div className="mt-10 bg-gray-100 p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-[#482070]">{post.title}</h2>
                    <p className="text-gray-600 mt-2">작성자: {post.userName} | 작성일: {formatDate(post.createdAt)}</p>

                    <div className="mt-6 bg-white p-4 rounded-md border">
                        <p className="text-lg">{post.content}</p>
                    </div>

                    {/* 🔹 내가 쓴 글이면 수정 버튼 표시 (타입 변환 추가) */}
                    {userId && String(userId) === String(post.userId) && (
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => navigate(`/editpost/${post.id}`)}
                                className="bg-[#482070] text-white px-4 py-2 rounded-md hover:bg-purple-900"
                            >
                                수정
                            </button>
                        </div>
                    )}
                </div>
                <CommentList postId={id} />
            </div >
        </>
    );
};

export default PostedPage;
