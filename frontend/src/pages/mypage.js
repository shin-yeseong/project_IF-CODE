import React, { useState, useEffect } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useNavigate } from "react-router-dom";

const ItemType = "COURSE";

// 초기 과목 리스트 (필수 과목은 required: true)
const initialCourses = [
  { id: 1, name: "융합프로그래밍", required: true },
  { id: 2, name: "자료구조", required: true },
  { id: 3, name: "알고리즘", required: true },
  { id: 4, name: "컴퓨터시스템", required: true },
  { id: 5, name: "오픈소스소프트웨어프로젝트", required: true },
  { id: 6, name: "융합캡스톤디자인", required: true },
  { id: 7, name: "파이썬프로그래밍", required: false },
  { id: 8, name: "융합어드벤처디자인", required: false },
  { id: 9, name: "데이터사이언스개론", required: false },
  { id: 10, name: "데이터베이스", required: false },
  { id: 11, name: "머신러닝과데이터사이언스", required: false },
  { id: 12, name: "데이터사이언스를위한파이썬프로그래밍", required: false },
  { id: 13, name: "웹프론트엔드", required: false },
  { id: 14, name: "웹백엔드", required: false },
  { id: 15, name: "모바일프로그래밍", required: false },
  { id: 16, name: "인공지능입문", required: false },
  { id: 17, name: "오픈소스소프트웨어실습", required: false },
  { id: 18, name: "사물인터넷개론", required: false },
  { id: 19, name: "머신러닝및딥러닝", required: false },
  { id: 20, name: "컴퓨터네트워크및보안", required: false },
];

// ✅ 초기 학기 상태
const initialSemesters = {
  "1-1": [],
  "1-2": [],
  "2-1": [],
  "2-2": [],
  "3-1": [],
  "3-2": [],
  "4-1": [],
  "4-2": [],
};


function Course({ course }) {
  const [{ isDragging }, drag] = useDrag({
    type: "COURSE",
    item: { course },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`flex justify-center items-center text-white rounded-md cursor-pointer transition-all 
        px-3 py-1 text-xs 
        ${course.required ? "bg-purple-800" : "bg-gray-500"} 
        ${isDragging ? "opacity-50 scale-105" : "opacity-100"} `}
    >
      <span className="truncate w-full text-center px-2">{course.name}</span>
    </div>
  );
}
function CourseList({ availableCourses, moveCourse }) {
  const [, drop] = useDrop({
    accept: "COURSE",
    drop: (item) => moveCourse(item.course, "remove"),
  });

  return (
    <div ref={drop} className="flex flex-wrap gap-1 mt-4 bg-gray-200 p-2 rounded-md min-h-12">
      {availableCourses.map((course) => (
        <Course key={course.id} course={course} />
      ))}
    </div>
  );
}


