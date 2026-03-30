import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import IconChat from "../../../assets/icon/chat2.svg";
import ApiServices from "../../../services/ApiServices";
import Chat from "../../auth/modal/chat";
import { Calendar, Upload, Save, FileText, FileSpreadsheet, Link, X, Loader2 } from "lucide-react";
import SearchableSelect from "../../../components/common/SearchableSelect";
import { useToast } from "../../../app/providers/ToastProvider";

type Priority = "High" | "Medium" | "Low";

interface ApiChapter {
  id: number;
  chapter: string;
  startDate: string;
  endDate: string;
  startDate_raw: string;
  endDate_raw: string;
  progress: number;
  completed: boolean;
  testMaterial: any[];
  practiceMaterial: any[];
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
    startDate_raw: "",
    endDate: "--",
    endDate_raw: "",
    progress: 90,
    completed: false,
    testMaterial: [] as { name: string; type: "pdf" | "excel" | "link" }[],
    practiceMaterial: [] as { name: string; type: "pdf" | "excel" | "link" }[],
  },
  {
    id: 2,
    chapter: "Algebra",
    startDate: "--",
    startDate_raw: "",
    endDate: "--",
    endDate_raw: "",
    progress: 85,
    completed: false,
    testMaterial: [] as { name: string; type: "pdf" | "excel" | "link" }[],
    practiceMaterial: [] as { name: string; type: "pdf" | "excel" | "link" }[],
  },
  {
    id: 3,
    chapter: "Logarithm",
    startDate: "--",
    startDate_raw: "",
    endDate: "--",
    endDate_raw: "",
    progress: 58,
    completed: false,
    testMaterial: [] as { name: string; type: "pdf" | "excel" | "link" }[],
    practiceMaterial: [] as { name: string; type: "pdf" | "excel" | "link" }[],
  },
  {
    id: 4,
    chapter: "Geometry",
    startDate: "--",
    startDate_raw: "",
    endDate: "--",
    endDate_raw: "",
    progress: 74,
    completed: false,
    testMaterial: [] as { name: string; type: "pdf" | "excel" | "link" }[],
    practiceMaterial: [] as { name: string; type: "pdf" | "excel" | "link" }[],
  },
  {
    id: 5,
    chapter: "Trigonometry",
    startDate: "--",
    startDate_raw: "",
    endDate: "--",
    endDate_raw: "",
    progress: 45,
    completed: false,
    testMaterial: [] as { name: string; type: "pdf" | "excel" | "link" }[],
    practiceMaterial: [] as { name: string; type: "pdf" | "excel" | "link" }[],
  },
  {
    id: 6,
    chapter: "Trigonometry",
    startDate: "--",
    startDate_raw: "",
    endDate: "--",
    endDate_raw: "",
    progress: 45,
    completed: false,
    testMaterial: [] as { name: string; type: "pdf" | "excel" | "link" }[],
    practiceMaterial: [] as { name: string; type: "pdf" | "excel" }[],
  },
];

