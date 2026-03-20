import React, { useState } from "react";

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
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [selectedSubject, setSelectedSubject] = React.useState("");
  const [showExamDropdown, setShowExamDropdown] = useState(false);
  const [selectedExam, setSelectedExam] = useState("");

  const tabs: Tab[] = [
    { name: "Performance Overview", key: "performance" },
    { name: "Subjects", key: "subject" },
    { name: "Mock Exams", key: "exam" },
    { name: "Remediation", key: "remediation" },
  ];

  const subjectsList = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English",
  ];
  const examList = ["MCQ", "Quiz"];
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
          <h1 className="pt-2 px-6 text-[#00bcd4] font-black text-lg tracking-tight whitespace-nowrap">
            My Dashboard
          </h1>
          {tabs.map((tab) => {
            if (tab.key === "subject") {
              return (
                <div key={tab.key} className="relative">
                  {/* Subject Button */}
                  <button
                    onClick={() => {
                      onTabChange(tab.key);
                      setShowDropdown(!showDropdown);
                    }}
                    className={`px-6 py-1 flex items-center rounded-full text-lg font-bold ${
                      activeTab === tab.key
                        ? "bg-[#E59003] text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {tab.name}
                    <span className="material-symbols-outlined">
                      keyboard_arrow_down
                    </span>
                  </button>

                  {/* Dropdown */}
                  {showDropdown && (
                    <div
                      className="absolute top-12 left-0 bg-white shadow-lg rounded-lg w-44 z-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {subjectsList.map((sub, i) => (
                        <div
                          key={i}
                          onClick={() => {
                            setSelectedSubject(sub);
                            setShowDropdown(false);
                          }}
                          className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                        >
                          {sub}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            if (tab.key === "exam") {
              return (
                <div key={tab.key} className="relative">
                  {/* Exam Button */}
                  <button
                    onClick={() => {
                      onTabChange(tab.key);
                      setShowExamDropdown(!showExamDropdown);
                      setShowDropdown(false); // close subject dropdown
                    }}
                    className={`px-6 py-1 flex items-center rounded-full text-lg font-bold ${
                      activeTab === tab.key
                        ? "bg-[#E59003] text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {tab.name}
                    <span className="material-symbols-outlined">
                      keyboard_arrow_down
                    </span>
                  </button>

                  {/* Dropdown */}
                  {showExamDropdown && (
                    <div
                      className="absolute top-12 left-0 bg-white shadow-lg rounded-lg w-40 z-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {examList.map((exam, i) => (
                        <div
                          key={i}
                          onClick={() => {
                            setSelectedExam(exam);
                            setShowExamDropdown(false);
                          }}
                          className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                        >
                          {exam}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            // Other tabs (normal)
            return (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={`px-6 py-1 rounded-full text-lg font-bold ${
                  activeTab === tab.key
                    ? "bg-[#E59003] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.name}
              </button>
            );
          })}
        </div>
        {activeTab === "subject" && selectedSubject && (
          <div className="relative left-[25rem] -top-9 px-4 mt-2">
            <h2 className="text-2xl font-semibold text-primary">
              {selectedSubject}
            </h2>
          </div>
        )}
        {activeTab === "exam" && selectedExam && (
          <div className="relative left-[30rem] -top-9 px-4 mt-2">
            <h2 className="text-2xl font-semibold text-primary">
              {selectedExam}
            </h2>
          </div>
        )}
      </div>
    </>
  );
};

// import React, { useState } from "react";

// interface Tab {
//   name: string;
//   key: string;
// }

// interface HeaderProfileProps {
//   activeTab: string;
//   onTabChange: (tab: string) => void;
// }

// export const HeaderProfile: React.FC<HeaderProfileProps> = ({
//   activeTab,
//   onTabChange,
// }) => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   const tabs: Tab[] = [
//     { name: "Performance Overview", key: "performance" },
//     { name: "Subjects", key: "subject" },
//     { name: "Mock Exams", key: "exam" },
//     { name: "Remediation", key: "remediation" },
//   ];

//   const subjects = [
//     "Mathematics",
//     "Physics",
//     "Chemistry",
//     "Biology",
//     "English",
//   ];

//   return (
//     <>
//       <div className="grid grid-cols-1 mb-1 lg:grid-cols-3 xl:grid-cols-4 items-center">
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
//             <p className="text-sm text-gray-300">Standred X</p>
//             <span className="text-xs text-yellow-400">Top 10%</span>
//           </div>
//         </div>

//         <div className="flex gap-3 justify-around py-1 bg-[#ECECED] h-12 rounded-tr-full rounded-br-full shadow lg:col-span-2 xl:col-span-3">
//           <h1 className="pt-2 px-6 text-[#00bcd4] font-black text-lg tracking-tight uppercase whitespace-nowrap">
//             My Dashboard
//           </h1>
//           {tabs.map((tab) => {
//             if (tab.key === "subject") {
//               return (
//                 <div key={tab.key} className="relative">
//                   <button
//                     onClick={() => {
//                       onTabChange(tab.key);
//                       setIsDropdownOpen(!isDropdownOpen);
//                     }}
//                     className={`px-6 py-1 rounded-full text-lg font-bold transition-colors flex items-center gap-2 ${
//                       activeTab === tab.key
//                         ? "bg-yellow-400 text-white"
//                         : "text-gray-600 hover:bg-gray-100"
//                     }`}
//                   >
//                     {tab.name}
//                     <span className="text-xs">▼</span>
//                   </button>
//                   {isDropdownOpen && (
//                     <div className="absolute top-12 left-0 w-48 bg-white rounded-xl shadow-xl z-50 border border-gray-100 overflow-hidden">
//                       {subjects.map((subject, idx) => (
//                         <div
//                           key={idx}
//                           className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm font-medium text-gray-700 hover:text-[#00bcd4]"
//                           onClick={() => setIsDropdownOpen(false)}
//                         >
//                           {subject}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               );
//             }
//             return (
//               <button
//                 key={tab.key}
//                 onClick={() => onTabChange(tab.key)}
//                 className={`px-6 py-1 rounded-full text-lg font-bold transition-colors ${
//                   activeTab === tab.key
//                     ? "bg-yellow-400 text-white"
//                     : "text-gray-600 hover:bg-gray-100"
//                 }`}
//               >
//                 {tab.name}
//               </button>
//             );
//           })}
//         </div>
//       </div>
//     </>
//   );
// };
