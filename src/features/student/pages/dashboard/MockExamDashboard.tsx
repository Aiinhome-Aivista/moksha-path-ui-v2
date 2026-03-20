import { AccuracyProgression } from "./AccuracyProgression";
import { DifficultyMatrix } from "./DifficultyMatrix";

export const MockExamDashboard = () => {
  return (
    <div className="p-4 bg-gray-100 h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-1/2 overflow-y-auto custom-scrollbar p-2 pb-8">
        <DifficultyMatrix />
        <AccuracyProgression />
      </div>
    </div>
  );
};