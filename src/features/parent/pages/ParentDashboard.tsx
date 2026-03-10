import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import IconChat from "../../../assets/icon/chat2.svg";
import IconLamb from "../../../assets/icon/lamb.svg";
// import Apiservices from "../../../services/ApiServices";
import ApiServices from "../../../services/ApiServices";
import Chat from "../../auth/modal/chat";

const ParentDashboard: React.FC = () => {
  // const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  // Children dropdown
  const [children, setChildren] = useState<
    { full_name: string; student_id: number; username: string }[]
  >([]);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  // const [childrenStatus, setChildrenStatus] = useState<string>("Loading children...");

  // Student data
  const [studentData, setStudentData] = useState({
    name: "User",
    school: "",
    board: "",
    class: "",
    subjects: "",
    subjectsArray: [] as any[],
    daysLeft: 0,
    examName: "Annual Exam",
    progressScore: 0,
    scienceAvg: 0,
    mathematicsScore: 0,
  });

  // Analytics Data State
  const [analyticsData, setAnalyticsData] = useState<any>({
    confidence: [],
    consistency: 0,
    examReadiness: 0,
    pendingTasks: [],
    subjectScores: [],
    strengths: [],
    improvements: [],
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setProfileImage(previewUrl);

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await ApiServices.uploadProfilePicture(formData);

      if (response.data?.status === "success") {
        // console.log("Upload success");
      }
    } catch (err) {
      // console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const fetchProfileImage = async () => {
    try {
      const response = await ApiServices.getUserProfileImage();

      if (response.data?.status === "success" && response.data?.data?.image) {
        setProfileImage(response.data.data.image); // base64 image
      }
    } catch (error) {
      // console.error("Failed to fetch profile image", error);
    }
  };

  useEffect(() => {
    // Fetch children list for the parent
    const fetchChildren = async () => {
      try {
        // console.log("Fetching children...");
        // setChildrenStatus("Fetching...");
        const res = await ApiServices.getParentChildren();
        // console.log("Children response:", res.data);
        if (res.data?.status === "success" || res.data?.code === 200) {
          const list = res.data.data || [];
          setChildren(list);
          if (list.length > 0) {
            setSelectedChildId(list[0].student_id);
            // setChildrenStatus("");
          } else {
            // setChildrenStatus("No children found in data array.");
            setIsLoading(false);
          }
        } else {
          // setChildrenStatus(`Failed with status: ${res.data?.status || 'unknown'}`);
          setIsLoading(false);
        }
      } catch (err: any) {
        // console.error("Failed to fetch children", err);
        // setChildrenStatus(`Error: ${err.message}`);
        setIsLoading(false);
      }
    };
    fetchChildren();
    fetchProfileImage();
  }, []);

  useEffect(() => {
    if (selectedChildId === null) return;

    const fetchDashboardData = async (studentId: number) => {
      try {
        // 1. Fetch Basic Student Info & Planner Stats
        const response = await ApiServices.getStudentLearningPlanner();
        if (response.data?.status === "success") {
          const stats = response.data.data.stats;
          setStudentData({
            name: stats.student_name,
            school: stats.institute_name,
            board: stats.board_name,
            class: stats.class_name,
            subjects: "",
            subjectsArray: [],
            daysLeft: stats.days_left,
            // examName: `${stats.board_name} Annual Exam`,
            examName: `Annual Exam`,
            progressScore:
              stats.chapters_assigned > 0
                ? Math.round(
                    (stats.completed_count / stats.chapters_assigned) * 100,
                  )
                : 0,
            scienceAvg: 0, // Will be updated by analytics API
            mathematicsScore: 0, // Will be updated by analytics API
          });
        }

        // 2. Fetch Analytics Data in Parallel
        const [
          confidenceRes,
          progressRes,
          consistencyRes,
          readinessRes,
          pendingRes,
          scoresRes,
          strengthRes,
        ] = await Promise.all([
          ApiServices.getParentConfidence(studentId),
          ApiServices.getAnalyticsProgressingAbility(),
          ApiServices.getParentConsistency(studentId),
          ApiServices.getParentExamReadiness(studentId),
          ApiServices.getAnalyticsPendingTasks(),
          ApiServices.getParentAverageScore(studentId),
          ApiServices.getParentStrengthWeakness(studentId),
        ]);

        // Process Subject Scores for Header (Science Avg & Math)
        const scores = scoresRes.data?.data || [];
        // console.log('Fetched subject scores:', scores);
        const subjectNames = scores.map((s: any) => s.subject_name).join(", ");

        const mathScore =
          scores.find((s: any) => s.subject_name === "Mathematics")
            ?.average_percentage || 0;

        // Process Strengths & Improvements based on Strength API
        const strengthsData = strengthRes.data?.data?.strengths || [];
        const weaknessesData = strengthRes.data?.data?.weaknesses || [];
        const derivedStrengths = strengthsData
          .slice(0, 5)
          .map((s: any) => s.chapter_name);
        const derivedImprovements = weaknessesData
          .slice(0, 5)
          .map((s: any) => s.chapter_name);

        const confidenceList = confidenceRes.data?.data || [];

        // Calculate Science Average (Physics, Chemistry, Biology)
        const scienceSubjects = ["Physics", "Chemistry", "Biology"];
        const scienceScores = scores.filter((s: any) =>
          scienceSubjects.includes(s.subject_name),
        );
        const scienceAvg = scienceScores.length
          ? scienceScores.reduce(
              (acc: number, curr: any) => acc + curr.average_percentage,
              0,
            ) / scienceScores.length
          : 0;

        // Update Student Data with new scores and progress
        setStudentData((prev) => ({
          ...prev,
          progressScore:
            progressRes.data?.data?.progress_percentage || prev.progressScore,
          subjects: subjectNames,
          subjectsArray: scores,
          scienceAvg: Math.round(scienceAvg),
          mathematicsScore: Math.round(mathScore),
        }));

        // Update Analytics State
        setAnalyticsData({
          confidence: confidenceList,
          consistency:
            consistencyRes.data?.data?.consistency_score_percentage || 0,
          examReadiness:
            readinessRes.data?.data?.exam_readiness_percentage || 0,
          pendingTasks: pendingRes.data?.data || [],
          subjectScores: scores,
          strengths: derivedStrengths.length > 0 ? derivedStrengths : [""],
          improvements:
            derivedImprovements.length > 0 ? derivedImprovements : [""],
        });
      } catch (error) {
        // console.error("Failed to fetch dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };

    setIsLoading(true);
    fetchDashboardData(selectedChildId);
  }, [selectedChildId]);

  // Skill ratings (out of 5)
  const skillRatings = [
    { name: "Concept Understanding", rating: 4 },
    { name: "Problem Solving", rating: 3 },
    { name: "Application Questions", rating: 3 },
    { name: "Exam Time Management - 2/5", rating: 2 },
  ];

  // Strengths and improvements
  // const strengths = [
  //   "Biology diagrams & definitions",
  //   "Chemistry theory retention",
  //   "Regular weekly study habit",
  // ];

  // const needsImprovement = [
  //   "Physics numericals",
  //   "Math word problems",
  //   "Application-based questions",
  // ];

  // Star rating component
  const StarRating = ({
    rating,
    maxRating = 5,
  }: {
    rating: number;
    maxRating?: number;
  }) => (
    <div className="flex gap-0.5">
      {[...Array(maxRating)].map((_, i) => (
        <span
          key={i}
          style={{ fontVariationSettings: "'wght' 300, 'opsz' 20" }}
          className={`material-symbols-outlined text-sm ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
        >
          star
        </span>
      ))}
    </div>
  );

  const getProgressColor = (value: number) => {
    if (value >= 80) return "bg-green-500";
    if (value >= 65) return "bg-lime-500";
    return "bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400";
  };

  // Get first letter of name for avatar fallback
  const getInitial = () => {
    return studentData.name?.charAt(0).toUpperCase();
  };

  return (
    <div className=" min-h-screen p-6 relative">
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-[#BADA55] rounded-full animate-spin"></div>
            <span className="text-sm text-gray-500 font-medium">
              Loading dashboard...
            </span>
          </div>
        </div>
      )}
      {/* Header Section */}
      <header className="flex flex-wrap justify-between items-start mb-8 gap-6">
        <div className="flex gap-4 items-start">
          {/* Avatar with Upload Badge */}
          <div className="relative group cursor-pointer">
            {/* Avatar Circle */}
            <div className="w-[90px] h-[90px] rounded-full overflow-hidden flex-shrink-0 border-3 border-gray-200 group-hover:border-[#BADA55] transition-colors duration-300 bg-gray-100 flex items-center justify-center">
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-full">
                  <div className="w-8 h-8 border-3 border-gray-200 border-t-[#BADA55] rounded-full animate-spin"></div>
                </div>
              )}
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={() => setProfileImage("")}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#BADA55] to-lime-500 text-white">
                  <span className="text-4xl font-bold">{getInitial()}</span>
                </div>
              )}
            </div>

            {/* Upload Badge - Bottom Right Corner */}
            <button
              onClick={triggerFileInput}
              disabled={uploading}
              className="absolute bottom-0 right-0 bg-[#BADA55] hover:bg-lime-500 disabled:opacity-70 disabled:cursor-not-allowed w-[32px] h-[32px] rounded-full flex items-center justify-center shadow-lg border-2 border-white transition-all duration-300 transform group-hover:scale-110 active:scale-95"
              title="Change profile picture"
            >
              {uploading ? (
                <div className="w-4 h-4 border-2 border-gray-600 border-t-white rounded-full animate-spin"></div>
              ) : (
                <span
                  style={{ fontVariationSettings: "'wght' 600, 'opsz' 20" }}
                  className="material-symbols-outlined text-gray-700 text-lg"
                >
                  photo_camera
                </span>
              )}
            </button>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              aria-label="Upload profile picture"
              disabled={uploading}
            />
          </div>
          {/* Profile Info */}
          <div className="flex flex-col gap-0.5">
            <span className=" text-2xl text-[#ABB3BC] font-bold tracking-wide">
              My Dashboard
            </span>
            <h1 className="text-3xl font-bold text-primary m-0">
              Hi{" "}
              {studentData.name
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}{" "}
              !
            </h1>
            <p className="text-sm text-primary font-medium m-0">
              {studentData.school}
            </p>
            <p className="text-sm text-primary m-0">
              {studentData.board} | {studentData.class}
            </p>
            <p className="text-sm text-primary m-0 break-words max-w-xl">
              Subjects: {studentData.subjects}
            </p>
                <div className="flex flex-col gap-1 mt-4 lg:mt-0 text-left">
          <label className="text-sm text-primary tracking-wider">
            Select Your Child
          </label>
          <div className="relative">
            <select
              value={selectedChildId ?? ""}
              onChange={(e) => setSelectedChildId(Number(e.target.value))}
              className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-1.5 pr-8 text-sm font-medium text-primary shadow-sm focus:outline-none focus:ring-2 focus:ring-[#BADA55] focus:border-[#BADA55] hover:border-[#BADA55] transition-all cursor-pointer min-w-[120px]"
            >
              {children.length === 0 && <option value="">None</option>}
              {children.map((child) => (
                <option key={child.student_id} value={child.student_id} title={child.full_name}>
                  {child.full_name.length > 20 ? child.full_name.substring(0, 20) + '...' : child.full_name}
                </option>
              ))}
            </select>
            {/* <span
              className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none"
              style={{ fontVariationSettings: "'wght' 400, 'opsz' 20" }}
            >
              expand_more
            </span> */}
          </div>
        </div>
          </div>
          
        </div>
        {/* Days Badge - Grouped the number and text together for proper alignment */}

        <div className="flex items-center gap-2 pt-8 pl-10 pr-8 -mr-auto">
          <div className="flex items-center justify-center bg-highlighter w-[80px] h-[80px] rounded-full pl-2">
            <span className="text-3xl font-bold text-red-500 drop-shadow-sm">
              {studentData.daysLeft}
            </span>
          </div>
          <span className="text-xs font-bold text-primary leading-tight">
            Days left for
            <br />
            {/* <strong>{studentData.examName}</strong> */}
            Annual
            <br />
            Exam
          </span>
        </div>

        {/* Progress Badge */}
        <div className="flex items-center gap-4 pr-8 pt-8 pl-10 -mr-auto">
          <div className="relative w-[80px] h-[80px]">
            {/* Yellow circle with diagonal line */}
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="40"
                cy="40"
                r="38"
                fill="#FFED00"
                stroke="#E5D600"
                strokeWidth="1"
              />
              <line
                x1="12"
                y1="68"
                x2="68"
                y2="12"
                stroke="white"
                strokeWidth="3"
              />
            </svg>
            {/* 71 - top left */}
            <span className="absolute top-[12px] left-[18px] text-xl font-bold text-red-500">
              {studentData.progressScore}
            </span>
            {/* 100 - bottom right */}
            <span className="absolute bottom-[12px] right-[8px] text-lg font-bold text-primary">
              100
            </span>
          </div>
          <span className="text-xs font-bold text-primary leading-snug">
            You are
            <br />
            progressing
            <br />
            steadily
          </span>
        </div>

        {/* Children Dropdown */}
    

        {/* Score Badges */}
        <div className="flex items-center pr-2 ml-auto mr-4 mt-11">
          <div className="flex gap-24">
            {studentData.subjectsArray.map((subject: any, index: number) => {
              const subjectScore = analyticsData.subjectScores.find((s: any) => s.subject_name === subject.subject_name)?.average_percentage || 0;
              return (
                <div key={index} className="flex flex-col items-center justify-end text-center min-h-[120px] w-[100px]">
                  <div className="flex items-center justify-center bg-highlighter w-[70px] h-[70px] rounded-full mb-2">
                    <span className="text-xl font-bold text-red-500">
                      {Math.round(subjectScore)}%
                    </span>
                  </div>
                  <span
                    className="block text-xs font-bold text-primary mt-1 uppercase tracking-wider max-w-[100px] break-words whitespace-normal text-center"
                    style={{ wordBreak: 'break-word', lineHeight: '1.2', minHeight: '38px', display: 'inline-block' }}
                  >
                    {subject.subject_name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <section>
          <div className="border-t-4 border-[#555555] mb-2 w-[600px]"></div>

          {/* <h2 className="text-base font-bold text-gray-800 uppercase tracking-wide">
            Strengths & Improvement Areas
          </h2> */}

          <div className="grid grid-cols-2 gap-8 mb-2">
            {/* Skill Ratings */}
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-2">
                Skill Rating
              </h3>
              <ul className="list-none p-0 m-0">
                {skillRatings.map((skill, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center py-0.2 text-xs text-gray-600"
                  >
                    <span>• {skill.name}</span>
                    {/* Removed the conditional check to only show the StarRating component */}
                    <StarRating rating={skill.rating} />
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-2">
                Subject Confidence Sliders
              </h3>
              <ul className="list-none p-0 m-0">
                {analyticsData.confidence.map((subject: any, index: number) => (
                  <li
                    key={index}
                    className="flex justify-between items-center py-1 text-xs text-gray-600"
                  >
                    <span>• {subject.subject_name}</span>
                    {/* Percentage value aligned to the right, matching the StarRating position */}
                    <span className="font-bold text-gray-800 w-10 text-right pr-20">
                      {Math.round(subject.confidence_score)}%
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 flex justify-between items-center w-full pr-10">
            {/* Left Side: The question text */}
            <p className="text-sm text-primary font-bold">
              Describe what you find difficult or easy?
            </p>

            {/* Right Side: The action button */}
            {/* <button
                            onClick={() => navigate('/parent-material')}
                            className="px-6 py-2.5 bg-[#b0cb1f] text-gray-900 font-semibold rounded-full hover:bg-[#c5de3a] transition-colors shadow-sm"
                        >
                            View Study Materials
                        </button> */}
            {/* <button
                            onClick={() => navigate('/parent/parentlearning-planner')}
                            className="px-6 py-2.5 bg-[#b0cb1f] text-gray-900 font-semibold rounded-full hover:bg-[#c5de3a] transition-colors shadow-sm"
                        >
                            View Learning Planner
                        </button> */}
          </div>
        </section>
        <section className="flex justify-between items-start gap-8 pt-2">
          {/* Left Side: Title and Insight */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-800 leading-tight mb-1">
              Academic
              <br />
              Readiness Score
            </h2>

            <div className="flex gap-4 items-center">
              <div className="p-2.5 bg-gray-100 rounded-full shadow-sm flex items-center justify-center">
                <img src={IconLamb} alt="Insight" className="w-12 h-12" />
              </div>
              <p className="text-sm font-bold text-cyan-600 leading-tight">
                Focus on Physics numericals
                <br />
                to boost your overall score
              </p>
            </div>
          </div>

          {/* Right Side: The Two Large Score Circles */}
          <div className="flex gap-14 items-center pl-2 -mr-auto mt-8">
            <div className="text-center relative ">
              <div className="flex items-center justify-center bg-highlighter w-[70px] h-[70px] rounded-full mx-auto">
                <span className=" text-xl font-bold text-red-500">
                  {Math.round(analyticsData.consistency)}%
                </span>
              </div>
              <span className="block text-xs font-bold text-primary mt-3 uppercase tracking-wider">
                Consistency
              </span>
            </div>

            <div className="text-center relative pr-4">
              <div className="flex items-center justify-center bg-highlighter w-[70px] h-[70px] rounded-full mx-auto">
                <span className="text-xl font-bold text-red-500">
                  {Math.round(analyticsData.examReadiness)}%
                </span>
              </div>
              <span className="block text-xs font-bold text-primary mt-3 uppercase tracking-wider">
                Exam Readiness
              </span>
            </div>
          </div>
        </section>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <section>
          <h2 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b-4 border-[#555555]">
            Subject Performance Snapshot
          </h2>
          <div className="mb-4">
            {analyticsData.subjectScores.map((subject: any, index: number) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <span className="w-20 text-xs text-gray-800 flex-shrink-0">
                  {subject.subject_name}
                </span>
                <div className="flex-1 h-[18px] bg-gray-200 rounded overflow-hidden">
                  <div
                    className={`h-full rounded transition-all duration-500 ${getProgressColor(subject.average_percentage)}`}
                    style={{ width: `${subject.average_percentage}%` }}
                  ></div>
                </div>
                <span className="w-10 text-xs text-gray-800 text-right flex-shrink-0">
                  {Math.round(subject.average_percentage)}%
                </span>
              </div>
            ))}
          </div>
          <button className="bg-gradient-to-r from-lime-500 to-lime-600 text-primary border-none px-6 py-2.5 rounded-full text-xs font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-lime-500/40">
            Detailed Analysis
          </button>
        </section>
        <section>
          <h2 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b-4 border-[#555555]">
            Strengths & Improvement Areas
          </h2>
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-2">
                Strengths
              </h3>
              <ul className="list-none p-0 m-0">
                {analyticsData.strengths.map((item: string, index: number) => (
                  <li
                    key={index}
                    className="text-xs text-gray-500 py-0.5 leading-relaxed"
                  >
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-2">
                Needs Improvement
              </h3>
              <ul className="list-none p-0 m-0">
                {analyticsData.improvements.map(
                  (item: string, index: number) => (
                    <li
                      key={index}
                      className="text-xs text-gray-500 py-0.5 leading-relaxed"
                    >
                      • {item}
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>
          <button className="bg-gradient-to-r from-lime-300 to-lime-500 text-primary border-none px-6 py-2.5 rounded-full text-xs font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-lime-500/40">
            Start Recommended Practice
          </button>
        </section>
        <section>
          <h2 className="text-base font-bold text-gray-800 mb-4 pb-2 border-b-4 border-[#555555]">
            Your next best actions
          </h2>
          <ul className="list-none p-0 m-0 mb-4">
            {analyticsData.pendingTasks
              .slice(0, 5)
              .map((action: any, index: number) => (
                <li
                  key={index}
                  className="text-xs text-gray-500 py-1 leading-relaxed"
                >
                  {action.task_name}{" "}
                  <span className="text-[10px] text-gray-400">
                    ({action.subject_name})
                  </span>
                </li>
              ))}
          </ul>
          <div className="flex gap-3 pt-4">
            <button className="bg-gradient-to-r from-lime-300 to-lime-500 text-primary border-none px-6 py-2.5 rounded-full text-xs font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-lime-500/40">
              Guide Me Now
            </button>
            <button className="bg-gray-800 text-white border-none px-6 py-2.5 rounded-full text-xs font-semibold cursor-pointer transition-all duration-300 hover:bg-gray-700 hover:-translate-y-0.5">
              Remind Me Later
            </button>
          </div>
        </section>
      </div>

      <div className="fixed right-[1%] top-[80%] -translate-y-1/2 z-[100]">
        <button
          onClick={() => setIsChatOpen(true)}
          aria-label="Open chat"
          className="p-0 bg-transparent border-0 cursor-pointer"
        >
          <img src={IconChat} alt="Chat" className="w-[95px]" />
        </button>
      </div>
      {isChatOpen && <Chat onClose={() => setIsChatOpen(false)} />}
    </div>
  );
};

export default ParentDashboard;
