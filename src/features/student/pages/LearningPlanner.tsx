import React, { useEffect, useState } from "react";
import IconChat from "../../../assets/icon/chat2.svg";
import ApiServices from "../../../services/ApiServices";
import Chat from "../../auth/modal/chat";
import TestModalUpdated from "../components/TestModalUpdated";
import { useToast } from "../../../app/providers/ToastProvider";

// ─── Interfaces ─────────────────────────────────────────────────────────────

// ─── Interfaces ─────────────────────────────────────────────────────────────

interface ApiTask {
  status: string;
  type: string;
}

interface ApiPlanner {
  end_date: string | null;
  is_completed: boolean | null;
  start_date: string | null;
}

interface ApiChapter {
  chapter_id: number;
  chapter_name: string;
  planner: ApiPlanner;
  tasks: ApiTask[];
  // Compatibility fields for the UI
  status?: string;
  progress_percentage?: number;
}

interface Task {
  type: "tutorial" | "mock_test";
  progress: number;
  status?: string;
}

interface ChapterDay {
  chapter_id: number;
  chapter_name: string;
  topics?: { topic_id: number; topic_name: string }[];
  tasks: Task[];
}

interface WeeklyPlanDay {
  date: string;
  day: string;
  progress: number;
  status?: string;
  chapters: ChapterDay[];
}

interface AcademicDetails {
  academic_year: string;
  board: string;
  class: string;
  institute: string;
  sections?: string[];
}

interface StudentDetails {
  id: number;
  name: string;
}

interface ApiSubjectPlan {
  subject_id: number;
  subject_name: string;
  chapters: ApiChapter[];
  weekly_plan?: WeeklyPlanDay[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getTodayDate = () => new Date().toISOString().split("T")[0];

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

const formatFullDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

const progressBarColor = (p: number) =>
  p >= 100 ? "bg-green-500" : p > 50 ? "bg-[#BADA55]" : p > 20 ? "bg-amber-400" : "bg-red-400";

const statusPill = (status?: string) => {
  switch (status?.toLowerCase()) {
    case "completed": return "bg-green-100 text-green-700 border-green-200";
    case "in_progress": return "bg-amber-100 text-amber-700 border-amber-200";
    default: return "bg-red-100 text-red-500 border-red-200";
  }
};

// ─── Generate weekly plan from chapters ──────────────────────────────────────

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const generateWeeklyPlan = (subject: ApiSubjectPlan): WeeklyPlanDay[] => {
  const today = new Date();
  const dow = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dow === 0 ? 7 : dow) - 1));

  const weekDates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    weekDates.push(d.toISOString().split("T")[0]);
  }

  const chapters = subject.chapters ?? [];

  return weekDates.map((dateStr, dIdx) => {
    const dayChapters = chapters
      .filter((ch, ci) => {
        if (!ch.planner.start_date || !ch.planner.end_date) {
          // Spread undated chapters across the week
          return ci % 7 === dIdx;
        }
        const start = new Date(ch.planner.start_date);
        const end = new Date(ch.planner.end_date);
        const current = new Date(dateStr);
        return current >= start && current <= end;
      })
      .map((ch) => ({
        chapter_id: ch.chapter_id,
        chapter_name: ch.chapter_name,
        tasks: ch.tasks.map((t) => ({
          type: (t.type.toLowerCase().includes("mock") ? "mock_test" : "tutorial") as "tutorial" | "mock_test",
          progress: t.status === "completed" ? 100 : 0,
          status: t.status,
        })),
      }));

    const avgProgress =
      dayChapters.length > 0
        ? Math.round(
          dayChapters.reduce(
            (sum, ch) => sum + ch.tasks.reduce((s, t) => s + t.progress, 0) / (ch.tasks.length || 1),
            0,
          ) / dayChapters.length,
        )
        : 0;

    return {
      date: dateStr,
      day: DAY_NAMES[new Date(dateStr).getDay()],
      progress: avgProgress,
      status: avgProgress >= 100 ? "completed" : avgProgress > 0 ? "in_progress" : "pending",
      chapters: dayChapters,
    };
  });
};

const getPrevWeekStatus = (
  weeklyPlan: WeeklyPlanDay[],
  today: string,
): "green" | "red" | "none" => {
  const past = weeklyPlan.filter((d) => d.date < today && d.chapters.length > 0);
  if (past.length === 0) return "none";
  return past.every((d) => d.progress >= 100) ? "green" : "red";
};

