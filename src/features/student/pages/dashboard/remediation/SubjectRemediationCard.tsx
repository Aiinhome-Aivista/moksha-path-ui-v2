/* Helper for hex colors */
const getHexColor = (percent: number) => {
  if (percent === 0) return "#f3f4f6"; // Light gray for bar background
  if (percent > 80) return "#4caf50"; // Green
  if (percent > 60) return "#ff9800"; // Orange
  if (percent > 45) return "#fbc02d"; // Yellow
  return "#ea4335"; // Red
};

const SubjectRemediationCard = ({ data, isLoading }: any) => {
  return (
    <div className=" px-4 border-b-2">
      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        <h3 className="text-xl text-primary font-semibold leading-tight">{data.title}</h3>
        <span className="text-xs font-bold text-red whitespace-nowrap mt-1">{data.priority}</span>
      </div>

      {/* Score + Progress */}
      <div className="flex items-center gap-12 mt-2">
        <h2 className="text-5xl font-light" style={{ color: getHexColor(data.percent) }}>
          {data.percent}%
        </h2>

        <div className="w-full">
          <span className="text-xs font-bold" style={{ color: data.levelColor }}>{data.level}</span>
          <div className="w-full h-4 bg-gray-200 rounded-full mb-2">
            <div
              className="h-4 rounded-full"
              style={{
                width: `${data.percent}%`,
                backgroundColor: getHexColor(data.percent)
              }}
            />
          </div>
        </div>
      </div>

      {/* Levels */}
      <div className="flex gap-1 mt-4">
        {data.levels.map((lvl: any, i: number) => (
          <div key={i} className="flex-1">
            <h4
              className="text-2xl text-center font-medium"
              style={{ color: lvl.color }}
            >
              {lvl.value}%
            </h4>
            <p className={`text-sm text-center font-bold uppercase ${lvl.value === 0 ? "text-gray-400" : "text-black"}`}>{lvl.label}</p>
            <div className="h-3 bg-gray-200 rounded-full">
              <div
                className="h-3 rounded-full"
                style={{
                  width: `${lvl.value}%`,
                  backgroundColor: lvl.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-6 space-y-3 pb-4 min-h-[120px] relative">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-gray-100 border-t-[#BADA55] rounded-full animate-spin" />
              <span className="text-[10px] text-gray-400 font-medium tracking-wide">
                Analyzing patterns…
              </span>
            </div>
          </div>
        ) : data.actions.length > 0 ? (
          data.actions.map((act: any, i: number) => {
            const bgColor = i === 0 ? "#c5e1a5" : i === 1 ? "#fff59d" : "#ef9a9a";
            const textColor = i === 0 ? "#33691e" : i === 1 ? "#f57f17" : "#b71c1c";
            
            return (
              <div
                key={i}
                className="p-3 rounded-2xl text-sm flex gap-4 items-center shadow-sm"
                style={{ backgroundColor: bgColor }}
              >
                <div className="font-bold bg-white w-10 h-10 flex items-center justify-center rounded-full text-xl shrink-0 shadow-inner" style={{ color: textColor }}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 leading-tight mb-0.5">{act.title}</p>
                  {act.subtitle && <p className="font-medium text-gray-700 text-xs leading-snug">{act.subtitle}</p>}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-400 italic text-sm">
            No remediation insights available yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectRemediationCard;
