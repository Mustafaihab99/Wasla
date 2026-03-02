export default function PostSkeleton() {
  return (
    <div
      className="flex gap-3 px-6 py-4 border-b animate-pulse"
      style={{ borderColor: "var(--border-color)" }}
    >
      <div className="w-12 h-12 rounded-full bg-white/10 flex-shrink-0" />
      <div className="flex-1 space-y-3 pt-1">
        <div className="flex gap-3">
          <div className="h-3.5 w-28 rounded-full bg-white/10" />
          <div className="h-3.5 w-20 rounded-full bg-white/10" />
        </div>
        <div className="h-3.5 w-full rounded-full bg-white/10" />
        <div className="h-3.5 w-3/4 rounded-full bg-white/10" />
      </div>
    </div>
  );
}
