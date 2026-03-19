

export const subjects = [
    {
        title: "Set Theory",
        score: 82,
        level: "L3 - Hard",
        statusColor: "#65a30d",
        levels: [
            { label: "L1", value: 96, color: "#22c55e", time: "5 sec" },
            { label: "L2", value: 84, color: "#84cc16", time: "12 sec" },
            { label: "L3", value: 56, color: "#f59e0b", time: "15 sec" },
            { label: "L4", value: 22, color: "#ef4444", time: "20 sec" },
        ],
    },
    {
        title: "Algebra",
        score: 91,
        level: "L3 - Hard",
        statusColor: "#16a34a",
        levels: [
            { label: "L1", value: 96, color: "#22c55e", time: "5 sec" },
            { label: "L2", value: 84, color: "#84cc16", time: "12 sec" },
            { label: "L3", value: 56, color: "#f59e0b", time: "15 sec" },
            { label: "L4", value: 22, color: "#ef4444", time: "20 sec" },
        ],
    },
    {
        title: "Logarithm",
        score: 58,
        level: "L3 - Hard",
        statusColor: "#ef4444",
        levels: [
            { label: "L1", value: 96, color: "#22c55e", time: "5 sec" },
            { label: "L2", value: 84, color: "#84cc16", time: "12 sec" },
            { label: "L3", value: 56, color: "#f59e0b", time: "15 sec" },
            { label: "L4", value: 22, color: "#ef4444", time: "20 sec" },
        ],
    },
];


export const levels = [
    {
        label: "L1 - Easy",
        percent: 91,
        attempted: 48,
        correct: 44,
        wrong: 2,
        skipped: 2,
        correctColor: "bg-green-500",
        wrongColor: "bg-red-500",
        skippedColor: "bg-gray-200",
    },
    {
        label: "L2 - Medium",
        percent: 74,
        attempted: 32,
        correct: 24,
        wrong: 4,
        skipped: 4,
        correctColor: "bg-green-500",
        wrongColor: "bg-red-500",
        skippedColor: "bg-gray-200",
    },
    {
        label: "L3 - Hard",
        percent: 45,
        attempted: 20,
        correct: 9,
        wrong: 8,
        skipped: 3,
        correctColor: "bg-green-500",
        wrongColor: "bg-red-500",
        skippedColor: "bg-gray-200",

    },
    {
        label: "L4 - Expert",
        percent: 22,
        attempted: 12,
        correct: 3,
        wrong: 7,
        skipped: 2,
        correctColor: "bg-green-500",
        wrongColor: "bg-red-500",
        skippedColor: "bg-gray-500",
    },
];

export const subjectAccuracies = [
  { name: "Set Theory", level: 3 },
  { name: "Algebra", level: 3 },
  { name: "Logarithm", level: 4 },
  { name: "Geometry", level: 3 },
  { name: "Trigonometry", level: 2 },
  { name: "Probability", level: 2 },
];