interface DifficultyLevel {
  label: string;
  attempted: number;
  correct: number;
  correctColor: string;
  wrong: number;
  wrongColor: string;
  skipped: number;
  skippedColor: string;
  percent: number;
  meanTime?: number;
}

interface DifficultyMatrixProps {
  DifficultyData: DifficultyLevel[];
}

export const DifficultyMatrix = ({ DifficultyData }: DifficultyMatrixProps) => {
  return (
    <div className="px-4">
      <h2 className="font-semibold text-3xl text-primary">
        Difficulty Performance Matrix
      </h2>
      <p className="font-medium text-base mb-5 text-primary">
        How you performed at each adaptive difficulty tier-
      </p>

      {DifficultyData.map((lvl, i) => (
        <div key={i} className="mb-8 flex items-stretch">
          {/* Left Side: Level Info */}
          <div className="w-[20%] flex flex-col justify-between pb-1">
            <div>
              <p className="font-extrabold text-sm text-[#637381]">Level</p>
              <h2 className="font-extrabold text-lg text-[#212B36] leading-tight mt-0.5 whitespace-nowrap">{lvl.label}</h2>
            </div>
            <p className="text-[10px] text-[#212B36] font-bold">Mean Time: {lvl.meanTime || 0} sec</p>
          </div>

          {/* Right Side: Stats + Bar + Percentage */}
          <div className="flex-1 flex items-end ml-4">
            
            {/* Stats and Bar Column */}
            <div className="flex-1 flex flex-col">
              {/* Stats row */}
              <div className="flex justify-between items-end px-2 mb-2">
                 {/* Attempted */}
                 <div className="text-center">
                    <p className="text-[11px] font-extrabold text-[#212B36] mb-0.5">Attempted</p>
                    <p className="text-[34px] font-light text-[#5C92C8] leading-none">{lvl.attempted}</p>
                 </div>
                 {/* Correct */}
                 <div className="text-center">
                    <p className="text-[11px] font-extrabold mb-0.5" style={{color: lvl.correctColor}}>Correct</p>
                    <p className="text-[34px] font-light leading-none" style={{color: lvl.correctColor}}>{lvl.correct}</p>
                 </div>
                 {/* Wrong */}
                 <div className="text-center">
                    <p className="text-[11px] font-extrabold mb-0.5" style={{color: lvl.wrongColor}}>Wrong</p>
                    <p className="text-[34px] font-light leading-none" style={{color: lvl.wrongColor}}>{lvl.wrong}</p>
                 </div>
                 {/* Skipped */}
                 <div className="text-center">
                    <p className="text-[11px] font-extrabold text-[#8A94A0] mb-0.5">Skipped</p>
                    <p className="text-[34px] font-light text-[#8A94A0] leading-none">{lvl.skipped}</p>
                 </div>
              </div>
              
              {/* Progress Bar Row */}
              <div className="flex w-full h-[10px] rounded-full overflow-hidden bg-[#DFE3E8] mt-1.5">
                {(() => {
                  const total = lvl.attempted + lvl.skipped;
                  if (total === 0) return null;
                  return (
                    <>
                      <div style={{ width: `${(lvl.correct / total) * 100}%`, backgroundColor: lvl.correctColor }} className="border-r-[3px] border-white h-full" />
                      <div style={{ width: `${(lvl.wrong / total) * 100}%`, backgroundColor: lvl.wrongColor }} className="border-r-[3px] border-white h-full" />
                      <div style={{ width: `${(lvl.skipped / total) * 100}%`, backgroundColor: lvl.skippedColor || '#8A94A0' }} className="h-full" />
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Percentage Column */}
            <div className="w-[90px] flex items-end justify-end pl-4">
               <h2 className="text-[46px] font-light text-[#637381] leading-none flex items-baseline translate-y-1.5">
                  {lvl.percent}<span className="text-[22px] ml-0.5">%</span>
               </h2>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
