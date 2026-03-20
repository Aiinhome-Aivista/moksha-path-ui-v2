import { dashboardData } from "./mockData";

const RemediationTab = () => {
  return (
    <div className="space-y-2 animate-in fade-in duration-500">
      
      {/* 1. TOP SECTION: Title and Student Buckets */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-gray-100">
        
        {/* Left Side: Title & Subtitle */}
<div className="flex-shrink-0 pt-4">
  <h2 className="text-[1.3rem] font-bold text-cyan-600 leading-tight tracking-tight whitespace-nowrap">
    Remediation Plan & Student Buckets
  </h2>
  <p className="text-[9px] text-gray-400 font-bold tracking-tight mt-1 whitespace-nowrap">
    Priority actions, at-risk matrix and improvement strategies
  </p>
</div>

        {/* Right Side: 4 Student Bucket Stats (No Cards, just text on bg) */}
<div className="flex flex-1 items-center justify-around max-w-6xl">
  {(dashboardData?.remediationSummary || []).map((item: any, i: number) => {
    // Map exact brand colors
    const colorClass = 
      item.label === 'Excelling' ? 'text-[#4CAF50]' :
      item.label === 'Watch Zone' ? 'text-[#FFC107]' :
      item.label === 'At-Risk' ? 'text-[#FF9800]' : 'text-[#F44336]';
    
    const bgClass = 
      item.label === 'Excelling' ? 'bg-[#4CAF50]' :
      item.label === 'Watch Zone' ? 'bg-[#FFC107]' :
      item.label === 'At-Risk' ? 'bg-[#FF9800]' : 'bg-[#F44336]';

    return (
      // Removed "flex-1 px-4" to stop them from stretching apart
      <div key={i} className="flex flex-col w-36">
        <span className={`text-4xl font-medium leading-none tracking-tighter ${colorClass}`}>
          {item.value}
        </span>
        
        <span className="text-sm font-bold text-gray-800 mt-0.5 leading-none tracking-tight">
          {item.label}
        </span>
        
        <div className="flex justify-between items-center w-full mt-1">
           <span className="text-[10px] text-gray-500 font-medium">
             {item.sub}
           </span>
           <span className="text-[10px] text-gray-400 font-medium">
             61% of class
           </span>
        </div>

        {/* Progress Bar Line */}
        <div className="w-full h-[3px] bg-gray-500 mt-1 overflow-hidden">
          <div className={`h-full ${bgClass}`} style={{ width: '61%' }} />
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
            <thead className="border-y-4 border-gray-300 dark:border-secondary-700">
              <tr className="border-y-2 border-gray-100 text-gray-800 text-[16px] font-bold tracking-tight">
                <th className="py-2 pl-2 font-bold">Class</th>
                <th className="py-2 font-bold">Subjects</th>
                <th className="py-2 font-bold">Chapter</th>
                <th className="py-2 text-center font-bold">Accuracy</th>
                <th className="py-2 text-center font-bold">Benchmark</th>
                <th className="py-2 text-center font-bold">Gap</th>
                <th className="py-2 text-center font-bold">At-Risk</th>
                <th className="py-2 text-center font-bold pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {(dashboardData?.remediationMatrix || []).map((item: any, i: number) => (
                <tr key={i} className="">
                  <td className="py-2 pl-2 text-[13px] font-bold text-gray-600">{item.class}</td>
                  <td className="py-2 text-[13px] font-bold text-gray-800">{item.subject}</td>
                  <td className="py-2 text-[13px] font-bold text-gray-800">{item.chapter}</td>
                  <td className="py-2 text-[13px] font-bold text-[#F44336] text-center">{item.accuracy}%</td>
                  <td className="py-2 text-[13px] text-gray-600 font-bold text-center">{item.bench}%</td>
                  <td className="py-2 text-[13px]  font-bold text-[#F44336] text-center">{item.gap}%</td>
                  <td className="py-2 text-[13px] text-gray-700 font-bold text-center">{item.risk}</td>
                  <td className="py-2 pr-2 text-center">
                    {/* Action Buttons exactly matching the image */}
                    <button className={`w-[100px] py-1.5 rounded-full text-[10px] font-black tracking-wider transition-all ${
                      item.action === 'Assign Now' ? 'bg-[#ff6b6b] text-white' : 
                      item.action === 'Schedule' ? 'bg-[#f39c12] text-white' : 
                      'bg-white text-gray-600 border border-gray-300' // 'Monitor' style
                    }`}>
                      {item.action}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(dashboardData?.recommendedPlans || []).map((plan: any) => (
            <div key={plan.id} className="bg-[#bada55] p-5 rounded-[1.2rem] flex gap-4 items-start shadow-sm border border-[#a8c64a]">
              <div className="bg-white text-[#8ba832] w-7 h-7 rounded-full flex items-center justify-center font-black flex-shrink-0 text-xs shadow-sm">
                {plan.id}
              </div>
              <div>
                <p className="text-sm font-black text-gray-800 leading-tight mb-1">{plan.title}</p>
                <p className="text-[11px] font-bold text-gray-700 leading-tight opacity-90">{plan.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default RemediationTab;