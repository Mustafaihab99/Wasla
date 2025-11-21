export default function DoctorProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto mt-10 bg-background border border-border shadow-md rounded-xl p-6 animate-pulse">

      {/* Top Section */}
      <div className="flex flex-col md:flex-row gap-6 items-center">

        {/* IMAGE Skeleton */}
        <div className="w-32 h-32 rounded-full bg-muted"></div>

        {/* TEXT Skeleton */}
        <div className="flex-1 w-full">
          <div className="h-6 w-40 bg-muted rounded-md mb-3"></div>
          <div className="h-4 w-32 bg-muted rounded-md"></div>

          <div className="flex gap-3 mt-4">
            <div className="h-10 w-32 bg-muted rounded-lg"></div>
            <div className="h-10 w-40 bg-muted rounded-lg"></div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="my-6 border-t border-border"></div>

      <div className="grid md:grid-cols-2 gap-6">

        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className="h-4 w-24 bg-muted rounded-md"></div>
            <div className="h-5 w-48 bg-muted rounded-md"></div>
          </div>
        ))}

        {/* BIO Skeleton */}
        <div className="md:col-span-2 flex flex-col gap-2 mt-2">
          <div className="h-4 w-20 bg-muted rounded-md"></div>
          <div className="h-16 w-full bg-muted rounded-md"></div>
        </div>
      </div>

      {/* CV Skeleton */}
      <div className="mt-6 h-5 w-36 bg-muted rounded"></div>
    </div>
  );
}
