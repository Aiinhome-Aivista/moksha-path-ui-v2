import { dashboardData } from "./mockData";

interface RemediationTabProps {
  data?: any;
}

const RemediationTab = ({ data }: RemediationTabProps) => {
  // Use API data if available, otherwise fall back to mock data
  const displayData = data || dashboardData;

  // Extract summary and matrix data
  const summary = displayData?.summary || {};
  const matrix = displayData?.matrix || [];
  const recommendations = displayData?.recommendations || [];

  // Build summary stats array
  // Calculate total students for percentage calculation
  const totalStudents = (summary.excellent || 0) + (summary.watch_zone || 0) + (summary.at_risk || 0) + (summary.critical || 0) || 1;

  // Build summary stats array
  const summaryStats = [
    { label: 'Excelling', labelScore: '>=Benchmark', value: summary.excellent || 0, color: 'text-[#4CAF50]', bgColor: 'bg-[#4CAF50]' },
    { label: 'Watch Zone', labelScore: '5-15% below', value: summary.watch_zone || 0, color: 'text-[#FFC107]', bgColor: 'bg-[#FFC107]' },
    { label: 'At-Risk', labelScore: '15-25% below', value: summary.at_risk || 0, color: 'text-[#E18E00]', bgColor: 'bg-[#E18E00]' },
    { label: 'Critical', labelScore: '> 25% below', value: summary.critical || 0, color: 'text-[#F44336]', bgColor: 'bg-[#F44336]' },
  ];

  const getActionStyle = (action: string) => {
    const act = action?.toUpperCase();
    if (act === 'SCHEDULE') return 'bg-[#E67E22] text-white border-none';
    if (act === 'ASSIGN' || act === 'ASSIGN_NOW') return 'bg-[#FF6060] text-white border-none';
    if (act === 'MONITOR') return 'bg-white text-[#E67E22] border-[2px] border-[#E67E22]';
    return 'bg-white text-gray-600 border border-gray-300';
  };

  const getActionLabel = (action: string) => {
    const act = action?.toUpperCase();
    if (act === 'ASSIGN NOW' || act === 'ASSIGN_NOW') return 'Assign Now';
    if (act === 'SCHEDULE') return 'Schedule';
    if (act === 'MONITOR') return 'Monitor';
    return action;
  };

  return (
    <div className="space-y-2 animate-in fade-in duration-500 pr-6 pl-6 relative -top-4">
      
      {/* 1. TOP SECTION: Title and Student Buckets */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 border-b border-gray-100 pb-2">
        
        {/* Left Side: Title & Subtitle */}
        <div className="flex-shrink-0 pt-8">
          <h2 className="text-xl font-black text-cyan-600">
            Remediation Plan & Student Buckets
          </h2>
          <p className="text-xs text-primary font-medium tracking-tight">
            Priority actions, at-risk matrix and improvement strategies
          </p>
        </div>

        {/* Right Side: 4 Student Bucket Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 items-start gap-4 lg:gap-8 flex-1 xl:max-w-4xl">
          {summaryStats.map((item: any, i: number) => {
            const percentage = Math.round((item.value / totalStudents) * 100);
            return (
              <div key={i} className="flex flex-col w-full min-w-0">
                <span className={`text-4xl font-medium leading-none tracking-tighter ${item.color}`}>
                  {item.value}
                </span>
                
                <span className="text-sm font-bold text-gray-800 mt-0.5 leading-none tracking-tight truncate">
                  {item.label}
                </span>
                
                <div className="flex justify-between items-center w-full mt-1">
                  <span className="text-[10px] text-primary font-medium whitespace-nowrap">
                    {item.labelScore}
                  </span>
                  <span className="text-[10px] text-primary font-medium whitespace-nowrap">
                    {percentage}% of class
                  </span>
                </div>

                {/* Progress Bar Line */}
                <div className="w-full h-1.5 rounded-full bg-gray-200 mt-1 overflow-hidden">
                  <div 
                    className={`h-full ${item.bgColor} transition-all duration-1000`} 
                    style={{ width: `${percentage}%` }} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. TABLE SECTION: Clean, No Borders, Centered columns */}
      <div className="">
        <h3 className="text-[1.1rem] font-bold text-gray-800 mb-2 tracking-tight">Remediation Priority Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="border-y-[6px] border-gray-300 dark:border-secondary-700">
              <tr className="border-y-2 border-gray-100 text-gray-800 text-[16px] font-bold tracking-tight">
                <th className="py-2 pl-2 font-bold">Class</th>
                <th className="py-2 font-bold">Subject</th>
                <th className="py-2 font-bold">Chapter</th>
                <th className="py-2 text-center font-bold">Accuracy</th>
                <th className="py-2 text-center font-bold">Benchmark</th>
                <th className="py-2 text-center font-bold">Gap</th>
                <th className="py-2 text-center font-bold">At-Risk</th>
                <th className="py-2 text-center font-bold pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {matrix.map((item: any, i: number) => (
                <tr key={i} className="">
                  <td className="py-2 pl-2 text-[13px] font-bold text-gray-600">
                    {item.class}
                  </td>
                  <td className="py-2 text-[13px] font-bold text-gray-800">{item.subject}</td>
                  <td className="py-2 text-[13px] font-bold text-gray-800">{item.chapter}</td>
                  <td className="py-2 text-[13px] font-bold text-[#F44336] text-center">{item.accuracy}%</td>
                  <td className="py-2 text-[13px] text-gray-600 font-bold text-center">{item.benchmark}%</td>
                  <td className="py-2 text-[13px]  font-bold text-[#F44336] text-center">{item.gap}%</td>
                  <td className="py-2 text-[13px] text-gray-700 font-bold text-center">{item.at_risk_students}</td>
                  <td className="py-2 pr-2 text-center">
                    {/* Action Buttons */}
                    <button className={`w-[110px] py-1.5 rounded-full text-xs font-black tracking-tight transition-all ${getActionStyle(item.action)}`}>
                      {getActionLabel(item.action)}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. RECOMMENDED PLANS (Green Cards at bottom) */}
      <div className="">
        <h3 className="text-[1.1rem] font-bold text-gray-800 mb-4 tracking-tight">Recommended Remediation Plans</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {recommendations.map((plan: any, idx: number) => (
            <div key={idx} className="bg-[#bada55] p-5 rounded-[1.2rem] flex gap-4 items-start shadow-sm border border-[#a8c64a]">
              <div className="bg-white text-[#8ba832] w-7 h-7 rounded-full flex items-center justify-center font-black flex-shrink-0 text-xs shadow-sm">
                {idx + 1}
              </div>
              <div>
                <p className="text-sm font-black text-gray-800 leading-tight mb-1">{plan.title}</p>
                <p className="text-[11px] font-bold text-gray-700 leading-tight opacity-90">{plan.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default RemediationTab;