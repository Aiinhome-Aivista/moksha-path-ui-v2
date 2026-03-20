import { dashboardData } from "./mockData";

const SyllabusTab = () => {
  // Helper to render a single column (Math or Science)
  const renderColumn = (title: string, data: any[]) => (
    <div className="flex-1">
      {/* Subject Header */}
      <div className="mb-6 border-b border-gray-500 pb-3">
        <h3 className="text-xl font-black text-gray-800 tracking-tight">
          {title} <span className="text-gray-800 font-medium">| Class 10-a</span>
        </h3>
        <div className="flex items-center gap-4 mt-1 text-[11px] font-bold  tracking-wider text-gray-800">
          <span>Syllabus: <span className="text-gray-500">78% complete</span></span>
          <span className="h-3 w-[1px] bg-gray-800"></span>
          <span>7 of 9 chapters</span>
        </div>
      </div>

      {/* Progress Bars List */}
      <div className="space-y-3">
        {(data || []).map((item: any, i: number) => (
          <div key={i} className="flex items-center gap-4 group">
            <span className={`w-44 text-[10px] font-bold leading-tight ${item.value === 0 ? 'text-gray-300 italic' : 'text-gray-600'}`}>
              {item.label}
            </span>
            <div className="flex-1 h-4 bg-gray-300 rounded-full relative">
              {item.value > 0 ? (
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${item.color || 'bg-orange-400'}`} 
                  style={{ width: `${item.value}%` }} 
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                   <span className="text-[9px] text-gray-300 font-black ">Not started</span>
                </div>
              )}
              {/* Benchmark marker line - fixed position */}
              <div className="absolute right-[15%] top-[-4px] w-[4px] h-6 bg-gray-500 rounded-full" />
            </div>
            <span className={`w-10 text-[18px] font-black text-right ${item.value === 0 ? 'text-gray-200' : 'text-orange-400'}`}>
              {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500">
      {/* 2. Main White Card */}
      <div className="bg-gray-100 rounded-[2rem] border border-gray-100 pt-2">
        {/* 1. Page Title */}
        <div className="mb-4">
          <h2 className="text-2xl font-black text-cyan-600">Syllabus Progress</h2>
          <p className="text-[10px] text-gray-400 font-bold  tracking-tight">
            Chapter-level coverage and performance vs CICSE benchmark
          </p>
        </div>

        <div className="flex flex-col xl:flex-row gap-16">
          {/* Column 1: Mathematics (Using the first 8 items) */}
          {renderColumn("Mathematics", dashboardData?.syllabus?.slice(0, 8))}

          {/* Column 2: Science/Other (Using remaining items or duplicated for design) */}
          {renderColumn("Science", dashboardData?.syllabus?.slice(0, 8))}
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