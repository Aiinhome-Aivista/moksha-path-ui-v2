// import {
//   performanceStatsData,
//   performanceDataTimeDistribution,
// } from "./NewStudent";

export const PerformanceCards = ({ performanceData }: { performanceData?: any }) => {
  const performance = performanceData?.performance || {};
  const time_distribution = Array.isArray(performanceData?.time_distribution) ? performanceData.time_distribution : [];
  const trend_graph = Array.isArray(performance?.trend_graph) ? performance.trend_graph : [];

  const stats = [
    {
      label: "Overall Score",
      value: `${performance.overall_score || 0}%`,
      icon: (trend_graph[0]?.trend > 0) ? "up" : (trend_graph[0]?.trend < 0) ? "down" : "",
      title: trend_graph[0] ? `${trend_graph[0].trend}% trend` : "No data",
    },
    {
      label: "Module Test Completed",
      value: `${performance.completed_module_tests || 0}/${performance.total_module_tests || 0}`,
      icon: "",
      title: `${(performance.total_module_tests || 0) - (performance.completed_module_tests || 0)} pending`,
    },
    {
      label: "Mock Tests Attempted",
      value: `${performance.attempted_mock_tests || 0}/${performance.total_mock_tests || 0}`,
      icon: "",
      title: `${(performance.total_mock_tests || 0) - (performance.attempted_mock_tests || 0)} pending`,
    },
    {
      label: "Avg Difficulty",
      value: performance.avg_difficulty || "N/A",
      icon: "",
      title: `${performance.performance_label || "No label"}`,
    },
  ];

  const dynamicPerformanceStatsData = Object.keys(performance).length > 0 ? [
    {
      value: performance.difficulty_adapt_rate || 0,
      suffix: "%",
      valueColor: "#505050",
      title: "Difficulty Adapt Rate",
      titleColor: "#474747",
      icon: (trend_graph[0]?.trend > 0) ? "up" : (trend_graph[0]?.trend < 0) ? "down" : "",
      subText: trend_graph[0] ? `${trend_graph[0].trend}% trend` : "Initial attempt",
      subTextColor: "#3B8263",
      borderColor: "#7BA6B3",
    },
    {
      value: performance.on_time_completion || 0,
      suffix: "%",
      valueColor: "#D3A251",
      title: "On-time Completion",
      titleColor: "#474747",
      icon: "",
      subText: performance.pacing_msg || "Target 20 mins max",
      subTextColor: "#D3A251",
      borderColor: "#7BA6B3",
    },
    {
      value: performance.accuracy_after_adapt || 0,
      suffix: "%",
      valueColor: "#B7C356",
      title: "Accuracy After Adapt",
      titleColor: "#474747",
      icon: "",
      subText: `Revisit count: ${performance.revisit_count || 0}`,
      subTextColor: "#3B8263",
      borderColor: "#7BA6B3",
    },
    {
      value: performance.skip_rate || 0,
      suffix: "%",
      valueColor: "#B7C356",
      title: "Question Skip Rate",
      titleColor: "#474747",
      icon: (performance.skip_rate || 0) > 15 ? "up" : "down",
      subText: (performance.skip_rate || 0) > 15 ? "Needs improvement" : "Well managed",
      subTextColor: "#3B8263",
      borderColor: "#7BA6B3",
    },
  ] : [];

  const chartData = trend_graph.length > 0 
    ? trend_graph.map((item: any) => parseFloat(item.score_pct))
    : [];

const labels = trend_graph.length > 0
  ? trend_graph.map((item: any) => `Set ${item.attempt_id}`)
  : [];

const max = 100;

// Map levels to UI colors and labels (matching difficulty_level from SQL)
const levelMapping: Record<string, { color: string, label: string }> = {
  'Easy': { color: '#b0cb1f', label: 'Easy (L1)' },
  'Medium': { color: '#EB8E02', label: 'Medium (L2)' },
  'Hard': { color: '#ed6c61', label: 'Hard (L3)' },
  'Expert': { color: '#ea4335', label: 'Expert (L4)' }
};

const levelOrder = ['Easy', 'Medium', 'Hard', 'Expert'];
const maxTime = time_distribution.length > 0 ? Math.max(...time_distribution.map((i: any) => i.avg_time)) : 1;
const dynamicTimeDistribution = (time_distribution.length > 0
  ? time_distribution
    .map((item: any) => ({
      label: levelMapping[item.level]?.label || item.level,
      value: (item.avg_time / (maxTime || 1)) * 100, // Normalize to percentage based on max time
      color: levelMapping[item.level]?.color,
      avg: `${item.avg_time.toFixed(1)} avg${item.avg_time === maxTime ? ' !' : ''}`,
      level: item.level // keep for sorting
    }))
  : [])
  .sort((a: any, b: any) => {
    const orderA = levelOrder.indexOf(a.level || a.label.split(' ')[0]);
    const orderB = levelOrder.indexOf(b.level || b.label.split(' ')[0]);
    return orderA - orderB;
  });

// Convert chart data to SVG points
const points = chartData
  .map((value: number, i: number) => {
    const x = chartData.length > 1 ? (i / (chartData.length - 1)) * 100 : 50;
    const y = 100 - (value / max) * 100;
    return `${x},${y}`;
  })
  .join(" ");

return (
  <>

    <div className="xl:ml-80 grid grid-cols-2 md:grid-cols-4 xl:place-items-end gap-1 2xl:gap-12 xl:relative xl:-top-6">
      {stats.map((item, i) => (
        <div key={i} className="w-56 2xl:w-60 p-1 ">
          <div className="grid grid-cols-3">
            <h3 className="text-4xl font-normal">{item.value}</h3>
            <p className="text-sm text-primary col-span-2 mb-1 flex flex-col justify-end w-full md:w-20 lg:w-full">
              {item.icon === "up" && (
                <span className="material-symbols-outlined text-3xl leading-3">
                  keyboard_arrow_up
                </span>
              )}
              <span>{item.title}</span>
            </p>
          </div>
          <p className="text-sm font-bold text-primary w-full md:w-28 lg:w-full">{item.label}</p>
        </div>
      ))}
    </div>




    <div className="grid grid-cols-1 xl:grid-cols-2 m-1 gap-2 max-h-[70vh] overflow-y-auto custom-scrollbar">
      <div className="grid grid-cols-1 gap-2">
        <div className="grid grid-cols-3 gap-4 mb-4">
          {[
            ...dynamicPerformanceStatsData.map(item => ({
              ...item,
              // Remove revisit count from subtext if it's Accuracy After Adapt
              subText: item.title === "Accuracy After Adapt" ? "Post-Adaptation" : item.subText
            })),
            {
              title: "First Pass Accuracy",
              value: performance.first_pass_accuracy,
              suffix: "%",
              valueColor: "#57A7B3",
              borderColor: "#57A7B3",
              titleColor: "#474747",
              subText: "Initial Accuracy",
              subTextColor: "#3B8263"
            },
            {
              title: "Guessing Index",
              value: performance.guessing_index,
              suffix: "%",
              valueColor: "#D3A251",
              borderColor: "#D3A251",
              titleColor: "#474747",
              subText: "Conceptual Clarity",
              subTextColor: "#3B8263"
            },
            {
              title: "Easy Miss Rate",
              value: performance.easy_miss_rate,
              suffix: "%",
              valueColor: "#ed6c61",
              borderColor: "#ed6c61",
              titleColor: "#474747",
              subText: "Silly Mistakes",
              subTextColor: "#3B8263"
            },
            {
              title: "Hard Attempt Rate",
              value: performance.hard_attempt_rate,
              suffix: "%",
              valueColor: "#ea4335",
              borderColor: "#ea4335",
              titleColor: "#474747",
              subText: "Attempt Courage",
              subTextColor: "#3B8263"
            },
            {
              title: "Revisit Count",
              value: performance.revisit_count,
              suffix: "",
              valueColor: "#7BA6B3",
              borderColor: "#7BA6B3",
              titleColor: "#474747",
              subText: "Questions Reviewed",
              subTextColor: "#3B8263"
            },
            {
              title: "Last Minute Error Rate",
              value: performance.last_minute_error_rate,
              suffix: "%",
              valueColor: "#ed6c61",
              borderColor: "#ed6c61",
              titleColor: "#474747",
              subText: "Final Minutes Pressure",
              subTextColor: "#3B8263"
            },
            {
              title: "Total Marks",
              value: `${performance.total_score || 0}/${performance.total_marks || 0}`,
              suffix: "",
              valueColor: "#57A7B3",
              borderColor: "#57A7B3",
              titleColor: "#474747",
              subText: "Score Achievement",
              subTextColor: "#3B8263"
            }
          ].map((item, i) => (
            <div
              key={i}
              className="px-3 border-b-4 h-24 flex flex-col justify-center"
              style={{ borderColor: item.borderColor }}
            >
              <h3
                className="text-4xl font-normal leading-none"
                style={{ color: item.valueColor }}
              >
                {item.value || 0}
                <span className="text-xl">{item.suffix}</span>
              </h3>

              <p
                className="text-sm font-bold mt-1 leading-tight"
                style={{ color: item.titleColor }}
              >
                {item.title}
              </p>

              <p
                className="text-[10px] font-bold flex items-center mt-1"
                style={{ color: item.subTextColor }}
              >
                {('icon' in item) && item.icon === "up" && (
                  <span className="material-symbols-outlined text-2xl leading-3">
                    keyboard_arrow_up
                  </span>
                )}
                {('icon' in item) && item.icon === "down" && (
                  <span className="material-symbols-outlined text-2xl leading-3">
                    keyboard_arrow_down
                  </span>
                )}
                {item.subText}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-primary text-white p-4 rounded-xl w-full xl:w-[107%] z-10">
          {/* Title */}
          <h2 className="text-3xl font-bold">Mock Score Trend</h2>
          <p className="text-sm text-gray-400 mb-4">
            {trend_graph.length} exams • {parseFloat(trend_graph[0]?.trend || 0) >= 0 ? "+" : ""}{trend_graph[0]?.trend || 0} pts trend
          </p>

          {chartData.length > 0 ? (
            <div className="flex">
              {/* Y-axis Labels */}
              <div className="flex flex-col justify-between h-40 text-xs text-gray-400 mr-2">
                <span>100</span>
                <span>75</span>
                <span>50</span>
                <span>25</span>
                <span>0</span>
              </div>
              <div className="flex-1">
                {/* Chart */}
                <div className="w-full h-40">
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full"
                    preserveAspectRatio="none"
                  >
                    {/* Grid Lines */}
                    {[0, 25, 50, 75, 100].map((line, i) => (
                      <line
                        key={i}
                        x1="0"
                        y1={line}
                        x2="100"
                        y2={line}
                        stroke="#fff"
                        strokeDasharray="2,2"
                        strokeWidth="0.5"
                      />
                    ))}

                    {/* Line */}
                    <polyline
                      fill="none"
                      stroke="#facc15"
                      strokeWidth="2"
                      points={points}
                    />

                    {/* Dots */}
                    {chartData.map((value: number, i: number) => {
                      const x = chartData.length > 1 ? (i / (chartData.length - 1)) * 100 : 50;
                      const y = 100 - (value / max) * 100;
                      return (
                        <circle key={i} cx={x} cy={y} r="1.5" fill="#facc15" />
                      );
                    })}
                  </svg>
                </div>

                {/* X-axis Labels */}
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  {labels.map((label: string, i: number) => (
                    <span key={i}>{label}</span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center rounded-lg border border-white/10">
              <p className="text-gray-400 italic">Complete more tests to see your progress trend</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="p-2 col-span-2">
          <h3 className="font-extrabold mb-3 text-xl text-primary">
            Time Distribution by Question Difficulty
          </h3>

          {dynamicTimeDistribution.length > 0 ? (
            dynamicTimeDistribution.map((item: any, i: number) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center">
                <p className="text-sm col-span-3 font-semibold text-primary whitespace-nowrap">
                  {item.label}
                </p>
                <div className="w-full bg-gray-200 h-3 rounded-full col-span-6">
                  <div
                    className={`h-3 rounded-full`}
                    style={{
                      width: `${item.attempted || item.value}%`, // Fallback for width
                      backgroundColor: `${item.color}`,
                    }}
                  />
                </div>
                <p
                  className={`text-base font-semibold col-span-3 text-end whitespace-nowrap`}
                  style={{ color: `${item.color}` }}
                >
                  {item.avg}
                </p>
              </div>
            ))
          ) : (
            <div className="py-10 flex flex-col items-center justify-center opacity-60">
              <span className="material-symbols-outlined text-4xl mb-2 text-gray-400">timer_off</span>
              <p className="text-gray-500 font-medium italic text-sm">No time distribution data tracked</p>
            </div>
          )}
        </div>

        <div className="h-[26rem] grid grid-cols-3 gap-4 bg-[#e0dfdf] p-4 mr-4 rounded-xl shadow">
          <div className="max-w-52 h-80">
            <h3 className="font-semibold text-2xl text-primary text-center my-2">
              Your Action
            </h3>
            <img
              src="https://thirdeyeblindproductions.com/wp-content/uploads/2025/02/Screenshot-2025-02-24-115914.png"
              className="w-full h-full xl:h-80"
            />
          </div>
          <div className="col-span-2 flex flex-col justify-between">
            <ul className="space-y-1 pt-8">
              <li className="w-full flex gap-4">
                <span className="material-symbols-outlined text-[#b0cb1f] text-5xl font-extrabold">
                  check
                </span>
                <p className="text-xl text-primary font-bold">
                  {performance.pacing_msg || "Your pacing is steady, minimizing errors in the final minutes."}
                </p>
              </li>
              <li className="w-full flex gap-4">
                <span className="material-symbols-outlined text-[#b0cb1f] text-5xl font-extrabold">
                  check
                </span>{" "}
                <p className="text-xl text-primary font-bold">
                    {performance.accuracy_msg || "Strong conceptual accuracy with minimal guessing detected."}
                </p>
              </li>
            </ul>
            <div className="mb-8">
              <p className="mt-2 text-xs text-primary font-semibold">
                {(performance.overall_score || 0) >= 80 ? "You are performing at an elite level." : "Consistently clearing L3 will help you reach"}
              </p>
              <h2 className="mt-2 text-primary">
                <span className="text-4xl font-extrabold"> Top {performance.percentile || 0}%</span>
                <span className="text-sm font-semibold">
                  {" "}
                  School Percentile
                </span>
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);
};
