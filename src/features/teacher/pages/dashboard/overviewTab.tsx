import { dashboardData } from "./mockData";

const OverviewTab = () => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'On Track': return 'bg-green-600';
      case 'Watch': return 'bg-orange-400';
      case 'Action': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const renderTable = (title: string, data: any[], syllabus: string, mock: string) => (
    <div className="bg-color-secondary dark:bg-secondary-800 pt-6 pb-6 rounded-3xl  border border-gray-100 dark:border-secondary-700 flex-1">
      <div className="flex justify-between items-end mb-4">
        <h3 className="text-xl font-black text-gray-800 dark:text-gray-200 tracking-tight">{title}</h3>
        <p className="text-[12px] text-gray-700 dark:text-gray-500 font-bold ">
          Syllabus: <span className="text-[10px] text-gray-400 dark:text-gray-300">{syllabus} complete</span> | Mock: <span className="text-[10px] text-gray-400 dark:text-gray-300">{mock}</span>
        </p>
      </div>
      
      <table className="w-full text-left">
        <thead className="border-y-4 border-gray-300 dark:border-secondary-700">
          <tr className="text-gray-700 dark:text-gray-700 text-[14px] font-black tracking-widest">
            <th className="p-2 text-center">Section</th>
            <th className="p-2 text-center">Students</th>
            <th className="p-2 text-center">Class Avg</th>
            <th className="p-2 text-center">Benchmark</th>
            <th className="p-2 text-center">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-300 dark:divide-secondary-700">
          {(data || []).map((item, i) => (
            <tr key={i} className=" transition-all duration-200">
              <td className="py-3.5 text-sm font-bold text-gray-700 dark:text-gray-300 text-center">{item.section}</td>
              <td className="text-sm font-bold text-gray-700 dark:text-gray-400  text-center">{item.students}</td>
              <td className="text-sm font-bold text-gray-700 dark:text-gray-300 text-center">{item.avg}%</td>
              <td className="text-sm font-bold text-gray-700 dark:text-gray-500 text-center">{item.benchmark}%</td>
              <td className="text-center">
                <span className={`inline-block w-24 text-center py-1.5 rounded-full text-[9px] font-black text-white  transform group-hover:scale-105 transition-transform ${getStatusStyle(item.status)}`}>
                  {item.status?.toUpperCase()}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. Page Sub-Header and Top Stats in one responsive row */}
      <div className="bg-color-secondary dark:bg-secondary-800 rounded-3xl border border-gray-100 dark:border-secondary-700 flex flex-col xl:flex-row justify-between items-center gap-8">
        <div className="flex-shrink-0 pt-2 ">
          <h2 className="text-2xl font-black text-cyan-600 dark:text-cyan-400 tracking-tight leading-none">Student & Subject Overview</h2>
          <div className="text-[11px] text-gray-400 dark:text-gray-500 font-bold tracking-tight mt-1">
            <p>Performance summary across all classes</p>
            <p>March 2026</p>
          </div>
        </div>

<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 flex-1 w-full max-w-5xl">
  {(dashboardData?.topStats || []).map((stat, i) => (
    <div key={i} className="flex flex-col justify-center">
      {/* 1. Large Number (Value) */}
      <p className={`text-4xl lg:text-5xl font-black leading-none tracking-tight ${stat.color || 'text-gray-800 dark:text-gray-200'}`}>
        {stat.value}
      </p>
      
      <div className="mt-1">
        {/* 2. Label - NOW USES THE SAME COLOR AS THE VALUE */}
        <p className={`text-[12px] font-bold leading-tight ${stat.color || 'text-gray-800 dark:text-gray-200'}`}>
          {stat.label}
        </p>
        
        {/* 3. Sub-label - Remains gray */}
        <p className="text-[10px] text-gray-600 dark:text-gray-500 mt-0.5 font-medium leading-tight">
          {stat.sub}
        </p>
      </div>
    </div>
  ))}
</div>
      </div>

      {/* 2. Subject Tables Grid (Mathematics & Science) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 ">
        {renderTable("Mathematics", dashboardData?.overview?.mathematics, "78%", "91%")}
        {renderTable("Science", dashboardData?.overview?.science, "78%", "91%")}
      </div>


{/* 3. EVS FOOTER ALERT BAR (Fully Dynamic) */}
{(dashboardData?.overview?.evs || []).map((item: any, i: number) => (
  <div key={i} className="bg-[#FCEA0A] rounded-[1rem] p-5 flex items-center justify-between shadow-sm w-full border border-yellow-300 ">
    
    <div className="flex items-start gap-4">
      {/* Orange Chevron Icon Box */}
      <div className="bg-[#f39c12] text-white w-7 h-7 flex items-center justify-center rounded-[6px] flex-shrink-0 shadow-sm mt-0.5">
        <svg 
          width="14" height="14" viewBox="0 0 24 24" fill="none" 
          stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </div>
      
      {/* Alert Text Content */}
      <div className="flex flex-col text-gray-900">
        
        {/* Top Line: Title and Stats from Data */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-black tracking-wide">EVS</span>
          <span className="text-[11px] font-bold">
            {item.section} <span className="mx-1.5 opacity-50">•</span> 
            {item.students} students <span className="mx-1.5 opacity-50">•</span> 
            Avg {item.avg}% <span className="mx-1.5 opacity-50">•</span> 
            Bench {item.benchmark}%
          </span>
        </div>
        
        {/* Middle Line: Coverage from Data */}
        <div className="text-[10.5px] font-black mt-1">
          Syllabus {item.syllabus}% <span className="mx-1.5 opacity-50">•</span> Mock {item.mock}% <span className="mx-1.5 text-gray-500">-</span>
        </div>
        
        {/* Bottom Line: Recommendation from Data */}
        <div className="text-[10px] font-bold mt-0.5 text-gray-700">
          {item.recommendation}
        </div>
        
      </div>
    </div>

    {/* Right Side: Action Button from Data */}
    <div className="pl-4">
      <button className="bg-[#f39c12] text-white px-8 py-2 rounded-full text-[10px] font-black  tracking-wider shadow-sm hover:scale-105 transition-transform active:scale-95">
        {item.status}
      </button>
    </div>
    
  </div>
))}
    </div>
  );
};

export default OverviewTab;