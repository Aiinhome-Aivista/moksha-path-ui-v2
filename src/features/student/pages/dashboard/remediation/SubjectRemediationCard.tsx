
/* Helper */
const getColor = (percent: number) => {
  if (percent > 80) return "text-gray-500";
  if (percent > 60) return "text-orange-500";
  if (percent > 45) return "text-green-500";
  return "text-red-500";
};

const SubjectRemediationCard = ({ data }: any) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow border">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">{data.title}</h3>
        <span className="text-xs text-red-500">{data.priority}</span>
      </div>

      {/* Score */}
      <div className="flex items-center justify-between mt-2">
        <h2 className={`text-3xl font-bold ${getColor(data.percent)}`}>
          {data.percent}%
        </h2>
        <span className="text-xs text-gray-500">{data.level}</span>
      </div>

      {/* Progress */}
      <div className="w-full h-2 bg-gray-200 rounded mt-2">
        <div
          className="h-2 bg-red-400 rounded"
          style={{ width: `${data.percent}%` }}
        />
      </div>

      {/* Levels */}
      <div className="flex gap-1 mt-3">
        {data.levels.map((lvl: any, i: number) => (
          <div key={i} className="flex-1">
            <div className="h-1 bg-gray-200 rounded">
              <div
                className="h-1 rounded"
                style={{
                  width: `${lvl.value}%`,
                  backgroundColor: lvl.color,
                }}
              />
            </div>
            <p className="text-[10px] text-center mt-1">{lvl.label}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-4 space-y-2">
        {data.actions.map((act: any, i: number) => (
          <div
            key={i}
            className={`p-2 rounded-lg text-sm flex gap-2 ${
              i === 0
                ? "bg-green-100"
                : i === 1
                ? "bg-yellow-100"
                : "bg-red-100"
            }`}
          >
            <span className="font-bold">{i + 1}</span>
            <p>{act}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectRemediationCard;