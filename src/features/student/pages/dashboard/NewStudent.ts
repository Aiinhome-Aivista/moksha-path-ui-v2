

export const subjects = [
    {
        title: "Set Theory",
        score: 82,
        level: "L3 - Hard",
        statusColor: "#568F14",
        levels: [
            { label: "L1", value: 96, color: "#578E12", time: "5 sec" },
            { label: "L2", value: 84, color: "#578E12", time: "12 sec" },
            { label: "L3", value: 56, color: "#EA9003", time: "15 sec" },
            { label: "L4", value: 22, color: "#FF7361", time: "20 sec" },
        ],
    },
    {
        title: "Algebra",
        score: 91,
        level: "L3 - Hard",
        statusColor: "#568F14",
        levels: [
            { label: "L1", value: 96, color: "#568F14", time: "5 sec" },
            { label: "L2", value: 84, color: "#84cc16", time: "12 sec" },
            { label: "L3", value: 56, color: "#f59e0b", time: "15 sec" },
            { label: "L4", value: 22, color: "#FF7361", time: "20 sec" },
        ],
    },
    {
        title: "Logarithm",
        score: 58,
        level: "L3 - Hard",
        statusColor: "#FF7361",
        levels: [
            { label: "L1", value: 96, color: "#568F14", time: "5 sec" },
            { label: "L2", value: 84, color: "#84cc16", time: "12 sec" },
            { label: "L3", value: 56, color: "#f59e0b", time: "15 sec" },
            { label: "L4", value: 22, color: "#FF7361", time: "20 sec" },
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


export const remediationSubjects = [
    {
        title: "Trigonometry",
        percent: 45,
        level: "L1 - Easy",
        priority: "Critical",
        levels: [
            { label: "L1", value: 61, color: "#22c55e" },
            { label: "L2", value: 28, color: "#f59e0b" },
            { label: "L3", value: 0, color: "#ddd" },
            { label: "L4", value: 0, color: "#ddd" },
        ],
        actions: [
            {
                title: "Master L1 first", subtitle: "Target 80% + on basic Sin/Cos/Tan. Engine won't escalate until you're consistent"
            },
            {
                title: "Practice L2 basics",
                subtitle: "Identities & Inverse trig. Your L2 accuracy (28%) indicates conceptual gaps here."
            },
            { title: "", subtitle: "" }
        ],
    },
    {
        title: "Logarithm",
        percent: 58,
        level: "L2 - Hard",
        priority: "High Priority",
        levels: [
            { label: "L1", value: 96, color: "#22c55e" },
            { label: "L2", value: 84, color: "#22c55e" },
            { label: "L3", value: 56, color: "#f59e0b" },
            { label: "L4", value: 22, color: "#ef4444" },
        ],
        actions: [
            {
                title: "Solidity L1 (78%-90%)",
                subtitle: "Log laws & basic evaluations. You're close-2-3 focussed sessions should clear this."
            },
            { title: "Push L2 past 70%", subtitle: "Change the base of equations. Currently 52% -borderline. Timed practice will help." },
            { title: "Target L3 breakthrough", subtitle: "24% at L3 means the engine drops you immediately. Conceptual clarity needed." }
        ],
    },
    {
        title: "Geometry",
        percent: 74,
        level: "L1 - Medium",
        priority: "Medium",
        levels: [
            { label: "L1", value: 96, color: "#22c55e" },
            { label: "L2", value: 84, color: "#22c55e" },
            { label: "L3", value: 56, color: "#f59e0b" },
            { label: "L4", value: 22, color: "#ef4444" },
        ],
        actions: [
            {
                title: " Mastered (92%)",
                subtitle: "Strong on triangles & basic theorems. No action needed."
            },
            { title: "Push L2 to 80%", subtitle: "At 68% one more focussed quiz and you'll unlock the engine routine you to L3" },
            { title: "Address L3 (36% accuracy)", subtitle: "Co-ordinate geometry & advanced theorems. Time management issue detected." }
        ],
    },
];

export const remediationFooterData = [
    {
      title: "Stress Index",
      value: "Low 51/100",
      subtitle: "Calm under pressure. Low anxiety in timed condition",
      description:
        "Re-balance study loads with planned breaks, structured shorter study blocks and guided revision by spacing mock tests.",
      progress: 51,
      color: "#f59e0b", // orange
    },
    {
      title: "Resilience",
      value: "82/100",
      subtitle: "Scores improve 9% on retry within 48h of setback",
      description:
        "Sustain momentum by maintaining routines gradually increasing challenges and reinforcing positive study habits.",
      progress: 82,
      color: "#22c55e", // green
    },
    {
      title: "Focus Quality",
      value: "Low 28/100",
      subtitle: "Average deep-focus, minimal task switching",
      description:
        "Maintain focused study blocks while gradually increasing difficulty and protecting breaks.",
      progress: 28,
      color: "#ef4444", // red
    },
  ];