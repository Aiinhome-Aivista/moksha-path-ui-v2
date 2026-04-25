import { useState, useEffect } from "react";
import { HeaderProfile } from "./HeaderProfile";
import { PerformanceCards } from "./PerformanceCards";
import { MockExamDashboard } from "./MockExamDashboard";
import SubjectGrid from "./subject/SubjectGrid";
import Remediation from "./remediation/Remediation";
import ApiServices from "../../../../services/ApiServices";
import Loader from "../../../../components/common/Loader";

export const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("performance");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [subjectDashboardData, setSubjectDashboardData] = useState<any>(null);
  const [mockDashboardData, setMockDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [performanceRes, subjectsRes, mocksRes] = await Promise.all([
          ApiServices.getStudentPerformance(),
          ApiServices.getStudentSubjectDashboard(),
          ApiServices.getStudentMockDashboard()
        ]);

        if (performanceRes.data?.status === "success") {
          setPerformanceData(performanceRes.data.data);
        }
        if (subjectsRes.data?.status === "success") {
          setSubjectDashboardData(subjectsRes.data.data);
          
          // Auto-select first subject if none selected
          const firstSub = subjectsRes.data.data?.subjects?.[0];
          if (firstSub && !selectedSubject) {
            setSelectedSubject(firstSub.subject_name);
          }
        }
        if (mocksRes.data?.status === "success") {
          setMockDashboardData(mocksRes.data.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const tabComponents: Record<string, React.ReactElement> = {
    performance: <PerformanceCards performanceData={performanceData} />,
    subject: <SubjectGrid 
      selectedSubject={selectedSubject} 
      subjectDashboardData={subjectDashboardData} 
    />,
    exam: <MockExamDashboard 
      selectedExam={selectedExam} 
      mockDashboardData={mockDashboardData} 
    />,
    remediation: <Remediation />,
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <HeaderProfile
        activeTab={activeTab}
        onTabChange={setActiveTab}
        selectedSubject={selectedSubject}
        onSubjectSelect={setSelectedSubject}
        selectedExam={selectedExam}
        onExamSelect={setSelectedExam}
        subjectDashboardData={subjectDashboardData}
        mockDashboardData={mockDashboardData}
      />
      <main className="min-h-[400px] flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-24">
            <Loader size="xl" text="Fetching dashboard data..." />
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            {tabComponents[activeTab]}
          </div>
        )}
      </main>
    </div>
  );
};
