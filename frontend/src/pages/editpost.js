import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/header";

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [existingFiles, setExistingFiles] = useState([]); // ✅ 기존 파일 목록
    const [newFiles, setNewFiles] = useState([]); // ✅ 새 파일 목록
    const [filesToDelete, setFilesToDelete] = useState([]); // ✅ 삭제할 파일 목록

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`http://localhost:8080/api/posts/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setTitle(response.data.title);
                setContent(response.data.content);
                setExistingFiles(response.data.filePaths || []); // 기존 파일들
            } catch (error) {
                console.error("❌ 게시글 불러오기 실패:", error);
            }
        };

        fetchPost();
    }, [id]);

    const handleFileChange = (e) => {
        setNewFiles([...newFiles, ...e.target.files]);
    };

    const handleDeleteFile = (filePath) => {
        setFilesToDelete([...filesToDelete, filePath]);
        setExistingFiles(existingFiles.filter(file => file !== filePath)); // UI에서 제거
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) {
            alert("로그인이 필요합니다!");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);

        // ✅ 새 파일 추가
        newFiles.forEach(file => {
            formData.append("files", file);
        });

        // ✅ 삭제할 파일 목록 추가
        filesToDelete.forEach(filePath => {
            formData.append("deleteFiles", filePath);
        });

        try {
            await axios.put(`http://localhost:8080/api/posts/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            alert("게시글이 성공적으로 수정되었습니다!");
            navigate(`/post/${id}`);
        } catch (error) {
            console.error("❌ 게시글 수정 실패:", error);
            alert("게시글 수정 중 오류 발생!");
        }
    };

    return (
        <>
            <Header />
            <div className="bg-white min-h-screen p-32 pt-32">
                <h1 className="text-3xl font-bold text-[#482070]">게시글 수정 |</h1>

                <form onSubmit={handleUpdate} className="mt-10 bg-gray-100 p-6 rounded-lg shadow-md">
                    <div className="mb-4">
                        <label className="block text-lg font-semibold text-[#482070]">제목</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border p-2 rounded-md" />
                    </div>

                    <div className="mb-4">
                        <textarea value={content} onChange={(e) => setContent(e.target.value)} className="w-full h-64 border p-2 rounded-md" />
                    </div>

                    <div className="mb-4">
                        <label className="block text-lg font-semibold text-[#482070]">기존 파일</label>
                        {existingFiles.map(file => (
                            <div key={file} className="flex justify-between items-center border p-2 rounded-md">
                                <span>{file}</span>
                                <button type="button" onClick={() => handleDeleteFile(file)}>삭제</button>
                            </div>
                        ))}
                    </div>

                    <input type="file" multiple onChange={handleFileChange} />

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

export default EditPost;
