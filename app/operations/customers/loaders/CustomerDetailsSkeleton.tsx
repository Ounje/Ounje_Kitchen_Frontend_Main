export function CustomerDetailsSkeleton() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-14 py-6">
      {/* Title row */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 w-48 bg-gray-300 rounded animate-pulse" />
        <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse" />
      </div>

      {/* Header card */}
      <div className="bg-white rounded-xl p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <div className="w-28 h-28 sm:w-36 sm:h-36 bg-gray-300 rounded-2xl animate-pulse flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-5 w-56 bg-gray-300 rounded animate-pulse" />
            <div className="h-4 w-44 bg-gray-300 rounded animate-pulse" />
            <div className="h-4 w-52 bg-gray-300 rounded animate-pulse" />
            <div className="h-4 w-64 bg-gray-300 rounded animate-pulse" />
          </div>
          <div className="h-10 w-24 bg-gray-300 rounded-lg animate-pulse self-start" />
        </div>
      </div>

      {/* Activities title */}
      <div className="h-7 w-32 bg-gray-300 rounded animate-pulse mb-4" />

      {/* Stat boxes */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-300 rounded-xl animate-pulse" />
        ))}
      </div>

      {/* Most used vendor */}
      <div className="bg-gray-300 rounded-xl h-28 animate-pulse mb-6" />

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 h-12 bg-gray-300 rounded-xl animate-pulse" />
        <div className="flex-1 h-12 bg-gray-300 rounded-xl animate-pulse" />
      </div>
    </div>
  );
}
