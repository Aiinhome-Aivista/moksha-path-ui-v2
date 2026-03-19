import { NavLink, Outlet } from 'react-router-dom';

const TDashboard = () => {
  const tabs = [
    { name: 'Overview', path: 'overview' },
    { name: 'Syllabus', path: 'syllabus' },
    { name: 'Mock Exams', path: 'mock-exams' },
    { name: 'Remediation', path: 'remediation' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. THE SINGLE DIV HEADER (Exact Design Fix) */}
<div className="flex items-center gap-4 w-full pr-4">
  {/* 1. Profile Greeting Card (Fixed width on the left) */}
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

  {/* 2. THE EXPANDED NAV DIV (flex-1 makes it fill the rest of the row) */}
  <nav className="flex-1 flex items-center justify-between bg-gray-100 dark:bg-secondary-800 p-1 rounded-full border border-gray-200 shadow-sm ml-4 px-6">
    
    {/* "My Dashboard" text on the left of the nav bar */}
    <h1 className="text-[#00bcd4] font-black text-sm lg:text-lg tracking-tight uppercase whitespace-nowrap">
      My Dashboard
    </h1>

    {/* The Buttons Group on the right of the nav bar */}
    <div className="flex items-center gap-1">
      {tabs.map((tab) => (
        <NavLink
          key={tab.name}
          to={tab.path}
          className={({ isActive }) =>
            `px-8 py-2.5 rounded-full text-xs lg:text-sm font-black transition-all duration-300 ${
              isActive
                ? 'bg-[#f39c12] text-white shadow-lg scale-105' // Active button stands out
                : 'text-gray-400 hover:text-gray-800 dark:text-gray-300'
            }`
          }
        >
          {tab.name}
        </NavLink>
      ))}
    </div>
  </nav>
</div>

      {/* 2. DYNAMIC CONTENT AREA */}
      <main className="px-2">
        <Outlet />
      </main>
    </div>
  );
};

export default TDashboard;