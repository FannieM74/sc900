export default function Skeleton() {
  return (
    <div className="card p-6 animate-pulse">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-3 w-24" style={{ backgroundColor: "var(--color-hairline)", borderRadius: "var(--rounded-sm)" }} />
        <div className="h-5 w-28" style={{ backgroundColor: "var(--color-hairline)", borderRadius: "var(--rounded-pill)" }} />
      </div>
      <div className="h-4 w-full mb-3" style={{ backgroundColor: "var(--color-hairline)", borderRadius: "var(--rounded-sm)" }} />
      <div className="h-4 w-3/4 mb-6" style={{ backgroundColor: "var(--color-hairline)", borderRadius: "var(--rounded-sm)" }} />
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 w-full" style={{ backgroundColor: "var(--color-hairline)", borderRadius: "var(--rounded-md)" }} />
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="card p-6 animate-pulse">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-3 w-24" style={{ backgroundColor: "var(--color-hairline)", borderRadius: "var(--rounded-sm)" }} />
        <div className="h-5 w-28" style={{ backgroundColor: "var(--color-hairline)", borderRadius: "var(--rounded-pill)" }} />
      </div>
      <div className="h-4 w-full mb-3" style={{ backgroundColor: "var(--color-hairline)", borderRadius: "var(--rounded-sm)" }} />
      <div className="h-4 w-3/4 mb-6" style={{ backgroundColor: "var(--color-hairline)", borderRadius: "var(--rounded-sm)" }} />
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 w-full" style={{ backgroundColor: "var(--color-hairline)", borderRadius: "var(--rounded-md)" }} />
        ))}
      </div>
    </div>
  );
}
