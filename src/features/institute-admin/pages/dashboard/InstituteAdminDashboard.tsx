import React, { useEffect, useState } from "react";
import {
  dashboardMeta,
  principalProfile,
  scoringWeights,
  actionInsights,
} from "./data/teacherReview.data";
import type { ActionInsight, TeacherScorecard, StatCard } from "./data/teacherReview.types";
import { DashboardHeader } from "../../../../components/common/DashboardHeader";
import ApiServices from "../../../../services/ApiServices";
import Loader from "../../../../components/common/Loader";

// --- Helpers ---
const gradeColor = (grade: string) => {
  if (grade === "A" || grade === "A-") return "text-green-600 font-bold";
  if (grade.startsWith("B")) return "text-blue-600 font-bold";
  if (grade.startsWith("C")) return "text-orange-500 font-bold";
  return "text-red-500 font-bold";
};

const insightIcon = (type: ActionInsight["type"]) => {
  switch (type) {
    case "success": return { icon: "●", color: "text-green-500" };
    case "danger": return { icon: "●", color: "text-red-500" };
    case "warning": return { icon: "●", color: "text-orange-400" };
    case "info": return { icon: "○", color: "text-blue-400" };
  }
};

const InstituteAdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ApiServices.getInstituteAdminDashboard();
        if (response.data.status === "success") {
          setDashboardData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader />;
  if (!dashboardData) return <div className="p-10 text-center">No data found</div>;

  // Main 5 Stat Cards as per image
  const mainStats: StatCard[] = [
    {
      label: "Overall Score",
      value: (dashboardData.overall_score ?? 0).toString(),
      subLabel: "8 Classes, 24 Sections",
      color: "text-[#79C9D2]",
    },
    {
      label: "Active Teachers",
      value: (dashboardData.active_teachers ?? 0).toString(),
      subLabel: "MokshaPath engaged",
      color: "text-[#F5B041]",
    },
    {
      label: "Avg Benchmark Att.",
      value: (dashboardData.avg_benchmark_attainment ?? 0).toString(),
      suffix: "%",
      subLabel: "Across all subjects",
      color: "text-[#7DCEA0]",
    },
    {
      label: "Syllabus On-Track",
      value: (dashboardData.syllabus_on_track_percent ?? 0).toString(),
      suffix: "%",
      subLabel: "School-wide avg",
      color: "text-[#7DCEA0]",
    },
    {
      label: "At-Risk Recovery",
      value: (dashboardData.at_risk_recovery_percent ?? 0).toString(),
      suffix: "%",
      subLabel: "Of flagged students",
      color: "text-[#F5B041]",
    },
  ];

  // Extra KPIs
  const extraKpis = [
    { label: "Avg Accuracy Improvement", value: dashboardData.avg_accuracy_improvement ?? 0, suffix: "%" },
    { label: "Avg Consistency Index", value: dashboardData.avg_consistency_index ?? 0, suffix: "" },
    { label: "Avg Intervention Index", value: dashboardData.avg_intervention_index ?? 0, suffix: "" },
    { label: "Avg Teacher Improvement", value: dashboardData.avg_teacher_improvement ?? 0, suffix: "%" },
    { label: "Avg Teacher Score", value: dashboardData.avg_teacher_score ?? 0, suffix: "" },
    { label: "Bottom Percent", value: dashboardData.bottom_percent ?? 0, suffix: "%" },
    { label: "Consistent Performer", value: dashboardData.consistent_performer_percent ?? 0, suffix: "%" },
    { label: "High Impact Teacher", value: dashboardData.high_impact_teacher_percent ?? 0, suffix: "%" },
    { label: "Improvement Consistency", value: dashboardData.improvement_consistency_percent ?? 0, suffix: "%" },
    { label: "Mid Percent", value: dashboardData.mid_percent ?? 0, suffix: "%" },
    { label: "School Avg Score", value: dashboardData.school_avg_score ?? 0, suffix: "" },
    { label: "School Readiness Index", value: dashboardData.school_readiness_index ?? 0, suffix: "" },
    { label: "Top Percent", value: dashboardData.top_percent ?? 0, suffix: "%" },
  ];

  const teacherScorecards: TeacherScorecard[] = (dashboardData.teacher_data ?? []).map((t: any) => ({
    name: t.teacher ?? "N/A",
    subjects: t.subjects ?? "N/A",
    classes: t.classes ?? "N/A",
    bench: t.bench ?? 0,
    syllabus: t.syllabus ?? 0,
    mockEng: t.mock_eng ?? 0,
    riskRes: t.risk_res ?? 0,
    accGwth: t.acc_gwth ?? 0,
    score: t.score ?? 0,
    grade: t.grade ?? "N/A",
  }));

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <DashboardHeader
        profile={principalProfile}
        meta={dashboardMeta}
        profileAltText="Principal Profile"
      />

      <div className="flex flex-col gap-8 px-12 py-5">
        {/* Main Stat row */}
        <div className="flex w-full justify-between gap-4">
          {mainStats.map((stat, i) => (
            <div key={i} className="text-start">
              <p
                className={`font-light leading-none text-4xl lg:text-5xl ${stat.color}`}
              >
                {stat.value}
                {stat.suffix && (
                  <span className="text-2xl font-light">
                    {stat.suffix}
                  </span>
                )}
              </p>
              <p className="text-[13px] font-bold text-gray-800 mt-2 whitespace-nowrap">
                {stat.label}
              </p>
              <p className="text-[11px] text-gray-600 font-medium whitespace-nowrap">
                {stat.subLabel}
              </p>
            </div>
          ))}
        </div>

        {/* Extra KPIs row */}
        <div className="flex flex-wrap gap-x-12 gap-y-6 pt-2">
            {extraKpis.map((kpi, i) => (
                <div key={i} className="flex flex-col min-w-[120px]">
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tight whitespace-nowrap mb-1">{kpi.label}</span>
                    <span className="text-lg font-bold text-gray-800">{kpi.value}{kpi.suffix}</span>
                </div>
            ))}
        </div>
      </div>

      {/* ── SCORECARD TABLE ────────────────────────────── */}
      <div className="rounded-xl mb-5 overflow-hidden">
        <div className="px-12 pt-6 pb-2">
          <span className="font-bold text-sm text-gray-800 uppercase tracking-wide">Teacher Performance Scorecards</span>
          <span className="text-[10px] text-gray-400 ml-2 font-medium">Each Benchmarked in Own Domain</span>
        </div>

        <div className="overflow-x-auto px-12">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t-4 border-[#E0E0E0] border-b-4 border-[#E0E0E0] text-primary text-sm font-bold">
                <th className="px-4 py-2 text-left">Teacher</th>
                <th className="px-4 py-2 text-left">
                  Subjects<br />
                  <span className="font-normal text-primary text-[10px]">(Own benchmark)</span>
                </th>
                <th className="px-4 py-2 text-left">Classes</th>
                <th className="px-4 py-2 text-left">Bench%</th>
                <th className="px-4 py-2 text-left">Syllabus%</th>
                <th className="px-4 py-2 text-left">Mock Eng%</th>
                <th className="px-4 py-2 text-left">Risk Res%</th>
                <th className="px-4 py-2 text-left">Acc Gwth%</th>
                <th className="px-4 py-2 text-left">Score</th>
                <th className="px-4 py-2 text-left">Grade</th>
              </tr>
            </thead>
            <tbody>
              {teacherScorecards.map((t, i) => (
                <tr key={i} className="border-b border-gray-200 hover:bg-gray-50 text-xs font-bold transition-colors">
                  <td className="px-4 py-3 font-bold text-primary whitespace-nowrap">{t.name}</td>
                  <td className="px-4 py-3 text-primary">{t.subjects}</td>
                  <td className="px-4 py-3 text-primary">{t.classes}</td>
                  <td className="px-4 py-3 text-primary">{t.bench}%</td>
                  <td className="px-4 py-3 text-primary">{t.syllabus}%</td>
                  <td className="px-4 py-3 text-primary">{t.mockEng}%</td>
                  <td className="px-4 py-3 text-primary">{t.riskRes}%</td>
                  <td className="px-4 py-3 text-primary">{t.accGwth}%</td>
                  <td className="px-4 py-3 font-bold text-primary">{t.score}</td>
                  <td className={`px-4 py-3 ${gradeColor(t.grade)}`}>{t.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── BOTTOM ROW ────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-12 mt-8">
        {/* Scoring Guide */}
        <div className="bg-[#f5f9e8] border border-[#d4e68a] rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <svg width="40" height="40" viewBox="0 0 36 36" className="shrink-0">
              <path d="M3 20 A15 15 0 0 1 33 20" fill="none" stroke="#c5de4a" strokeWidth="5" strokeLinecap="round" />
              <path d="M18 20 L12 10" stroke="#333" strokeWidth="2" strokeLinecap="round" />
              <circle cx="18" cy="20" r="2" fill="#333" />
            </svg>
            <div>
              <p className="font-bold text-sm text-gray-800">Scoring Guide</p>
              <p className="text-[10px] text-gray-600 font-medium">(within own subject benchmark):</p>
            </div>
          </div>

          <div className="flex w-full h-5 rounded-xl overflow-hidden mb-3">
            {scoringWeights.map((w, i) => {
              const colors = ["bg-yellow-400", "bg-lime-400", "bg-green-400", "bg-teal-400", "bg-cyan-400"];
              return (
                <div
                  key={i}
                  className={`${colors[i]} flex items-center justify-center text-[10px] font-bold text-white border-r border-white/20 last:border-0`}
                  style={{ width: `${w.weight}%` }}
                >
                  {w.weight}%
                </div>
              );
            })}
          </div>

          <div className="flex justify-between mt-1">
            {scoringWeights.map((w, i) => (
              <p key={i} className="text-[10px] text-gray-600 text-center font-bold" style={{ width: `${w.weight}%` }}>
                {w.label.split("\n").map((line, j) => (
                  <span key={j} className="block leading-tight">{line}</span>
                ))}
              </p>
            ))}
          </div>
        </div>

        {/* Principal's Action Insights */}
        <div className="pl-0 md:pl-5">
          <p className="font-bold text-sm text-gray-800 mb-4 uppercase tracking-wide">Principal's Action Insights</p>
          <ul className="space-y-3">
            {actionInsights.map((insight, i) => {
              const { icon, color } = insightIcon(insight.type);
              return (
                <li key={i} className="flex items-start gap-3 text-xs text-gray-700 font-medium leading-relaxed">
                  <span className={`${color} text-lg leading-none mt-0.5 shrink-0`}>{icon}</span>
                  <span>{insight.text}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InstituteAdminDashboard;
