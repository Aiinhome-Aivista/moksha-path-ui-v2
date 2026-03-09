import React, { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";

export interface GeneratorData {
  child: string;
  subject: string;
  questions: number;
  timeLimit: number;
  difficulty: string;
}

interface TestGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (data: GeneratorData) => void;
  childrenOptions: string[];
  subjectOptions: string[];
  difficultyOptions: string[];
}

const TestGeneratorModal: React.FC<TestGeneratorModalProps> = ({
  isOpen,
  onClose,
  childrenOptions,
  subjectOptions,
  difficultyOptions,
}) => {
  const [form, setForm] = useState<GeneratorData>({
    child: "",
    subject: "",
    questions: 20,
    timeLimit: 30,
    difficulty: "",
  });

  // reset when opened
  useEffect(() => {
    if (isOpen) {
      setForm({
        child: "",
        subject: "",
        questions: 20,
        timeLimit: 30,
        difficulty: "",
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl w-full max-w-3xl p-5 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold mb-5">Test Generator</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:items-start">
          {/* form inputs */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Child *
              </label>
              <select
                value={form.child}
                onChange={(e) =>
                  setForm((p) => ({ ...p, child: e.target.value }))
                }
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-[#b0cb1f] focus:border-[#b0cb1f] text-sm"
              >
                <option value="">Choose a Child</option>
                {childrenOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Select Subject *
              </label>
              <select
                value={form.subject}
                onChange={(e) =>
                  setForm((p) => ({ ...p, subject: e.target.value }))
                }
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-[#b0cb1f] focus:border-[#b0cb1f] text-sm"
              >
                <option value="">Choose a subject</option>
                {subjectOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Number of Questions
                </label>
                <input
                  type="number"
                  value={form.questions}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, questions: Number(e.target.value) }))
                  }
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md bg-white shadow-sm text-sm focus:outline-none focus:ring-[#b0cb1f] focus:border-[#b0cb1f]"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Time Limit (minutes)
                </label>
                <input
                  type="number"
                  value={form.timeLimit}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, timeLimit: Number(e.target.value) }))
                  }
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md bg-white shadow-sm text-sm focus:outline-none focus:ring-[#b0cb1f] focus:border-[#b0cb1f]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Difficulty Level *
              </label>
              <select
                value={form.difficulty}
                onChange={(e) =>
                  setForm((p) => ({ ...p, difficulty: e.target.value }))
                }
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-[#b0cb1f] focus:border-[#b0cb1f] text-sm"
              >
                <option value="">Choose difficulty</option>
                {difficultyOptions.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* summary panel */}
          <div className="bg-gradient-to-br from-blue-50 to-gray-50 rounded-xl p-3 border border-blue-100 sticky top-0">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Test Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Student:</span>
                <span className="text-sm text-gray-800 font-semibold">
                  {form.child || "Not selected"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Subject:</span>
                <span className="text-sm text-gray-800 font-semibold">
                  {form.subject || "Not selected"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Topics:</span>
                <span className="text-sm text-gray-500">None selected</span>
              </div>
              <hr className="my-2 border-blue-200" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Questions:</span>
                <span className="text-sm font-bold text-[#b0cb1f]">{form.questions}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Time:</span>
                <span className="text-sm font-bold text-[#b0cb1f]">{form.timeLimit} min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Difficulty:</span>
                <span className="text-sm font-bold text-[#b0cb1f]">
                  {form.difficulty || "Not Selected"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <button
          className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-2 rounded-full bg-[#b0cb1f] text-gray-900 font-semibold text-sm hover:bg-[#c5de3a] transition-all hover:scale-[1.02] shadow-md"
        >
          <Plus size={18} />
          Generate Test &amp; Assign
        </button>
      </div>
    </div>
  );
};

export default TestGeneratorModal;
