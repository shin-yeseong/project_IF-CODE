import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";

const Post = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        const userName = localStorage.getItem("userName");
        if (!token) {
            alert("로그인이 필요합니다!");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("userName", userName || "");
        if (file) {
            formData.append("file", file);  // 첨부파일 추가
        }

        try {
            const response = await axios.post("http://localhost:8080/api/posts", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("✅ 게시글 작성 성공:", response.data);
            alert("게시글이 성공적으로 업로드되었습니다!");
            setTitle("");
            setContent("");
            setFile(null);
            navigate('/board');
        } catch (error) {
            console.error("❌ 게시글 작성 실패:", error);
            alert("게시글 작성 중 오류 발생!");
        }
    };


    return (
        <>
            <Header />
            <div className="bg-white min-h-screen p-32 pt-32">
                <h1 className="text-3xl font-bold text-[#482070]">Algorithm Study |</h1>

                <form onSubmit={handleSubmit} className="mt-10 bg-gray-100 p-6 rounded-lg shadow-md">
                    {/* 🔹 제목 입력 */}
                    <div className="mb-4">
                        <label className="block text-lg font-semibold text-[#482070]">제목</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border p-2 rounded-md"
                            placeholder="제목을 입력하세요."
                        />
                    </div>

                    {/* 🔹 본문 입력 */}
                    <div className="mb-4">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full h-64 border p-2 rounded-md"
                            placeholder="글을 작성해주세요."
                        />
                    </div>

                    {/* 🔹 첨부파일 */}
                    <div className="mb-4">
                        <label className="block text-lg font-semibold text-[#482070]">첨부파일</label>
                        <input type="file" onChange={handleFileChange} className="w-full border p-2 rounded-md" />
                    </div>

                    {/* 🔹 메시지 출력 */}
                    {message && <p className="text-red-500 mb-4">{message}</p>}

                    {/* 🔹 업로드 버튼 */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-[#482070] text-white px-4 py-2 rounded-md hover:bg-purple-900"
                        >
                            업로드
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Post;
