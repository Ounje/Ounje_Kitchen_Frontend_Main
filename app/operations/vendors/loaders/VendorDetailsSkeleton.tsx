// app/operations/vendors/loaders/VendorDetailsSkeleton.tsx
export function VendorDetailsSkeleton() {
  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header Section Skeleton */}
      <div className="bg-white rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Photo */}
          <div className="w-full md:w-[240px] h-[200px] bg-gray-300 rounded-xl animate-pulse"></div>

          {/* Details */}
          <div className="flex-1 space-y-3">
            <div className="h-5 w-64 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-5 w-48 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-5 w-56 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-5 w-72 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-5 w-80 bg-gray-300 rounded animate-pulse"></div>
          </div>

          {/* Status Badge */}
          <div className="h-10 w-28 bg-gray-300 rounded-lg animate-pulse"></div>
        </div>
      </div>

      {/* Metrics Section Skeleton */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#1A3F1C' }}>
          Performance Metrics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl p-6 h-32 bg-gray-300 animate-pulse"
            ></div>
          ))}
        </div>
      </div>

      {/* Buyer Card Skeleton */}
      <div className="bg-white rounded-xl p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-gray-300 rounded-full animate-pulse"></div>
          <div className="flex-1 space-y-2">
            <div className="h-5 w-32 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-4 w-48 bg-gray-300 rounded animate-pulse"></div>
          </div>
          <div className="h-16 w-24 bg-gray-300 rounded-lg animate-pulse"></div>
        </div>
      </div>

      {/* Action Buttons Skeleton */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 h-12 bg-gray-300 rounded-lg animate-pulse"></div>
        <div className="flex-1 h-12 bg-gray-300 rounded-lg animate-pulse"></div>
      </div>
    </div>
  );
}