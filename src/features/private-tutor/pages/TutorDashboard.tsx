import React, { useState, useEffect } from "react";
import ApiServices from "../../../services/ApiServices";
import {
  Users,
  BookOpen,
  ClipboardList,
  TrendingUp,
  Clock,
  ChevronRight,
  Star,
  CheckCircle2,
  Circle,
} from "lucide-react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface StatCard {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ReactNode;
  accent: string;
  iconBg: string;
}

interface Student {
  id: number;
  name: string;
  subject: string;
  grade: string;
  progress: number;
  avatar: string;
  status: "On Track" | "Needs Attention" | "Excellent";
}

interface ScheduleItem {
  id: number;
  title: string;
  time: string;
  student: string;
  subject: string;
  done: boolean;
}

// ─────────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────────
const STAT_CARDS: StatCard[] = [
  {
    label: "Active Students",
    value: 12,
    sub: "+2 this month",
    icon: <Users size={18} />,
    accent: "text-violet-600",
    iconBg: "bg-violet-50",
  },
  {
    label: "Subjects Teaching",
    value: 5,
    sub: "Math, Science, English…",
    icon: <BookOpen size={18} />,
    accent: "text-[#7a9900]",
    iconBg: "bg-lime-50",
  },
  {
    label: "Tests Assigned",
    value: 34,
    sub: "8 pending review",
    icon: <ClipboardList size={18} />,
    accent: "text-blue-600",
    iconBg: "bg-blue-50",
  },
  {
    label: "Avg. Performance",
    value: "78%",
    sub: "+4% vs last month",
    icon: <TrendingUp size={18} />,
    accent: "text-emerald-600",
    iconBg: "bg-emerald-50",
  },
];

const STUDENTS: Student[] = [
  {
    id: 1,
    name: "Aarav Sharma",
    subject: "Mathematics",
    grade: "Class 10",
    progress: 82,
    avatar: "A",
    status: "On Track",
  },
  {
    id: 2,
    name: "Priya Mehta",
    subject: "Science",
    grade: "Class 9",
    progress: 95,
    avatar: "P",
    status: "Excellent",
  },
  {
    id: 3,
    name: "Rohan Verma",
    subject: "English",
    grade: "Class 8",
    progress: 61,
    avatar: "R",
    status: "Needs Attention",
  },
  {
    id: 4,
    name: "Sneha Patel",
    subject: "Mathematics",
    grade: "Class 10",
    progress: 74,
    avatar: "S",
    status: "On Track",
  },
  {
    id: 5,
    name: "Karan Singh",
    subject: "Physics",
    grade: "Class 11",
    progress: 88,
    avatar: "K",
    status: "Excellent",
  },
];

const SCHEDULE: ScheduleItem[] = [
  {
    id: 1,
    title: "Chapter Test – Algebra",
    time: "10:00 AM",
    student: "Aarav Sharma",
    subject: "Math",
    done: true,
  },
  {
    id: 2,
    title: "Doubt Clearing Session",
    time: "12:30 PM",
    student: "Rohan Verma",
    subject: "English",
    done: false,
  },
  {
    id: 3,
    title: "Mock Test Review",
    time: "03:00 PM",
    student: "Priya Mehta",
    subject: "Science",
    done: false,
  },
  {
    id: 4,
    title: "Weekly Progress Call",
    time: "05:00 PM",
    student: "Sneha Patel",
    subject: "Math",
    done: false,
  },
];

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const avatarGradients = [
  "from-violet-500 to-purple-600",
  "from-blue-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-rose-500 to-pink-500",
  "from-orange-500 to-amber-500",
];

const statusConfig: Record<
  Student["status"],
  { bg: string; text: string; dot: string }
