export default function PostSkeleton() {
  return (
    <div className="flex gap-3 px-4 py-3 border-b border-[#2f3336] animate-pulse">
      <div className="w-10 h-10 rounded-full bg-white/10 flex-shrink-0" />
      <div className="flex-1 space-y-2 pt-1">
        <div className="flex gap-2">
          <div className="h-3.5 w-24 bg-white/10 rounded-full" />
          <div className="h-3.5 w-16 bg-white/10 rounded-full" />
        </div>
        <div className="h-3.5 w-full bg-white/10 rounded-full" />
        <div className="h-3.5 w-4/5 bg-white/10 rounded-full" />
        <div className="h-32 w-full bg-white/10 rounded-2xl mt-2" />
        <div className="flex gap-10 pt-1">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-4 w-8 bg-white/10 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}