import { TOPIC_LABELS } from "@/lib/topics";

interface Props {
  topic: string;
}

export default function TopicBadge({ topic }: Props) {
  return (
    <span className="topic-pill">
      {TOPIC_LABELS[topic] || topic}
    </span>
  );
}
