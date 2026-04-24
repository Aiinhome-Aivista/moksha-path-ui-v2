import React, { useEffect, useState } from "react";
import SubjectCard from "./SubjectCard";
import ApiServices from "../../../../../services/ApiServices";

interface SubjectGridProps {
  selectedSubject: string;
}

const SubjectGrid: React.FC<SubjectGridProps> = ({ selectedSubject }) => {
  const [data, setData] = useState<any[]>([]);
  const [totalSubjects, setTotalSubjects] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await ApiServices.getStudentSubjectDashboard();
        if (response.data?.status === "success") {
          const subjects = response.data.data?.subjects || [];

          if (selectedSubject) {
            // Find the selected subject and map its chapters
            const currentSubject = subjects.find((s: any) => s.subject_name === selectedSubject);
            if (currentSubject) {
              setTotalSubjects(currentSubject.total_attempts || 0);
              const formattedChapters = currentSubject.chapters.map((chapter: any) => {
                const sortedLevels = [...(chapter.levels || [])].sort((a, b) => {
                  const numA = parseInt(a.level.replace(/\D/g, "")) || 0;
                  const numB = parseInt(b.level.replace(/\D/g, "")) || 0;
                  return numA - numB;
                });
                const latestLevel = sortedLevels.length > 0 ? sortedLevels[sortedLevels.length - 1] : null;
                
                const chapterAccuracy =
                  chapter.levels && chapter.levels.length > 0
                    ? Math.round(
                        chapter.levels.reduce(
                          (sum: number, l: any) => sum + Number(l.accuracy || 0),
                          0
                        ) / chapter.levels.length
                      )
                    : Number(chapter.accuracy) || 0;

                return {
                  title: chapter.chapter_name,
                  score: chapterAccuracy,
                  level: latestLevel?.level || "N/A",
                  difficulty: latestLevel?.bucket || "N/A",
                  statusColor: chapterAccuracy > 80 ? "#568F14" : chapterAccuracy > 60 ? "#EA9003" : "#FF7361",
                  levels: sortedLevels.map((lvl: any) => ({
                    label: lvl.level,
                    value: Math.round(Number(lvl.accuracy) || 0),
                    color: lvl.bucket === "Easy" ? "#578E12" : lvl.bucket === "Medium" ? "#EA9003" : "#FF7361",
                    time: `${parseFloat(lvl.avg_time).toFixed(1)}m`
                  }))
                };
              });
              setData(formattedChapters);
            } else {
              setData([]);
              setTotalSubjects(0);
            }
          } else {
            // Sum all attempts for ALL Subjects view
            const totalAllAttempts = subjects.reduce((acc: number, sub: any) => acc + (sub.total_attempts || 0), 0);
            setTotalSubjects(totalAllAttempts);

            // Map all subjects as summary cards
            const formattedSubjects = subjects.map((sub: any) => {
              const sortedLevels = [...(sub.levels || [])].sort((a, b) => {
                const numA = parseInt(a.level.replace(/\D/g, "")) || 0;
                const numB = parseInt(b.level.replace(/\D/g, "")) || 0;
                return numA - numB;
              });
              const latestLevel = sortedLevels.length > 0 ? sortedLevels[sortedLevels.length - 1] : null;
              
              const subAccuracy =
                sub.levels && sub.levels.length > 0
                  ? Math.round(
                      sub.levels.reduce(
                        (sum: number, l: any) => sum + Number(l.accuracy || 0),
                        0
                      ) / sub.levels.length
                    )
                  : Number(sub.accuracy) || 0;
              
              return {
                title: sub.subject_name,
                score: subAccuracy,
                level: latestLevel?.level || "N/A",
                difficulty: latestLevel?.bucket || "N/A",
                statusColor: subAccuracy > 80 ? "#568F14" : subAccuracy > 60 ? "#EA9003" : "#FF7361",
                levels: sortedLevels.map((lvl: any) => ({
                  label: lvl.level,
                  value: Math.round(Number(lvl.accuracy) || 0),
                  color: lvl.bucket === "Easy" ? "#578E12" : lvl.bucket === "Medium" ? "#EA9003" : "#FF7361",
                  time: `${parseFloat(lvl.avg_time).toFixed(1)}m`
                }))
              };
            });
            setData(formattedSubjects);
          }
        }
      } catch (error) {
        console.error("Failed to fetch dashboard subjects:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedSubject]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full gap-3">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-[#BADA55] rounded-full animate-spin"></div>
        <span className="text-sm text-gray-500 font-medium tracking-wide">
          Loading subjects...
        </span>
      </div>
    );
  }

  return (
    <>
      <div className="px-8 py-4 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-[#212B36]">
          {selectedSubject || "All Subjects"}
          <span className="ml-3 text-sm bg-[#BADA55] text-[#2b3a00] px-3 py-1 rounded-full font-bold">
            {totalSubjects} {totalSubjects === 1 ? 'Test' : 'Tests'}
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8 py-4">
        {data.length > 0 ? (
          data.map((item, i) => (
            <SubjectCard key={item.title + i} {...item} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <p className="text-gray-500 font-medium italic text-xl">
              {selectedSubject
                ? `No performance data available for ${selectedSubject}.`
                : "No subjects found."}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default SubjectGrid;