import { dashboardData } from "./mockData";


const OverviewTab = () => {
  // Mapping for status badge colors
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'On Track': return 'bg-green-600';
      case 'Watch': return 'bg-orange-400';
      case 'Action': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const renderTable = (title: string, data: any[]) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-end mb-4 border-b pb-2">
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        <p className="text-[10px] text-gray-400 italic">
          Syllabus: <span className="text-gray-600 font-bold">78% complete</span>, Mock: <span className="text-gray-600 font-bold">91%</span>
        </p>
      </div>
      
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-400 text-[10px] uppercase font-black">
            <th className="pb-3">Section</th>
            <th className="pb-3">Students</th>
            <th className="pb-3">Class Avg</th>
            <th className="pb-3">Benchmark</th>
            <th className="pb-3 text-right pr-4">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {(data || []).map((item, i) => (
            <tr key={i} className="hover:bg-gray-50 transition-colors">
              <td className="py-3 text-sm font-bold text-gray-700">{item.section}</td>
              <td className="text-sm text-gray-600">{item.students}</td>
              <td className="text-sm font-bold text-gray-700">{item.avg}%</td>
              <td className="text-sm text-gray-400">{item.benchmark}%</td>
              <td className="text-right">
                <span className={`inline-block w-24 text-center py-1 rounded-full text-[9px] font-black text-white shadow-sm ${getStatusStyle(item.status)}`}>
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
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
        {/* Tab Sub-Header */}
        <div className="flex-shrink-0">
          <h2 className="text-lg font-black text-cyan-600">Student & Subject Overview</h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
            Performance summary across all classes | March 2026
          </p>
        </div>

        {/* New: Top Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full lg:max-w-6xl">
          {(dashboardData?.topStats || []).map((stat, i) => (
            <div key={i} className="bg-white dark:bg-secondary-900 p-4 rounded-xl border-l-4 border-[#f39c12] shadow-sm">
              <p className={`text-2xl font-black ${stat.color || 'text-gray-800'}`}>{stat.value}</p>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter leading-tight">
                {stat.label}
              </p>
              <p className="text-[9px] text-gray-400 italic mt-1">{stat.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {renderTable("Mathematics", dashboardData?.overview?.mathematics)}
        {renderTable("Science", dashboardData?.overview?.science)}
      </div>
    </div>
  );
};

export default OverviewTab;