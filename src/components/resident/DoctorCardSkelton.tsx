// DoctorCardSkeleton.jsx
export default function DoctorCardSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="flex flex-col md:flex-row bg-white rounded-2xl shadow-md animate-pulse overflow-hidden"
        >
          {/* Image Skeleton */}
          <div className="w-full md:w-48 h-48 md:h-auto bg-gray-200 flex-shrink-0"></div>

          {/* Info Skeleton */}
          <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
              <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
              <div className="h-3 w-2/3 bg-gray-200 rounded"></div> 
              
              {/* Stats */}
              <div className="flex gap-2 mt-2">
                <div className="h-4 w-10 bg-gray-200 rounded"></div>
                <div className="h-4 w-14 bg-gray-200 rounded"></div>
                <div className="h-4 w-12 bg-gray-200 rounded"></div>
              </div>
            </div>

            {/* Button Skeleton */}
            <div className="h-10 w-32 bg-gray-200 rounded mt-4 md:mt-0"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
