import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import IconChat from "../../../assets/icon/chat2.svg";
import ApiServices from "../../../services/ApiServices";
import Chat from "../../auth/modal/chat";
import { Calendar, Upload } from "lucide-react";
import SearchableSelect from "../../../components/common/SearchableSelect";

// Function to navigate to student materials with stats and selected chapter
const navigateToStudentMaterials = (
  navigate: ReturnType<typeof useNavigate>,
  stats: any,
  subjects: any[],
  selectedChapterId?: number,
) => {
  navigate("/student-materials", {
    state: {
      boardName: stats.board_name,
      className: stats.class_name,
      subjects: subjects.map((s) => s.subject_name),
      subjectWisePlan: subjects,
      stats: stats,
      selectedChapterId: selectedChapterId,
    },
  });
};

const navigateToTests = (
  navigate: ReturnType<typeof useNavigate>,
  stats: any,
  subjects: any[],
  selectedChapterId: number,
  selectedSubjectName: string,
) => {
  const selectedSubject = subjects.find(
    (s) => s.subject_name === selectedSubjectName,
  );

  const selectedChapter = selectedSubject?.chapters.find(
    (ch: any) => ch.chapter_id === selectedChapterId,
  );

  const selectedTopicIds =
    selectedChapter?.topics
      ?.filter((t: any) => t.is_completed) // or your logic
      .map((t: any) => t.topic_id) || [];

  navigate("/teacher-material", {
    state: {
      boardName: stats.board_name,
      className: stats.class_name,
      subjects: subjects.map((s) => s.subject_name),
      subjectWisePlan: subjects,
      stats: stats,
      selectedChapterId: selectedChapterId,
      activeResourceType: "Tests",
      selectedSubjectName: selectedSubjectName,

      // ✅ ADD THIS
      selectedTopicIds: selectedTopicIds,
    },
  });
};
type Priority = "High" | "Medium" | "Low";

interface ApiTopic {
  topic_id: number;
  topic_name: string;
  is_completed: boolean;
  estimated_hours: number;
  status: string;
}

interface ApiChapter {
  chapter_id: number;
  chapter_name: string;
  start_date: string;
  end_date: string;
  start_end_date: string;
  estimated_hours: number;
  remaining_hours: number;
  priority: Priority;
  progress_percentage: number;
  status: string;
  target_completion_days: number;
  topics: ApiTopic[];
}

interface ApiSubjectPlan {
  subject_id: number;
  subject_name: string;
  chapters: ApiChapter[];
}

const demoChaptersData = [
  {
    id: 1,
    chapter: "Set Theory",
    startDate: "--",
    endDate: "--",
    progress: 90,
    completed: false,
    testMaterial: [] as string[],
    practiceMaterial: [] as string[],
  },
  {
    id: 2,
    chapter: "Algebra",
    startDate: "--",
    endDate: "--",
    progress: 85,
    completed: false,
    testMaterial: [] as string[],
    practiceMaterial: [] as string[],
  },
  {
    id: 3,
    chapter: "Logarithm",
    startDate: "--",
    endDate: "--",
    progress: 58,
    completed: false,
    testMaterial: [] as string[],
    practiceMaterial: [] as string[],
  },
  {
    id: 4,
    chapter: "Geometry",
    startDate: "--",
    endDate: "--",
    progress: 74,
    completed: false,
    testMaterial: [] as string[],
    practiceMaterial: [] as string[],
  },
  {
    id: 5,
    chapter: "Trigonometry",
    startDate: "--",
    endDate: "--",
    progress: 45,
    completed: false,
    testMaterial: [] as string[],
    practiceMaterial: [] as string[],
  },
];

