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
      if (status === 'GOOD') return 'bg-green-600';
      if (status === 'ACTION') return 'bg-red-400';
      if (status === 'WATCH') return 'bg-orange-400';
      return 'bg-gray-300';
    };

    return (
      <div className="flex-1">
        {/* Subject Header */}
        <div className="mb-6 border-b border-gray-500 pb-3">
          <h3 className="text-xl font-black text-gray-800 tracking-tight">
            {subjectData.subject_name} <span className="text-gray-800 font-medium">| {subjectData.class_name}</span>
          </h3>
          <div className="flex items-center gap-4 mt-1 text-[10px] font-bold  tracking-wider text-gray-800 ">
            <span>Syllabus: <span className="text-gray-500">{subjectData.overall_completion_pct || 0}% complete</span></span>
            <span className="h-3 w-[1px] bg-gray-800"></span>
            <span>{subjectData.completed_chapters || 0} of {subjectData.total_chapters || 0} chapters</span>
          </div>
        </div>

        {/* Progress Bars List */}
        <div className="space-y-3">
          {chapters.map((chapter: any, i: number) => (
            <div key={i} className="flex items-center gap-4 group">
              <span className={`w-44 text-[10px] font-bold leading-tight ${chapter.completion_pct === 0 ? 'text-gray-300 italic' : 'text-gray-600'}`}>
                {chapter.chapter_name}
              </span>
              <div className="flex-1 h-4 bg-gray-300 rounded-full relative">
                {chapter.completion_pct > 0 ? (
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${getStatusColor(chapter.status)}`} 
                    style={{ width: `${chapter.completion_pct}%` }} 
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <span className="text-[9px] text-gray-300 font-black ">Not started</span>
                  </div>
                )}
                {/* Benchmark marker line - fixed position */}
                <div className="absolute right-[15%] top-[-4px] w-[4px] h-6 bg-gray-500 rounded-full" />
              </div>
              <span className={`w-10 text-[18px] font-black text-right ${chapter.completion_pct === 0 ? 'text-gray-200' : 'text-orange-400'}`}>
                {chapter.completion_pct}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="animate-in fade-in duration-500 pr-6 pl-6">
      {/* 2. Main White Card */}
      <div className="bg-gray-100 rounded-[2rem] border border-gray-100 pt-4">
        {/* 1. Page Title */}
        <div className="mb-4">
          <h2 className="text-1xl font-black text-cyan-600 ">Syllabus Progress</h2>
          <p className="text-[10px] text-gray-400 font-bold  tracking-tight">
            Chapter-level coverage and performance vs benchmark
          </p>
        </div>

        <div className="flex flex-col xl:flex-row gap-16">
          {/* Render subjects dynamically */}
          {syllabusData.map((subject: any, idx: number) => (
            <div key={idx}>
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
        <div className="mt-6 pt-8 border-t border-gray-50 flex justify-center gap-8 items-center">
          {[
            { color: 'bg-green-600', label: '≥ Benchmark' },
            { color: 'bg-orange-400', label: 'Within 10%' },
            { color: 'bg-red-400', label: 'Below 10%+' },
            { color: 'bg-gray-300', label: 'Not Started' },
          ].map((dot, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${dot.color}`} />
              <span className="text-[9px] font-black text-gray-400  tracking-tighter">{dot.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SyllabusTab;