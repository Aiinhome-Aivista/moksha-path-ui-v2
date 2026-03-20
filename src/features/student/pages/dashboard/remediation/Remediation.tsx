import SubjectRemediationCard from "./SubjectRemediationCard";
import RemediationFooter from "./RemediationFooter";

const Remediation = () => {
  const subjects = [
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
        "Master L1 first",
        "Practice L2 basics",
        "Avoid complex questions",
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
        "Strengthen L2 basics",
        "Push L3 to 70%",
        "Target L3 breakthrough",
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
        "Revise basics",
        "Push L2 to 80%",
        "Address L3 accuracy",
      ],
    },
  ];

  return (
    <div className="p-4 bg-gray-100 min-h-screen space-y-4">

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {subjects.map((sub, i) => (
          <SubjectRemediationCard key={i} data={sub} />
        ))}
      </div>

      {/* Bottom Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RemediationFooter
          title="Stress Index"
          value="Low 51/100"
          desc="Calm under pressure"
        />
        <RemediationFooter
          title="Resilience"
          value="82/100"
          desc="Recovers quickly"
        />
        <RemediationFooter
          title="Focus Quality"
          value="Low 28/100"
          desc="Needs improvement"
        />
      </div>
    </div>
  );
};

export default Remediation;