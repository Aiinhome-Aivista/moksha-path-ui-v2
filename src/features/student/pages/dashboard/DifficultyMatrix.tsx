import { levels } from "./NewStudent";

export const DifficultyMatrix = () => {
  return (
    <div className="p-4">
      <h2 className="font-semibold text-lg">
        Difficulty Performance Matrix
      </h2>
      <p className="font-normal text-xs mb-5 text-gray-700">
        How you performed at each adaptive difficulty tier-
      </p>

      {levels.map((lvl, i) => (
        <div key={i} className="mb-4 grid grid-cols-7">
          {/* Top Row */}
          <div>
            <p className="font-medium">label</p>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">{lvl.label}</span>
            </div>

            {/* Mean Time */}
            <p className="text-[10px] text-gray-400 mt-1">Mean Time: 5 sec</p>
          </div>

          <div className=" col-span-5">
            {/* Stats */}
            <div className="flex gap-4 justify-around text-xs text-gray-500 mb-1">
              <div>
                <p>Attempted</p>
                <span> {lvl.attempted}</span>
              </div>
              <div>
                {" "}
                <p>Correct</p>
                <span className="text-green-600">{lvl.correct}</span>
              </div>
              <div>
                {" "}
                <p>Wrong</p>
                <span className="text-red-500">{lvl.wrong}</span>
              </div>
              <div>
                {" "}
                <p>Skipped</p>
                <span>{lvl.skipped}</span>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="flex w-full h-2 bg-gray-200 rounded">
              <div
                className={`h-2 rounded ${lvl.correctColor}`}
                style={{ width: `${(lvl.correct / lvl.attempted) * 100}%` }}
              />
              <div
                className={`h-2 rounded ${lvl.wrongColor}`}
                style={{ width: `${(lvl.wrong / lvl.attempted) * 100}%` }}
              />
              <div
                className={`h-2 rounded ${lvl.skippedColor}`}
                style={{ width: `${(lvl.skipped / lvl.attempted) * 100}%` }}
              />
            </div>
          </div>
          <h2
            className={`text-5xl text-end ${
              lvl.percent > 80
                ? "text-gray-500"
                : lvl.percent > 60
                ? "text-orange-500"
                : lvl.percent > 45
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {lvl.percent}
            <span className="text-2xl">%</span>
          </h2>
        </div>
      ))}
    </div>
  );
};
