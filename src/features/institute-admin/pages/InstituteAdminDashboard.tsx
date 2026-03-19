import React, { useState } from "react";

// --- Types ---
interface TeacherPerformance {
  id: number;
  name: string;
  subject: string;
  rating: number;
  avgScore: number;
  studentsCount: number;
  classesCount: number;
  trend: "up" | "down" | "stable";
}

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: string;
  color: string;
  bgColor: string;
  trend?: string;
  trendType?: "up" | "down";
}

// --- Hardcoded Data ---
const TEACHER_PERFORMANCE: TeacherPerformance[] = [
  { id: 1, name: "Dr. Sarah Wilson", subject: "Advanced Physics", rating: 4.9, avgScore: 88, studentsCount: 120, classesCount: 4, trend: "up" },
  { id: 2, name: "Prof. John Miller", subject: "Mathematics", rating: 4.7, avgScore: 82, studentsCount: 155, classesCount: 5, trend: "up" },
  { id: 3, name: "Emily Brown", subject: "English Literature", rating: 4.8, avgScore: 91, studentsCount: 95, classesCount: 3, trend: "stable" },
  { id: 4, name: "David Chen", subject: "Computer Science", rating: 4.5, avgScore: 78, studentsCount: 110, classesCount: 4, trend: "down" },
  { id: 5, name: "Maria Garcia", subject: "Biology", rating: 4.6, avgScore: 85, studentsCount: 130, classesCount: 4, trend: "up" },
];

const SUBJECT_PERFORMANCE = [
  { subject: "Mathematics", coverage: 85, color: "#60a5fa" },
  { subject: "Physics", coverage: 72, color: "#b0cb1f" },
  { subject: "Science", coverage: 94, color: "#34d399" },
  { subject: "History", coverage: 60, color: "#f97316" },
  { subject: "English", coverage: 88, color: "#a78bfa" },
];

const RATING_DISTRIBUTION = [
  { label: "4.5 - 5.0", count: 12, percentage: 60, color: "#22c55e" },
  { label: "4.0 - 4.5", count: 6, percentage: 30, color: "#84cc16" },
  { label: "3.5 - 4.0", count: 2, percentage: 10, color: "#facc15" },
  { label: "Below 3.5", count: 0, percentage: 0, color: "#ea4335" },
];

// --- Components ---
const MetricCard: React.FC<MetricCardProps> = ({ label, value, icon, color, bgColor, trend, trendType }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center`}>
        <span className={`material-symbols-outlined text-2xl`} style={{ color }}>{icon}</span>
      </div>
      {trend && (
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${trendType === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-[#ea4335]'}`}>
          {trend}
        </span>
      )}
    </div>
    <p className="text-primary text-sm font-medium uppercase tracking-wider">{label}</p>
    <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
  </div>
);

