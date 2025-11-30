export default function DoctorHomeSkeleton(){
      return (
    <div className="animate-pulse space-y-8">

      {/* Title Skeleton */}
      <div className="h-8 w-40 rounded-md"></div>

      {/* Top Stats Skeleton */}
      <div className="grid grid-cols-2 bg-muted md:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => (
          <div key={i} className="rounded-2xl border p-6 shadow">
            <div className="h-3 w-24 bg-muted rounded"></div>
            <div className="h-7 w-20 mt-4  rounded"></div>
          </div>
        ))}
      </div>

      {/* Chart Card Skeleton */}
      <div className="rounded-xl border shadow p-6 space-y-6">

        {/* Header: title + select */}
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div className="h-4 w-40 rounded"></div>
          <div className="h-9 w-28 rounded"></div>
        </div>

        {/* Chart Skeleton */}
        <div className="w-full h-[300px] md:h-[360px] rounded-lg"></div>
      </div>

      {/* Upcoming Bookings Skeleton */}
      <div className="p-6 rounded-xl border shadow space-y-4">
        <div className="h-4 w-40 rounded"></div>
        <div className="h-3 w-72 rounded"></div>
      </div>

    </div>
  );
}