const patchSubjectPlan = (sub: ApiSubjectPlan): ApiSubjectPlan => {
  const patchedChapters = sub.chapters.map(ch => {
    const totalTasks = ch.tasks.length;
    const completedTasks = ch.tasks.filter(t => t.status === "completed").length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    return {
      ...ch,
      progress_percentage: progress,
      status: progress >= 100 ? "completed" : progress > 0 ? "in_progress" : "pending"
    };
  });

  const updatedSub = { ...sub, chapters: patchedChapters };
  return {
    ...updatedSub,
    weekly_plan:
      sub.weekly_plan && sub.weekly_plan.length > 0 ? sub.weekly_plan : generateWeeklyPlan(updatedSub),
  };
};

const DayCard: React.FC<{
  day: WeeklyPlanDay;
  isSelected: boolean;
  isToday: boolean;
  isPast: boolean;
  onClick: () => void;
}> = ({ day, isSelected, isToday, isPast, onClick }) => {
  const allDone = isPast && day.progress >= 100;
  const hasPending = isPast && day.progress < 100;

  return (
    <div
      onClick={onClick}
      className={`
        relative flex-1 min-w-[60px] cursor-pointer rounded-2xl py-3 px-2 border-2
        flex flex-col items-center gap-1.5
        transition-all duration-200 select-none
        ${isSelected
          ? "bg-gradient-to-b from-[#BADA55]/30 to-[#BADA55]/10 border-[#BADA55] shadow-lg shadow-[#BADA55]/20 scale-[1.04]"
          : isToday
            ? "bg-gradient-to-b from-white to-gray-50 border-primary shadow-md"
            : allDone
              ? "bg-green-50 border-green-200"
              : hasPending
                ? "bg-red-50 border-red-200"
                : "bg-white border-gray-100 hover:border-[#BADA55]/50 hover:shadow-sm"
        }
      `}
    >
      {isToday && (
        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase tracking-wider bg-primary text-white px-2 py-0.5 rounded-full whitespace-nowrap shadow">
          Today
        </span>
      )}
      <p className={`text-[9px] font-black uppercase tracking-widest mt-1 ${
        isSelected ? "text-[#6a9000]" : isToday ? "text-primary" : "text-gray-400"
      }`}>
        {day.day}
      </p>
      <p className={`text-sm font-extrabold leading-none ${
        isSelected || isToday ? "text-primary" : "text-gray-700"
      }`}>
        {formatDate(day.date)}
      </p>
      {/* Status dot */}
      <span className={`w-2 h-2 rounded-full mt-1 ${
        isSelected
          ? "bg-[#BADA55]"
          : allDone
            ? "bg-green-500"
            : hasPending
              ? "bg-red-400"
              : isToday
                ? "bg-primary"
                : "bg-gray-200"
      }`} />
    </div>
  );
};

// ─── Task Row ─────────────────────────────────────────────────────────────────