const InstituteAdminDashboard: React.FC = () => {
  const [filter, setFilter] = useState("all");

  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* --- HEADER --- */}
      <header className="relative overflow-hidden rounded-3xl p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-primary text-4xl font-extrabold tracking-tight">Academic Performance Dashboard</h1>
            <p className="text-primary font-medium">Providing real-time insights into faculty excellence and curriculum progress.</p>
          </div>
          <div className="flex gap-3">
            {/* <button className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl font-bold hover:bg-white/20 transition-all">
              Download Report
            </button> */}
            {/* <button
              onClick={() => setIsFacultyModalOpen(true)}
              className="px-6 py-3 bg-[#b0cb1f] text-gray-900 rounded-xl font-bold hover:opacity-90 shadow-lg shadow-[#b0cb1f]/20 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>manage_accounts</span>
              Manage Faculty
            </button> */}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#b0cb1f] opacity-5 blur-[100px] -mr-32 -mt-32 rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 opacity-5 blur-[100px] -ml-32 -mb-32 rounded-full"></div>
      </header>

      {/* --- KEY METRICS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          label="Total Faculty"
          value="32"
          icon="groups"
          color="#3b82f6"
          bgColor="bg-blue-50"
          trend="Stable"
          trendType="up"
        />
        <MetricCard
          label="Avg. Faculty Rating"
          value="4.81 / 5"
          icon="star"
          color="#ffed00"
          bgColor="bg-yellow-50"
          trend="+0.05 pts"
          trendType="up"
        />
        <MetricCard
          label="Syllabus Coverage"
          value="82.1%"
          icon="menu_book"
          color="#10b981"
          bgColor="bg-emerald-50"
          trend="Ahead of schedule"
          trendType="up"
        />
        <MetricCard
          label="Pending Feedbacks"
          value="8"
          icon="rate_review"
          color="#ea4335"
          bgColor="bg-rose-50"
          trend="Required"
          trendType="down"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- PERFORMANCE TABLE --- */}
        <section className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                <span className="material-symbols-outlined text-indigo-500">leaderboard</span>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Faculty Performance Ranking</h2>
            </div>
            <select
              className="bg-gray-50 border-none text-sm font-bold py-2 px-4 rounded-xl focus:ring-2 focus:ring-[#b0cb1f]"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Departments</option>
              <option value="science">Science</option>
              <option value="arts">Humanities</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-primary text-xs font-medium uppercase tracking-widest">
                  <th className="px-6 py-4">Teacher</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">Rating</th>
                  <th className="px-6 py-4">Avg Student Score</th>
                  <th className="px-6 py-4 text-center">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {TEACHER_PERFORMANCE.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-bold text-gray-600 border border-gray-200">
                          {teacher.name.charAt(0)}
                        </div>
                        <span className="font-bold text-gray-700 group-hover:text-gray-900 transition-colors">{teacher.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">{teacher.subject}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[#ffed00] text-lg fill-current">star</span>
                        <span className="font-bold text-gray-800">{teacher.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden max-w-[100px]">
                          <div
                            className={`h-full rounded-full ${teacher.avgScore >= 85 ? 'bg-green-500' : teacher.avgScore >= 75 ? 'bg-[#ffed00]' : 'bg-[#ea4335]'}`}
                            style={{ width: `${teacher.avgScore}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-gray-800 text-xs">{teacher.avgScore}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`material-symbols-outlined ${teacher.trend === 'up' ? 'text-green-500' : teacher.trend === 'down' ? 'text-[#ea4335]' : 'text-gray-300'}`}>
                        {teacher.trend === 'up' ? 'trending_up' : teacher.trend === 'down' ? 'trending_down' : 'horizontal_rule'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-gray-50/50 border-t border-gray-50 text-center">
            <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700">Detailed Faculty Analysis</button>
          </div>
        </section>

        {/* --- ANALYTICS SIDEBAR --- */}
        <div className="space-y-8">
          {/* Syllabus Coverage */}
          <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                <span className="material-symbols-outlined text-emerald-500">auto_stories</span>
              </div>
              <h2 className="text-lg font-bold text-gray-800">Syllabus Coverage</h2>
            </div>

            <div className="space-y-5">
              {SUBJECT_PERFORMANCE.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-medium">
                    <span>{item.subject}</span>
                    <span style={{ color: item.color }}>{item.coverage}%</span>
                  </div>
                  <div className="h-3 bg-gray-50 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 shadow-sm"
                      style={{ width: `${item.coverage}%`, backgroundColor: item.color }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Rating Distribution */}
          <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                <span className="material-symbols-outlined text-amber-500">bar_chart</span>
              </div>
              <h2 className="text-lg font-bold text-gray-800">Rating Distribution</h2>
            </div>

            <div className="space-y-4">
              {RATING_DISTRIBUTION.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <span className="text-xs font-bold text-gray-500 w-16">{item.label}</span>
                  <div className="flex-1 h-8 bg-gray-50 rounded-lg overflow-hidden flex items-center px-1">
                    <div
                      className="h-6 rounded-md transition-all duration-1000"
                      style={{ width: `${Math.max(item.percentage, 5)}%`, backgroundColor: item.color }}
                    ></div>
                  </div>
                  <span className="text-xs font-extrabold text-gray-700 w-6 text-right">{item.count}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default InstituteAdminDashboard;
