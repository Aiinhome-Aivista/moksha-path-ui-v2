import React from "react";
import { NavLink } from "react-router-dom";

export const HeaderProfile: React.FC = () => {
  const tabs = [
    { name: "My Dashboard", path: "/new-dashboard" },
    { name: "Performance Overview", path: "/new-dashboard/performance" },
    { name: "Subjects", path: "/new-dashboard/subject" },
    { name: "Mock Exams", path: "/new-dashboard/exam" },
    { name: "Remediation", path: "/new-dashboard/remediation" },
  ];

  return (
    <>
      <div className="grid grid-cols-1 mb-6 lg:grid-cols-3 xl:grid-cols-4  items-center">
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
            <p className="text-sm text-gray-300">
              Standred X
            </p>
            <span className="text-xs text-yellow-400">Top 10%</span>
          </div>
        </div>

        <div className="flex gap-3 justify-around py-2 bg-white h-12 rounded-tr-full rounded-br-full shadow d:col-span-2 lg:col-span-2 xl:col-span-3">
          {tabs.map((tab, i) => (
            <NavLink
              key={i}
              to={tab.path}
              className={({ isActive }) =>
                `px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                  isActive
                  ? "bg-yellow-400 text-black"
                  : "text-gray-600 hover:bg-gray-100"
                }`
              }
              end={tab.path === "/new-dashboard"}
            >
              {tab.name}
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
};
