import { dashboardData } from "./mockData";

interface SyllabusTabProps {
  data?: any;
}

const SyllabusTab = ({ data }: SyllabusTabProps) => {
  // Use API data if available, otherwise fall back to mock data
  const displayData = data || dashboardData;

  // Extract syllabus data
  const syllabusData = displayData?.syllabus || [];
  const isSingleSubject = syllabusData.length === 1;

  // Helper to render a single column (Subject)
  const renderColumn = (subjectData: any) => {
    const chapters = subjectData?.chapters || [];

    // Map status to color
    const getStatusColor = (status: string) => {
      const s = status?.toUpperCase();
      if (s === "COMPLETED" || s === "GOOD") return "bg-[#589F12]";
      if (s === "IN_PROGRESS" || s === "WATCH") return "bg-[#E48D00]";
      if (s === "ACTION") return "bg-[#FE6768]";
      return "bg-[#E6E6E6]";
    };

    const getStatusTextColor = (status: string) => {
      const s = status?.toUpperCase();
      if (s === "COMPLETED" || s === "GOOD") return "text-[#589F12]";
      if (s === "IN_PROGRESS" || s === "WATCH") return "text-[#E48D00]";
      if (s === "ACTION") return "text-[#FE6768]";
      return "text-[#E6E6E6]";
    };

    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Subject Header */}
        <div className="mb-6 pb-1 border-b-[6px] border-secondary">
          <h3 className="text-2xl text-primary tracking-tight">
            <span className="font-black">{subjectData.subject_name}</span>
            <span className="font-medium mx-2 text-3xl">|</span>
            <span className="text-primary font-medium ml-1 ">
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
        <div className={`flex-1 overflow-y-auto pr-4 custom-scrollbar grid gap-x-12 ${isSingleSubject ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`} style={{ maxHeight: 'calc(80vh - 300px)' }}>
          {chapters.map((chapter: any, i: number) => (
            <div key={i} className="flex items-center gap-2 group py-1">
              {/* Chapter Name */}
              <span
                className={`min-w-[230px] flex-1 text-[13px] font-semibold leading-tight truncate ${chapter.completion_pct === 0 ? "text-primary opacity-50" : "text-primary"}`}
                title={chapter.chapter_name}
              >
                {chapter.chapter_name}
              </span>

              {/* Progress Bar Container */}
              <div className="flex-[2] h-4 bg-gray-200 rounded-full relative overflow- shadow-inner">
                {chapter.completion_pct > 0 ? (
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${getStatusColor(chapter.status)}`}
                    style={{ width: `${chapter.completion_pct}%` }}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <span className="text-[13px] text-secondary opacity-100 font-black tracking-widest">
                      Not started
                    </span>
                  </div>
                )}

                {/* Benchmark marker line - thin vertical line as seen in dummy */}
                {chapter.completion_pct > 0 && chapter.completion_pct < 100 && (
                  <div className="absolute -bottom-2 text-3xl font-bold text-[#989C9D] z-10" style={{ left: `${chapter.completion_pct}%` }} >|</div>
                )}
              </div>

              {/* Percentage Display */}
              <div className="w-16 ml-2 flex items-baseline justify-end gap-0.5">
                <span
                  className={`text-3xl font-medium ${chapter.completion_pct === 0 ? "text-gray-300" : getStatusTextColor(chapter.status)}`}
                >
                  {chapter.completion_pct}
                </span>
                <span
                  className={`text-lg font-medium ${chapter.completion_pct === 0 ? "text-gray-300" : getStatusTextColor(chapter.status)} opacity-70`}
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
    <div className="animate-in fade-in duration-500 pr-6 pl-6 h-full flex flex-col overflow-hidden">
      {/* 2. Main White Card */}
      <div className=" border border-gray-100 p-3 h-full flex flex-col overflow-hidden">
        {/* 1. Page Title */}
        <div className="mb-8 pl-2">
          <h2 className="text-2xl font-black text-cyan-600 ">
            Syllabus Progress
          </h2>
          <p className="text-sm text-secondary font-medium tracking-tight">
            Chapter-level progress vs academic benchmark
          </p>
        </div>

        <div className={`grid gap-16 flex-1 overflow-hidden ${isSingleSubject ? 'grid-cols-1' : 'xl:grid-cols-2'}`}>
          {/* Render subjects dynamically */}
          {syllabusData.map((subject: any, idx: number) => (
            <div key={idx} className="flex-1 min-w-[350px] flex flex-col overflow-hidden">
              {renderColumn(subject)}
            </div>
          ))}
        </div>


        {/* 3. Legend Section */}
        <div className="mt-6 pt-2 border-t border-gray-100 flex justify-center gap-10 items-center">
          {[
            { color: "bg-[#589F12]", label: "Completed" },
            { color: "bg-[#E48D00]", label: "In Progress" },
            { color: "bg-[#FE6768]", label: "Action Needed" },
            { color: "bg-[#E6E6E6]", label: "Not Started" },
          ].map((dot, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${dot.color}`} />
              <span className="text-[11px] font-black text-secondary uppercase tracking-wider">
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
