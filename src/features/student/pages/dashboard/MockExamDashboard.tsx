import { AccuracyProgression } from "./AccuracyProgression";
import { DifficultyMatrix } from "./DifficultyMatrix";

interface MockExamDashboardProps {
  selectedExam: string;
  mockDashboardData: any;
}

export const MockExamDashboard = ({ selectedExam, mockDashboardData }: MockExamDashboardProps) => {
  if (!mockDashboardData || !mockDashboardData.mocks || mockDashboardData.mocks.length === 0) {
    return <div className="text-center py-20 text-gray-500 font-medium italic text-xl">No mock exam data available.</div>;
  }

  // Parse 'Mock: M01' to get the index (1 -> 0)
  const mockIndex = parseInt(selectedExam.split('M')[1]) - 1;
  const currentMock = mockDashboardData.mocks[mockIndex] || mockDashboardData.mocks[0];

  if (!currentMock) {
    return <div className="text-center py-20 text-gray-500">No data found for {selectedExam}.</div>;
  }



  // Transform level_matrix to match DifficultyMatrix expected format
  const difficultyLevels = currentMock.level_matrix.map((lvl: any) => {
    // Map bucket names based on level if not provided in the matrix
    const bucket = lvl.level === "L1" ? "Easy" : lvl.level === "L2" ? "Medium" : lvl.level === "L3" ? "Hard" : "Expert";
    
    return {
      label: `${lvl.level} - ${bucket}`,
      attempted: lvl.attempted || 0,
      correct: lvl.correct || 0,
      correctColor: "#b0cb1f",
      wrong: lvl.wrong || 0,
      wrongColor: "#FC7465",
      skipped: lvl.skipped || 0,
      skippedColor: "#6b7280",
      percent: Math.round(lvl.accuracy || 0),
      meanTime: lvl.avg_time || 0
    };
  });

  return (
    <div className="px-4 h-[40rem] overflow-y-auto custom-scrollbar pt-0">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-2">
        <DifficultyMatrix DifficultyData={difficultyLevels} />
        <AccuracyProgression chapters={currentMock.chapters} />
      </div>
    </div>
  );
};
