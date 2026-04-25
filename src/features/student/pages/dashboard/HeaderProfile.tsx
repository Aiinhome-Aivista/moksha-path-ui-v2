import React, { useState, useEffect, useRef } from "react";
import ApiServices from "../../../../services/ApiServices.jsx";

interface Tab {
  name: string;
  key: string;
}

interface HeaderProfileProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  selectedSubject: string;
  onSubjectSelect: (subject: string) => void;
  selectedExam: string;
  onExamSelect: (exam: string) => void;
  subjectDashboardData: any;
  mockDashboardData: any;
}

interface StudentProfile {
  student_name: string;
  school_name: string;
  board_name: string;
  class_name: string;
}

interface Subject {
  subject_id: number;
  subject_name: string;
}

export const HeaderProfile: React.FC<HeaderProfileProps> = ({
  activeTab,
  onTabChange,
  selectedSubject,
  onSubjectSelect,
  selectedExam,
  onExamSelect,
  subjectDashboardData,
  mockDashboardData,
}) => {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [showExamDropdown, setShowExamDropdown] = useState(false);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [profileImage, setProfileImage] = useState<string>("");
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [subjectsList, setSubjectsList] = useState<Subject[]>([]);

  const subjectDropdownRef = useRef<HTMLDivElement>(null);
  const examDropdownRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<Record<string, number>>({});
  // const [overallTestCount, setOverallTestCount] = useState<number>(0);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await ApiServices.getStudentProfile();
        if (response.data && response.data.status === "success") {
          setProfile(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching student profile:", error);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchProfileImage = async () => {
      setIsImageLoading(true);
      try {
        const imageRes = await ApiServices.getUserProfileImage();
        let imgData = imageRes.data?.data?.image || imageRes.data?.data?.profile_image;

        // ✅ Safely handle both Base64 strings and actual HTTP URLs
        if (imageRes.data?.status === "success" && imgData && imgData.trim() !== "") {
          if (!imgData.startsWith("http") && !imgData.startsWith("data:")) {
            imgData = `data:image/jpeg;base64,${imgData}`;
          }
          setProfileImage(imgData);
        }
      } catch (error) {
        console.error("Failed to fetch student profile image", error);
      } finally {
        setIsImageLoading(false);
      }
    };
    fetchProfileImage();
  }, []);

  // ✅ Robustly sync subjects from passed props to avoid redundant API loading
  useEffect(() => {
    if (subjectDashboardData) {
      const fetchedSubjects = subjectDashboardData.subjects || [];
      if (Array.isArray(fetchedSubjects) && fetchedSubjects.length > 0) {
        setSubjectsList(fetchedSubjects);

        const counts: Record<string, number> = {};
        fetchedSubjects.forEach((sub: any) => {
          counts[sub.subject_name] = sub.chapters?.length || 0;
        });
        setNotifications(counts);

        if (!selectedSubject) {
          onSubjectSelect(fetchedSubjects[0].subject_name);
        }
      }
    }
  }, [subjectDashboardData, selectedSubject, onSubjectSelect]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        subjectDropdownRef.current &&
        !subjectDropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
      if (
        examDropdownRef.current &&
        !examDropdownRef.current.contains(event.target as Node)
      ) {
        setShowExamDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const tabs: Tab[] = [
    { name: "Performance Overview", key: "performance" },
    { name: "Subjects", key: "subject" },
    { name: "Mock Exams", key: "exam" },
    { name: "Remediation", key: "remediation" },
  ];

  const [examList, setExamList] = useState<string[]>([]);
  const [mockCount, setMockCount] = useState<number>(0);
  const [mockData, setMockData] = useState<any[]>([]);

  useEffect(() => {
    if (mockDashboardData) {
      const fetchedMocks = mockDashboardData.mocks || [];
      setMockCount(fetchedMocks.length);
      setMockData(fetchedMocks);

      if (Array.isArray(fetchedMocks) && fetchedMocks.length > 0) {
        const dynamicExams = fetchedMocks.map((_: any, index: number) => `Mock: M${(index + 1).toString().padStart(2, '0')}`);
        setExamList(dynamicExams);

        if (!selectedExam && dynamicExams.length > 0) {
          onExamSelect(dynamicExams[dynamicExams.length - 1]);
        }
      }
    }
  }, [mockDashboardData, selectedExam, onExamSelect]);

  // ✅ Fallbacks: Get data from local storage immediately so the UI isn't blank while loading
  const localUser = JSON.parse(localStorage.getItem("active_profile") || "{}");
  const displayName = profile?.student_name || localUser?.student_name || localUser?.name || localUser?.full_name || "";
  const displayInitial = displayName ? displayName.charAt(0).toUpperCase() : "S";
  const displaySchool = profile?.school_name || localUser?.institute_name || "Loading Info...";
  const displayBoard = profile?.board_name || localUser?.board_name || "";
  const displayClass = profile?.class_name || localUser?.class_name || "";

  return (
    <>
      <div className="grid grid-cols-1 mb-1 lg:grid-cols-3 xl:grid-cols-4 items-center relative -ml-6">

        {/* ─── Profile Card ────────────────────────────────────────────── */}
        <div className="flex items-center gap-4 bg-[#212b36] text-white p-4 h-24 z-10 min-w-72 rounded-tr-full rounded-br-full shadow-md">
          <div className="relative flex-shrink-0">
            {profileImage ? (
              <img
                src={profileImage}
                className="w-20 h-20 rounded-full border-2 border-white object-cover shadow-sm bg-white"
                alt="profile"
                onError={() => setProfileImage("")}
              />
            ) : (
              <div className="w-20 h-20 rounded-full border-2 border-white bg-[#BADA55] flex items-center justify-center text-[#2b3a00] text-3xl font-black shadow-sm">
                {isImageLoading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  displayInitial
                )}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 pr-4">
            <h2 className="text-lg font-bold truncate">
              {displayName}
            </h2>
            <p className="text-[11px] text-gray-300 leading-snug mt-0.5 truncate">
              {displaySchool} <br />
              {displayBoard ? `(${displayBoard}) | ` : ""}{displayClass}
            </p>
            <span className="text-[10px] font-bold text-[#BADA55] uppercase tracking-widest mt-1 block">
              Top 10%
            </span>
          </div>
        </div>

        {/* ─── Right Side Stack ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col justify-center gap-1.5 lg:col-span-2 xl:col-span-3 h-24">
          {/* ─── Tabs ─────────────────────────────────────────────────────── */}
          <div className="flex items-center justify-around py-1 bg-[#ECECED] rounded-tr-full rounded-br-full shadow w-full">
            <h1 className="text-[#00bcd4] font-black text-lg tracking-tight whitespace-nowrap hidden lg:hidden xl:block">
              My Dashboard
            </h1>
            {tabs.map((tab) => {
              if (tab.key === "subject") {
                return (
                  <div key={tab.key} className="relative" ref={subjectDropdownRef}>
                    <button
                      onClick={() => {
                        onTabChange(tab.key);
                        // If no subject is selected yet, force select the first one when the tab is clicked
                        if (!selectedSubject && subjectsList.length > 0) {
                          onSubjectSelect(subjectsList[0].subject_name);
                        }
                        setShowDropdown(!showDropdown);
                        setShowExamDropdown(false);
                      }}
                      className={`px-2 py-1 flex items-center rounded-full text-lg font-bold ${activeTab === tab.key
                        ? "bg-[#E59003] text-white px-6"
                        : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                      {activeTab === "subject" && selectedSubject ? selectedSubject : tab.name}
                      <span className="material-symbols-outlined ml-1">
                        keyboard_arrow_down
                      </span>
                      <span className="ml-1.5 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                        {Object.values(notifications).reduce((acc, curr) => acc + curr, 0)}
                      </span>
                    </button>

                    {showDropdown && (
                      <div
                        className="absolute top-12 left-0 bg-white shadow-lg rounded-lg w-full z-50 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {subjectsList.length > 0 ? (
                          subjectsList.map((sub) => {
                            const count = notifications[sub.subject_name];
                            return (
                              <div
                                key={sub.subject_id}
                                onClick={() => {
                                  onSubjectSelect(sub.subject_name);
                                  setShowDropdown(false);
                                }}
                                className={`flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer font-medium transition-colors ${selectedSubject === sub.subject_name
                                  ? "bg-lime-50 text-lime-800"
                                  : "text-gray-700 hover:bg-gray-100"
                                  }`}
                              >
                                <span>{sub.subject_name}</span>
                                <div className="flex items-center gap-2">
                                  {/* ✅ Number Badge - Always show even if 0 */}
                                  <span className="flex items-center justify-center bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full shadow-sm">
                                    {count || 0}
                                  </span>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="px-4 py-2.5 text-sm text-left text-gray-400 italic">
                            No subjects found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              }

              if (tab.key === "exam") {
                return (
                  <div key={tab.key} className="relative" ref={examDropdownRef}>
                    <button
                      onClick={() => {
                        onTabChange(tab.key);
                        if (!selectedExam) {
                          onExamSelect(examList[0]);
                        }
                        setShowExamDropdown(!showExamDropdown);
                        setShowDropdown(false);
                      }}
                      className={`px-2 py-1 flex items-center rounded-full text-lg font-bold ${activeTab === tab.key
                        ? "bg-[#E59003] text-white px-6"
                        : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                      {activeTab === "exam" && selectedExam ? selectedExam : tab.name}
                      <span className="material-symbols-outlined ml-1">
                        keyboard_arrow_down
                      </span>
                      <span className="ml-1.5 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                        {mockCount}
                      </span>
                    </button>

                    {showExamDropdown && (
                      <div
                        className="absolute top-12 left-0 bg-white shadow-lg rounded-lg w-full z-50 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {examList.length > 0 ? (
                          examList.map((exam, i) => (
                            <div
                              key={i}
                              onClick={() => {
                                onExamSelect(exam);
                                setShowExamDropdown(false);
                              }}
                              className={`flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer font-medium transition-colors ${selectedExam === exam
                                ? "bg-lime-100 text-lime-800"
                                : "text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                              <span>{exam}</span>
                              {selectedExam === exam && (
                                <span className="material-symbols-outlined text-lime-600 text-base">check</span>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-2.5 text-sm text-left text-gray-400 italic">
                            No mocks available
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              }

              // Other tabs (normal)
              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    onTabChange(tab.key);
                    setShowDropdown(false);
                    setShowExamDropdown(false);
                  }}
                  className={`px-2 py-1 rounded-full text-lg font-bold ${activeTab === tab.key
                    ? "bg-[#E59003] text-white px-6"
                    : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  {tab.name}
                </button>
              );
            })}
          </div>

          {/* ─── Mock KPIs (Renders below tabs) ─────────────────────────── */}
          {activeTab === "exam" && mockData.length > 0 && (
            <div className="flex items-center justify-between pl-4 pr-2 w-full animate-in slide-in-from-top-2 duration-300">
              {(() => {
                const mockIndex = examList.indexOf(selectedExam);
                const currentMock = mockIndex >= 0 ? mockData[mockIndex] : mockData[mockData.length - 1];
                if (!currentMock) return null;

                const attemptDate = new Date(currentMock.attempt_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' });
                const overallScore = Math.round(currentMock.overall_score || 0);
                const accuracyRate = Math.round(currentMock.accuracy_rate || 0);
                // The screenshot uses 'min', but the actual data is in seconds (e.g. 15.69s). 
                // Displaying as 'sec' matches the Difficulty Matrix below it.
                const avgTime = Number(currentMock.avg_time_per_question || 0).toFixed(1);

                return (
                  <>
                    <div className="flex flex-col">
                      <h2 className="text-lg font-bold text-[#212B36] tracking-tight">{selectedExam || `Mock: M${mockData.length.toString().padStart(2, '0')}`}</h2>
                      <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{attemptDate}</p>
                    </div>

                    <div className="text-center">
                      <h3 className="text-[26px] font-normal text-[#637381] flex items-baseline justify-center">
                        {overallScore}<span className="text-base ml-0.5">%</span>
                      </h3>
                      <p className="text-[10px] font-extrabold text-[#212B36] uppercase tracking-widest mt-0.5">Overall Score</p>
                    </div>

                    <div className="text-center">
                      <h3 className="text-[26px] font-normal text-[#637381] flex items-baseline justify-center">
                        {accuracyRate}<span className="text-base ml-0.5">%</span>
                      </h3>
                      <p className="text-[10px] font-extrabold text-[#212B36] uppercase tracking-widest mt-0.5">Accuracy Rate</p>
                    </div>

                    <div className="text-center pr-4">
                      <h3 className="text-[26px] font-normal text-[#637381] flex items-baseline justify-center">
                        {avgTime}<span className="text-base ml-1 text-gray-500 font-normal">sec</span>
                      </h3>
                      <p className="text-[10px] font-extrabold text-[#212B36] uppercase tracking-widest mt-0.5">Average/Question</p>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </>
  );
};