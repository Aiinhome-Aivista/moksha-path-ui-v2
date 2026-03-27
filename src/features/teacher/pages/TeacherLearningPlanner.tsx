import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import IconChat from "../../../assets/icon/chat2.svg";
import ApiServices from "../../../services/ApiServices";
import Chat from "../../auth/modal/chat";
import { Calendar, Upload, Save, FileText, FileSpreadsheet, Link, X } from "lucide-react";
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
    testMaterial: [] as { name: string; type: "pdf" | "excel" | "link" }[],
    practiceMaterial: [] as { name: string; type: "pdf" | "excel" | "link" }[] ,
  },
  {
    id: 2,
    chapter: "Algebra",
    startDate: "--",
    endDate: "--",
    progress: 85,
    completed: false,
    testMaterial: [] as { name: string; type: "pdf" | "excel" | "link" }[],
    practiceMaterial: [] as { name: string; type: "pdf" | "excel" | "link" }[] ,
  },
  {
    id: 3,
    chapter: "Logarithm",
    startDate: "--",
    endDate: "--",
    progress: 58,
    completed: false,
    testMaterial: [] as { name: string; type: "pdf" | "excel" | "link" }[],
    practiceMaterial: [] as { name: string; type: "pdf" | "excel" | "link" }[] ,
  },
  {
    id: 4,
    chapter: "Geometry",
    startDate: "--",
    endDate: "--",
    progress: 74,
    completed: false,
    testMaterial: [] as { name: string; type: "pdf" | "excel" | "link" }[],
    practiceMaterial: [] as { name: string; type: "pdf" | "excel" | "link" }[] ,
  },
  {
    id: 5,
    chapter: "Trigonometry",
    startDate: "--",
    endDate: "--",
    progress: 45,
    completed: false,
    testMaterial: [] as { name: string; type: "pdf" | "excel" | "link" }[],
    practiceMaterial: [] as { name: string; type: "pdf" | "excel" | "link" }[] ,
  },
  {
    id: 6,
    chapter: "Trigonometry",
    startDate: "--",
    endDate: "--",
    progress: 45,
    completed: false,
    testMaterial: [] as { name: string; type: "pdf" | "excel" | "link" }[],
    practiceMaterial: [] as { name: string; type: "pdf" | "excel" }[] ,
  },
];

