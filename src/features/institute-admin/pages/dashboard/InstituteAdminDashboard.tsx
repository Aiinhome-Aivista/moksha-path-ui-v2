import React, { useEffect, useState } from "react";
import type { TeacherScorecard, StatCard } from "./data/teacherReview.types";
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

const InsightIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "top":
      return (
        <svg width="16" height="16" viewBox="0 0 20 20" className="shrink-0">
          <circle cx="10" cy="10" r="10" fill="#67B13F" />
          <path d="M10 2.5 L12.2 7 L17.2 7.8 L13.6 11.2 L14.4 16 L10 13.8 L5.6 16 L6.4 11.2 L2.8 7.8 L7.8 7 Z" fill="white" />
        </svg>
      );
    case "low":
      return (
        <svg width="16" height="16" viewBox="0 0 20 20" className="shrink-0">
          <circle cx="10" cy="10" r="10" fill="#FF6B6B" />
          <path d="M9 4 h2 v7 h-2 z M9 13 h2 v2 h-2 z" fill="white" />
        </svg>
      );
    case "risk":
      return (
        <svg width="16" height="16" viewBox="0 0 20 20" className="shrink-0">
          <circle cx="10" cy="10" r="10" fill="#E69919" />
          <path d="M9 4 h2 v7 h-2 z M9 13 h2 v2 h-2 z" fill="white" />
        </svg>
      );
    case "syllabus":
      return (
        <svg width="16" height="16" viewBox="0 0 20 20" className="shrink-0">
          <circle cx="10" cy="10" r="10" fill="#67B13F" />
          <path d="M6 10 L8.5 12.5 L14 7" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "mock":
      return (
        <svg width="16" height="16" viewBox="0 0 20 20" className="shrink-0">
          <circle cx="10" cy="10" r="10" fill="none" stroke="#66B2BA" strokeWidth="2.5" />
          <path d="M10 5 L14.5 13 L5.5 13 Z" fill="#66B2BA" />
        </svg>
      );
    default:
      return (
        <svg width="16" height="16" viewBox="0 0 20 20" className="shrink-0">
          <circle cx="10" cy="10" r="10" fill="#999" />
        </svg>
      );
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
      subLabel: `${dashboardData.total_classes ?? 0} Classes, ${dashboardData.total_sections ?? 0} Sections`,
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
    { label: "Avg Accuracy Improvement", value: dashboardData.avg_accuracy_improvement ?? 0, suffix: "%", color: "text-[#79C9D2]" },
    { label: "Avg Consistency Index", value: dashboardData.avg_consistency_index ?? 0, suffix: "", color: "text-[#F5B041]" },
    { label: "Avg Intervention Index", value: dashboardData.avg_intervention_index ?? 0, suffix: "", color: "text-[#7DCEA0]" },
    { label: "Avg Teacher Improvement", value: dashboardData.avg_teacher_improvement ?? 0, suffix: "%", color: "text-[#79C9D2]" },
    { label: "Avg Teacher Score", value: dashboardData.avg_teacher_score ?? 0, suffix: "", color: "text-[#F5B041]" },
    { label: "Bottom Percent", value: dashboardData.bottom_percent ?? 0, suffix: "%", color: "text-[#7DCEA0]" },
    { label: "Consistent Performer", value: dashboardData.consistent_performer_percent ?? 0, suffix: "%", color: "text-[#79C9D2]" },
    { label: "High Impact Teacher", value: dashboardData.high_impact_teacher_percent ?? 0, suffix: "%", color: "text-[#F5B041]" },
    { label: "Improvement Consistency", value: dashboardData.improvement_consistency_percent ?? 0, suffix: "%", color: "text-[#7DCEA0]" },
    { label: "Mid Percent", value: dashboardData.mid_percent ?? 0, suffix: "%", color: "text-[#79C9D2]" },
    { label: "School Avg Score", value: dashboardData.school_avg_score ?? 0, suffix: "", color: "text-[#F5B041]" },
    { label: "School Readiness Index", value: dashboardData.school_readiness_index ?? 0, suffix: "", color: "text-[#7DCEA0]" },
    { label: "Top Percent", value: dashboardData.top_percent ?? 0, suffix: "%", color: "text-[#79C9D2]" },
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
        meta={{
          title: "Dashboard: Teacher Performance Review",
          academicYear: dashboardData.academic_year 
            ? (dashboardData.academic_year.startsWith("AY") ? dashboardData.academic_year : `AY ${dashboardData.academic_year}`)
            : "AY 2025-26"
        }}
        profileAltText="Institute Admin Profile"
      />

      {/* Stat cards + Extra KPIs — একই flex row-এ */}
    <div className="flex w-full gap-8 pb-5" style={{ paddingLeft: "310px" }}>

     
            {mainStats.map((stat, i) => (
              <div key={i} className="text-start flex-1">
                <p className={`font-bold leading-none text-2xl lg:text-2xl ${stat.color}`}>
                  {stat.value}
                  {stat.suffix && <span className="text-sm">{stat.suffix}</span>}
                </p>
                <p className="text-[13px] font-bold text-gray-600 mt-2 whitespace-nowrap">
                  {stat.label}
                </p>
                <p className="text-[11px] text-gray-600 font-medium whitespace-nowrap">
                  {stat.subLabel}
                </p>
              </div>
            ))}
          </div>

          {/* Extra KPIs row */}
          <div className="grid grid-cols-6 gap-6 gap-y-6 px-12">
            {extraKpis.map((kpi, i) => (
              <div key={i} className="flex flex-col items-start text-start">
                <span className={`font-bold leading-none text-2xl ${kpi.color}`}>
                  {kpi.value}{kpi.suffix}
                </span>
                <span className="text-[13px] font-bold text-gray-600 whitespace-nowrap mt-2">
                  {kpi.label}
                </span>
              </div>
            ))}
          </div>

        

      {/* ── SCORECARD TABLE ────────────────────────────── */}
      <div className="rounded-xl mb-5 overflow-hidden">
        <div className="px-12 pt-6 pb-2">
          <span className="font-bold text-sm text-gray-800 uppercase tracking-wide">Teacher Performance Scorecards</span>
          <span className="text-[10px] text-primary ml-2 font-medium">Each Benchmarked in Own Domain</span>
        </div>

        <div className="overflow-x-auto px-12">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t-4 border-[#E0E0E0] border-b-4 border-[#E0E0E0] text-primary text-[15px] font-bold">
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
      <div className="grid grid-cols-1 md:grid-cols-[40%_60%] lg:grid-cols-[38%_62%] xl:grid-cols-[35%_65%] gap-8 px-12 mt-8">
        {/* Scoring Guide */}
        <div className="bg-[#EAF0D2] rounded-2xl p-5 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-6">
            <svg width="40" height="32" viewBox="0 0 40 32" className="shrink-0 mt-2">
              <path d="M4 28 A16 16 0 0 1 36 28" fill="none" stroke="#58A5B0" strokeWidth="3" strokeLinecap="round" />
              <path d="M10 18 L12 21 M20 12 L20 15 M30 18 L28 21" stroke="#58A5B0" strokeWidth="2" strokeLinecap="round" />
              <path d="M20 28 L11 17" stroke="#4B4B4B" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M15 28 A5 5 0 0 0 25 28 Z" fill="#4B4B4B" />
            </svg>
            <div className="flex flex-col">
              <p className="font-extrabold text-[17px] text-[#58A5B0] leading-tight">Scoring Guide</p>
              <p className="text-[10px] text-gray-500 font-medium leading-tight mt-0.5">(within own subject benchmark):</p>
            </div>
          </div>

          <div className="flex justify-between w-full mb-1">
            {(dashboardData.scoring_guide || []).map((w: any, i: number) => (
              <p key={`num-${i}`} className="text-[11px] text-[#A2A46C] text-center font-semibold" style={{ width: `${w.weight}%` }}>
                {w.weight}%
              </p>
            ))}
          </div>

          <div className="flex w-full h-1.5 rounded-full overflow-hidden mb-2">
            {(dashboardData.scoring_guide || []).map((w: any, i: number) => {
              const colors = ["bg-[#58A5B0]", "bg-[#4D4D4D]", "bg-[#58A5B0]", "bg-[#4D4D4D]", "bg-[#58A5B0]"];
              return (
                <div
                  key={`bar-${i}`}
                  className={`${colors[i % colors.length]}`}
                  style={{ width: `${w.weight}%` }}
                ></div>
              );
            })}
          </div>

          <div className="flex justify-between w-full">
            {(dashboardData.scoring_guide || []).map((w: any, i: number) => (
              <p key={`label-${i}`} className="text-[9px] text-[#4B4B4B] text-center font-bold leading-tight" style={{ width: `${w.weight}%` }}>
                {w.label.split(" ").map((line: string, j: number) => (
                  <span key={j} className="block">{line}</span>
                ))}
              </p>
            ))}
          </div>
        </div>

        {/* Principal's Action Insights */}
        <div className="pl-0 md:pl-5 overflow-hidden w-full">
          <p className="font-bold text-sm text-gray-800 mb-4 uppercase tracking-wide">Principal's Action Insights</p>
          <ul className="space-y-3">
            {(dashboardData.principal_insights || []).map((insight: any, i: number) => {
              return (
                <li key={i} className="flex items-center gap-3 text-[11px] xl:text-xs text-gray-700 font-semibold leading-tight whitespace-nowrap overflow-hidden">
                  <InsightIcon type={insight.type} />
                  <span className="truncate" title={insight.text}>{insight.text}</span>
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
