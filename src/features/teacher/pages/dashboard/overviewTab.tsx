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
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex-1">
      <div className="flex justify-between items-end mb-4 border-b border-gray-50 pb-2">
        <h3 className="text-xl font-black text-gray-800 tracking-tight">{title}</h3>
        <p className="text-[10px] text-gray-400 font-bold uppercase">
          Syllabus: <span className="text-gray-700">{syllabus} complete</span> | Mock: <span className="text-gray-700">{mock}</span>
        </p>
      </div>
      
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-400 text-[10px] uppercase font-black tracking-widest">
            <th className="pb-4">Section</th>
            <th className="pb-4">Students</th>
            <th className="pb-4 text-center">Class Avg</th>
            <th className="pb-4 text-center">Benchmark</th>
            <th className="pb-4 text-right pr-4">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {(data || []).map((item, i) => (
            <tr key={i} className="group hover:bg-gray-50 transition-all duration-200">
              <td className="py-3.5 text-sm font-bold text-gray-700">{item.section}</td>
              <td className="text-sm text-gray-500 font-medium">{item.students}</td>
              <td className="text-sm font-bold text-gray-700 text-center">{item.avg}%</td>
              <td className="text-sm text-gray-400 text-center">{item.benchmark}%</td>
              <td className="text-right">
                <span className={`inline-block w-24 text-center py-1.5 rounded-full text-[9px] font-black text-white shadow-sm transform group-hover:scale-105 transition-transform ${getStatusStyle(item.status)}`}>
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. Page Sub-Header and Top Stats in one responsive row */}
      <div className="flex flex-col xl:flex-row justify-between items-start gap-8">
        <div className="flex-shrink-0 pt-2">
          <h2 className="text-2xl font-black text-cyan-600 tracking-tight leading-none">Student & Subject Overview</h2>
          <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tight mt-1">
            Performance summary across all classes | March 2026
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 flex-1 w-full max-w-5xl">
          {(dashboardData?.topStats || []).map((stat, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border-l-[5px] border-[#f39c12] shadow-sm flex flex-col justify-center">
              <p className={`text-2xl font-black leading-none ${stat.color || 'text-gray-800'}`}>{stat.value}</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter mt-1 leading-tight">
                {stat.label}
              </p>
              <p className="text-[9px] text-gray-400 italic mt-0.5">{stat.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Subject Tables Grid (Mathematics & Science) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {renderTable("Mathematics", dashboardData?.overview?.mathematics, "78%", "91%")}
        {renderTable("Science", dashboardData?.overview?.science, "78%", "91%")}
      </div>

      {/* 3. EVS Specific Footer Bar (Matching Source 36-39) */}
      <div className="bg-[#f39c12] rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between text-white shadow-lg overflow-hidden relative">
        <div className="flex items-center gap-6 z-10">
          <div className="bg-white/20 px-4 py-1 rounded-lg font-black text-lg">EVS</div>
          <div className="text-xs font-bold space-x-4">
            <span>Class 8-A</span>
            <span className="opacity-60">|</span>
            <span>28 students</span>
            <span className="opacity-60">|</span>
            <span>Avg 80%</span>
            <span className="opacity-60">|</span>
            <span>Bench 86%</span>
          </div>
        </div>
        
        <div className="flex items-center gap-8 z-10 mt-4 md:mt-0">
          <div className="text-[10px] font-black uppercase text-white/80 text-right">
            Syllabus 95% | Mock 88%
            <p className="text-[9px] opacity-100 mt-0.5 italic text-white underline">Strong coverage extension mock recommended</p>
          </div>
          <div className="bg-white text-[#f39c12] px-6 py-1.5 rounded-full text-xs font-black shadow-md uppercase">
            Watch
          </div>
        </div>
        {/* Decorative subtle background icon */}
        <div className="absolute right-[-20px] bottom-[-20px] text-8xl opacity-10 font-black italic">EVS</div>
      </div>
    </div>
  );
};

export default OverviewTab;