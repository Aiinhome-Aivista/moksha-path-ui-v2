import React, { useState } from "react";
import { HeaderProfile } from "../../dashboard/HeaderProfile";
import { StatsOverview } from "../../dashboard/StatsOverview";
import { PerformanceCards } from "../../dashboard/PerformanceCards";
import { MockExamDashboard } from "../../dashboard/MockExamDashboard";
import SubjectGrid from "../../dashboard/subject/SubjectGrid";
import Remediation from "../../dashboard/remediation/Remediation";

const tabComponents: Record<string, React.ReactElement> = {
  dashboard: <StatsOverview />,
  performance: <PerformanceCards />,
  subject: <SubjectGrid />,
  exam: <MockExamDashboard />,
  remediation: <Remediation />,
};

export const DashboardStudent = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      <HeaderProfile activeTab={activeTab} onTabChange={setActiveTab} />
      {tabComponents[activeTab]}
    </div>
  );
};
