import React, { useEffect, useState } from "react";
import SubjectCard from "./SubjectCard";

interface SubjectGridProps {
  selectedSubject: string;
  subjectDashboardData: any;
}

const SubjectGrid: React.FC<SubjectGridProps> = ({ selectedSubject, subjectDashboardData }) => {
  const [data, setData] = useState<any[]>([]);
  const [totalSubjects, setTotalSubjects] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (subjectDashboardData) {
      setLoading(true);
      const subjects = subjectDashboardData.subjects || [];
      const totalSubjectsCount = subjectDashboardData.total_subjects || subjects.length;

      if (selectedSubject) {
        // Find the selected subject and map its chapters
        const currentSubject = subjects.find((s: any) => s.subject_name === selectedSubject);
        if (currentSubject && currentSubject.chapters) {
          setTotalSubjects(currentSubject.chapters.length);
          const formattedChapters = currentSubject.chapters.map((chapter: any) => {
            const sortedLevels = [...(chapter.levels || [])].sort((a, b) => {
              const numA = parseInt(a.level.replace(/\D/g, "")) || 0;
              const numB = parseInt(b.level.replace(/\D/g, "")) || 0;
              return numA - numB;
            });
            
            return {
              title: chapter.chapter_name,
              score: Math.round(chapter.overall_accuracy || 0),
              level: chapter.level_label || "N/A",
              difficulty: chapter.levels?.find((l: any) => l.level === chapter.level_label)?.bucket || "N/A",
              statusColor: chapter.overall_accuracy > 80 ? "#568F14" : chapter.overall_accuracy > 60 ? "#EA9003" : "#FF7361",
              levels: sortedLevels.map((lvl: any) => ({
                label: lvl.level,
                value: Math.round(Number(lvl.accuracy) || 0),
                color: lvl.bucket === "Easy" ? "#578E12" : lvl.bucket === "Medium" ? "#EA9003" : lvl.bucket === "Hard" ? "#FF7361" : "#ea4335",
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
        setTotalSubjects(totalSubjectsCount);

        // Map all subjects as summary cards
        const formattedSubjects = subjects.map((sub: any) => {
          // Aggregate accuracy from chapters
          const subAccuracy = sub.chapters?.length > 0
            ? Math.round(sub.chapters.reduce((sum: number, ch: any) => sum + (ch.overall_accuracy || 0), 0) / sub.chapters.length)
            : 0;

          const lastChapter = sub.chapters?.length > 0 ? sub.chapters[sub.chapters.length - 1] : null;
          
          return {
            title: sub.subject_name,
            score: subAccuracy,
            level: lastChapter?.level_label || "N/A",
            difficulty: lastChapter?.levels?.find((l: any) => l.level === lastChapter.level_label)?.bucket || "N/A",
            statusColor: subAccuracy > 80 ? "#568F14" : subAccuracy > 60 ? "#EA9003" : "#FF7361",
            levels: lastChapter?.levels?.map((lvl: any) => ({
              label: lvl.level,
              value: Math.round(Number(lvl.accuracy) || 0),
              color: lvl.bucket === "Easy" ? "#578E12" : lvl.bucket === "Medium" ? "#EA9003" : lvl.bucket === "Hard" ? "#FF7361" : "#ea4335",
              time: `${parseFloat(lvl.avg_time).toFixed(1)}m`
            })) || []
          };
        });
        setData(formattedSubjects);
      }
      setLoading(false);
    }
  }, [selectedSubject, subjectDashboardData]);

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