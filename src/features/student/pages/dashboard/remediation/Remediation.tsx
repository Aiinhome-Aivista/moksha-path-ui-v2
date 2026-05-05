import { useEffect, useState } from "react";
import SubjectRemediationCard from "./SubjectRemediationCard";
import ApiServices from "../../../../../services/ApiServices";

interface RemediationProps {
  remediationData: any;
}

const Remediation: React.FC<RemediationProps> = ({ remediationData }) => {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [aiInsights, setAiInsights] = useState<any>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Update subjects when base remediationData arrives
  useEffect(() => {
    if (remediationData?.subjects?.list) {
      setSubjects(remediationData.subjects.list);
    }
  }, [remediationData]);

  // Fetch AI insights independently
  useEffect(() => {
    const fetchAiInsights = async () => {
      setIsAiLoading(true);
      try {
        const res = await ApiServices.getStudentRemediationAiInsights();
        if (res.data?.status === "success") {
          setAiInsights(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching AI insights:", error);
      } finally {
        setIsAiLoading(false);
      }
    };

    fetchAiInsights();
  }, []);

  // Merge AI insights into subjects whenever either one updates
  const mergedSubjects = subjects.map(subject => {
    if (!aiInsights?.remediation?.subjects?.list) return subject;

    const aiSubjects = aiInsights.remediation.subjects.list;
    // For now, if there's only one subject in AI data, we might want to apply it to all or find by name
    // The previous logic used a flatMap to find chapters by name, which is safer
    const aiChapters = aiSubjects.flatMap((s: any) => s.chapters || []);

    return {
      ...subject,
      chapters: (subject.chapters || []).map((chapter: any) => {
        const aiChapter = aiChapters.find((c: any) => c.chapter_name === chapter.chapter_name);
        return {
          ...chapter,
          remediation_pointers: aiChapter?.remediation_pointers || chapter.remediation_pointers
        };
      })
    };
  });

  const mapChapter = (chapter: any) => {
    const getLevelLabel = (lvl: string) => {
      if (lvl === "L1") return "L1 - Easy";
      if (lvl === "L2") return "L2 - Medium";
      if (lvl === "L3") return "L3 - Hard";
      if (lvl === "L4") return "L4 - Expert";
      return lvl;
    };

    const getLevelColor = (lvl: string) => {
      if (lvl === "L1") return "#4caf50";
      if (lvl === "L2") return "#fbc02d";
      if (lvl === "L3") return "#ff9800";
      if (lvl === "L4") return "#ea4335";
      return "#666";
    };

    const actions = (chapter.remediation_pointers || chapter.recommendations || []).map((rec: string) => {
      // If it's a long string, maybe we can split it into title and subtitle
      // For now, let's just use the string as the title and empty subtitle
      // or try to find the first period to split.
      const dotIndex = rec.indexOf('.');
      if (dotIndex !== -1 && dotIndex < 100) {
        return {
          title: rec.substring(0, dotIndex + 1).trim(),
          subtitle: rec.substring(dotIndex + 1).trim()
        };
      }
      return {
        title: rec,
        subtitle: ""
      };
    });

    return {
      title: chapter.chapter_name,
      priority: chapter.priority || (chapter.overall_accuracy < 40 ? "Critical" : chapter.overall_accuracy < 70 ? "High Priority" : "Medium"),
      percent: Math.round(chapter.overall_accuracy),
      level: getLevelLabel(chapter.level_label || "L1"),
      levelColor: getLevelColor(chapter.level_label || "L1"),
      levels: (chapter.levels || []).map((lvl: any) => ({
        label: lvl.level, // Only L1, L2, etc.
        value: Math.round(lvl.accuracy),
        color: lvl.level === "L1" ? "#4caf50" : lvl.level === "L2" ? "#fbc02d" : lvl.level === "L3" ? "#ff9800" : "#ea4335"
      })),
      actions: actions
    };
  };

  if (!remediationData && !subjects.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-500">
        <p className="italic">No remediation data available.</p>
      </div>
    );
  }

  return (
    <div className="px-4 pb-4 bg-gray-100 min-h-screen space-y-6">
      {mergedSubjects.map((subject: any) => (
        <div key={subject.subject_id} className="space-y-2">
          {subject.chapters && subject.chapters.length > 0 && (
            <>
              <h2 className="text-xl font-bold text-primary px-2 pt-2">
                {subject.subject_name}
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {subject.chapters.map((chapter: any, i: number) => (
                  <SubjectRemediationCard 
                    key={i} 
                    data={mapChapter(chapter)} 
                    isLoading={isAiLoading && !chapter.remediation_pointers}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default Remediation;
