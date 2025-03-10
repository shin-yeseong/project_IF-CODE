import React, { useState, useEffect } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

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


  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:8080/api/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("사용자 정보를 가져오는 데 실패했습니다.");
        }

        const data = await response.json();
        console.log("프로필 데이터 가져옴:", data);

        setUser(data);
        setProfilePicture(data.profilePictureUrl || "http://localhost:8080/default-profile.png");

        setUpdatedUserInfo({
          username: data.username,
          email: data.email,
          phone: data.phone,
          password: "",
          introduction: data.introduction || "",
        });
      } catch (error) {
        console.error("프로필 정보 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

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

    const formData = new FormData();
    formData.append("file", file); // ✅ 요청 필드 이름을 "file"로 변경

    const token = localStorage.getItem("token");
    console.log("🔑 저장된 토큰:", token); // 디버깅용

    try {
      const response = await fetch("http://localhost:8080/api/profile/upload-picture", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ 인증 토큰 추가
          // 'Content-Type': 'multipart/form-data' 제거 (자동 설정됨)
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`프로필 사진 업로드 실패 (status: ${response.status})`);
      }

      const data = await response.json();
      console.log("업로드 응답 데이터:", data);

      if (data.profilePictureUrl) {
        const newProfileUrl = `http://localhost:8080${data.profilePictureUrl}`;
        setProfilePicture(newProfileUrl);
        setUser((prev) => ({ ...prev, profilePictureUrl: newProfileUrl }));
      } else {
        console.error("업로드 응답에 profilePictureUrl 없음:", data);
      }
    } catch (error) {
      console.error("프로필 사진 변경 실패:", error);
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


  if (loading) return <p className="text-white p-32">로딩 중...</p>;
  if (!user) return <p className="text-white p-32">사용자 정보를 불러올 수 없습니다.</p>;

  return (
    <>
      <Header />
      <div className="min-h-screen p-32 pt-32 bg-[#482070]">
        <div className="w-full max-w-4xl text-left mb-10">
          <h1 className="text-3xl font-bold text-[#ffffff]">My Page |</h1>
          <p className="text-lg text-[#ffffff] mt-2">
            프로필 확인 및 수정이 가능한 페이지입니다. <br />
          </p>
        </div>

        <div className="w-full flex bg-white text-black rounded-lg shadow-lg overflow-visible">
          {/* 왼쪽 메뉴 */}
          <div className="w-1/3 bg-gray-100 p-6 flex flex-col items-center">
            {/* 🔹 프로필 사진 */}
            <label htmlFor="profile-upload" className="cursor-pointer">
              <img
                src={profilePicture || "http://localhost:8080/default-profile.png"}
                alt="profile"
                className="w-24 h-24 rounded-full border-2 border-gray-400"
              />

            </label>
            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfilePictureChange}
            />
            <h2 className="mt-4 text-lg font-bold">{user.username}</h2>
            <p className="text-gray-600">{user.userId}</p>

            {/* 🔹 메뉴 리스트 */}
            <nav className="mt-6 w-full text-center">
              <ul className="space-y-4">
                <li
                  className={`cursor-pointer font-semibold ${selectedMenu === "개인정보" ? "text-purple-800" : "text-gray-600 hover:text-purple-800"}`}
                  onClick={() => setSelectedMenu("개인정보")}
                >
                  개인정보
                </li>
                <li
                  className={`cursor-pointer ${selectedMenu === "내 게시글" ? "text-purple-800 font-semibold" : "text-gray-600 hover:text-purple-800"}`}
                  onClick={() => setSelectedMenu("내 게시글")}
                >
                  내 게시글
                </li>
                <li
                  className={`cursor-pointer ${selectedMenu === "내 메모" ? "text-purple-800 font-semibold" : "text-gray-600 hover:text-purple-800"}`}
                  onClick={() => setSelectedMenu("내 메모")}
                >
                  내 메모
                </li>

                <li
                  className={`cursor-pointer ${selectedMenu === "학점 관리" ? "text-purple-800 font-semibold" : "text-gray-600 hover:text-purple-800"}`}
                  onClick={() => setSelectedMenu("학점 관리")}
                >
                  학점 관리
                </li>
                <li className="text-red-600 cursor-pointer hover:text-red-800">회원탈퇴</li>
              </ul>
            </nav>
          </div>

          <div className="w-2/3 p-6 flex flex-col">
            {selectedMenu === "개인정보" && (
              <>
                <h2 className="text-2xl font-bold text-purple-800">🔒 개인정보 |</h2>
                <div className="flex items-center justify-center flex-grow">
                  <img
                    src={profilePicture}
                    alt="profile"
                    className="w-20 h-20 rounded-full border-2 border-gray-400"
                  />
                  <div className="ml-4">
                    <div className="flex items-center">
                      <p className="w-24"><strong>이름</strong></p>
                      <span className="mx-2">|</span>
                      <p>{user.username}</p>
                    </div>
                    <div className="flex items-center">
                      <p className="w-24"><strong>메일</strong></p>
                      <span className="mx-2">|</span>
                      <p>{user.email}</p>
                    </div>
                    <div className="flex items-center">
                      <p className="w-24"><strong>전화번호</strong></p>
                      <span className="mx-2">|</span>
                      <p>{user.phone}</p>
                    </div>
                    <div className="flex items-center">
                      <p className="w-24"><strong>학번</strong></p>
                      <span className="mx-2">|</span>
                      <p>{user.userId}</p>
                    </div>
                    <div className="flex items-center">
                      <p className="w-24"><strong>자기소개</strong></p>
                      <span className="mx-2">|</span>
                      <p>{user.introduction || "자기소개를 입력해주세요."}</p>
                    </div>
                  </div>
                </div>
                <button
                  className="mt-6 bg-purple-800 text-white px-4 py-2 rounded hover:bg-purple-900"
                  onClick={() => setIsModalOpen(true)}
                >
                  회원정보 수정
                </button>
              </>
            )}

            {selectedMenu === "내 게시글" && (
              <>
                <h2 className="text-2xl font-bold text-purple-800">📂 내 게시글 |</h2>
                <p className="mt-4 text-gray-600">사용자가 작성한 게시글 목록이 표시됩니다.</p>
                {/* TODO: 실제 게시글 목록을 불러와 표시 */}
              </>
            )}

            {selectedMenu === "내 메모" && (
              <>
                <h2 className="text-2xl font-bold text-purple-800">📝 내 메모 |</h2>
                <p className="mt-4 text-gray-600">사용자의 메모 목록이 표시됩니다.</p>
                {/* TODO: 실제 메모 목록을 불러와 표시 */}
              </>
            )}

            {selectedMenu === "학점 관리" && (
              <DndProvider backend={HTML5Backend}>
                <h2 className="text-2xl font-bold text-purple-800">📚 학점 관리</h2>



                <CourseList availableCourses={availableCourses} moveCourse={moveCourse} />



                {/* 학기별 드롭 박스 */}
                <div className="grid grid-cols-4 gap-4 mt-4">
                  {Object.keys(semesters).map((sem) => (
                    <Semester key={sem} semester={sem} courses={semesters[sem]} moveCourse={moveCourse} />
                  ))}
                </div>

                <h3 className="mt-4 text-black">
                  총 이수 학점: {totalCredits.required + totalCredits.elective}학점 (필수 {totalCredits.required}학점 / 선택 {totalCredits.elective}학점)
                </h3>
              </DndProvider>
            )}
          </div>
        </div>
      </div>

      {/* 🔹 회원정보 수정 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto sm:mt-10">
            <h2 className="text-xl font-bold text-gray-800 mb-4">회원정보 수정</h2>

            <label className="block mb-4 cursor-pointer">
              <img src={profilePicture} alt="profile"
                className="w-24 h-24 rounded-full border-2 border-gray-400" />
              <input type="file" className="hidden" accept="image/*" onChange={handleProfilePictureChange} />
            </label>

            <div className="mb-4">
              <label className="block">이름</label>
              <input
                type="text"
                name="username"
                value={updatedUserInfo.username}
                onChange={handleInputChange}
                className="border p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block">이메일</label>
              <input
                type="email"
                name="email"
                value={updatedUserInfo.email}
                onChange={handleInputChange}
                className="border p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block">전화번호</label>
              <input
                type="text"
                name="phone"
                value={updatedUserInfo.phone}
                onChange={handleInputChange}
                className="border p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block">자기소개</label>
              <textarea
                name="introduction"
                value={updatedUserInfo.introduction}
                onChange={handleInputChange}
                className="border p-2 w-full h-20 resize-none"
              />
            </div>


            <div className="mb-4">
              <label className="block">새 비밀번호</label>
              <input
                type="password"
                name="password"
                value={updatedUserInfo.password}
                onChange={handleInputChange}
                className="border p-2 w-full"
              />
            </div>

            {/* 🔹 비밀번호 확인 입력 */}
            <div className="mb-4">
              <label className="block">비밀번호 확인</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border p-2 w-full"
              />
            </div>

            {/* 🔹 비밀번호 불일치 에러 메시지 */}
            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}

            <button
              className="bg-purple-800 text-white px-4 py-2 rounded w-full"
              onClick={handleSaveChanges}
            >
              수정 저장
            </button>
            <button className="mt-4 text-gray-600 hover:underline w-full" onClick={() => setIsModalOpen(false)}>
              취소
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default MyPage;
