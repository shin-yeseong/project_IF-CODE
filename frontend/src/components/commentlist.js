import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";

const CommentList = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [username, setUsername] = useState("");
    const [userId, setUserId] = useState("");
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editContent, setEditContent] = useState("");

    useEffect(() => {
        fetchComments();
        if (!username) {
            fetchUsername();
        }
    }, [username, userId]);

    const fetchComments = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("❌ 로그인 토큰 없음");
                return;
            }

            const response = await axios.get(`http://localhost:8080/api/comments/${postId}`, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });

            console.log("받아온 댓글 데이터:", response.data);
            console.log("현재 로그인한 사용자 ID:", userId);
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

            const response = await axios.get("http://localhost:8080/api/users/profile", {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });

            setUsername(response.data.user.username);
            setUserId(response.data.user.userId);
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
                {
                    postId,
                    content: newComment,
                    userName: username,
                    userId: userId
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            console.log("새로 작성된 댓글 데이터:", response.data);
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

    const handleEditComment = async (commentId) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("로그인이 필요합니다.");
                return;
            }

            await axios.put(`http://localhost:8080/api/comments/${commentId}`,
                { content: editContent },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setComments(comments.map(comment =>
                comment.id === commentId ? { ...comment, content: editContent } : comment
            ));
            setEditingCommentId(null);
            setEditContent("");
        } catch (error) {
            console.error("❌ 댓글 수정 실패:", error);
            alert("댓글 수정에 실패했습니다.");
        }
    };

    const startEditing = (comment) => {
        setEditingCommentId(comment.id);
        setEditContent(comment.content);
    };

    return (
        <div className="mt-6">
            <h3 className="text-lg font-bold">댓글</h3>

            <div className="mt-4">
                {comments.map((comment) => {
                    console.log("댓글 정보:", comment);
                    console.log("현재 사용자 ID:", userId);
                    return (
                        <div key={comment.id} className="border p-3 rounded-lg my-2 bg-white shadow-sm">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800">{comment.userName}</p>
                                    <p className="text-gray-500 text-sm">
                                        {moment(comment.createdAt).format("YYYY년 MM월 DD일 HH:mm")}
                                    </p>
                                    {editingCommentId === comment.id ? (
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                value={editContent}
                                                onChange={(e) => setEditContent(e.target.value)}
                                                className="w-full border p-2 rounded-md"
                                            />
                                            <div className="mt-2 space-x-2">
                                                <button
                                                    onClick={() => handleEditComment(comment.id)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    저장
                                                </button>
                                                <button
                                                    onClick={() => setEditingCommentId(null)}
                                                    className="text-gray-600 hover:text-gray-800"
                                                >
                                                    취소
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="mt-2 text-gray-700">{comment.content}</p>
                                    )}
                                </div>
                                {String(comment.userId) === String(userId) && !editingCommentId && (
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => startEditing(comment)}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            수정
                                        </button>
                                        <button
                                            onClick={() => handleDeleteComment(comment.id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            삭제
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="mt-4 flex">
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="댓글을 입력하세요..."
                    className="border p-2 flex-1 rounded-md"
                />
                <button
                    onClick={handleAddComment}
                    className="bg-[#482070] text-white px-4 py-2 rounded-md ml-2"
                >
                    댓글 작성
                </button>
            </div>
        </div>
    );
};

export default CommentList;
