import { ChevronDown, ChevronRight, ChevronUp } from "lucide-react";
import { dashboardData } from "./mockData";

interface MockExamsTabProps {
  data?: any;
}

const MockExamsTab = ({ data }: MockExamsTabProps) => {
  // Use API data if available, otherwise fall back to mock data
  const displayData = data || dashboardData;
  
  // Extract mock overview data
  const mockOverview = displayData?.mock_overview || [];
  const chapterAccuracy = displayData?.chapter_accuracy || [];
  const actions = displayData?.actions || [];

  return (
    <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700 pt-4  pb-4 pr-6 pl-6">
      {/* 1. Header Title Section */}
      <div className="flex flex-col gap-1 ">
        <h2 className="text-xl font-black text-[#00a8cc]">Mock Exam Performance</h2>
        <p className="text-xs text-secondary tracking-tight">
          Class-wise mock scores, trends & chapter accuracy • Latest Mock
        </p>
      </div>

      {/* 2. Upper Row: Performance Cards with High-Fidelity Stepped Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {mockOverview.map((item: any, idx: number) => {
          
          // Color based on score vs benchmark
          const isAboveBench = (item.score || 0) >= (item.benchmark || 75);
          const colorHex = isAboveBench ? '#4CAF50' : '#FF9800'; // Green or Orange line
          const textClass = isAboveBench ? 'text-[#4CAF50]' : 'text-[#FF9800]';
          const isPositive = (item.trend || 0) >= 0;
          const trendValues = item.trend_scores || [];

          return (
            <div key={idx} className="flex flex-col justify-between h-full bg-transparent">
              
              <div className="flex justify-between items-end">
                 <div className="flex items-baseline">
                    <span className={`text-6xl leading-none tracking-tighter ${textClass}`}>
                      {item.score}
                    </span>
                    <span className="text-primary text-3xl ml-1">/100</span>
                  </div>
                   <div className={`flex items-center justify-center font-bold text-sm ${textClass}`}>
                    <span className="text-lg leading-none">
                      {isPositive ? <ChevronUp /> : <ChevronDown />} 
                    </span>
                    <span className="text-xl">{Math.abs(item.trend || 0)}</span>
                  </div>
              </div>
              <div className="flex justify-between items-end">
                <p className="font-bold text-lg text-primary tracking-tight">
                    {item.class} {item.section ? `- ${item.section}` : ''}
                  </p>
                  <p className="text-xs text-primary font-bold tracking-tight whitespace-nowrap">
                    Bench: <span className="text-primary">{item.benchmark}</span>
                  </p>
              </div>
              
              {/* Stepped Performance Chart Area */}
              <div className=" relative h-28 w-full flex flex-col justify-end ">
                
                {/* SVG for Continuous Stepped Lines */}
                <svg className="absolute top-0 left-0 w-full h-[calc(100%-2rem)] overflow-visible" preserveAspectRatio="none">
                  {trendValues.map((p: number, i: number, arr: number[]) => {
                    
                    if (i === arr.length - 1) return null; // Stop drawing lines at the last point
                    
                    // Calculate Y position percentages (0% is top, 100% is bottom)
                    const y1 = 100-p;
                    
                    // Calculate X position percentages
                    const x1 = (i / (arr.length - 1)) * 100+1;
                    const x2 = ((i + 1) / (arr.length - 1)) * 100-1;
                    return (
                      <g key={`line-${i}`}>
                        {/* Horizontal step forward */}
                        <line x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y1}%`} stroke={colorHex} strokeWidth="2.5" />
                      </g>
                    );
                  })}
                </svg>

                {/* Data Dots and Numbers matching text color */}
                <div className="absolute top-0 left-0 w-full h-[calc(100%-2rem)]">
                  {trendValues.map((p: number, i: number, arr: number[]) => {
                    // const minScore = 40;
                    // const range = 50;
                    // const yPos = 100 - (((p - minScore) / range) * 100);
                    const yPos = 100-p;
                    const xPos = (i / (arr.length - 1)) * 100;

                    return (
                      <div key={`point-${i}`} className="absolute" style={{ left: `${xPos}%`, top: `${yPos}%` }}>
                        
                        {/* Number label colored dynamically above every dot */}
                        <span 
                          className="absolute -top-4 -left-2 text-[10px] font-bold text-primary"
                          style={{ color: i === arr.length - 1 ? colorHex : 'inherit' }} 
                        >
                          {p}
                        </span>
                        {/* Solid Colored Dot */}
                        <div 
                          className="absolute w-2 h-2 bg-white rounded-full z-10 transform -translate-x-1/2 -translate-y-1/2"
                          style={{ border: `2px solid ${colorHex}`,backgroundColor: i === arr.length - 1 ? colorHex : 'inherit' }} 
                        />
                      </div>
                    );
                  })}
                </div>

                {/* M1 to M5 Labels fixed to the bottom */}
                <div className="absolute bottom-1 left-0 w-full flex justify-between">
                  {trendValues.map((_: any, i: number) => (
                    <span key={`m-label-${i}`} className="text-xs font-black text-primary">
                      M{i+1}
                    </span>
                  ))}
                </div>

              </div>

              {/* The Exact Thick Bottom Border as per screenshot */}
              <div className="w-full h-[4px] mt-2" style={{ backgroundColor: colorHex }}></div>

            </div>
          );
        })}
      </div>

      {/* 3. Middle: Chapter Accuracy Grid (REFINED) */}
      <div className="bg-gray-100 rounded-3xl  border border-gray-100 pt-6">
        <div className="flex items-center gap-4 mb-3">
          <h3 className="text-xl font-black text-primary">Chapter Accuracy - Mock V</h3>
          <span className="h-6 w-[2px] bg-gray-600" />
          <p className="text-sm text-secondary font-bold tracking-widest">Mathamatics</p>
          <span className="h-6 w-[2px] bg-gray-600" />
          <p className="text-sm text-secondary font-bold tracking-widest">All Class</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-12 gap-y-4 pt-2 mb-2">
          {chapterAccuracy.map((chap: any, i: number) => (
            <div key={i} className="flex flex-col">
              <h4 className="text-sm font-black text-primary tracking-tight leading-tight max-h-[32px]">
                {chap.chapter_name}
              </h4>
              <div className="flex flex-col gap-5">
                {(chap.classes || []).map((classItem: any, si: number) => (
                  <div key={si} className="mt-2">
                    <div className="w-2/3 bg-gray-100 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${
                          (classItem.accuracy || 0) < 50 ? 'bg-[#FF6666]' : 
                          (classItem.accuracy || 0) < 75 ? 'bg-[#E48D00]' : 
                          'bg-[#589F12]'
                        }`} 
                        style={{ width: `${classItem.accuracy || 0}%` }} 
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`text-sm font-semibold ${
                        (classItem.accuracy || 0) < 50 ? 'text-[#FF6666]' : 
                        (classItem.accuracy || 0) < 75 ? 'text-[#E48D00]' : 
                        'text-[#589F12]'
                      }`}>
                        {classItem.class}-{classItem.section}: {classItem.accuracy}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Bottom: Action Alerts with Glassmorphism shadow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {actions.map((alert: any, i: number) => {
          // Map alert type to color
          const colorClass = 
            alert.type === 'success' ? 'bg-[#589F12]' :
            alert.type === 'warning' ? 'bg-[#E48D00]' :
            alert.type === 'danger' ? 'bg-[#FE6768]' :
            'bg-blue-500';
          
          return (
            <div key={i} className={`${colorClass} p-4 rounded-2xl text-white flex items-center gap-4  transition-all `}>
              <div className="p-2 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold"><ChevronRight /></span>
              </div>
              <div>
                <p className="text-xs font-black">{alert.text}</p>
               
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MockExamsTab;