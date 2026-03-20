import React from "react";

interface Tab {
  name: string;
  key: string;
}

interface HeaderProfileProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const HeaderProfile: React.FC<HeaderProfileProps> = ({ activeTab, onTabChange }) => {
  const tabs: Tab[] = [
    { name: "My Dashboard", key: "dashboard" },
    { name: "Performance Overview", key: "performance" },
    { name: "Subjects", key: "subject" },
    { name: "Mock Exams", key: "exam" },
    { name: "Remediation", key: "remediation" },
  ];

  return (
    <>
      <div className="grid grid-cols-1 mb-6 lg:grid-cols-3 xl:grid-cols-4 items-center">
        <div className="flex items-center gap-4 bg-gray-800 text-white p-4 h-28 z-10 min-w-96 rounded-tr-full rounded-br-full">
          <img
            src="https://www.picsman.ai/blog/wp-content/uploads/2025/01/free-passport-photo-maker-1.webp"
            className="w-24 h-24 rounded-full"
            alt="profile"
          />
          <div>
            <h2 className="text-lg font-semibold">Hi Aarav !</h2>
            <p className="text-sm text-gray-300">
              St. Thomas School for Boys (ICSE)
            </p>
            <p className="text-sm text-gray-300">Standred X</p>
            <span className="text-xs text-yellow-400">Top 10%</span>
          </div>
        </div>

        <div className="flex gap-3 justify-around py-2 bg-white h-12 rounded-tr-full rounded-br-full shadow lg:col-span-2 xl:col-span-3">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-yellow-400 text-black"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
