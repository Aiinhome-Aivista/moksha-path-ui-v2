import { dashboardData } from "./mockData";

const RemediationTab = () => {
  return (
    <div className="space-y-8">
      {/* 1. TOP SECTION: Title and Student Buckets in ONE LINE */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Side: Title & Subtitle */}
        <div className="flex-shrink-0">
          <h2 className="text-xl font-extrabold text-cyan-600 leading-tight">
            Remediation Plan & Student Buckets
          </h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
            Priority actions, at-risk matrix and improvement strategies
          </p>
        </div>

        {/* Right Side: 4 Student Bucket Cards */}
        <div className="flex flex-1 items-center justify-end gap-3 max-w-4xl">
          {(dashboardData?.remediationSummary || []).map((item: any, i: number) => (
            <div key={i} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex-1 min-w-[140px]">
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-black ${
                  item.label === 'Excelling' ? 'text-green-600' :
                  item.label === 'Watch Zone' ? 'text-yellow-500' :
                  item.label === 'At-Risk' ? 'text-orange-500' : 'text-red-500'
                }`}>
                  {item.value}
                </span>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-gray-700 uppercase leading-none">
                    {item.label}
                  </span>
                  <span className="text-[8px] text-gray-400 font-medium">
                    {item.sub}
                  </span>
                </div>
              </div>
              {/* Progress Bar under the number */}
              <div className="w-full h-1 bg-gray-100 rounded-full mt-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${item.color}`} 
                  style={{ width: '61%' }} // Matches the "61% of class" text in your pic
                />
              </div>
              <p className="text-[8px] text-gray-400 font-bold mt-1 text-right">61% of class</p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. TABLE SECTION: Fixed Header Design */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">Remediation Priority Matrix</h3>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-500 text-[10px] uppercase font-black">
                <tr>
                <th className="p-4">Class</th>
                <th className="p-4">Subjects</th>
                <th className="p-4">Chapter</th>
                <th className="p-4">Accuracy</th>
                <th className="p-4">Benchmark</th>
                <th className="p-4">Gap</th>
                <th className="p-4">At-Risk</th>
                <th className="p-4 text-center">Action</th>
              </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(dashboardData?.remediationMatrix || []).map((item: any, i: number) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-bold text-sm text-gray-700">{item.class}</td>
                    <td className="p-4 text-sm text-gray-600">{item.subject}</td>
                    <td className="p-4 text-sm text-gray-600 font-medium">{item.chapter}</td>
                    <td className="p-4 text-sm text-red-500 font-bold">{item.accuracy}%</td>
                    <td className="p-4 text-sm text-gray-400 font-medium">{item.bench}%</td>
                    <td className="p-4 text-sm text-red-400 font-bold">{item.gap}%</td>
                    <td className="p-4 text-sm text-gray-700 font-bold">{item.risk}</td>
                    <td className="p-4 text-center">
                      <button className={`min-w-[90px] py-1.5 rounded-full text-[9px] font-black text-white shadow-sm transition-all hover:opacity-90 active:scale-95 ${
                        item.action === 'Assign Now' ? 'bg-[#ff6b6b]' : 
                        item.action === 'Schedule' ? 'bg-[#f39c12]' : 'bg-gray-300'
                      }`}>
                        {item.action.toUpperCase()}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 3. RECOMMENDED PLANS */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4">Recommended Remediation Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(dashboardData?.recommendedPlans || []).map((plan: any) => (
            <div key={plan.id} className={`${plan.color || 'bg-lime-50'} p-4 rounded-xl flex gap-4 items-start shadow-sm border border-lime-200`}>
              <div className="bg-white text-lime-600 w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 border-2 border-lime-200 text-lg">
                {plan.id}
              </div>
              <div>
                <p className="text-sm font-bold text-green-900 leading-tight mb-1">{plan.title}</p>
                <p className="text-xs text-green-800/90 leading-snug">{plan.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RemediationTab;