const TaskRow: React.FC<{ task: Task; onClick?: () => void }> = ({
  task,
  onClick,
}) => (
  <div
    className={`flex items-center gap-2 ${
      task.type === "mock_test" ? "cursor-pointer group/task" : ""
    }`}
    onClick={task.type === "mock_test" ? onClick : undefined}
  >
    <span
      className={`w-6 h-6 rounded-lg flex items-center justify-center text-white transition-transform ${
        task.type === "mock_test"
          ? "bg-primary group-hover/task:scale-110"
          : "bg-[#BADA55]"
      }`}
    >
      <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
        {task.type === "mock_test" ? "quiz" : "play_circle"}
      </span>
    </span>
    <span
      className={`text-xs font-semibold text-gray-700 ${
        task.type === "mock_test" ? "group-hover/task:text-primary" : ""
      }`}
    >
      {task.type === "mock_test" ? "Mock Test" : "Tutorial"}
    </span>
    {task.status && (
      <span
        className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full border ${statusPill(
          task.status,
        )}`}
      >
        {task.status.replace("_", " ")}
      </span>
    )}
    {task.type === "mock_test" && (
      <span className="material-symbols-outlined text-[10px] text-primary opacity-0 group-hover/task:opacity-100 transition-opacity ml-auto">
        arrow_forward_ios
      </span>
    )}
  </div>
);

// ─── Chapter Accordion ────────────────────────────────────────────────────────

const ChapterAccordion: React.FC<{
  chapter: ChapterDay;
  index: number;
  onMockTestClick?: (chapterId: number, chapterName: string) => void;
}> = ({ chapter, index, onMockTestClick }) => {
  const [open, setOpen] = useState(false);
  const allDone = chapter.tasks.every((t) => t.progress >= 100);

  return (
    <div className={`rounded-2xl overflow-hidden border transition-all duration-200 shadow-sm hover:shadow-md ${allDone ? "border-green-200 bg-green-50/40" : "border-gray-100 bg-white"}`}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50/80 transition-colors"
      >
        <span className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${allDone ? "bg-green-500 text-white" : "bg-[#BADA55]/20 text-[#6a9000]"}`}>
          {allDone
            ? <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check</span>
            : index + 1}
        </span>
        <span className="flex-1 font-semibold text-sm text-primary">{chapter.chapter_name}</span>
        <span className={`material-symbols-outlined text-lg text-gray-400 transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`}>
          expand_more
        </span>
      </button>

      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${open ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-4 pb-4 pt-2 space-y-4 border-t border-gray-100">
          {chapter.tasks && chapter.tasks.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Tasks</p>
              <div className="space-y-3">
                {chapter.tasks.map((task, idx) => (
                  <TaskRow
                    key={idx}
                    task={task}
                    onClick={() =>
                      onMockTestClick?.(chapter.chapter_id, chapter.chapter_name)
                    }
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Subject Section (self-contained: calendar + details) ─────────────────────

const SubjectSection: React.FC<{
  subject: ApiSubjectPlan;
  accentColor: string;
  defaultExpanded: boolean;
  onMockTestClick?: (
    subjectId: number,
    subjectName: string,
    chapterId: number,
    chapterName: string,
  ) => void;
}> = ({ subject, accentColor, defaultExpanded, onMockTestClick }) => {
  const today = getTodayDate();
  const weeklyPlan = subject.weekly_plan ?? [];
  const prevWeekStatus = getPrevWeekStatus(weeklyPlan, today);

  const todayEntry = weeklyPlan.find((d) => d.date === today);
  const defaultDay = todayEntry ?? weeklyPlan[0] ?? null;

  const [selectedDate, setSelectedDate] = useState<string>(defaultDay?.date ?? "");
  const [selectedDayData, setSelectedDayData] = useState<WeeklyPlanDay | null>(defaultDay);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleDayClick = (day: WeeklyPlanDay) => {
    setSelectedDate(day.date);
    setSelectedDayData(day);
  };

  // ── Derived: Overall Mock Test progress
  const overallMockTestProgress =
    subject.chapters.length > 0
      ? Math.round(
          subject.chapters.reduce((sum, ch) => {
            const mockTask = ch.tasks.find(t => t.type.toLowerCase().includes("mock"));
            const mockProgress = mockTask?.status === "completed" ? 100 : 0;
            return sum + mockProgress;
          }, 0) / subject.chapters.length
        )
      : 0;
  const mockTestStatus = overallMockTestProgress >= 100 ? "Completed" : "Pending";

  return (
    <div className="flex flex-col gap-3">
      {/* ── Subject Header Card ─────────────────────────────────────── */}
      <div
        className="bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between px-5 py-3 cursor-pointer select-none"
        style={{ borderLeft: `5px solid ${accentColor}` }}
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        {/* LEFT: icon + name + subtitle */}
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-base shadow-sm flex-shrink-0"
            style={{ background: accentColor }}
          >
            {subject.subject_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-base font-extrabold text-primary leading-tight">{subject.subject_name}</h3>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5">
              {subject.chapters?.length ?? 0} chapters &middot; {weeklyPlan.length} days planned
            </p>
          </div>
        </div>

        {/* MIDDLE: Prev Week badge (with left margin gap) */}
        {prevWeekStatus !== "none" && (
          <span className={`inline-flex items-center gap-1 ml-6 px-3 py-1.5 rounded-full text-[11px] font-bold border flex-shrink-0
            ${prevWeekStatus === "green"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-600"}`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
              {prevWeekStatus === "green" ? "verified" : "warning"}
            </span>
            {prevWeekStatus === "green" ? "Prev Week: All done ✓" : "Prev Week: Pending ⚠️"}
          </span>
        )}

        {/* RIGHT: Overall Mock Test + chevron */}
        <div className="flex items-center gap-3 flex-shrink-0 ml-auto">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-1.5">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: 16 }}>quiz</span>
            <div className="leading-tight">
              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Overall Mock Test</p>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-extrabold text-primary">{overallMockTestProgress}%</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border
                  ${overallMockTestProgress >= 100
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-amber-50 border-amber-200 text-amber-700"}`}
                >
                  {mockTestStatus}
                </span>
              </div>
            </div>
          </div>
          <span className={`material-symbols-outlined text-gray-400 transition-transform duration-300 ${isExpanded ? "rotate-180" : "rotate-0"}`}>
            expand_more
          </span>
        </div>
      </div>

      {/* ── Collapsible body ─────────────────────────────────────────── */}
      <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? "max-h-[2000px]" : "max-h-0"}`}>
      <div className="flex flex-col lg:flex-row gap-4">

        {/* LEFT — Weekly Calendar (independent card) */}
        <div className="w-full lg:w-[58%] bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Weekly Plan</p>
            {weeklyPlan.length > 0 && (
              <span className="text-[10px] text-gray-400 bg-gray-50 border border-gray-100 px-2.5 py-0.5 rounded-full font-semibold">
                {formatDate(weeklyPlan[0].date)} – {formatDate(weeklyPlan[weeklyPlan.length - 1].date)}
              </span>
            )}
          </div>

          {weeklyPlan.length > 0 ? (
            <div className="flex items-stretch gap-2 overflow-x-auto pb-1 pt-4">
              {/* Prev-week card */}
              <div
                className={`flex-shrink-0 rounded-2xl px-3 py-2 border-2 flex flex-col items-center justify-center gap-1
                  ${prevWeekStatus === "green"
                    ? "bg-green-50 border-green-200"
                    : prevWeekStatus === "red"
                      ? "bg-red-50 border-red-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
              >
                <span className={`material-symbols-outlined ${
                  prevWeekStatus === "green" ? "text-green-500" : prevWeekStatus === "red" ? "text-red-400" : "text-gray-300"
                }`} style={{ fontSize: 20 }}>
                  {prevWeekStatus === "green" ? "verified" : prevWeekStatus === "red" ? "warning" : "history"}
                </span>
                <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 text-center leading-tight">Prev<br/>Week</p>
                <p className={`text-[9px] font-extrabold text-center ${
                  prevWeekStatus === "green" ? "text-green-600" : prevWeekStatus === "red" ? "text-red-500" : "text-gray-400"
                }`}>
                  {prevWeekStatus === "green" ? "Done" : prevWeekStatus === "red" ? "Pending" : "—"}
                </p>
              </div>

              <div className="w-px bg-gray-100 self-stretch flex-shrink-0 rounded-full" />

              {weeklyPlan.map((day) => (
                <DayCard
                  key={day.date}
                  day={day}
                  isSelected={selectedDate === day.date}
                  isToday={day.date === today}
                  isPast={day.date < today}
                  onClick={() => handleDayClick(day)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-gray-300 text-center">
              <span className="material-symbols-outlined text-4xl mb-2">calendar_month</span>
              <p className="text-xs font-medium text-gray-400">No plan available</p>
            </div>
          )}

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-gray-50">
            {[
              { color: "bg-green-500", label: "Completed" },
              { color: "bg-[#BADA55]", label: "In Progress" },
              { color: "bg-amber-400", label: "Partial" },
              { color: "bg-red-400", label: "Pending" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${color}`} />
                <span className="text-[10px] text-gray-400 font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Chapter Details (independent card) */}
        <div className="w-full lg:w-[42%] bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-5 flex flex-col">
          {/* Day header */}
          <div className="mb-4">
            {selectedDayData ? (
              <>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    {formatFullDate(selectedDayData.date)}
                  </p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusPill(selectedDayData.status)}`}>
                    {selectedDayData.progress}% done
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${progressBarColor(selectedDayData.progress)}`}
                    style={{ width: `${selectedDayData.progress}%` }}
                  />
                </div>
              </>
            ) : (
              <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">
                Select a day
              </p>
            )}
          </div>

          {/* Chapters */}
          <div className="space-y-2.5 flex-1 overflow-y-auto min-h-0 pr-1 max-h-56 custom-scrollbar">
            {selectedDayData ? (
              selectedDayData.chapters.length > 0 ? (
                selectedDayData.chapters.map((ch, idx) => (
                  <ChapterAccordion
                    key={`${ch.chapter_id}-${idx}`}
                    chapter={ch}
                    index={idx}
                    onMockTestClick={(cid, cname) =>
                      onMockTestClick?.(
                        subject.subject_id,
                        subject.subject_name,
                        cid,
                        cname,
                      )
                    }
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <span className="material-symbols-outlined text-4xl text-gray-200 mb-2">menu_book</span>
                  <p className="text-sm font-medium text-gray-400">No chapters today</p>
                  <p className="text-xs text-gray-300">Enjoy your free day! 🌟</p>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <span className="material-symbols-outlined text-4xl text-gray-100 mb-2">touch_app</span>
                <p className="text-sm font-medium text-gray-400">Click a day to view chapters</p>
              </div>
            )}
          </div>
        </div>

      </div>
      </div>
    </div>
  );
};

// ─── Accent colors for subjects ───────────────────────────────────────────────

const SUBJECT_COLORS = [
  "#BADA55", "#4F8EF7", "#F97316", "#A855F7", "#14B8A6", "#EF4444", "#F59E0B",
];

// ─── Main Component ───────────────────────────────────────────────────────────

const LearningPlanner: React.FC = () => {
  const [subjects, setSubjects] = useState<ApiSubjectPlan[]>([]);
  const [academic, setAcademic] = useState<AcademicDetails | null>(null);
  const [student, setStudent] = useState<StudentDetails | null>(null);
  const [profileImage, setProfileImage] = useState<string>(" ");
  const [isLoading, setIsLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { showToast } = useToast();

  // Test Modal State
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [assessmentDetails, setAssessmentDetails] = useState<any>(null);
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [testDuration, setTestDuration] = useState(30);

  const handleMockTestClick = async (
    subjectId: number,
    _subjectName: string,
    chapterId: number,
    chapterName: string,
  ) => {
    try {
      setIsLoading(true);

      // 1. Assign/Create Assessment for this chapter
      const assignPayload = {
        subject_id: subjectId,
        chapter_ids: [chapterId],
        test_name: `${chapterName} Mock Test`,
        total_questions: 10, // Default 10 questions
        duration_minutes: 30, // Default 30 minutes
        difficulty_level: "Mixed",
      };

      const assignRes = await ApiServices.assignSelfAssessment(assignPayload);

      if (assignRes.data?.status === "success") {
        const assignmentId = assignRes.data.data.assignment_id;

        // 2. Get Assessment Details
        const detailsRes = await ApiServices.getAssessmentDetails(assignmentId);
        if (detailsRes.data?.status === "success") {
          setAssessmentDetails(detailsRes.data.data);
          setTestDuration(detailsRes.data.data.duration_minutes || 30);

          // 3. Start Assessment Attempt
          const startRes = await ApiServices.startAssessment({
            assignment_id: assignmentId,
          });
          if (startRes.data?.status === "success") {
            setAttemptId(startRes.data.data.attempt_id);
            setTestModalOpen(true);
            showToast("Mock test started!", "success");
          } else {
            showToast(startRes.data?.message || "Failed to start test", "error");
          }
        } else {
          showToast(
            detailsRes.data?.message || "Failed to get test details",
            "error",
          );
        }
      } else {
        showToast(assignRes.data?.message || "Failed to assign test", "error");
      }
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Something went wrong",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLearningPlan = async () => {
    try {
      const getResponse = await ApiServices.getStudentPlannerDashboard();
      const getResult = getResponse.data;

      if (getResult.status === "success" && getResult.data.subjects?.length > 0) {
        setSubjects(getResult.data.subjects.map(patchSubjectPlan));
        setAcademic(getResult.data.academic);
        setStudent(getResult.data.student);
        return;
      }

      // If no plan, we might need to fallback to generation as before
      await ApiServices.generateLearningPlan({ topic_ids: null });

      const newGetResponse = await ApiServices.getStudentPlannerDashboard();
      const newGetResult = newGetResponse.data;

      if (newGetResult.status === "success" && newGetResult.data.subjects?.length > 0) {
        setSubjects(newGetResult.data.subjects.map(patchSubjectPlan));
        setAcademic(newGetResult.data.academic);
        setStudent(newGetResult.data.student);
      }
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProfileImage = async () => {
    try {
      const response = await ApiServices.getUserProfileImage();
      if (response.data?.status === "success" && response.data?.data?.image)
        setProfileImage(response.data.data.image);
    } catch { /* silent */ }
  };

  useEffect(() => {
    fetchLearningPlan();
    fetchProfileImage();
  }, []);

  const getInitial = () => student?.name?.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen p-6 relative">
      {/* ── Loading overlay ─────────────────────────────────────────── */}
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-gray-100 border-t-[#BADA55] rounded-full animate-spin" />
            <span className="text-sm text-gray-400 font-medium tracking-wide">
              Loading your planner…
            </span>
          </div>
        </div>
      )}

      {/* ── Header ──────────────────────────────────────────────────── */}
      <header className="flex flex-wrap justify-between items-start gap-6 pb-6">
        <div className="flex gap-4 items-start">
          <div className="w-[90px] h-[90px] rounded-full overflow-hidden flex-shrink-0 border-4 border-[#BADA55]/40 shadow-lg flex items-center justify-center bg-gray-100">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" onError={() => setProfileImage("")} />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#BADA55] to-lime-500 text-white">
                <span className="text-4xl font-bold">{getInitial()}</span>
              </div>
            )}
          </div>
          {student && (
            <div className="flex flex-col gap-0.5">
              <span className="text-2xl text-[#ABB3BC] font-bold tracking-wide">Learning Planner</span>
              <h1 className="text-3xl font-bold text-primary m-0">
                Hi {student.name
                  ? student.name.split(" ").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
                  : ""}!
              </h1>
              {academic && (
                <>
                  <p className="text-sm text-primary font-medium m-0">{academic.institute}</p>
                  <p className="text-sm text-primary m-0">{academic.board} | {academic.class} | Section {academic.sections}</p>
                  <p className="text-sm text-primary m-0 break-words max-w-xl">
                    Subject: {subjects.map(s => s.subject_name).join(", ")}
                  </p>
                  <p className="text-sm text-primary m-0 break-words max-w-xl">
                    Academic Year: {academic.academic_year}
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-start gap-10">
          <div className="flex items-center gap-4">
            <div className="w-[6rem] h-[6rem] rounded-full bg-yellow flex items-center justify-center shadow-inner">
              <span className="text-4xl font-bold text-red">00</span>
            </div>
            <div className="leading-snug">
              <p className="text-xs font-bold mt-7 text-primary">Days Left for<br />Annual<br />Exam</p>
            </div>
          </div>

          <div className="text-center flex flex-col items-center">
            <div className="w-[4.688rem] h-[4.688rem] rounded-full bg-yellow flex items-center justify-center mb-1 shadow-inner">
              <span className="text-lg font-bold text-red">#12</span>
            </div>
            <p className="text-xs font-medium text-primary w-[4.688rem] leading-tight">Leadership Board Position</p>
          </div>
        </div>
      </header>

      {/* ── Divider ─────────────────────────────────────────────────── */}
      <div className="border-t-4 border-gray-300 mb-6" />

      {/* ── Subject Sections (stacked) ───────────────────────────────── */}
      {subjects.length > 0 ? (
        <div className="flex flex-col gap-6">
          {subjects.map((subject, idx) => (
            <SubjectSection
              key={subject.subject_id}
              subject={subject}
              accentColor={SUBJECT_COLORS[idx % SUBJECT_COLORS.length]}
              defaultExpanded={subjects.length <= 2}
              onMockTestClick={handleMockTestClick}
            />
          ))}
        </div>
      ) : (
        !isLoading && (
          <div className="flex flex-col items-center justify-center py-24 text-center text-gray-300">
            <span className="material-symbols-outlined text-7xl mb-4">school</span>
            <p className="text-base font-semibold text-gray-400">No learning plan found</p>
            <p className="text-sm text-gray-300 mt-1">Your plan will appear here once generated</p>
          </div>
        )
      )}

      {/* ── Chat ────────────────────────────────────────────────────── */}
      <div className="fixed right-[1%] top-[80%] -translate-y-1/2 z-[100]">
        <button onClick={() => setIsChatOpen(true)} aria-label="Open chat" className="p-0 bg-transparent border-0 cursor-pointer">
          <img src={IconChat} alt="Chat" className="w-[95px]" />
        </button>
      </div>
      {isChatOpen && <Chat onClose={() => setIsChatOpen(false)} />}

      <TestModalUpdated
        isOpen={testModalOpen}
        onClose={() => setTestModalOpen(false)}
        testDurationMinutes={testDuration}
        assessmentDetails={assessmentDetails}
        attemptId={attemptId}
        onComplete={(result) => {
          console.log("Test completed:", result);
          // Refresh data to show progress
          fetchLearningPlan();
        }}
      />
    </div>
  );
};

export default LearningPlanner;
