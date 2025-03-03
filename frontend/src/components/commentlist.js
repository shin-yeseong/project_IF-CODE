import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

const CommentList = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [username, setUsername] = useState("");

    useEffect(() => {
        fetchComments();
        if (!username) {
            fetchUsername();
        }
    }, [username]); // username이 없을 때만 호출

    const fetchComments = async () => {
        try {
            const token = localStorage.getItem("token"); // ✅ 토큰 가져오기
            if (!token) {
                console.error("❌ 로그인 토큰 없음");
                return;
            }

            const response = await axios.get(`http://localhost:8080/api/comments/${postId}`, {
                headers: { Authorization: `Bearer ${token}` }, // ✅ JWT 추가
                withCredentials: true, // ✅ 인증 쿠키 포함 (필요할 경우)
            });

            setComments(response.data);
        } catch (error) {
            console.error("❌ 댓글 불러오기 실패:", error);
        }
    };


    const fetchUsername = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("❌ 로그인 토큰 없음");
                return;
            }

            const response = await axios.get("http://localhost:8080/api/profile", {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });

            setUsername(response.data.username);
        } catch (error) {
            console.error("❌ 사용자 정보 가져오기 실패:", error);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("로그인이 필요합니다.");
                return;
            }

            const response = await axios.post(
                "http://localhost:8080/api/comments",
                { postId, content: newComment, userName: username },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setComments([...comments, response.data]);
            setNewComment("");
        } catch (error) {
            console.error("❌ 댓글 추가 실패:", error);
            alert("댓글 작성 중 오류 발생!");
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("로그인이 필요합니다.");
                return;
            }

            await axios.delete(`http://localhost:8080/api/comments/${commentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setComments(comments.filter((comment) => comment.id !== commentId));
        } catch (error) {
            console.error("❌ 댓글 삭제 실패:", error);
        }
    };

    return (
        <div className="mt-6">
            <h3 className="text-lg font-bold">댓글</h3>

            <div className="mt-4">
                {comments.map((comment) => (
                    <div key={comment.id} className="border p-2 rounded-md my-2">
                        <div className="flex justify-between">
                            <div>
                                <p className="font-semibold">{comment.userName}</p>
                                <p className="text-gray-600 text-sm">
                                    {moment(comment.createdAt).format("YYYY년 MM월 DD일 HH:mm")}
                                </p>
                            </div>
                            {comment.userName === username && (
                                <button onClick={() => handleDeleteComment(comment.id)} className="text-red-500">
                                    삭제
                                </button>
                            )}
                        </div>
                        <p className="mt-1">{comment.content}</p>
                    </div>
                ))}
            </div>

            <div className="mt-4 flex">
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="댓글을 입력하세요..."
                    className="border p-2 flex-1 rounded-md"
                />
                <button onClick={handleAddComment} className="bg-[#482070] text-white px-4 py-2 rounded-md ml-2">
                    작성
                </button>
            </div>
        </div>
    );
};

export default CommentList;
