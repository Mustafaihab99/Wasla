export default function ProfileSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-56 bg-white/10" />
      <div className="px-6 pb-6 relative">
        <div className="w-28 h-28 rounded-full bg-white/10 border-4 border-[var(--background)] absolute -top-16" />
        <div className="pt-20 space-y-3">
          <div className="h-5 w-40 rounded-full bg-white/10" />
          <div className="h-4 w-28 rounded-full bg-white/10" />
        </div>
      </div>
    </div>
  );
}