// ✅ 학기별 칸 (드롭 가능)
function Semester({ semester, courses, moveCourse }) {
  const [, drop] = useDrop({
    accept: "COURSE",
    drop: (item) => moveCourse(item.course, semester),
  });

  return (
    <div
      ref={drop}
      className="w-40 min-h-32 border border-gray-400 flex flex-col gap-1 items-center bg-gray-100 m-2 rounded-lg p-2 overflow-auto"
    >
      <strong className="text-sm">{semester}</strong>
      <div className="flex flex-col w-full gap-1 items-center">
        {courses.map((course) => (
          <Course key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}



const MyPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState("개인정보");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [semesters, setSemesters] = useState(initialSemesters);
  const [totalCredits, setTotalCredits] = useState({ required: 0, elective: 0 });
  const [availableCourses, setAvailableCourses] = useState(initialCourses);
  const [password, setPassword] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [updatedUserInfo, setUpdatedUserInfo] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    introduction: "",
  });
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [memos, setMemos] = useState([]);
  const [newMemo, setNewMemo] = useState("");
  const [memoTitle, setMemoTitle] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);  // 데이터 로딩 시작
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("토큰이 없습니다. 로그인 페이지로 이동합니다.");
          navigate("/login");
          return;
        }

        console.log("프로필 요청 시작 - 토큰:", token.substring(0, 20) + "...");

        // 사용자 정보 가져오기
        const response = await fetch("http://localhost:8080/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("프로필 응답 상태:", response.status);

        if (!response.ok) {
          const errorData = await response.text();
          console.error("프로필 요청 실패:", response.status, errorData);
          throw new Error(`사용자 정보를 가져오는데 실패했습니다. (${response.status})`);
        }

        const data = await response.json();
        console.log("받은 사용자 데이터:", data);

        setUser(data);
        setProfilePicture(data.profilePictureUrl || "http://localhost:8080/default-profile.png");
      } catch (error) {
        console.error("사용자 데이터 가져오기 실패:", error);
        console.error("에러 상세:", error.stack);
        alert("사용자 정보를 가져오는데 실패했습니다. 다시 로그인해주세요.");
        navigate("/login");
      } finally {
        setLoading(false);  // 데이터 로딩 완료
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    const fetchUserContent = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        // 게시글 가져오기
        const postsResponse = await fetch("http://localhost:8080/api/posts/my-posts", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (postsResponse.ok) {
          const postsData = await postsResponse.json();
          setPosts(postsData);
        }

        // 댓글 가져오기
        const commentsResponse = await fetch("http://localhost:8080/api/comments/my-comments", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (commentsResponse.ok) {
          const commentsData = await commentsResponse.json();
          setComments(commentsData);
        }

        // 메모 가져오기
        const memosResponse = await fetch("http://localhost:8080/api/memos", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (memosResponse.ok) {
          const memosData = await memosResponse.json();
          setMemos(memosData);
        }
      } catch (error) {
        console.error("데이터 가져오기 실패:", error);
      }
    };

    fetchUserContent();
  }, [navigate]);

  const moveCourse = (course, semester) => {
    setSemesters((prev) => {
      const newSemesters = { ...prev };

      // 기존 학기에서 과목 제거
      Object.keys(newSemesters).forEach((key) => {
        newSemesters[key] = newSemesters[key].filter((c) => c.id !== course.id);
      });

      if (semester === "remove") {
        // ✅ 중복 방지: 이미 위 리스트에 있는지 확인 후 추가
        setAvailableCourses((prev) => {
          const alreadyExists = prev.some((c) => c.id === course.id);
          return alreadyExists ? prev : [...prev, course];
        });
      } else {
        newSemesters[semester] = [...newSemesters[semester], course];
      }

      // ✅ 학점 업데이트 유지
      updateCredits(newSemesters);

      return newSemesters;
    });

    if (semester !== "remove") {
      setAvailableCourses((prev) => prev.filter((c) => c.id !== course.id));
    }
  };



  const updateCredits = (semesters) => {
    let newTotal = { required: 0, elective: 0 };

    // 모든 학기별 과목을 다시 검사
    Object.values(semesters).forEach((courses) => {
      courses.forEach((c) => {
        if (c.required) {
          newTotal.required += 3; // 필수 과목은 3학점
        } else {
          newTotal.elective += 3; // 선택 과목도 3학점
        }
      });
    });

    setTotalCredits(newTotal);
  };





  const handleProfilePictureChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // 파일 크기 체크 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB를 초과할 수 없습니다.");
      return;
    }

    // 파일 타입 체크
    if (!file.type.startsWith('image/')) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/profile/upload-picture", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "프로필 사진 업로드에 실패했습니다.");
      }

      const data = await response.json();
      console.log("업로드 응답 데이터:", data);

      if (data.profilePictureUrl) {
        // URL이 상대 경로인 경우 전체 URL로 변환
        const newProfileUrl = data.profilePictureUrl.startsWith('http')
          ? data.profilePictureUrl
          : `http://localhost:8080${data.profilePictureUrl}`;

        setProfilePicture(newProfileUrl);
        setUser(prev => ({ ...prev, profilePictureUrl: newProfileUrl }));
        alert("프로필 사진이 성공적으로 변경되었습니다.");
      } else {
        throw new Error("프로필 사진 URL이 없습니다.");
      }
    } catch (error) {
      console.error("프로필 사진 변경 실패:", error);
      alert(error.message || "프로필 사진 변경에 실패했습니다.");
    }
  };



  const handlePasswordConfirm = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:8080/api/verify-password", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        throw new Error("비밀번호가 올바르지 않습니다.");
      }

      setIsVerified(true); // 비밀번호 검증 성공 → 수정 폼 보여줌
    } catch (error) {
      alert(error.message); // 비밀번호 틀림 → 에러 메시지 표시
    }
  };

  // 🔹 비밀번호 유효성 검사 함수 추가
  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUserInfo({
      ...updatedUserInfo,
      [name]: value,
    });
  };

  const handleSaveChanges = async () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();

    Object.keys(updatedUserInfo).forEach((key) => {
      formData.append(key, updatedUserInfo[key]);
    });

    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }

    // 🔹 비밀번호 유효성 검사 + 비밀번호 일치 여부 검사
    if (updatedUserInfo.password && !validatePassword(updatedUserInfo.password)) {
      setPasswordError("비밀번호는 8자 이상, 영문+숫자+특수문자를 포함해야 합니다.");
      return;
    } else if (updatedUserInfo.password !== confirmPassword) {
      setPasswordError("비밀번호가 일치하지 않습니다.");
      return;
    } else {
      setPasswordError(""); // 에러 메시지 초기화
    }

    try {
      const response = await fetch("http://localhost:8080/api/profile/update", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUserInfo),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message || "정보가 성공적으로 수정되었습니다.");
        setIsModalOpen(false);
      } else {
        const errorText = await response.text();
        console.error("서버 오류:", errorText);
        alert("정보 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("정보 수정 중 오류 발생:", error);
      alert("정보 수정에 실패했습니다.");
    }
  };

  const handleDeleteProfilePicture = async () => {
    if (!window.confirm("프로필 사진을 기본 이미지로 변경하시겠습니까?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("로그인이 필요합니다.");
        return;
      }

      const response = await fetch("http://localhost:8080/api/profile/delete-picture", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("프로필 사진 삭제에 실패했습니다.");
      }

      setProfilePicture("http://localhost:8080/default-profile.png");
      alert("프로필 사진이 기본 이미지로 변경되었습니다.");
    } catch (error) {
      console.error("Error deleting profile picture:", error);
      alert("프로필 사진 삭제에 실패했습니다.");
    }
  };

  const handleAddMemo = async () => {
    if (!memoTitle.trim() || !newMemo.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:8080/api/memos", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: memoTitle,
          content: newMemo,
        }),
      });

      if (response.ok) {
        const newMemoData = await response.json();
        setMemos([...memos, newMemoData]);
        setMemoTitle("");
        setNewMemo("");
        alert("메모가 저장되었습니다.");
      } else {
        throw new Error("메모 저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("메모 저장 실패:", error);
      alert("메모 저장에 실패했습니다.");
    }
  };

  const handleDeleteMemo = async (memoId) => {
    if (!window.confirm("이 메모를 삭제하시겠습니까?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`http://localhost:8080/api/memos/${memoId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setMemos(memos.filter(memo => memo.id !== memoId));
        alert("메모가 삭제되었습니다.");
      } else {
        throw new Error("메모 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("메모 삭제 실패:", error);
      alert("메모 삭제에 실패했습니다.");
    }
  };

  if (loading) return <p className="text-white p-32">로딩 중...</p>;
  if (!user) return <p className="text-white p-32">사용자 정보를 불러올 수 없습니다.</p>;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-[#482070] to-[#2a123f] p-4 md:p-8 lg:p-32 pt-32">
        <div className="w-full max-w-6xl mx-auto">
          <div className="text-left mb-10">
            <h1 className="text-3xl font-bold text-white">My Page</h1>
            <p className="text-lg text-gray-200 mt-2">
              프로필 확인 및 수정이 가능한 페이지입니다.
            </p>
          </div>

          <div className="w-full flex flex-col md:flex-row bg-white rounded-xl shadow-2xl overflow-hidden">
            {/* 왼쪽 메뉴 */}
            <div className="w-full md:w-1/3 bg-gradient-to-b from-gray-50 to-gray-100 p-6 flex flex-col items-center">
              {/* 프로필 사진 */}
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <img
                    src={profilePicture}
                    alt="프로필"
                    className="w-32 h-32 rounded-full object-cover border-4 border-purple-200 shadow-lg"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full transition-all duration-300">
                    <label className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        className="hidden"
                      />
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </label>
                  </div>
                </div>
                <button
                  onClick={handleDeleteProfilePicture}
                  className="mt-2 text-sm text-red-500 hover:text-red-700 transition-colors duration-200"
                >
                  기본 프로필로 변경
                </button>
              </div>

              <div className="mt-4 text-center">
                <h2 className="text-xl font-bold text-gray-800">{user.username}</h2>
                <p className="text-gray-600">{user.userId}</p>
              </div>

              {/* 메뉴 리스트 */}
              <nav className="mt-8 w-full">
                <ul className="space-y-3">
                  {["개인정보", "내 게시글", "내 메모", "학점 관리"].map((menu) => (
                    <li
                      key={menu}
                      className={`cursor-pointer px-4 py-2 rounded-lg transition-all duration-200 ${selectedMenu === menu
                        ? "bg-purple-100 text-purple-800 font-semibold"
                        : "text-gray-600 hover:bg-purple-50 hover:text-purple-800"
                        }`}
                      onClick={() => setSelectedMenu(menu)}
                    >
                      {menu}
                    </li>
                  ))}
                  <li className="px-4 py-2 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-200 cursor-pointer">
                    회원탈퇴
                  </li>
                </ul>
              </nav>
            </div>

            {/* 오른쪽 컨텐츠 */}
            <div className="w-full md:w-2/3 p-6 md:p-8">
              {selectedMenu === "개인정보" && (
                <div className="space-y-6 flex flex-col items-center">
                  <h2 className="text-2xl font-bold text-purple-800">🔒 개인정보</h2>
                  <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-2xl">
                    <div className="flex flex-col items-center space-y-6">
                      <div className="w-full space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-semibold text-gray-700">이름</span>
                          <span className="text-gray-800">{user.username}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-semibold text-gray-700">메일</span>
                          <span className="text-gray-800">{user.email}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-semibold text-gray-700">전화번호</span>
                          <span className="text-gray-800">{user.phone}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-semibold text-gray-700">학번</span>
                          <span className="text-gray-800">{user.userId}</span>
                        </div>
                      </div>
                      <div className="w-full">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <span className="font-semibold text-gray-700 block mb-2">자기소개</span>
                          <p className="text-gray-800 whitespace-pre-wrap">{user.introduction || "자기소개를 입력해주세요."}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    className="bg-purple-800 text-white px-8 py-3 rounded-lg hover:bg-purple-900 transition-colors duration-200 shadow-md hover:shadow-lg"
                    onClick={() => setIsModalOpen(true)}
                  >
                    회원정보 수정
                  </button>
                </div>
              )}

              {selectedMenu === "내 게시글" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-purple-800">📂 내 게시글</h2>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="space-y-4">
                      {posts.length > 0 ? (
                        posts.map((post) => (
                          <div key={post.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-800 hover:text-purple-800 cursor-pointer">
                                  {post.title}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">{post.content}</p>
                                <div className="flex items-center text-sm text-gray-500 mt-2">
                                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                  <span className="mx-2">•</span>
                                  <span>댓글 {post.commentCount}개</span>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <button className="text-sm text-purple-600 hover:text-purple-800">수정</button>
                                <button className="text-sm text-red-600 hover:text-red-800">삭제</button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-600 text-center py-4">작성한 게시글이 없습니다.</p>
                      )}
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-purple-800 mt-8">💬 내 댓글</h2>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="space-y-4">
                      {comments.length > 0 ? (
                        comments.map((comment) => (
                          <div key={comment.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-gray-800">{comment.content}</p>
                                <div className="flex items-center text-sm text-gray-500 mt-2">
                                  <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                                  <span className="mx-2">•</span>
                                  <span className="text-purple-600">게시글: {comment.postTitle}</span>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <button className="text-sm text-purple-600 hover:text-purple-800">수정</button>
                                <button className="text-sm text-red-600 hover:text-red-800">삭제</button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-600 text-center py-4">작성한 댓글이 없습니다.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {selectedMenu === "내 메모" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-purple-800">📝 내 메모</h2>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="mb-6">
                      <input
                        type="text"
                        placeholder="메모 제목"
                        value={memoTitle}
                        onChange={(e) => setMemoTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-2"
                      />
                      <textarea
                        placeholder="메모 내용을 입력하세요..."
                        value={newMemo}
                        onChange={(e) => setNewMemo(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent h-32 resize-none mb-2"
                      />
                      <button
                        onClick={handleAddMemo}
                        className="w-full bg-purple-800 text-white px-4 py-2 rounded-lg hover:bg-purple-900 transition-colors duration-200"
                      >
                        메모 저장
                      </button>
                    </div>

                    <div className="space-y-4">
                      {memos.length > 0 ? (
                        memos.map((memo) => (
                          <div key={memo.id} className="border rounded-lg p-4 bg-gray-50">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-800">{memo.title}</h3>
                                <p className="text-gray-600 mt-2 whitespace-pre-wrap">{memo.content}</p>
                                <p className="text-sm text-gray-500 mt-2">
                                  {new Date(memo.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <button
                                onClick={() => handleDeleteMemo(memo.id)}
                                className="text-sm text-red-600 hover:text-red-800"
                              >
                                삭제
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-600 text-center py-4">작성한 메모가 없습니다.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {selectedMenu === "학점 관리" && (
                <DndProvider backend={HTML5Backend}>
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-purple-800">📚 학점 관리</h2>
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <CourseList availableCourses={availableCourses} moveCourse={moveCourse} />
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                        {Object.keys(semesters).map((sem) => (
                          <Semester key={sem} semester={sem} courses={semesters[sem]} moveCourse={moveCourse} />
                        ))}
                      </div>
                      <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                        <h3 className="text-lg font-semibold text-purple-800">
                          총 이수 학점: {totalCredits.required + totalCredits.elective}학점
                          <span className="block mt-1 text-sm text-purple-600">
                            (필수 {totalCredits.required}학점 / 선택 {totalCredits.elective}학점)
                          </span>
                        </h3>
                      </div>
                    </div>
                  </div>
                </DndProvider>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 회원정보 수정 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">회원정보 수정</h2>

              <div className="flex justify-center mb-6">
                <div className="relative group">
                  <img
                    src={profilePicture}
                    alt="profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-purple-200 shadow-lg"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full transition-all duration-300">
                    <label className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                      />
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                  <input
                    type="text"
                    name="username"
                    value={updatedUserInfo.username}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                  <input
                    type="email"
                    name="email"
                    value={updatedUserInfo.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
                  <input
                    type="text"
                    name="phone"
                    value={updatedUserInfo.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">자기소개</label>
                  <textarea
                    name="introduction"
                    value={updatedUserInfo.introduction}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent h-24 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">새 비밀번호</label>
                  <input
                    type="password"
                    name="password"
                    value={updatedUserInfo.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호 확인</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {passwordError && (
                  <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                )}
              </div>

              <div className="mt-6 space-y-3">
                <button
                  className="w-full bg-purple-800 text-white px-4 py-2 rounded-lg hover:bg-purple-900 transition-colors duration-200"
                  onClick={handleSaveChanges}
                >
                  수정 저장
                </button>
                <button
                  className="w-full text-gray-600 hover:text-gray-800 transition-colors duration-200"
                  onClick={() => setIsModalOpen(false)}
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default MyPage;
