import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import IconChat from "../../../assets/icon/chat2.svg";
import ApiServices from "../../../services/ApiServices"; // @ts-ignore
import Chat from "../../auth/modal/chat";
import { useToast } from "../../../app/providers/ToastProvider";

// ─── Interfaces ─────────────────────────────────────────────────────────────

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

interface Task {
  type: "tutorial" | "mock_test";
  progress: number;
  status?: string;
  assignment_id?: number;
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

interface ApiSubjectPlan {
  subject_id: number;
  subject_name: string;
  chapters: ApiChapter[];
  weekly_plan?: WeeklyPlanDay[];
}

// ─── Test Modal Interfaces ──────────────────────────────────────────────────

interface Option {
  label: string;
  text: string;
}

interface Question {
  id: number;
  question: string;
  options: Option[];
  correctAnswer: string;
  sl_no?: number;
}

interface ApiQuestion {
  question_id: number;
  question_text: string;
  question_type: "MCQ" | "TrueFalse" | "Textual";
  options: Record<string, string> | null;
  difficulty: string;
  marks: number;
  sl_no: number;
}

// ─── Hardcoded Assessment Data ──────────────────────────────────────────────

const HARDCODED_ASSESSMENT = {
  questions: [
    {
      question_id: 101,
      question_text: "Which of the following is a hook in React?",
      question_type: "MCQ",
      options: { a: "useState", b: "useModal", c: "useData", d: "useFetch" },
      difficulty: "easy",
      marks: 2,
      sl_no: 1,
    },
    {
      question_id: 102,
      question_text: "React components must always return a single parent HTML element.",
      question_type: "TrueFalse",
      options: null,
      difficulty: "medium",
      marks: 1,
      sl_no: 2,
    },
    {
      question_id: 103,
      question_text: "Explain the concept of Virtual DOM in React.",
      question_type: "Textual",
      options: null,
      difficulty: "hard",
      marks: 5,
      sl_no: 3,
    },
  ]
};

// Transform API question to internal format
const transformApiQuestion = (apiQuestion: ApiQuestion): Question => {
  let options: Option[] = [];

  if (apiQuestion.question_type === "MCQ" && apiQuestion.options) {
    options = Object.entries(apiQuestion.options).map(([key, value]) => ({
      label: key.toUpperCase(),
      text: value,
    }));
  } else if (apiQuestion.question_type === "TrueFalse") {
    options = [
      { label: "A", text: "True" },
      { label: "B", text: "False" },
    ];
  }

  return {
    id: apiQuestion.question_id,
    question: apiQuestion.question_text,
    options,
    correctAnswer: "",
    sl_no: apiQuestion.sl_no,
  };
};

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

  return weekDates.map((dateStr, idx) => {
    const dayName = DAY_NAMES[new Date(dateStr).getDay()];
    const dayChapters = chapters
      .filter((_, ci) => ci % 7 === idx)
      .map((ch) => ({
        chapter_id: ch.chapter_id,
        chapter_name: ch.chapter_name,
        topics: ch.topics.map((t) => ({ topic_id: t.topic_id, topic_name: t.topic_name })),
        tasks: [
          {
            type: "tutorial" as const,
            progress: ch.progress_percentage,
            status:
              ch.status?.toLowerCase() === "completed" ? "completed"
                : ch.progress_percentage > 0 ? "in_progress"
                  : "pending",
          },
          {
            type: "mock_test" as const,
            progress:
              ch.status?.toLowerCase() === "completed" ? 100
                : Math.max(0, ch.progress_percentage - 20),
            assignment_id: ch.chapter_id * 100 + 1,
            status: ch.status?.toLowerCase() === "completed" ? "completed" : "pending",
          },
        ],
      }));

    const avgProgress =
      dayChapters.length > 0
        ? Math.round(
          dayChapters.reduce(
            (sum, ch) => sum + ch.tasks.reduce((s, t) => s + t.progress, 0) / ch.tasks.length,
            0,
          ) / dayChapters.length,
        )
        : 0;

    return {
      date: dateStr, day: dayName, progress: avgProgress,
      status: avgProgress >= 100 ? "completed" : avgProgress > 0 ? "in_progress" : "pending",
      chapters: dayChapters,
    };
  });
};

