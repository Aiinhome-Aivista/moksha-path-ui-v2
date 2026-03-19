import { dashboardData } from "./mockData";

const MockExamsTab = () => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 1. Header Title Section */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-black text-[#00a8cc]">Mock Exam Performance</h2>
        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tight">
          Class-wise mock scores, trends & chapter accuracy • Mock V Latest
        </p>
      </div>

      {/* 2. Upper Row: Performance Cards with High-Fidelity Stepped Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {(dashboardData?.mockExams || []).map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between h-full hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-baseline">
                  <span className={`text-5xl font-black tracking-tighter ${item.color.includes('green') ? 'text-green-600' : 'text-[#f39c12]'}`}>
                    {item.score}
                  </span>
                  <span className="text-gray-300 text-lg font-bold ml-1">/100</span>
                </div>
                <p className="font-black text-sm text-gray-800 mt-1 uppercase tracking-tight">{item.class}</p>
              </div>
              <div className="text-right">
                <p className={`text-xs font-black flex items-center justify-end gap-1 ${item.color.includes('green') ? 'text-green-600' : 'text-[#f39c12]'}`}>
                   <span className="text-[10px]">{item.trend.startsWith('+') ? '▲' : '▼'}</span> {item.trend}
                </p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1">
                  Bench: <span className="text-gray-700">{item.bench}</span>
                </p>
              </div>
            </div>
            
            {/* Stepped Performance Chart Logic */}
            <div className="mt-8 flex items-end gap-2 h-20 relative">
              {(item.points || []).map((p, i) => {
                const stepHeight = (p / 100) * 60; // Calculate height based on 100 max
                return (
                  <div key={i} className="flex-1 flex flex-col items-center relative group">
                    {/* The Horizontal Step Line */}
                    <div 
                      className={`w-full h-[4px] rounded-full transition-all duration-500 ${item.color.includes('green') ? 'bg-green-500' : 'bg-[#f39c12]'}`} 
                      style={{ 
                        opacity: 0.3 + (i * 0.15),
                        transform: `translateY(-${stepHeight}px)` 
                      }} 
                    />
                    
                    {/* Circle Dot for the current M5 point */}
                    {i === (item.points.length - 1) && (
                      <div 
                        className={`absolute w-3 h-3 rounded-full border-2 border-white shadow-md z-10 transition-all ${item.color.includes('green') ? 'bg-green-600' : 'bg-[#f39c12]'}`}
                        style={{ transform: `translateY(-${stepHeight + 4}px)` }} 
                      />
                    )}

                    <span className="text-[9px] font-black text-gray-300 mt-auto pt-2">M{i+1}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Middle: Chapter Accuracy Grid (REFINED) */}
      <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-10">
          <h3 className="text-xl font-black text-gray-800">Chapter Accuracy - Mock V</h3>
          <span className="h-6 w-[2px] bg-gray-200" />
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Mathematics | All Classes</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-12 gap-y-12">
          {(dashboardData?.chapterAccuracy || []).map((chap, i) => (
            <div key={i} className="flex flex-col gap-6">
              <h4 className="text-[12px] font-black text-gray-900 uppercase tracking-tight leading-tight min-h-[32px]">
                {chap.name}
              </h4>
              <div className="flex flex-col gap-5">
                {(chap.scores || []).map((s, si) => (
                  <div key={si} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className={`text-[11px] font-black ${s.val < 50 ? 'text-red-500' : s.val < 75 ? 'text-[#f39c12]' : 'text-green-600'}`}>
                        {s.label}: {s.val}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 h-[7px] rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${s.val < 50 ? 'bg-red-400' : s.val < 75 ? 'bg-[#f39c12]' : 'bg-green-600'}`} 
                        style={{ width: `${s.val}%` }} 
                      />
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
        {(dashboardData?.alerts || []).map((alert, i) => (
          <div key={i} className={`${alert.color} p-6 rounded-2xl text-white flex items-center gap-5 shadow-xl transition-all hover:-translate-y-1 cursor-pointer ring-1 ring-white/20`}>
            <div className="bg-white/20 p-3 rounded-xl flex items-center justify-center">
               <span className="text-2xl">➜</span>
            </div>
            <div>
              <p className="text-xs font-black leading-tight uppercase tracking-wide">{alert.text}</p>
              <p className="text-[11px] opacity-80 font-bold mt-1">{alert.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MockExamsTab;