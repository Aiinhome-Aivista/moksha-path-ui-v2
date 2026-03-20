import React from "react";

interface Tab {
  name: string;
  key: string;
}

interface HeaderProfileProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const HeaderProfile: React.FC<HeaderProfileProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs: Tab[] = [
    { name: "Performance Overview", key: "performance" },
    { name: "Subjects", key: "subject" },
    { name: "Mock Exams", key: "exam" },
    { name: "Remediation", key: "remediation" },
  ];

  return (
    <>
      <div className="grid grid-cols-1 mb-1 lg:grid-cols-3 xl:grid-cols-4 items-center">
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

        <div className="flex gap-3 justify-around py-1 bg-[#ECECED] h-12 rounded-tr-full rounded-br-full shadow lg:col-span-2 xl:col-span-3">
          <h1 className="pt-2 px-6 text-[#00bcd4] font-black text-lg tracking-tight uppercase whitespace-nowrap">
            My Dashboard
          </h1>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`px-6 py-1 rounded-full text-sm font-medium transition-colors ${
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

// import React, { useState } from 'react';
// import OverviewTab from './overviewTab';
// import SyllabusTab from './syllabusTab';
// import MockExamsTab from './mockExamsTab';
// import RemediationTab from './remediationTab';

// type TabName = 'Overview' | 'Syllabus' | 'Mock Exams' | 'Remediation';

// const tabs: { name: TabName }[] = [
//   { name: 'Overview' },
//   { name: 'Syllabus' },
//   { name: 'Mock Exams' },
//   { name: 'Remediation' },
// ];

// const tabComponents: Record<TabName, React.ReactElement> = {
//   Overview: <OverviewTab />,
//   Syllabus: <SyllabusTab />,
//   'Mock Exams': <MockExamsTab />,
//   Remediation: <RemediationTab />,
// };

// const HeaderProfile = () => {
//   const [activeTab, setActiveTab] = useState<TabName>('Overview');

//   return (
//     <div className="space-y-0">
//       {/* 1. THE SINGLE DIV HEADER */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 items-center">
//         <div className="flex items-center gap-4 bg-gray-800 text-white p-4 h-28 z-10 min-w-96 rounded-tr-full rounded-br-full">
//           <img
//             src="https://www.picsman.ai/blog/wp-content/uploads/2025/01/free-passport-photo-maker-1.webp"
//             className="w-24 h-24 rounded-full"
//             alt="profile"
//           />
//           <div>
//             <h2 className="text-lg font-semibold">Hi Aarav !</h2>
//             <p className="text-sm text-gray-300">
//               St. Thomas School for Boys (ICSE)
//             </p>
//             <p className="text-sm text-gray-300">
//               Standard X
//             </p>
//             <span className="text-xs text-yellow-400">Top 10%</span>
//           </div>
//         </div>

//         <div className="flex items-center gap-20 px-14 bg-[#E9E9E9] h-12 rounded-tr-full rounded-br-full lg:col-span-2 xl:col-span-3">
//           <h1 className="text-[#00bcd4] font-black text-lg tracking-tight uppercase whitespace-nowrap">
//             My Dashboard
//           </h1>
//           <div className="flex gap-3">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.name}
//                 onClick={() => setActiveTab(tab.name)}
//                 className={`px-10 py-2 rounded-full text-sm font-medium transition-colors ${
//                   activeTab === tab.name
//                     ? "bg-yellow-500  text-black"
//                     : "text-gray-600 hover:bg-gray-100"
//                 }`}
//               >
//                 {tab.name}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* 2. DYNAMIC CONTENT AREA */}
//       <main className="px-2">
//         {tabComponents[activeTab]}
//       </main>
//     </div>
//   );
// };

// export default HeaderProfile;
