import { dashboardData } from "./mockData";

interface SyllabusTabProps {
  data?: any;
}

const SyllabusTab = ({ data }: SyllabusTabProps) => {
  // Use API data if available, otherwise fall back to mock data
  const displayData = data || dashboardData;

  // Extract syllabus data
  const syllabusData = displayData?.syllabus || [];

  // Helper to render a single column (Subject)
  const renderColumn = (subjectData: any) => {
    const chapters = subjectData?.chapters || [];

    // Map status to color
    const getStatusColor = (status: string) => {
      if (status === "GOOD") return "bg-[#589F12]";
      if (status === "ACTION") return "bg-[#FE6768]";
      if (status === "WATCH") return "bg-[#E48D00]";
      return "bg-[#E6E6E6]";
    };

    const getStatusTextColor = (status: string) => {
      if (status === "GOOD") return "text-[#589F12]";
      if (status === "ACTION") return "text-[#FE6768]";
      if (status === "WATCH") return "text-[#E48D00]";
      return "text-[#E6E6E6]";
    };

    return (
      <div className="flex-1">
        {/* Subject Header */}
        <div className="mb-6 pb-1 border-b-[6px] border-gray-300">
          <h3 className="text-2xl text-gray-800 tracking-tight">
            <span className="font-black">{subjectData.subject_name}</span>
            <span className="font-medium mx-2 text-3xl">|</span>
            <span className="text-gray-primary font-medium ml-1 ">
              {subjectData.class_name}
            </span>
            <span className=" lowercase">-{subjectData.section_name}</span>
          </h3>
          <h5 className="flex items-center gap-4 text-sm font-bold tracking-tight text-primary ">
            <span className="font-bold text-primary">
              Syllabus: {subjectData.overall_completion_pct || 0}% complete
            </span>
            <span className="mx-2 font-medium text-2xl">|</span>
            <span>
              {subjectData.completed_chapters || 0} of{" "}
              {subjectData.total_chapters || 0} chapters
            </span>
          </h5>
        </div>

        {/* Progress Bars List */}
        <div className="space-y-4">
          {chapters.map((chapter: any, i: number) => (
            <div key={i} className="flex items-center gap-2 group py-1">
              {/* Chapter Name */}
              <span
                className={`min-w-72 text-sm font-bold leading-tight ${chapter.completion_pct === 0 ? "text-gray-300 italic" : "text-gray-700"}`}
              >
                {chapter.chapter_name}
              </span>

              {/* Progress Bar Container */}
              <div className="flex-1 h-4 bg-gray-200 rounded-full relative overflow- shadow-inner">
                {chapter.completion_pct > 0 ? (
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${getStatusColor(chapter.status)}`}
                    style={{ width: `${chapter.completion_pct}%` }}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest ">
                      Not started
                    </span>
                  </div>
                )}

                {/* Benchmark marker line - thin vertical line as seen in dummy */}
                <div className="absolute -bottom-2 text-3xl font-bold text-[#989C9D] z-10" style={{left:`${chapter.completion_pct}%`}} >|</div>
              </div>

              {/* Percentage Display */}
              <div className="w-16 flex items-baseline justify-end gap-0.5">
                <span
                  className={`text-2xl font-black ${chapter.completion_pct === 0 ? "text-gray-200" : getStatusTextColor(chapter.status)}`}
                >
                  {chapter.completion_pct}
                </span>
                <span
                  className={`text-[10px] font-bold ${chapter.completion_pct === 0 ? "text-gray-200" : getStatusTextColor(chapter.status)} opacity-70`}
                >
                  %
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="animate-in fade-in duration-500 pr-6 pl-6">
      {/* 2. Main White Card */}
      <div className=" border border-gray-100 p-3">
        {/* 1. Page Title */}
        <div className="mb-8 pl-2">
          <h2 className="text-2xl font-black text-cyan-600 ">
            Syllabus Progress
          </h2>
          <p className="text-sm text-secondary font-medium tracking-tight">
            Chapter-level progress vs academic benchmark
          </p>
        </div>

        <div className="flex flex-col xl:flex-row gap-16">
          {/* Render subjects dynamically */}
          {syllabusData.map((subject: any, idx: number) => (
            <div key={idx} className="flex-1 min-w-[350px]">
              {renderColumn(subject)}
            </div>
          ))}

          {/* If only one subject, render placeholder for second column */}
          {syllabusData.length === 1 && (
            <div className="flex-1">
              <div className="text-center text-gray-400 py-8">
                <p className="text-sm font-bold">No additional subjects</p>
              </div>
            </div>
          )}
        </div>

        {/* 3. Legend Section */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex justify-center gap-10 items-center">
          {[
            { color: "bg-[#589F12]", label: "≥ Benchmark" },
            { color: "bg-[#E48D00]", label: "Within 10%" },
            { color: "bg-[#FE6768]", label: "Below 10%+" },
            { color: "bg-[#E6E6E6]", label: "Not Started" },
          ].map((dot, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${dot.color}`} />
              <span className="text-[11px] font-black text-gray-400 uppercase tracking-wider">
                {dot.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SyllabusTab;
