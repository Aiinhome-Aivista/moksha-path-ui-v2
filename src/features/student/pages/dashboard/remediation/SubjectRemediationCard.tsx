/* Helper for hex colors */
const getHexColor = (percent: number) => {
  if (percent === 0) return "#f3f4f6"; // Light gray for bar background
  if (percent > 80) return "#4caf50"; // Green
  if (percent > 60) return "#ff9800"; // Orange
  if (percent > 45) return "#fbc02d"; // Yellow
  return "#ea4335"; // Red
};

const SubjectRemediationCard = ({ data }: any) => {
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
      <div className="mt-4 space-y-1">
        {data.actions.map((act: any, i: number) => (
          <div
            key={i}
            className={`p-2 rounded-lg text-sm flex gap-4 ${i === 0
              ? "bg-button-primary"
              : i === 1
                ? "bg-highlighter"
                : "bg-lime-100"
              }`}
          >
            <div className="font-bold bg-white w-12 h-12 flex items-center justify-center rounded-full text-xl shrink-0">
              {i + 1}
            </div>
            <div>
              <p className="font-bold">{act.title}</p>
              <p className="font-medium">{act.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectRemediationCard;
