export default function GymProfileSkeleton() {
  return (
    <div className="max-w-6xl mt-10 border border-border rounded-xl overflow-hidden animate-pulse">
      <div className="h-32 bg-muted"></div>
      <div className="p-8">
        <div className="flex gap-6 items-center -mt-16">
          <div className="w-40 h-40 bg-muted rounded-xl"></div>

          <div className="flex-1 space-y-4">
            <div className="h-6 w-1/3 bg-muted rounded"></div>
            <div className="h-4 w-1/4 bg-muted rounded"></div>
            <div className="flex gap-3 mt-4">
              <div className="h-10 w-28 bg-muted rounded"></div>
              <div className="h-10 w-40 bg-muted rounded"></div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-muted rounded-lg"></div>
          ))}
        </div>

        {/* Info */}
        <div className="grid md:grid-cols-2 gap-8 mt-10">
          <div className="space-y-3">
            <div className="h-4 w-1/4 bg-muted rounded"></div>
            <div className="h-16 bg-muted rounded"></div>
          </div>

          <div className="space-y-3">
            <div className="h-4 w-1/4 bg-muted rounded"></div>
            <div className="h-6 bg-muted rounded"></div>
            <div className="h-6 bg-muted rounded"></div>
          </div>
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-36 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
