interface Props {
  current: number;
  total: number;
  answered?: number;
}

export default function ProgressBar({ current, total, answered }: Props) {
  const value = answered ?? current;
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 overflow-hidden progress-track" style={{ borderRadius: "var(--rounded-pill)" }}>
        <div className="h-full progress-fill" style={{ width: `${pct}%`, borderRadius: "var(--rounded-pill)" }} />
      </div>
      <span className="text-sm font-medium shrink-0" style={{ color: "var(--color-slate)" }}>
        {answered ?? current}/{total}
      </span>
    </div>
  );
}