const TeacherLearningPlanner: React.FC = () => {
  const [subjects, setSubjects] = useState<ApiSubjectPlan[]>([]);
  const [activeSubject, setActiveSubject] = useState("");

  const [academicHierarchy, setAcademicHierarchy] = useState<any[]>([]);
  const [classOptions, setClassOptions] = useState<string[]>([]);
  const [sectionOptions, setSectionOptions] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");

  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(
    new Set(),
  );
  const [demoChapters, setDemoChapters] = useState(demoChaptersData);

  const toggleDemoChapter = (id: number) => {
    setDemoChapters((prev) =>
      prev.map((ch) =>
        ch.id === id ? { ...ch, completed: !ch.completed } : ch,
      ),
    );
  };

  const handleFileUpload = (
    id: number,
    field: "testMaterial" | "practiceMaterial",
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFileNames = Array.from(files).map((f) => f.name);
      setDemoChapters((prev) =>
        prev.map((row) =>
          row.id === id
            ? {
                ...row,
                [field]: [...(row[field] as string[]), ...newFileNames],
              }
            : row,
        ),
      );
    }
  };

  const today = new Date().toISOString().split("T")[0];

  const handleDateChange = (
    id: number,
    field: "startDate" | "endDate",
    value: string,
  ) => {
    if (!value) return;
    const date = new Date(value);
    const formattedDate = date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    setDemoChapters((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, [field]: formattedDate } : row,
      ),
    );
  };
  const [profileImage, setProfileImage] = useState<string>(" ");
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const navigate = useNavigate();

  const toggleChapterAccordion = (chapterId: number) => {
    setExpandedChapters((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(chapterId)) {
        newSet.delete(chapterId);
      } else {
        newSet.add(chapterId);
      }
      return newSet;
    });
  };

  const fetchLearningPlan = async () => {
    try {
      const response = await ApiServices.getTeacherLearningPlanner();
      const result = response.data;

      if (result.status === "success") {
        const plans = result.data?.subject_wise_plan || [];

        setSubjects(plans);
        setStats(result.data?.stats);

        if (plans.length > 0) {
          setActiveSubject((prev) => prev || plans[0]?.subject_name || "");
        }
      }
    } catch (error) {
      // console.error("Learning Planner Error:", error);
    } finally {
      setIsLoading(false);
    }
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
    fetchLearningPlan();
    fetchProfileImage();
  }, []);

  useEffect(() => {
    const fetchHierarchy = async () => {
      try {
        const res = await ApiServices.getAcademicHierarchy();
        if (res.data?.status === "success" && Array.isArray(res.data.data)) {
          setAcademicHierarchy(res.data.data);
          const classes = Array.from(
            new Set(res.data.data.map((item: any) => item.class_name)),
          ).filter(Boolean) as string[];
          setClassOptions(classes);
        }
      } catch (e) {}
    };
    fetchHierarchy();
  }, []);

  useEffect(() => {
    if (!selectedClass) {
      setSectionOptions([]);
      return;
    }
    const sections = academicHierarchy
      .filter((item: any) => item.class_name === selectedClass)
      .flatMap((item: any) => {
        if (Array.isArray(item.sections)) {
          return item.sections.map((s: any) => s.section_name || s.section);
        }
        return [];
      })
      .filter(Boolean);
    const uniqueSections = Array.from(new Set(sections));
    setSectionOptions(uniqueSections);

    if (selectedSection && !uniqueSections.includes(selectedSection)) {
      setSelectedSection("");
    }
  }, [selectedClass, academicHierarchy]);

  useEffect(() => {
    if (stats) {
      if (!selectedClass && stats.class_name)
        setSelectedClass(stats.class_name);
      if (!selectedSection && stats.section_name)
        setSelectedSection(stats.section_name);
    }
  }, [stats]);

  const updateTopic = async (
    chapterId: number,
    topicId: number,
    isCompleted: boolean,
  ) => {
    const payload = [
      {
        chapter_id: chapterId,
        topic_id: topicId,
        status: isCompleted ? "Pending" : "Completed",
      },
    ];

    try {
      await ApiServices.updateTopicStatus(payload);

      //  Fetch updated data from backend
      await fetchLearningPlan();

      // Update UI locally after success
      setSubjects((prev) =>
        prev.map((sub) => ({
          ...sub,
          chapters: sub.chapters.map((ch) =>
            ch.chapter_id === chapterId
              ? {
                  ...ch,
                  topics: ch.topics.map((t) =>
                    t.topic_id === topicId
                      ? { ...t, is_completed: !isCompleted }
                      : t,
                  ),
                }
              : ch,
          ),
        })),
      );
    } catch (err) {
      // console.error("Update topic failed", err);
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-yellow-400";
    if (progress >= 30) return "bg-orange-500";
    return "bg-red-500";
  };

  // const getNextPriority = (
  //   current: "High" | "Medium" | "Low",
  // ): "High" | "Medium" | "Low" => {
  //   if (current === "High") return "Medium";
  //   if (current === "Medium") return "Low";
  //   return "High";
  // };

  // Get first letter of name for avatar fallback
  const getInitial = () => {
    return (
      stats?.teacher_name?.charAt(0).toUpperCase() ||
      stats?.student_name?.charAt(0).toUpperCase() ||
      ""
    );
  };

  return (
    <div className="min-h-screen p-6 relative">
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-[#BADA55] rounded-full animate-spin"></div>
            <span className="text-sm text-gray-500 font-medium">
              Loading Syllabus planner...
            </span>
          </div>
        </div>
      )}
      {/* Header Section */}
      <header className="flex flex-wrap justify-between items-start gap-6 pb-6">
        <div className="flex gap-4 items-start">
          {/* Avatar */}
          <div className="w-[90px] h-[90px] rounded-full overflow-hidden flex-shrink-0 border-3 border-gray-200 flex items-center justify-center bg-gray-100">
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

          {/* Profile Info */}

          {stats && (
            <div className="flex flex-col gap-0.5 ">
              <span className="text-2xl text-[#ABB3BC] font-bold tracking-wide">
                Syllabus Planner
              </span>
              <h1 className="text-4xl font-bold text-primary m-0">
                Hi{" "}
                {stats.teacher_name
                  ? stats.teacher_name
                      .split(" ")
                      .map(
                        (word: string) =>
                          word.charAt(0).toUpperCase() + word.slice(1),
                      )
                      .join(" ")
                  : ""}{" "}
                !
              </h1>
              <p className="text-sm text-primary font-medium m-0">
                {stats.institute_name}
              </p>
              {/* <p className="text-sm text-primary m-0">{stats.board_name}</p> */}
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex gap-2">
                  <div className="w-40">
                    <SearchableSelect
                      options={classOptions.map((c) => ({
                        label: c,
                        value: c,
                      }))}
                      value={selectedClass}
                      onChange={(val) => setSelectedClass(val as string)}
                      placeholder="Select Class"
                      className="text-sm text-primary m-0"
                    />
                  </div>
                  <div className="w-40">
                    <SearchableSelect
                      options={sectionOptions.map((s) => ({
                        label: s,
                        value: s,
                      }))}
                      value={selectedSection}
                      onChange={(val) => setSelectedSection(val as string)}
                      placeholder="Select Section"
                      className="text-sm text-primary m-0"
                    />
                  </div>
                  <div className="w-60">
                    <SearchableSelect
                      options={subjects.map((s) => ({
                        label: s.subject_name,
                        value: s.subject_name,
                      }))}
                      value={activeSubject}
                      onChange={(val) => setActiveSubject(val as string)}
                      placeholder="Select Subject"
                      className="text-sm text-primary m-0"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Badges */}
        <div className="flex flex-wrap items-center gap-20">
          {stats && (
            <div className="flex items-center gap-4">
              <div className="w-[6rem] h-[6rem] rounded-full bg-yellow flex items-center justify-center">
                <span className="text-4xl font-bold text-red">
                  {stats.days_left}
                </span>
              </div>

              <div className="leading-snug">
                <p className="text-xs font-bold mt-7 text-primary">
                  Days Left for
                  <br />
                  Annual
                  <br />
                  Exam
                </p>
                <br />
                <strong>{stats.examName}</strong>
              </div>
            </div>
          )}
          {stats && (
            <>
              {/* Chapters Assigned */}
              <div className="text-center">
                <div className="w-[4.688rem] h-[4.688rem] rounded-full bg-yellow flex items-center justify-center mx-auto mb-1">
                  <span className="text-lg font-bold text-red">
                    {stats.chapters_assigned_globally}
                  </span>
                </div>
                <p className="text-xs font-medium text-primary">
                  Chapters Assigned
                </p>
              </div>

              {/* Completed */}
              <div className="text-center">
                <div className="w-[4.688rem] h-[4.688rem] rounded-full bg-yellow flex items-center justify-center mx-auto mb-1">
                  <span className="text-lg font-bold text-red">
                    {stats?.completed_count ? stats.completed_count : 0}
                  </span>
                </div>
                <p className="text-xs font-medium text-primary">Completed</p>
              </div>

              {/* Pending */}
              <div className="text-center">
                <div className="w-[4.688rem] h-[4.688rem] rounded-full bg-yellow flex items-center justify-center mx-auto mb-1">
                  <span className="text-lg font-bold text-red">
                    {stats?.pending_count ? stats.pending_count : 0}
                  </span>
                </div>
                <p className="text-xs font-medium text-primary">Pending</p>
              </div>
            </>
          )}
        </div>
      </header>
      <div className="flex flex-wrap gap-3 items-center justify-center mb-6">
        {subjects.map((subject) => (
          <button
            key={subject.subject_name}
            onClick={() => setActiveSubject(subject.subject_name)}
            className={`px-6 py-2.5 rounded-full text-sm font-medium cursor-pointer transition-all duration-300 border-none
      ${
        activeSubject === subject.subject_name
          ? "bg-button-primary text-primary font-semibold"
          : "bg-primary text-white font-semibold"
      }`}
          >
            {subject.subject_name}
          </button>
        ))}

        {/* <div className="ml-auto cursor-pointer p-2">
          <img src="/vec.svg" alt="Filter" />
        </div> */}
      </div>
      <div className="overflow-x-auto mb-6 border-t-4 border-gray-300 ">
        <table className="w-full border-collapse text-sm">
          <thead className="border-b-2 border-gray-300">
            <tr>
              <th className="text-center py-3 px-2 font-bold text-primary text-lg whitespace-nowrap">
                Sl No.
              </th>
              <th className="text-center py-3 px-2 font-bold text-primary text-lg whitespace-nowrap">
                Chapter Name
              </th>
              <th className="text-right py-3 px-2 font-bold text-primary text-lg whitespace-nowrap">
                Start Date
              </th>
              <th className="text-right py-3 px-2 font-bold text-primary text-lg whitespace-nowrap">
                End Date
              </th>
              <th className="text-center py-3 px-2 font-bold text-primary text-lg whitespace-nowrap">
                Study Material
              </th>
              <th className="text-center py-3 px-2 font-bold text-primary text-lg whitespace-nowrap">
                Practice Material
              </th>
              <th className="text-center py-3 px-2 font-bold text-primary text-lg whitespace-nowrap">
                Completion Status
              </th>
              <th className="text-center py-3 px-2 font-bold text-primary text-lg whitespace-nowrap"></th>
            </tr>
          </thead>
          <tbody>
            {demoChapters.map((row, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="py-3 px-2 text-center">{row.id}</td>

                <td className="py-3 px-2 text-center font-medium">
                  {row.chapter}
                </td>

                <td className="py-3 px-2 text-center">
                  <div className="flex justify-end items-center gap-2">
                    {row.startDate || "—"}
                    <label className="relative cursor-pointer">
                      <input
                        type="date"
                        min={today}
                        className="absolute inset-0 opacity-0 w-full h-full z-10 cursor-pointer"
                        onChange={(e) =>
                          handleDateChange(row.id, "startDate", e.target.value)
                        }
                      />
                      <Calendar size={16} className="text-gray-400" />
                    </label>
                  </div>
                </td>

                <td className="py-3 px-2 text-center">
                  <div className="flex justify-end items-center gap-2">
                    {row.endDate || "—"}
                    <label className="relative cursor-pointer">
                      <input
                        type="date"
                        min={today}
                        className="absolute inset-0 opacity-0 w-full h-full z-10 cursor-pointer"
                        onChange={(e) =>
                          handleDateChange(row.id, "endDate", e.target.value)
                        }
                      />
                      <Calendar size={16} className="text-gray-400" />
                    </label>
                  </div>
                </td>

                <td className="py-3 px-2 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <label className="cursor-pointer flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded-md transition-colors">
                      <Upload size={12} />
                      <span>Upload</span>
                      <input
                        type="file"
                        multiple
                        accept=".pdf"
                        className="hidden"
                        onChange={(e) =>
                          handleFileUpload(row.id, "testMaterial", e)
                        }
                      />
                    </label>
                    {row.testMaterial.length > 0 && (
                      <div className="flex flex-col mt-1 gap-1">
                        {row.testMaterial.map((file, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] text-gray-500 truncate max-w-[80px]"
                            title={file}
                          >
                            {file}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </td>

                <td className="py-3 px-2 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <label className="cursor-pointer flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded-md transition-colors">
                      <Upload size={12} />
                      <span>Upload</span>
                      <input
                        type="file"
                        multiple
                        accept=".pdf"
                        className="hidden"
                        onChange={(e) =>
                          handleFileUpload(row.id, "practiceMaterial", e)
                        }
                      />
                    </label>
                    {row.practiceMaterial.length > 0 && (
                      <div className="flex flex-col mt-1 gap-1">
                        {row.practiceMaterial.map((file, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] text-gray-500 truncate max-w-[80px]"
                            title={file}
                          >
                            {file}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </td>

                <td className="py-3 px-2 text-center">
                  <input
                    type="checkbox"
                    checked={row.completed}
                    onChange={() => toggleDemoChapter(row.id)}
                    className="w-4 h-4 cursor-pointer"
                  />
                </td>

                <td className="py-3 px-2 text-center">
                  <button className="p-2 inline-flex items-center px-2 py-0.5 rounded-full text-sm font-medium text-primary">
                    <span className="material-symbols-outlined ">save</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

export default TeacherLearningPlanner;
