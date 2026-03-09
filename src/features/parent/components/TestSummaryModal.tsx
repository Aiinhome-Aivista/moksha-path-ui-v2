import React from "react";
import { X } from "lucide-react";
import type { GeneratorData } from "./TestGeneratorModal";

interface TestSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: GeneratorData | null;
}

const TestSummaryModal: React.FC<TestSummaryModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold mb-4">Test Summary</h2>
        <div className="space-y-2 text-sm text-gray-700">
          <p>Student: {data.child || "Not selected"}</p>
          <p>Subject: {data.subject || "Not selected"}</p>
          <p>Questions: {data.questions}</p>
          <p>Time Limit: {data.timeLimit} min</p>
          <p>Difficulty: {data.difficulty || "Not selected"}</p>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-full text-sm hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestSummaryModal;