const TeacherLearningPlanner: React.FC = () => {
  const [subjects, setSubjects] = useState<ApiSubjectPlan[]>([]);
  const [activeSubject, setActiveSubject] = useState("");
  const { showToast } = useToast();

  // Changed to store objects so we can access IDs for the API payload
  const [classOptions, setClassOptions] = useState<{ id: number; name: string }[]>([]);
  const [sectionOptions, setSectionOptions] = useState<{ id: number; name: string }[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");

  const [savingChapterId, setSavingChapterId] = useState<number | null>(null);
  const [selectionModal, setSelectionModal] = useState<{ id: number } | null>(null);
  const [isMockModalOpen, setIsMockModalOpen] = useState(false);
  const [selectedMockChapterIds, setSelectedMockChapterIds] = useState<number[]>([]);
  const [demoChapters, setDemoChapters] = useState(demoChaptersData);
const [isGeneratingTest, setIsGeneratingTest] = useState(false);
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

  const toggleDemoChapter = (id: number) => {
    setSubjects((prev) =>
      prev.map((sub) => ({
        ...sub,
        chapters: sub.chapters.map((ch: any) =>
          ch.id === id || ch.chapter_id === id
            ? { ...ch, completed: !ch.completed, is_completed: !ch.completed }
            : ch,
        ),
      })),
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

  const confirmNaming = async () => {
    if (!namingModal) return;
    const { id, field, file, isLink } = namingModal;
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

    setIsLoading(true);

    try {
      const formData = new FormData();

      // 1. Append Required IDs
      formData.append("chapter_id", id.toString());
      formData.append("board_id", stats?.board_id?.toString() || "");
      formData.append("institute_id", stats?.institute_id?.toString() || "");

      const currentClassObj = classOptions.find(c => c.name === selectedClass);
      formData.append("class_id", currentClassObj?.id?.toString() || stats?.class_id?.toString() || "");

      const currentSectionObj = sectionOptions.find(s => s.name === selectedSection);
      formData.append("section_id", currentSectionObj?.id?.toString() || stats?.section_id?.toString() || "");

      const currentSubject = subjects.find(s => s.subject_name === activeSubject);
      formData.append("subject_id", currentSubject?.subject_id?.toString() || "");

      // 2. Append Title
      formData.append("title", finalName);

      // 3. Handle File vs Link correctly
      if (isLink) {
        formData.append("file_type", "link");
        formData.append("link_url", namingValue.trim());
      } else if (file) {
        // Map UI field names to exact backend requirements
        const category = field === "testMaterial" ? "study_material" : "practice_material";
        formData.append("file_type", category);
        formData.append("files", file);
      }

      // Execute the API Call
      const res = await ApiServices.uploadStudyMaterial(formData);

      if (res.data?.status === "success") {
        showToast("Material uploaded successfully", "success");

        // Optimistically update the local state upon success
        setSubjects((prev) =>
          prev.map((sub) => ({
            ...sub,
            chapters: sub.chapters.map((ch: any) =>
              ch.id === id || ch.chapter_id === id
                ? {
                  ...ch,
                  [field]: [...(ch[field] || []), { name: finalName, type }],
                }
                : ch,
            ),
          })),
        );
      } else {
        showToast(res.data?.message || "Failed to upload material", "error");
      }
    } catch (error) {
      showToast("An error occurred while uploading material", "error");
    } finally {
      setIsLoading(false);
      setNamingModal(null);
      setNamingValue("");
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

    setSubjects((prev) =>
      prev.map((sub) => ({
        ...sub,
        chapters: sub.chapters.map((ch: any) =>
          ch.id === id || ch.chapter_id === id
            ? {
              ...ch,
              [field]: formattedDate,
              [`${field}_raw`]: value,
            }
            : ch,
        ),
      })),
    );
  };

  const [profileImage, setProfileImage] = useState<string>(" ");
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const fetchLearningPlan = async () => {
    try {
      setIsLoading(true);
      const response = await ApiServices.getTeacherPlannerData();
      const result = response.data;

      if (result.status === "success") {
        const data = result.data;
        const plannerMap = new Map();
        (data.chapter_planner || []).forEach((item: any) => {
          plannerMap.set(item.chapter_id, item);
        });

        const plans = (data.subject_wise_chapters || [])
          .filter((sub: any) => Array.isArray(sub.chapters) && sub.chapters.length > 0)
          .map((sub: any) => ({
            ...sub,
            chapters: (sub.chapters || []).map((ch: any) => {
              const plannerData = plannerMap.get(ch.id || ch.chapter_id);
              const rawStart = plannerData?.start_date || ch.start_date || "";
              const rawEnd = plannerData?.end_date || ch.end_date || "";

              return {
                ...ch,
                id: ch.id || ch.chapter_id,
                chapter: ch.name || ch.chapter_name,
                startDate: rawStart ? new Date(rawStart).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "--",
                endDate: rawEnd ? new Date(rawEnd).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "--",
                startDate_raw: rawStart,
                endDate_raw: rawEnd,
                progress: ch.progress_percentage || 0,
                completed: plannerData ? plannerData.is_completed : (ch.is_completed || false),
                testMaterial: ch.testMaterial || [],
                practiceMaterial: ch.practiceMaterial || [],
              };
            }),
          }));

        setSubjects(plans);

        // Map stats for header AND capture IDs for payload
        setStats({
          teacher_name: data.teacher?.name,
          institute_name: data.institute?.name,
          institute_id: data.institute?.id,
          board_name: data.board?.name,
          board_id: data.board?.id,
          class_name: data.dropdowns?.classes?.[0]?.name,
          class_id: data.dropdowns?.classes?.[0]?.id,
          section_name: data.dropdowns?.sections?.[0]?.name,
          section_id: data.dropdowns?.sections?.[0]?.id,
        });

        // Map dropdown options (keep the whole object so we have name AND id)
        if (data.dropdowns) {
          setClassOptions(data.dropdowns.classes || []);
          setSectionOptions(data.dropdowns.sections || []);
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
      setDemoChapters(activePlan.chapters);
    } else {
      setDemoChapters([]);
    }
  }, [activeSubject, subjects]);

  // const handleSave = async (row: any) => {
  //   const payload = {
  //     chapter_id: row.id,
  //     start_date: row.startDate_raw || null,
  //     end_date: row.endDate_raw || null,
  //     is_completed: row.completed,
  //   };

  //   try {
  //     const res = await ApiServices.upsertTeacherPlanner(payload);
  //     if (res.data?.status === "success") {
  //       showToast("Chapter planner updated successfully", "success");
  //     } else {
  //       showToast(res.data?.message || "Failed to update", "error");
  //     }
  //   } catch (error) {
  //     showToast("An error occurred while saving", "error");
  //   }
  // };


const handleSave = async (row: any) => {
  const payload = {
    chapter_id: row.id,
    start_date: row.startDate_raw || null,
    end_date: row.endDate_raw || null,
    is_completed: row.completed,
  };
  setSavingChapterId(row.id);
  try {

    const res = await ApiServices.upsertTeacherPlanner(payload);

    if (res.data?.status === "success") {
      showToast("Chapter planner updated successfully", "success");

      // 🔥 CALL TEST GENERATION
      if (row.completed === true) {
        try {
          setIsGeneratingTest(true); // 👈 start loader

          const genRes = await ApiServices.generateTestFromPlanner({
            subscription_id: stats?.subscription_id
          });

          if (genRes.data?.status === "success") {
            showToast("Test generated successfully", "success");
          } else {
            showToast(genRes.data?.message || "Test generation failed", "error");
          }

        } catch (err) {
          showToast("Error while generating test", "error");
        } finally {
          setIsGeneratingTest(false); // 👈 stop loader
        }
      }
    } else {
      showToast(res.data?.message || "Failed to update", "error");
    }

  } catch (error) {
    showToast("An error occurred while saving", "error");
  } finally {
    setSavingChapterId(null);
  }
};
  useEffect(() => {
    if (stats) {
      if (!selectedClass && stats.class_name)
        setSelectedClass(stats.class_name);
      if (!selectedSection && stats.section_name)
        setSelectedSection(stats.section_name);
    }
  }, [stats]);

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
                    ?.split(" ")
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
                        label: c.name,
                        value: c.name,
                      }))}
                      value={selectedClass}
                      onChange={(val) => setSelectedClass(val as string)}
                      placeholder="Select Class"
                      className="px-2 py-2 appearance-none bg-white border border-gray-200 rounded-lg text-sm text-primary font-medium focus:outline-none focus:ring-2 focus:ring-[#BADA55]/60 shadow-sm"
                    />
                  </div>
                  <div className="m-0">
                    <SearchableSelect
                      options={sectionOptions.map((s) => ({
                        label: s.name,
                        value: s.name,
                      }))}
                      value={selectedSection}
                      onChange={(val) => setSelectedSection(val as string)}
                      placeholder="Select Section"
                      className="px-2 py-2 w-full appearance-none bg-white border border-gray-200 rounded-lg text-sm text-primary font-medium focus:outline-none focus:ring-2 focus:ring-[#BADA55]/60 shadow-sm"
                    />
                  </div>
                  <div className="m-0 min-w-40">
                    <SearchableSelect
                      options={subjects.map((s) => ({
                        label: s.subject_name,
                        value: s.subject_name,
                      }))}
                      value={activeSubject}
                      onChange={(val) => setActiveSubject(val as string)}
                      placeholder="Select Subject"
                      className="px-2 py-2 w-full appearance-none bg-white border border-gray-200 rounded-lg text-sm text-primary font-medium focus:outline-none focus:ring-2 focus:ring-[#BADA55]/60 shadow-sm"
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
                <td className="py-3 px-2 text-center">{i + 1}</td>

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
                      <Calendar size={16} className="text-primary" />
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
                      <Calendar size={16} className="text-primary" />
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
                            {mat.type === "link" && <Link size={10} />}
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
                    onChange={() => {
                      if (row.startDate_raw && row.endDate_raw) toggleDemoChapter(row.id);
                    }}
                    disabled={!row.startDate_raw || !row.endDate_raw}
                    className="w-4 h-4 cursor-pointer rounded border-gray-300 text-[#b0cb1f] focus:ring-[#b0cb1f]"
                  />
                </td>

                <td className="py-3 px-2 text-center">
                  <button
                    onClick={() => handleSave(row)}
                    disabled={!row.startDate_raw || !row.endDate_raw || savingChapterId !== null}
                    className="p-2 inline-flex items-center px-2 py-0.5 rounded-full text-sm font-medium text-secondary hover:text-blue-600 transition-colors border-none bg-transparent disabled:text-[#AAA] cursor-pointer disabled:cursor-not-allowed"
                  >
                    {savingChapterId === row.id ? (
                      <Loader2 size={20} className="animate-spin text-blue-500" />
                    ) : (
                      <Save size={20} strokeWidth={2} />
                    )}
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
                disabled={isLoading}
                className="w-full py-3 bg-button-primary text-primary rounded-lg font-bold hover:bg-opacity-90 flex items-center justify-center gap-2 transition-colors border-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  namingModal.isLink ? "Add Link" : "Confirm Upload"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherLearningPlanner;