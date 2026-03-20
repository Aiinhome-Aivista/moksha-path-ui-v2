import React, { useState } from 'react';
import OverviewTab from './overviewTab';
import SyllabusTab from './syllabusTab';
import MockExamsTab from './mockExamsTab';
import RemediationTab from './remediationTab';

type TabName = 'Overview' | 'Syllabus' | 'Mock Exams' | 'Remediation';

const tabs: { name: TabName }[] = [
  { name: 'Overview' },
  { name: 'Syllabus' },
  { name: 'Mock Exams' },
  { name: 'Remediation' },
];

const tabComponents: Record<TabName, React.ReactElement> = {
  Overview: <OverviewTab />,
  Syllabus: <SyllabusTab />,
  'Mock Exams': <MockExamsTab />,
  Remediation: <RemediationTab />,
};

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabName>('Overview');

  return (
    // Single wrapper for the entire dashboard
    <div className="flex flex-col">
      
      {/* 1. THE HEADER ROW */}
<div className="flex items-center w-full relative pt-2 -ml-6">
        
        {/* Left: Dark Profile Pill */}
<div className="flex items-center gap-4 bg-[#4a4b4c] text-white py-4 pl-6 pr-16 rounded-r-[10rem] shadow-md z-10 relative flex-shrink-0">
          <img
            src="https://www.picsman.ai/blog/wp-content/uploads/2025/01/free-passport-photo-maker-1.webp"
            className="w-14 h-14 rounded-full border-2 border-white object-cover shadow-sm flex-shrink-0"
            alt="profile"
          />
          <div className="flex flex-col justify-center">
            <span className="text-[11px] font-bold text-gray-200 leading-none mb-0.5">
              Greetings
            </span>
            <h2 className="text-xl font-black leading-none tracking-tight">
              Ms. Priya Sharma
            </h2>
            <p className="text-[10px] text-gray-300 font-medium mt-1 tracking-wide">
              St. Thomas School for Boys (CICSE)
            </p>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-between px-6 py-2 bg-[#E9E9E9] h-14 rounded-tr-full rounded-br-full lg:col-span-2 xl:col-span-3">
          <h1 className="text-[#00bcd4] font-black text-lg tracking-tight  whitespace-nowrap">
            My Dashboard
          </h1>
          <div className="flex gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`px-10 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeTab === tab.name
                    ? "bg-yellow-500  text-black"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. DYNAMIC CONTENT AREA */}
      <main className="px-2 w-full animate-in fade-in duration-500">
        {tabComponents[activeTab]}
      </main>
      
    </div>
  );
};

export default TeacherDashboard;