> = {
  "On Track": { bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-400" },
  Excellent: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    dot: "bg-emerald-500",
  },
  "Needs Attention": {
    bg: "bg-amber-50",
    text: "text-amber-600",
    dot: "bg-amber-400",
  },
};

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
const TutorDashboard: React.FC = () => {
  const [scheduleItems, setScheduleItems] = useState(SCHEDULE);

  const [profileImage, setProfileImage] = useState<string>("");
  const [isImageLoading, setIsImageLoading] = useState(false);

  const tutorName =
    JSON.parse(localStorage.getItem("active_profile") || "{}")?.full_name ||
    "Tutor";

  const fetchProfileImage = async () => {
    try {
      setIsImageLoading(true);
      const response = await ApiServices.getUserProfileImage();

      if (response.data?.status === "success" && response.data?.data?.image) {
        setProfileImage(response.data.data.image); // base64 image
      }
    } catch (error) {
      // console.error("Failed to fetch profile image", error);
    } finally {
      setIsImageLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileImage();
  }, []);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const toggleDone = (id: number) => {
    setScheduleItems((prev) =>
      prev.map((s) => (s.id === id ? { ...s, done: !s.done } : s))
    );
  };

  const completedCount = scheduleItems.filter((s) => s.done).length;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Profile Image Section */}
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-2xl overflow-hidden ring-4 ring-white shadow-md bg-gradient-to-br from-[#BADA55] to-lime-400 flex items-center justify-center text-white text-2xl font-black">
              {isImageLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                tutorName.charAt(0).toUpperCase()
              )}
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-400 font-medium">{today}</p>
            <h1 className="text-2xl font-extrabold text-gray-800 leading-tight mt-0.5">
              Welcome back,{" "}
              <span className="text-[#7a9900]">{tutorName} 👋</span>
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Here's your teaching overview for today.
            </p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex gap-2 shrink-0">
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-600 hover:border-[#b0cb1f] hover:text-[#7a9900] transition-all shadow-sm">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "16px" }}
            >
              assignment_add
            </span>
            Assign Test
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#BADA55] text-gray-800 text-sm font-bold hover:bg-lime-400 transition-all shadow-sm hover:-translate-y-0.5 hover:shadow-md">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "16px", fontVariationSettings: "'FILL' 1" }}
            >
              person_add
            </span>
            Invite Student
          </button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div
                className={`w-9 h-9 rounded-xl ${card.iconBg} ${card.accent} flex items-center justify-center`}
              >
                {card.icon}
              </div>
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                {card.label}
              </span>
            </div>
            <div>
              <p className={`text-3xl font-extrabold ${card.accent} leading-none`}>
                {card.value}
              </p>
              <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Content: Students + Schedule ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Students List */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Users size={15} className="text-[#7a9900]" />
              <h2 className="text-sm font-bold text-gray-800">My Students</h2>
            </div>
            <button className="flex items-center gap-1 text-[11px] font-semibold text-gray-400 hover:text-[#7a9900] transition-colors">
              View all <ChevronRight size={13} />
            </button>
          </div>

          <div className="divide-y divide-gray-50">
            {STUDENTS.map((student, idx) => {
              const cfg = statusConfig[student.status];
              const grad = avatarGradients[idx % avatarGradients.length];
              return (
                <div
                  key={student.id}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/70 transition-colors"
                >
                  {/* Avatar */}
                  <div
                    className={`w-9 h-9 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm`}
                  >
                    {student.avatar}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {student.name}
                      </p>
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}
                        />
                        {student.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400">
                      {student.subject} · {student.grade}
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="w-24 shrink-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-gray-400">Progress</span>
                      <span className="text-[10px] font-bold text-gray-700">
                        {student.progress}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${student.progress}%`,
                          background:
                            student.progress >= 80
                              ? "#22c55e"
                              : student.progress >= 65
                              ? "#BADA55"
                              : "#f59e0b",
                        }}
                      />
                    </div>
                  </div>

                  {/* Star for excellent */}
                  {student.status === "Excellent" && (
                    <Star
                      size={13}
                      className="text-amber-400 fill-amber-400 shrink-0"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Clock size={15} className="text-[#7a9900]" />
              <h2 className="text-sm font-bold text-gray-800">
                Today's Schedule
              </h2>
            </div>
            <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
              {completedCount}/{scheduleItems.length} done
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-gray-100">
            <div
              className="h-full bg-[#BADA55] transition-all duration-500"
              style={{
                width: `${(completedCount / scheduleItems.length) * 100}%`,
              }}
            />
          </div>

          <div className="divide-y divide-gray-50 flex-1 overflow-y-auto">
            {scheduleItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-start gap-3 px-5 py-4 transition-colors ${
                  item.done ? "opacity-50" : "hover:bg-gray-50/70"
                }`}
              >
                <button
                  onClick={() => toggleDone(item.id)}
                  className="mt-0.5 shrink-0 text-gray-300 hover:text-[#7a9900] transition-colors"
                >
                  {item.done ? (
                    <CheckCircle2 size={17} className="text-[#7a9900]" />
                  ) : (
                    <Circle size={17} />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-semibold leading-snug ${
                      item.done
                        ? "text-gray-400 line-through"
                        : "text-gray-800"
                    }`}
                  >
                    {item.title}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5 truncate">
                    {item.student} · {item.subject}
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-gray-400 shrink-0 bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Row: Quick Insights ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Pending Reviews */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
            <span
              className="material-symbols-outlined text-amber-500"
              style={{
                fontSize: "20px",
                fontVariationSettings: "'FILL' 1, 'wght' 500",
              }}
            >
              pending_actions
            </span>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-gray-800">8</p>
            <p className="text-xs text-gray-400">Tests pending review</p>
          </div>
        </div>

        {/* Notes Shared */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <span
              className="material-symbols-outlined text-blue-500"
              style={{
                fontSize: "20px",
                fontVariationSettings: "'FILL' 1, 'wght' 500",
              }}
            >
              description
            </span>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-gray-800">24</p>
            <p className="text-xs text-gray-400">Study notes shared</p>
          </div>
        </div>

        {/* Invitations */}
        <div className="bg-gradient-to-br from-[#BADA55] to-lime-400 rounded-2xl border border-lime-200 shadow-sm p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/25 flex items-center justify-center shrink-0">
            <span
              className="material-symbols-outlined text-gray-800"
              style={{
                fontSize: "20px",
                fontVariationSettings: "'FILL' 1, 'wght' 500",
              }}
            >
              mail
            </span>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-gray-800">3</p>
            <p className="text-xs text-gray-700 font-medium">
              Pending invitations
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;
