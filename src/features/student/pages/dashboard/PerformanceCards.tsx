export const PerformanceCards = () => {
  const data = [
    { label: "Easy (L1-2)", value: 70, color: "bg-green-400", avg: "1.1 avg" },
    {
      label: "Medium (L3-4)",
      value: 55,
      color: "bg-yellow-400",
      avg: "1.8 avg",
    },
    { label: "Hard (L5)", value: 80, color: "bg-red-400", avg: "2.4 avg" },
  ];
  const stats = [
    { label: "Overall Score", value: "74%", title: "5% this month" },
    { label: "Module Test Completed", value: "6/8", title: "2 pending" },
    { label: "Mock Tests Attempted", value: "3/5", title: "2 pending" },
    { label: "Avg Difficulty", value: "L3", title: "Hard out of 4 level" },
  ];
  const chartData = [10, 30, 25, 45, 50, 80];
  const labels = ["12 Jan", "26 Jan", "12 Feb", "26 Feb", "12 Mar", "12 Mar"];

  const max = 100;

  // Convert data to SVG points
  const points = chartData
    .map((value, i) => {
      const x = (i / (chartData.length - 1)) * 100;
      const y = 100 - (value / max) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <>
      <div className="flex justify-end gap-4 relative -top-10">
        <div></div>
        {stats.map((item, i) => (
          <div key={i} className="w-72 p-4 ">
            <div className="grid grid-cols-3">
              <h3 className="text-lg font-bold">{item.value}</h3>
              <p className="text-xs text-gray-400 col-span-2">{item.title}</p>
            </div>
            <p className="text-sm text-gray-500">{item.label}</p>
          </div>
        ))}
      </div>
      <div className="absolute grid grid-cols-1 md:grid-cols-2 mt-1 gap-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-2 gap-4 row-span-2">
            <div className="p-4 border-[#7BA6B3] border-b-4">
              <h3 className="text-6xl text- font-thin">
                82<span className="text-3xl">%</span>
              </h3>
              <p className="text-lg text-[#474747] font-bold">
                ^ Difficulty Adapt Rate
              </p>
              <p className="text-sm text-[#518C6D] font-bold">5% mock ill</p>
            </div>
            <div className="p-4 border-[#7BA6B3] border-b-4">
              <h3 className="text-6xl text-[#D8AA5D] font-thin">
                90<span className="text-3xl">%</span>
              </h3>
              <p className="text-lg text-[#474747] font-bold">
                On-time Completion
              </p>
              <p className="text-sm text-[#D8AA5D]  font-bold">
                Tergate 20 mins max
              </p>
            </div>
            <div className="p-4 border-[#7BA6B3] border-b-4">
              <h3 className="text-6xl text-[#B7C364] font-thin">
                78<span className="text-3xl">%</span>
              </h3>
              <p className="text-lg text-[#474747] font-bold">
                Accuracy After Adapt
              </p>
              <p className="text-sm text-[#518C6D] font-bold">
                Above chart avg 71%
              </p>
            </div>
            <div className="p-4 border-[#7BA6B3] border-b-4">
              <h3 className="text-6xl text-[#B7C364] font-thin">
                8<span className="text-3xl">%</span>
              </h3>
              <p className="text-sm text-[#474747] font-bold">
                Question Skip Rate
              </p>
              <p className="text-sm text-[#518C6D] font-bold">Well managed</p>
            </div>
          </div>

          <div className="bg-primary text-white p-4 rounded-xl w-full">
            {/* Title */}
            <h2 className="text-lg font-semibold">Mock Score Trend</h2>
            <p className="text-sm text-gray-400 mb-4">
              5 exams • +20 pts improvement
            </p>

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
                    {chartData.map((value, i) => {
                      const x = (i / (chartData.length - 1)) * 100;
                      const y = 100 - (value / max) * 100;
                      return (
                        <circle key={i} cx={x} cy={y} r="1.5" fill="#facc15" />
                      );
                    })}
                  </svg>
                </div>

                {/* X-axis Labels */}
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  {labels.map((label, i) => (
                    <span key={i}>{label}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 grid-rows-3 gap-4">
          <div className="p-4 col-span-2">
            <h3 className="font-semibold mb-3 text-xl text-primary">
              Time Distribution by Question Difficulty
            </h3>

            {data.map((item, i) => (
              <div key={i} className="mb-4 grid grid-cols-8 gap-2 items-center">
                <p className="text-sm col-span-2">{item.label}</p>
                <div className="w-full bg-gray-200 h-2 rounded col-span-5">
                  <div
                    className={`${item.color} h-2 rounded`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
                <p className="text-sm">{item.avg}</p>
              </div>
            ))}
          </div>

          <div className=" grid grid-cols-3 gap-4 row-span-2 bg-[#e0dfdf] p-4 rounded-xl shadow">
            <div>
              <h3 className="font-semibold mb-2">Your Action</h3>
              <img
                src="https://thirdeyeblindproductions.com/wp-content/uploads/2025/02/Screenshot-2025-02-24-115914.png"
                className="max-w-60 h-60 xl:h-80"
              />
            </div>
            <div className="col-span-2 flex flex-col justify-between">
              <ul className="space-y-1 pt-12">
                <li className="w-full flex gap-4">
                  <span className="material-symbols-outlined text-[#b0cb1f] text-5xl font-extrabold">check</span>
                  <p className="text-xl text-primary  font-bold ">
                    You constantly clear L1 & L2 questions but lose accuracy at
                    L3.
                  </p>
                </li>
                <li className="w-full flex gap-4">
                  <span className="material-symbols-outlined text-[#b0cb1f] text-5xl font-extrabold">check</span>{" "}
                  <p className="text-xl text-primary  font-bold ">
                    The engine is routine towards L3 more frequently - this is
                    where your biggest score gains lie.
                  </p>
                </li>
              </ul>
              <div className="mb-8">
                <p className="mt-2 text-xs text-primary font-semibold">
                  If you crack 13 consistently you'll reach
                </p>
                <h2 className="mt-2 text-primary">
                  <span className="text-4xl font-extrabold"> Top 8%</span>
                  <span className="text-sm font-semibold"> School Percentile</span>
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
