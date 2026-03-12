export default function ChatListSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-4 py-3 animate-pulse"
        >
          <div className="w-12 h-12 rounded-full bg-border shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-32 bg-border rounded" />
            <div className="h-3 w-48 bg-border rounded" />
          </div>
        </div>
      ))}
    </>
  );
}