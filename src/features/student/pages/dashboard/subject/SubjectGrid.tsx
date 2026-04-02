import React, { useEffect, useState } from "react";
import SubjectCard from "./SubjectCard";
import ApiServices from "../../../../../services/ApiServices";

interface SubjectGridProps {
  selectedSubject: string;
}

const SubjectGrid: React.FC<SubjectGridProps> = ({ selectedSubject }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await ApiServices.getStudentSubjectsTabInfo();
        if (response.data?.status === "success") {
          const dashboardData = response.data.data?.dashboard || [];

          // Map raw dashboard data to SubjectCard format
          let formattedData = dashboardData
            .filter((item: any) => item.subject_name === selectedSubject)
            .map((item: any) => {
              const overall = Number(item.overall_accuracy) || 0;

              // Determine status and difficulty based on overall accuracy
              let difficulty = "Easy";
              let statusColor = "#80975F";
              if (overall > 80) {
                difficulty = "Easy";
                statusColor = "#568F14";
              } else if (overall > 60) {
                difficulty = "Medium";
                statusColor = "#EA9003";
              } else {
                difficulty = "Hard";
                statusColor = "#FF7361";
              }

              return {
                title: item.chapters_name || item.subject_name,
                score: Math.round(overall),
                level: `L${item.l3_accuracy != null ? 3 : item.l2_accuracy != null ? 2 : 1}`,
                difficulty: difficulty,
                statusColor: statusColor,
                levels: [
                  {
                    label: "L1",
                    value: Math.round(Number(item.l1_accuracy) || 0),
                    color: (Number(item.l1_accuracy) || 0) > 60 ? "#578E12" : "#FF7361",
                    time: item.l1_avg_time ? `${Math.round(Number(item.l1_avg_time))}s` : "0s"
                  },
                  {
                    label: "L2",
                    value: Math.round(Number(item.l2_accuracy) || 0),
                    color: (Number(item.l2_accuracy) || 0) > 60 ? "#578E12" : "#EA9003",
                    time: item.l2_avg_time ? `${Math.round(Number(item.l2_avg_time))}s` : "0s"
                  },
                  {
                    label: "L3",
                    value: Math.round(Number(item.l3_accuracy) || 0),
                    color: (Number(item.l3_accuracy) || 0) > 60 ? "#578E12" : "#EA9003",
                    time: item.l3_avg_time ? `${Math.round(Number(item.l3_avg_time))}s` : "0s"
                  }
                ]
              };
            });

          // If no data found for selected subject, provide a default empty state card
          if (formattedData.length === 0 && selectedSubject) {
            formattedData = [{
              title: selectedSubject,
              score: 0,
              level: "L1",
              difficulty: "Easy",
              statusColor: "#80975F",
              levels: [
                { label: "L1", value: 0, color: "#FF7361", time: "0s" },
                { label: "L2", value: 0, color: "#EA9003", time: "0s" },
                { label: "L3", value: 0, color: "#EA9003", time: "0s" }
              ]
            }];
          }

          setData(formattedData);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard subjects:", error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedSubject) {
      fetchData();
    }
  }, [selectedSubject]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full gap-3">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-[#BADA55] rounded-full animate-spin"></div>
        <span className="text-sm text-gray-500 font-medium tracking-wide">
          Loading performance data...
        </span>
      </div>
    );
  }

  return (
    <>
      <div className="px-8 py-2 text-lg font-semibold text-gray-700">
        Selected Subject: {selectedSubject || "None"}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8 py-4">
        {data.length > 0 ? (
          data.map((sub, i) => (
            <SubjectCard key={sub.title + i} {...sub} />
          ))
        ) : (
          <div className="col-span-full flex justify-center items-center min-h-[200px]">
            <p className="text-gray-500 font-medium italic">
              No performance data available for {selectedSubject}.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default SubjectGrid;