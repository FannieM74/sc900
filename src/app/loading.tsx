import Skeleton from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-canvas)" }}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="h-8 mx-auto mb-2" style={{ backgroundColor: "var(--color-hairline)", borderRadius: "var(--rounded-md)", width: "12rem" }} />
          <div className="h-4 mx-auto" style={{ backgroundColor: "var(--color-hairline)", borderRadius: "var(--rounded-md)", width: "16rem" }} />
        </div>
        <Skeleton />
      </div>
    </div>
  );
}
