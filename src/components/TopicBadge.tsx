const LABELS: Record<string, { label: string; color: string }> = {
  "security-concepts": { label: "Security Concepts", color: "bg-purple-100 text-purple-800" },
  "identity": { label: "Identity", color: "bg-blue-100 text-blue-800" },
  "compliance": { label: "Compliance", color: "bg-green-100 text-green-800" },
  "azure-security": { label: "Azure Security", color: "bg-orange-100 text-orange-800" },
};

interface Props {
  topic: string;
}

export default function TopicBadge({ topic }: Props) {
  const config = LABELS[topic] || { label: topic, color: "bg-gray-100 text-gray-800" };
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  );
}