const getPrevWeekStatus = (weeklyPlan: WeeklyPlanDay[], today: string): "green" | "red" | "none" => {
  const past = weeklyPlan.filter((d) => d.date < today && d.chapters.length > 0);
  if (past.length === 0) return "none";
  return past.every((d) => d.progress >= 100) ? "green" : "red";
};

const patchSubjectPlan = (sub: ApiSubjectPlan): ApiSubjectPlan => ({
  ...sub,
  weekly_plan:
    sub.weekly_plan && sub.weekly_plan.length > 0 ? sub.weekly_plan : generateWeeklyPlan(sub),
});

// ─── Shared Components ────────────────────────────────────────────────────────

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
      className={`relative flex-1 min-w-[60px] cursor-pointer rounded-2xl py-3 px-2 border-2 flex flex-col items-center gap-1.5 transition-all duration-200 select-none
        ${isSelected ? "bg-gradient-to-b from-[#BADA55]/30 to-[#BADA55]/10 border-[#BADA55] shadow-lg shadow-[#BADA55]/20 scale-[1.04]"
          : isToday ? "bg-gradient-to-b from-white to-gray-50 border-primary shadow-md"
            : allDone ? "bg-green-50 border-green-200"
              : hasPending ? "bg-red-50 border-red-200"
                : "bg-white border-gray-100 hover:border-[#BADA55]/50 hover:shadow-sm"}`}
    >
      {isToday && (
        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase tracking-wider bg-primary text-white px-2 py-0.5 rounded-full whitespace-nowrap shadow">
          Today
        </span>
      )}
      <p className={`text-[9px] font-black uppercase tracking-widest mt-1 ${isSelected ? "text-[#6a9000]" : isToday ? "text-primary" : "text-gray-400"}`}>
        {day.day}
      </p>
      <p className={`text-sm font-extrabold leading-none ${isSelected || isToday ? "text-primary" : "text-gray-700"}`}>
        {formatDate(day.date)}
      </p>
      <span className={`w-2 h-2 rounded-full mt-1 ${isSelected ? "bg-[#BADA55]" : allDone ? "bg-green-500" : hasPending ? "bg-red-400" : isToday ? "bg-primary" : "bg-gray-200"}`} />
    </div>
  );
};

const TaskRow: React.FC<{
  task: Task;
  subjectId: number;
  subjectName: string;
  chapterId: number;
  chapterName: string;
  topicIds?: number[];
  onOpenMockTest: (assignmentId?: number) => void;
}> = ({ task, subjectName, chapterId, topicIds, onOpenMockTest }) => {
  const navigate = useNavigate();

  const handleTaskClick = useCallback(() => {
    if (task.type === "mock_test") {
      // Trigger the hardcoded test modal instead of navigating
      onOpenMockTest(task.assignment_id);
    } else {
      // Tutorial logic
    }
  }, [task.type, task.assignment_id, onOpenMockTest]);

  return (
    <div
      className={`flex items-center gap-2 ${task.type === "mock_test" ? "cursor-pointer hover:bg-gray-50 rounded-md p-1 -m-1" : ""}`}
      onClick={handleTaskClick}
    >
      <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-white ${task.type === "mock_test" ? "bg-primary" : "bg-[#BADA55]"}`}>
        <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
          {task.type === "mock_test" ? "quiz" : "play_circle"}
        </span>
      </span>
      <span className="text-xs font-semibold text-gray-700">
        {task.type === "mock_test" ? "Mock Test" : "Tutorial"}
      </span>
      {task.status && (
        <span className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full border ${statusPill(task.status)}`}>
          {task.status.replace("_", " ")}
        </span>
      )}
    </div>
  );
};