const TeacherLearningPlanner: React.FC = () => {
  const [subjects, setSubjects] = useState<ApiSubjectPlan[]>([]);
  const [activeSubject, setActiveSubject] = useState("");

  const [classOptions, setClassOptions] = useState<string[]>([]);
  const [sectionOptions, setSectionOptions] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");

  const [selectionModal, setSelectionModal] = useState<{ id: number } | null>(null);
  const [isMockModalOpen, setIsMockModalOpen] = useState(false);
  const [selectedMockChapterIds, setSelectedMockChapterIds] = useState<number[]>([]);
  const [demoChapters, setDemoChapters] = useState(demoChaptersData);

  useEffect(() => {
    if (isMockModalOpen) {
      const completedIds = demoChapters.filter((ch) => ch.completed).map((ch) => ch.id);
      setSelectedMockChapterIds(completedIds);
    }
  }, [isMockModalOpen, demoChapters]);

  const [uploadModal, setUploadModal] = useState<{
    id: number;
    field: "testMaterial" | "practiceMaterial";
  } | null>(null);

  const [namingModal, setNamingModal] = useState<{
    id: number;
    field: "testMaterial" | "practiceMaterial";
    file?: File;
    isLink?: boolean;
  } | null>(null);
  const [namingValue, setNamingValue] = useState("");

  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(
    new Set(),
  );

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
    const file = e.target.files?.[0];
    if (file) {
      setNamingModal({ id, field, file });
      setNamingValue(file.name);
    }
    e.target.value = "";
  };

  const handleLinkUpload = (
    id: number,
    field: "testMaterial" | "practiceMaterial",
  ) => {
    setNamingModal({ id, field, isLink: true });
    setNamingValue("");
  };

  const confirmNaming = () => {
    if (!namingModal) return;
    const { id, field, file } = namingModal;
    const finalName = namingValue.trim() || (file ? file.name : "Link");

    const type = file
      ? file.name.endsWith(".xls") ||
        file.name.endsWith(".xlsx") ||
        file.type === "application/vnd.ms-excel" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ? "excel"
        : "pdf"
      : "link";

    setDemoChapters((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
              ...row,
              [field]: [...(row[field] as any[]), { name: finalName, type }],
            }
          : row,
      ),
    );
    setNamingModal(null);
    setNamingValue("");
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
      setIsLoading(true);
      const response = await ApiServices.getTeacherPlannerData();
      const result = response.data;

      if (result.status === "success") {
        const data = result.data;
        const plans = data.subject_wise_chapters || [];

        setSubjects(plans);

        // Map stats for header
        setStats({
          teacher_name: data.teacher?.name,
          institute_name: data.institute?.name,
          board_name: data.board?.name,
          class_name: data.dropdowns?.classes?.[0]?.name,
          section_name: data.dropdowns?.sections?.[0]?.name,
        });

        // Map dropdown options
        if (data.dropdowns) {
          setClassOptions(data.dropdowns.classes?.map((c: any) => c.name) || []);
          setSectionOptions(
            data.dropdowns.sections?.map((s: any) => s.name) || [],
          );
        }

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

  // Sync demoChapters with dynamic API data
  useEffect(() => {
    const activePlan = subjects.find((s) => s.subject_name === activeSubject);
    if (activePlan) {
      const mappedChapters = activePlan.chapters.map((ch: any) => {
        // Find existing demo chapter data if any (to preserve materials or local changes)
        const existing = demoChapters.find((d) => d.id === ch.id);
        return {
          id: ch.id,
          chapter: ch.name || ch.chapter_name,
          startDate: existing?.startDate || "--",
          endDate: existing?.endDate || "--",
          progress: existing?.progress || 0,
          completed: existing?.completed || false,
          testMaterial: existing?.testMaterial || [],
          practiceMaterial: existing?.practiceMaterial || [],
        };
      });
      setDemoChapters(mappedChapters);
    } else if (subjects.length > 0) {
      // Fallback if active subject not found in current subjects
      setDemoChapters([]);
    }
  }, [activeSubject, subjects]);

  useEffect(() => {
    if (stats) {
      if (!selectedClass && stats.class_name)
        setSelectedClass(stats.class_name);
      if (!selectedSection && stats.section_name)
        setSelectedSection(stats.section_name);
    }
  }, [stats]);

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
                {stats.institute_name} {stats.board_name && `| ${stats.board_name}`}
              </p>
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex gap-2">
                  <div className="m-0">
                    <SearchableSelect
                      options={classOptions.map((c) => ({
                        label: c,
                        value: c,
                      }))}
                      value={selectedClass}
                      onChange={(val) => setSelectedClass(val as string)}
                      placeholder="Select Class"
                      className="px-2 py-2 appearance-none bg-white border border-gray-200 rounded-lg text-sm text-primary font-medium focus:outline-none focus:ring-2 focus:ring-[#BADA55]/60 shadow-sm"
                    />
                  </div>
                  <div className="px-2">
                    <SearchableSelect
                      options={sectionOptions.map((s) => ({
                        label: s,
                        value: s,
                      }))}
                      value={selectedSection}
                      onChange={(val) => setSelectedSection(val as string)}
                      placeholder="Select Section"
                      className="px-2 py-2 appearance-none bg-white border border-gray-200 rounded-lg text-sm text-primary font-medium focus:outline-none focus:ring-2 focus:ring-[#BADA55]/60 shadow-sm"
                    />
                  </div>
                  <div className="m-0">
                    <SearchableSelect
                      options={subjects.map((s) => ({
                        label: s.subject_name,
                        value: s.subject_name,
                      }))}
                      value={activeSubject}
                      onChange={(val) => setActiveSubject(val as string)}
                      placeholder="Select Subject"
                       className="px-2 py-2 appearance-none bg-white border border-gray-200 rounded-lg text-sm text-primary font-medium focus:outline-none focus:ring-2 focus:ring-[#BADA55]/60 shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Badges */}
        <div className="flex justify-end items-end gap-20 relative top-20">
          <button 
            onClick={() => setIsMockModalOpen(true)}
            className="w-full p-3 bg-button-primary text-primary rounded-lg font-bold hover:bg-opacity-90 transition-colors border-none cursor-pointer"
          >
           Generate Overall Mock
          </button>
        </div>
      </header>
 
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
                Upload Material
              </th>
              <th className="text-center py-3 px-2 font-bold text-primary text-lg whitespace-nowrap">
                Completion Status
              </th>
              <th className="text-center py-3 px-2 font-bold text-primary text-lg whitespace-nowrap">Action</th>
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
                    <button
                      onClick={() => setSelectionModal({ id: row.id })}
                      className="cursor-pointer flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded-md transition-colors border-none"
                    >
                      <Upload size={12} />
                      <span>Upload</span>
                    </button>
                    <input
                      id={`file-test-${row.id}`}
                      type="file"
                      multiple
                      accept=".pdf,.xls,.xlsx"
                      className="hidden"
                      onChange={(e) =>
                        handleFileUpload(row.id, "testMaterial", e)
                      }
                    />
                    <input
                      id={`file-prac-${row.id}`}
                      type="file"
                      multiple
                      accept=".pdf,.xls,.xlsx"
                      className="hidden"
                      onChange={(e) =>
                        handleFileUpload(row.id, "practiceMaterial", e)
                      }
                    />
                    {row.testMaterial.length > 0 && (
                      <div className="flex flex-col mt-1 gap-1">
                        <span className="text-[9px] font-bold text-gray-400 uppercase">Study</span>
                        {row.testMaterial.map((mat, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-1 text-[10px] text-gray-500 max-w-[120px]"
                            title={mat.name}
                          >
                            {mat.type === "pdf" && <FileText size={10} />}
                            {mat.type === "excel" && <FileSpreadsheet size={10} className="text-green-600" />}
                            {mat.type === "link" && <Link size={10} />}
                            <span className="truncate">{mat.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {row.practiceMaterial.length > 0 && (
                      <div className="flex flex-col mt-2 gap-1 border-t border-gray-100 pt-1">
                        <span className="text-[9px] font-bold text-gray-400 uppercase">Practice</span>
                        {row.practiceMaterial.map((mat, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-1 text-[10px] text-gray-500 max-w-[120px]"
                            title={mat.name}
                          >
                            {mat.type === "pdf" && <FileText size={10} />}
                            {mat.type === "excel" && <FileSpreadsheet size={10} className="text-green-600" />}
                            <span className="truncate">{mat.name}</span>
                          </div>
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
                  <button className="p-2 inline-flex items-center px-2 py-0.5 rounded-full text-sm font-medium text-[#b9b7b7]">
                    <Save size={20} strokeWidth={2} />
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

      {/* Step 1: Material Type Selection Modal */}
      {selectionModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setSelectionModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 border-none bg-transparent cursor-pointer transition-colors"
            >
              <X size={20} />
            </button>
            
            <h3 className="text-xl font-bold text-primary mb-6 text-center">Select Material Type</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => {
                  setUploadModal({ id: selectionModal.id, field: "testMaterial" });
                  setSelectionModal(null);
                }}
                className="flex items-center justify-center gap-3 p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all border border-blue-200 font-bold cursor-pointer"
              >
                <FileText size={20} />
                <span>Study Material</span>
              </button>
              
              <button
                onClick={() => {
                  const inputId = `file-prac-${selectionModal.id}`;
                  document.getElementById(inputId)?.click();
                  setSelectionModal(null);
                }}
                className="flex items-center justify-center gap-3 p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-all border border-green-200 font-bold cursor-pointer"
              >
                <FileSpreadsheet size={20} />
                <span>Practice Material</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Study Material Source Modal */}
      {uploadModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setUploadModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 border-none bg-transparent cursor-pointer transition-colors"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold text-primary mb-6 text-center">Study Material Source</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => {
                  const inputId = uploadModal.field === "testMaterial" ? `file-test-${uploadModal.id}` : `file-prac-${uploadModal.id}`;
                  document.getElementById(inputId)?.click();
                  setUploadModal(null);
                }}
                className="flex items-center justify-center gap-3 p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all border border-blue-200 font-bold cursor-pointer"
              >
                <FileText size={20} />
                <span>Upload Local File</span>
              </button>
              
              <button
                onClick={() => {
                  handleLinkUpload(uploadModal.id, uploadModal.field);
                  setUploadModal(null);
                }}
                className="flex items-center justify-center gap-3 p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-all border border-green-200 font-bold cursor-pointer"
              >
                <Link size={20} />
                <span>Add External Link</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overall Mock Selection Modal */}
      {isMockModalOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsMockModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 bg-transparent hover:bg-gray-100 rounded-full transition-all z-10 border-none cursor-pointer"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-2xl font-bold text-primary mb-6">Generate Overall Mock</h2>
            
            <div className="max-h-60 overflow-y-auto custom-scrollbar border border-gray-200 rounded-lg mb-6">
              <table className="w-full border-collapse">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="py-3 px-4 text-left font-bold text-gray-600 border-b w-20">Select</th>
                    <th className="py-3 px-4 text-left font-bold text-gray-600 border-b">Chapter Name</th>
                  </tr>
                </thead>
                <tbody>
                  {demoChapters.map((ch) => (
                    <tr key={ch.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedMockChapterIds.includes(ch.id)}
                          disabled={!ch.completed}
                          onChange={() => {
                            setSelectedMockChapterIds((prev) =>
                              prev.includes(ch.id)
                                ? prev.filter((id) => id !== ch.id)
                                : [...prev, ch.id]
                            );
                          }}
                          className={`w-4 h-4 accent-[#BADA55] ${!ch.completed ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                        />
                      </td>
                      <td className={`py-3 px-4 text-sm font-medium ${!ch.completed ? 'text-gray-400 italic' : 'text-gray-700'}`}>
                        {ch.chapter} {!ch.completed && "(Incomplete)"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsMockModalOpen(false)}
                className="px-6 py-2 rounded-lg font-bold text-gray-500 hover:bg-gray-100 transition-colors border-none cursor-pointer bg-transparent"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsMockModalOpen(false)}
                className="px-8 py-3 bg-button-primary text-primary rounded-lg font-bold hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg border-none cursor-pointer"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Naming / Link Modal */}
      {namingModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-sm p-6 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setNamingModal(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 bg-transparent hover:bg-gray-100 rounded-full transition-all z-10  border-none cursor-pointer"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold text-primary mb-6 text-center">
              {namingModal.isLink ? "Add Link" : "Rename File"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  {namingModal.isLink ? "URL / Link" : "Display Name"}
                </label>
                <input
                  type="text"
                  value={namingValue}
                  onChange={(e) => setNamingValue(e.target.value)}
                  placeholder={namingModal.isLink ? "Enter link..." : "Enter name..."}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#BADA55] transition-all"
                  autoFocus
                />
              </div>

              <button
                onClick={confirmNaming}
                className="w-full py-3 bg-button-primary text-primary rounded-lg font-bold hover:bg-opacity-90 transition-colors border-none cursor-pointer"
              >
                {namingModal.isLink ? "Add Link" : "Confirm Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherLearningPlanner;
