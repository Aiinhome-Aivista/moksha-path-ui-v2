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
    <div className="space-y-6">
      {/* 1. THE SINGLE DIV HEADER */}
      <div className="flex items-center gap-4 w-full pr-4">
        {/* Profile Greeting Card */}
        <div className="bg-[#3a3a3a] text-white px-8 py-3 rounded-r-full flex items-center gap-4 shadow-xl flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gray-400 border-2 border-white overflow-hidden flex-shrink-0">
            <img
              src="https://via.placeholder.com/150"
              alt="Priya Sharma"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="whitespace-nowrap">
            <h2 className="font-bold text-sm lg:text-[16px] leading-tight">Greetings Ms. Priya Sharma</h2>
            <p className="text-[10px] opacity-60 font-medium">St. Thomas School for Boys (CICSE)</p>
          </div>
        </div>

        {/* Nav Tab Bar */}
        <nav className="flex-1 flex items-center justify-between bg-gray-100 dark:bg-secondary-800 p-1 rounded-full border border-gray-200 shadow-sm ml-4 px-6">
          <h1 className="text-[#00bcd4] font-black text-sm lg:text-lg tracking-tight uppercase whitespace-nowrap">
            My Dashboard
          </h1>

          <div className="flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`px-8 py-2.5 rounded-full text-xs lg:text-sm font-black transition-all duration-300 ${
                  activeTab === tab.name
                    ? 'bg-[#f39c12] text-white shadow-lg scale-105'
                    : 'text-gray-400 hover:text-gray-800 dark:text-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* 2. DYNAMIC CONTENT AREA */}
      <main className="px-2">
        {tabComponents[activeTab]}
      </main>
    </div>
  );
};

export default TeacherDashboard;