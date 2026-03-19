export const StatsOverview = () => {
  const stats = [
    { label: "Overall Score", value: "74%", title: "5% this month" },
    { label: "Module Test Completed", value: "6/8", title: "2 pending" },
    { label: "Mock Tests Attempted", value: "3/5", title: "2 pending" },
    { label: "Avg Difficulty", value: "L3", title: "Hard out of 4 level" },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((item, i) => (
        <div key={i} className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-lg font-bold">{item.value}</h3>
          <p className="text-sm text-gray-500">{item.label}</p>
          <p className="text-xs text-gray-400">{item.title}</p>
        </div>
      ))}
    </div>
  );
};