const ChapterAccordion: React.FC<{
  chapter: ChapterDay;
  index: number;
  subjectId: number;
  subjectName: string;
  onOpenMockTest: (assignmentId?: number) => void;
}> = ({ chapter, index, subjectId, subjectName, onOpenMockTest }) => {
  const [open, setOpen] = useState(false);
  const allDone = chapter.tasks.every((t) => t.progress >= 100);

  return (
    <div className={`rounded-2xl overflow-hidden border transition-all duration-200 shadow-sm hover:shadow-md ${allDone ? "border-green-200 bg-green-50/40" : "border-gray-100 bg-white"}`}>
      <button onClick={() => setOpen((p) => !p)} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50/80 transition-colors">
        <span className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${allDone ? "bg-green-500 text-white" : "bg-[#BADA55]/20 text-[#6a9000]"}`}>
          {allDone ? <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check</span> : index + 1}
        </span>
        <span className="flex-1 font-semibold text-sm text-primary">{chapter.chapter_name}</span>
        <span className={`material-symbols-outlined text-lg text-gray-400 transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`}>expand_more</span>
      </button>

      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${open ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-4 pb-4 pt-2 space-y-4 border-t border-gray-100">
          {chapter.tasks && chapter.tasks.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Tasks</p>
              <div className="space-y-2">
                {chapter.tasks.map((task, idx) => (
                  <TaskRow
                    key={idx}
                    task={task}
                    subjectId={subjectId}
                    subjectName={subjectName}
                    chapterId={chapter.chapter_id}
                    chapterName={chapter.chapter_name}
                    onOpenMockTest={onOpenMockTest}
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

const SubjectSection: React.FC<{
  subject: ApiSubjectPlan;
  accentColor: string;
  defaultExpanded: boolean;
  onOpenMockTest: (assignmentId?: number) => void;
}> = ({ subject, accentColor, defaultExpanded, onOpenMockTest }) => {
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

  const overallMockTestProgress = subject.chapters.length > 0
    ? Math.round(subject.chapters.reduce((sum, ch) => {
      const mockProgress = ch.status?.toLowerCase() === "completed" ? 100 : Math.max(0, ch.progress_percentage - 20);
      return sum + mockProgress;
    }, 0) / subject.chapters.length) : 0;
  const mockTestStatus = overallMockTestProgress >= 100 ? "Completed" : "Pending";

  return (
    <div className="flex flex-col gap-3">
      <div
        className="bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between px-5 py-3 cursor-pointer select-none"
        style={{ borderLeft: `5px solid ${accentColor}` }}
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-base shadow-sm flex-shrink-0" style={{ background: accentColor }}>
            {subject.subject_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-base font-extrabold text-primary leading-tight">{subject.subject_name}</h3>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5">{subject.chapters?.length ?? 0} chapters &middot; {weeklyPlan.length} days planned</p>
          </div>
        </div>

        {prevWeekStatus !== "none" && (
          <span className={`inline-flex items-center gap-1 ml-6 px-3 py-1.5 rounded-full text-[11px] font-bold border flex-shrink-0 ${prevWeekStatus === "green" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-600"}`}>
            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>{prevWeekStatus === "green" ? "verified" : "warning"}</span>
            {prevWeekStatus === "green" ? "Prev Week: All done ✓" : "Prev Week: Pending ⚠️"}
          </span>
        )}

        <div className="flex items-center gap-3 flex-shrink-0 ml-auto">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-1.5">
            <span className="material-symbols-outlined text-primary" style={{ fontSize: 16 }}>quiz</span>
            <div className="leading-tight">
              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Overall Mock Test</p>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-extrabold text-primary">{overallMockTestProgress}%</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${overallMockTestProgress >= 100 ? "bg-green-50 border-green-200 text-green-700" : "bg-amber-50 border-amber-200 text-amber-700"}`}>
                  {mockTestStatus}
                </span>
              </div>
            </div>
          </div>
          <span className={`material-symbols-outlined text-gray-400 transition-transform duration-300 ${isExpanded ? "rotate-180" : "rotate-0"}`}>expand_more</span>
        </div>
      </div>

      <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? "max-h-[2000px]" : "max-h-0"}`}>
        <div className="flex flex-col lg:flex-row gap-4">
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
                <div className={`flex-shrink-0 rounded-2xl px-3 py-2 border-2 flex flex-col items-center justify-center gap-1 ${prevWeekStatus === "green" ? "bg-green-50 border-green-200" : prevWeekStatus === "red" ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200"}`}>
                  <span className={`material-symbols-outlined ${prevWeekStatus === "green" ? "text-green-500" : prevWeekStatus === "red" ? "text-red-400" : "text-gray-300"}`} style={{ fontSize: 20 }}>
                    {prevWeekStatus === "green" ? "verified" : prevWeekStatus === "red" ? "warning" : "history"}
                  </span>
                  <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 text-center leading-tight">Prev<br />Week</p>
                  <p className={`text-[9px] font-extrabold text-center ${prevWeekStatus === "green" ? "text-green-600" : prevWeekStatus === "red" ? "text-red-500" : "text-gray-400"}`}>
                    {prevWeekStatus === "green" ? "Done" : prevWeekStatus === "red" ? "Pending" : "—"}
                  </p>
                </div>
                <div className="w-px bg-gray-100 self-stretch flex-shrink-0 rounded-full" />
                {weeklyPlan.map((day) => (
                  <DayCard key={day.date} day={day} isSelected={selectedDate === day.date} isToday={day.date === today} isPast={day.date < today} onClick={() => handleDayClick(day)} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-gray-300 text-center">
                <span className="material-symbols-outlined text-4xl mb-2">calendar_month</span>
                <p className="text-xs font-medium text-gray-400">No plan available</p>
              </div>
            )}
            <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-gray-50">
              {[{ color: "bg-green-500", label: "Completed" }, { color: "bg-[#BADA55]", label: "In Progress" }, { color: "bg-amber-400", label: "Partial" }, { color: "bg-red-400", label: "Pending" }].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${color}`} />
                  <span className="text-[10px] text-gray-400 font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-[42%] bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-5 flex flex-col">
            <div className="mb-4">
              {selectedDayData ? (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{formatFullDate(selectedDayData.date)}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusPill(selectedDayData.status)}`}>{selectedDayData.progress}% done</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-700 ${progressBarColor(selectedDayData.progress)}`} style={{ width: `${selectedDayData.progress}%` }} />
                  </div>
                </>
              ) : (
                <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">Select a day</p>
              )}
            </div>

            <div className="space-y-2.5 flex-1 overflow-y-auto min-h-0 pr-1">
              {selectedDayData ? (
                selectedDayData.chapters.length > 0 ? (
                  selectedDayData.chapters.map((ch, idx) => (
                    <ChapterAccordion key={ch.chapter_id} chapter={ch} index={idx} subjectId={subject.subject_id} subjectName={subject.subject_name} onOpenMockTest={onOpenMockTest} />
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

// ─── Test Modal Component ─────────────────────────────────────────────────────

interface TestModalProps {
  isOpen: boolean;
  onClose: () => void;
  testDurationMinutes?: number;
  assessmentDetails?: any;
  attemptId?: number | null;
  assignmentId?: number;
  onComplete?: (result: any) => void;
}

const TestModal: React.FC<TestModalProps> = ({
  isOpen,
  onClose,
  testDurationMinutes = 30,
  assessmentDetails,
  attemptId,
  onComplete,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionOrder, setQuestionOrder] = useState<number[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [textualAnswers, setTextualAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(testDurationMinutes * 60);
  const [testFinished, setTestFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const questionStartTimeRef = useRef<number>(Date.now());
  const { showToast } = useToast();

  const questions = useMemo(() => {
    return assessmentDetails?.questions
      ? assessmentDetails.questions.map((q: ApiQuestion) => transformApiQuestion(q))
      : [];
  }, [assessmentDetails]);

  useEffect(() => {
    if (isOpen) {
      setCurrentQuestionIndex(0);
      setQuestionOrder(questions.map((q: Question) => q.id));
      setSelectedAnswers({});
      setTextualAnswers({});
      setTimeLeft(testDurationMinutes * 60);
      setTestFinished(false);
      questionStartTimeRef.current = Date.now();
    }
  }, [isOpen, testDurationMinutes, questions]);

  useEffect(() => {
    questionStartTimeRef.current = Date.now();
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, timeLeft]);

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  }, []);

  const finishAssessmentAndShowResult = useCallback(async () => {
    if (testFinished || !attemptId) return;
    setTestFinished(true);

    try {
      // Mocked API success response since this is hardcoded testing
      const resultData = {
        total_questions: questions.length,
        attempted_count: Object.keys(selectedAnswers).length + Object.keys(textualAnswers).length,
        correct_answers: 0,
        incorrect_answers: 0,
        skipped_answers: 0,
        score_obtained: 0,
        total_marks: 10,
        percentage: 0
      };
      
      const elapsed = testDurationMinutes * 60 - timeLeft;
      const mins = Math.floor(elapsed / 60);
      const secs = elapsed % 60;
      const timeTaken = `${mins}m ${secs}s`;

      const result = {
        totalQuestions: resultData.total_questions,
        answered: resultData.attempted_count,
        correct: resultData.correct_answers,
        incorrect: resultData.incorrect_answers,
        skipped: resultData.skipped_answers,
        score: resultData.score_obtained,
        maxScore: resultData.total_marks,
        timeTaken,
        percentage: resultData.percentage,
      };

      showToast("Assessment completed!", "success");
      onClose();
      if (onComplete) onComplete(result);
    } catch (error: any) {
      showToast("Failed to submit assessment", "error");
    }
  }, [attemptId, timeLeft, testDurationMinutes, onClose, onComplete, testFinished, showToast, questions.length, selectedAnswers, textualAnswers]);

  useEffect(() => {
    if (isOpen && timeLeft === 0 && !testFinished) {
      finishAssessmentAndShowResult();
    }
  }, [isOpen, timeLeft, testFinished, finishAssessmentAndShowResult]);

  if (!isOpen || questionOrder.length === 0) return null;

  const currentQuestionId = questionOrder[currentQuestionIndex];
  const currentQuestion = questions.find((q: Question) => q.id === currentQuestionId);

  if (!currentQuestion) return null;

  const isTextualQuestion = currentQuestion.options.length === 0;
  const totalQuestions = questionOrder.length;
  const answeredCount = isTextualQuestion
    ? Object.keys(textualAnswers).length + Object.keys(selectedAnswers).length
    : Object.keys(selectedAnswers).length + Object.keys(textualAnswers).length;
  const completedPercent = Math.round((answeredCount / totalQuestions) * 100);

  const totalTime = testDurationMinutes * 60;
  const timerProgress = timeLeft / totalTime;
  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference * (1 - timerProgress);

  const handleSelectOption = (optionLabel: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionLabel }));
  };

  const handleTextualAnswer = (text: string) => {
    setTextualAnswers((prev) => ({ ...prev, [currentQuestion.id]: text }));
  };

  const handleSkip = () => {
    setQuestionOrder((prev) => {
      const newOrder = [...prev];
      const [skipped] = newOrder.splice(currentQuestionIndex, 1);
      newOrder.push(skipped);
      return newOrder;
    });
  };

  const handleSubmit = async () => {
    if (isSubmitting || !attemptId) return;
    const answer = isTextualQuestion ? textualAnswers[currentQuestion.id] : selectedAnswers[currentQuestion.id];

    if (!answer) {
      showToast("Please select or enter an answer", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      // Mock saving the assessment
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        await finishAssessmentAndShowResult();
      }
    } catch (error: any) {
      showToast("Failed to save answer", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuit = () => setShowExitConfirm(true);
  const handleConfirmExit = async () => {
    setShowExitConfirm(false);
    await finishAssessmentAndShowResult();
  };
  const handleCancelExit = () => setShowExitConfirm(false);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overscroll-contain">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity touch-none" />
      <div className="relative w-full max-w-[850px] bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[95vh] sm:max-h-[90vh]">
        <button onClick={handleQuit} className="absolute top-5 right-4 z-20 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors bg-white/50 backdrop-blur-sm sm:bg-transparent sm:backdrop-blur-none">
          <X size={20} />
        </button>

        <div className="md:hidden flex flex-row items-center gap-4 p-4 sm:p-5 border-b border-gray-100 shrink-0">
          <div className="w-[52px] h-[52px] rounded-full border-[3px] border-[#E91E7B] flex items-center justify-center shrink-0">
            <span className="text-[#E91E7B] font-bold text-sm tracking-tight">{formatTime(timeLeft)}</span>
          </div>
          <div className="flex-1 pr-8">
            <p className="text-xs font-bold text-gray-800 mb-1.5">Completed {completedPercent}%</p>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-[#b0cb1f] transition-all duration-300" style={{ width: `${completedPercent}%` }} />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row min-h-0 sm:min-h-[420px] flex-1 overflow-hidden">
          <div className="hidden md:flex w-[260px] bg-[#f2f2f2] flex-col items-center justify-between py-8 px-6 shrink-0 z-10 border-r border-gray-200">
            <div className="flex flex-col items-center mt-4 shrink-0">
              <div className="relative w-[170px] h-[170px]">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r="70" fill="none" stroke="#e8e8e8" strokeWidth="8" />
                  <circle cx="80" cy="80" r="70" fill="none" stroke="#E91E7B" strokeWidth="8" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className="transition-all duration-1000 ease-linear" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-[#E91E7B] tracking-wider font-mono">{formatTime(timeLeft)}</span>
                  <span className="text-xs text-gray-400 mt-1">left until break</span>
                </div>
              </div>
            </div>
            <div className="w-full mt-auto flex flex-col justify-center">
              <p className="text-sm font-semibold text-gray-700 mb-1.5">Completed {completedPercent}%</p>
              <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
                <div className="h-full bg-[#b0cb1f] rounded-full transition-all duration-300" style={{ width: `${completedPercent}%` }} />
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col p-5 sm:p-8 overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 pr-8 sm:pr-0">Assessment</h2>
            <p className="text-base sm:text-sm font-bold text-gray-800 mb-5 leading-relaxed">
              Q{currentQuestion.sl_no ?? questions.findIndex((q: Question) => q.id === currentQuestion.id) + 1}. {currentQuestion.question}
            </p>

            {isTextualQuestion ? (
              <div className="mb-auto shrink-0">
                <textarea
                  value={textualAnswers[currentQuestion.id] || ""}
                  onChange={(e) => handleTextualAnswer(e.target.value)}
                  placeholder="Enter your answer here..."
                  className="w-full h-32 sm:h-40 px-4 py-3 border border-gray-300 rounded-xl text-base sm:text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#b0cb1f] focus:border-[#b0cb1f] transition-all"
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 sm:gap-y-4 mb-auto shrink-0">
                {currentQuestion.options.map((option: Option) => {
                  const isSelected = selectedAnswers[currentQuestion.id] === option.label;
                  return (
                    <button key={option.label} onClick={() => handleSelectOption(option.label)} className="flex items-start sm:items-center gap-3 text-left group p-2 sm:p-0 -mx-2 sm:mx-0 rounded-lg hover:bg-gray-50 sm:hover:bg-transparent transition-colors">
                      <div className={`w-5 h-5 sm:w-6 sm:h-6 mt-0.5 sm:mt-0 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${isSelected ? "bg-[#b0cb1f] border-[#b0cb1f]" : "border-gray-300 bg-white group-hover:border-[#b0cb1f]"}`}>
                        {isSelected && <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      <span className="text-base sm:text-sm text-gray-700 font-medium">{option.label}. {option.text}</span>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-0 mt-6 sm:mt-8 pt-4 border-t border-gray-100 sm:border-transparent shrink-0 w-full">
              <button onClick={handleQuit} disabled={isSubmitting} className="order-3 md:order-1 w-full md:w-auto px-6 py-3 md:py-2.5 rounded-full bg-[#464646] text-white text-base md:text-sm font-medium hover:bg-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Quit
              </button>
              <div className="order-1 md:order-2 flex flex-col md:flex-row w-full md:w-auto md:ml-auto gap-3">
                <button onClick={handleSkip} disabled={isSubmitting} className="order-2 md:order-1 w-full md:w-auto px-6 py-3 md:py-2.5 rounded-full bg-[#464646] text-white text-base md:text-sm font-medium hover:bg-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  Skip for now
                </button>
                <button onClick={handleSubmit} disabled={isSubmitting} className="order-1 md:order-2 w-full md:w-auto px-6 py-3 md:py-2.5 rounded-full bg-[#b0cb1f] text-gray-900 text-base md:text-sm font-semibold hover:bg-[#c5de3a] transition-all sm:hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:sm:hover:scale-100">
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showExitConfirm && (
        <div className="absolute inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={handleCancelExit} />
          <div className="relative bg-white rounded-2xl p-5 sm:p-6 max-w-md w-full shadow-2xl animate-[fadeIn_0.15s_ease-out]">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Quit Assessment?</h3>
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to Quit? Your assessment will be submitted and you won't be able to continue.</p>
            <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
              <button onClick={handleCancelExit} className="w-full sm:w-auto px-5 py-2.5 sm:py-2 rounded-full bg-gray-200 text-gray-700 text-base sm:text-sm font-medium hover:bg-gray-300 transition-colors">Cancel</button>
              <button onClick={handleConfirmExit} className="w-full sm:w-auto px-5 py-2.5 sm:py-2 rounded-full bg-[#E91E7B] text-white text-base sm:text-sm font-medium hover:bg-[#d11a6d] transition-colors">Quit & Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Constants ────────────────────────────────────────────────────────────────

const SUBJECT_COLORS = [
  "#BADA55", "#4F8EF7", "#F97316", "#A855F7", "#14B8A6", "#EF4444", "#F59E0B",
];

// ─── Main Component ───────────────────────────────────────────────────────────

const LearningPlanner: React.FC = () => {
  const [subjects, setSubjects] = useState<ApiSubjectPlan[]>([]);
  const [profileImage, setProfileImage] = useState<string>(" ");
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // ── Modal State ──
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [activeAssignmentId, setActiveAssignmentId] = useState<number | null>(null);

  const handleOpenMockTest = useCallback((assignmentId?: number) => {
    setActiveAssignmentId(assignmentId || 999); // Provide fallback ID
    setIsTestModalOpen(true);
  }, []);

  const handleCloseTestModal = useCallback(() => {
    setIsTestModalOpen(false);
    setActiveAssignmentId(null);
  }, []);

  const fetchLearningPlan = async () => {
    try {
      const getResponse = await ApiServices.getStudentLearningPlanner();
      const getResult = getResponse.data;

      if (getResult.status === "success" && getResult.data.subject_wise_plan?.length > 0) {
        setSubjects(getResult.data.subject_wise_plan.map(patchSubjectPlan));
        setStats(getResult.data.stats);
        return;
      }

      await ApiServices.generateLearningPlan({ topic_ids: null });

      const newGetResponse = await ApiServices.getStudentLearningPlanner();
      const newGetResult = newGetResponse.data;

      if (newGetResult.status === "success" && newGetResult.data.subject_wise_plan?.length > 0) {
        setSubjects(newGetResult.data.subject_wise_plan.map(patchSubjectPlan));
        setStats(newGetResult.data.stats);
      }
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProfileImage = async () => {
    try {
      const response = await ApiServices.getUserProfileImage();
      if (response.data?.status === "success" && response.data?.data?.image)
        setProfileImage(response.data.data.image);
    } catch { }
  };

  useEffect(() => {
    fetchLearningPlan();
    fetchProfileImage();
  }, []);

  const getInitial = () => stats?.student_name?.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen p-6 relative">
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
          {stats && (
            <div className="flex flex-col gap-0.5">
              <span className="text-2xl text-[#ABB3BC] font-bold tracking-wide">Learning Planner</span>
              <h1 className="text-3xl font-bold text-primary m-0">
                Hi {stats.student_name
                  ? stats.student_name.split(" ").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
                  : ""}!
              </h1>
              <p className="text-sm text-primary font-medium m-0">{stats.institute_name}</p>
              <p className="text-sm text-primary m-0">{stats.board_name} | {stats.class_name}</p>
              <p className="text-sm text-primary m-0 break-words max-w-xl">
                Subject: {stats.subject_names?.join(", ")}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-start gap-10">
          {stats && (
            <div className="flex items-center gap-4">
              <div className="w-[6rem] h-[6rem] rounded-full bg-yellow flex items-center justify-center shadow-inner">
                <span className="text-4xl font-bold text-red">{stats.days_left}</span>
              </div>
              <div className="leading-snug">
                <p className="text-xs font-bold mt-7 text-primary">Days Left for<br />Annual<br />Exam</p>
                <br /><strong>{stats.examName}</strong>
              </div>
            </div>
          )}
          {stats && (
            <>
              {[
                { value: stats.chapters_assigned, label: "Chapters Assigned" },
                { value: stats.completed_count, label: "Completed" },
                { value: stats.pending_count, label: "Pending" },
              ].map(({ value, label }) => (
                <div key={label} className="text-center flex flex-col items-center">
                  <div className="w-[4.688rem] h-[4.688rem] rounded-full bg-yellow flex items-center justify-center mb-1 shadow-inner">
                    <span className="text-lg font-bold text-red">{value}</span>
                  </div>
                  <p className="text-xs font-medium text-primary w-[4.688rem] leading-tight">{label}</p>
                </div>
              ))}
              <div className="text-center flex flex-col items-center">
                <div className="w-[4.688rem] h-[4.688rem] rounded-full bg-yellow flex items-center justify-center mb-1 shadow-inner">
                  <span className="text-lg font-bold text-red">#12</span>
                </div>
                <p className="text-xs font-medium text-primary w-[4.688rem] leading-tight">Leadership Board Position</p>
              </div>
            </>
          )}
        </div>
      </header>

      <div className="border-t-4 border-gray-300 mb-6" />

      {subjects.length > 0 ? (
        <div className="flex flex-col gap-6">
          {subjects.map((subject, idx) => (
            <SubjectSection
              key={subject.subject_id}
              subject={subject}
              accentColor={SUBJECT_COLORS[idx % SUBJECT_COLORS.length]}
              defaultExpanded={subjects.length <= 2}
              onOpenMockTest={handleOpenMockTest} // Pass the open handler down
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

      {/* ── Test Modal (Hardcoded injection point) ── */}
      <TestModal
        isOpen={isTestModalOpen}
        onClose={handleCloseTestModal}
        testDurationMinutes={15} // Hardcoded 15 mins
        assessmentDetails={HARDCODED_ASSESSMENT}
        attemptId={999} // Hardcoded attempt ID
        assignmentId={activeAssignmentId ?? undefined}
      />

    </div>
  );
};

export default LearningPlanner;