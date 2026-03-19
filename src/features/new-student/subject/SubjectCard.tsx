import React from "react";

interface Level {
  label: string;
  value: number;
  color: string;
  time: string;
}

interface SubjectCardProps {
  title: string;
  score: number;
  level: string;
  statusColor: string;
  levels: Level[];
}

const SubjectCard: React.FC<SubjectCardProps> = ({
  title,
  score,
  level,
  statusColor,
  levels,
}) => {
  return (
    <div className="bg-white p-4 shadow-sm border-b-2 border-amber-300">
      {/* Top Section */}
      <div className="flex items-end gap-2 mb-2">
        <h2 className="text-7xl font-thin" style={{ color: statusColor }}>
          {score}
          <span className="text-3xl">%</span>
        </h2>
        <div className="w-full items-end">
          <span className="text-xs font-medium text-gray-500 pb-4">
            {level}
          </span>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-gray-200 rounded-full my-2">
            <div
              className="h-3 rounded-full"
              style={{
                width: `${score}%`,
                backgroundColor: statusColor,
              }}
            />
          </div>
        </div>
      </div>

      {/* Title */}
      <h3 className="font-bold text-2xl text-gray-700 mb-2">{title}</h3>

      {/* Accuracy by Level */}
      <p className="text-xs text-gray-400 mb-2">Accuracy by Level</p>

      {/* <div className="flex justify-around text-center text-xs text-gray-500 mb-1 ml-1">
        {levels.map((lvl, i) => (
          <span key={i}>{lvl.value}%</span>
        ))}
      </div> */}

      {/* Small Bars */}
      <div className="flex gap-1 mb-2 justify-around">
        {levels.map((lvl, i) => (
          <div key={i} className="flex-1">
            <p className="text-lg text-center mt-1"  style={{
                  color: lvl.color,
                }}>{lvl.value}%</p>
            <p className="text-sm font-bold text-center mt-1">{lvl.label}</p>
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 rounded-full"
                style={{
                  width: `${lvl.value}%`,
                  backgroundColor: lvl.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Mean Time */}
      <div className="flex justify-around mt-2 text-gray-400">
        {levels.map((lvl, i) => (
          <div className="text-center">
            <p className="text-sm text-center">Mean Time:</p>
            <p className="text-sm text-center" key={i}>
              {lvl.time}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectCard;
