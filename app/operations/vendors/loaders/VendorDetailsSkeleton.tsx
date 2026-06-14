export function VendorDetailsSkeleton() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-14 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 w-44 bg-gray-300 rounded animate-pulse" />
        <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse" />
      </div>
      <div className="bg-white rounded-xl p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <div className="w-40 h-36 sm:w-52 sm:h-44 bg-gray-300 rounded-xl animate-pulse flex-shrink-0" />
          <div className="flex-1 space-y-3">
            {[64, 48, 56, 72, 80].map((w, i) => (
              <div
                key={i}
                className={`h-5 bg-gray-300 rounded animate-pulse w-${w}`}
                style={{ width: `${w * 4}px` }}
              />
            ))}
          </div>
          <div className="h-10 w-28 bg-gray-300 rounded-lg animate-pulse self-start" />
        </div>
      </div>
      <div className="h-7 w-48 bg-gray-300 rounded animate-pulse mb-4" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-300 rounded-xl animate-pulse" />
        ))}
      </div>
      <div className="h-28 bg-gray-300 rounded-xl animate-pulse mb-6" />
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 h-12 bg-gray-300 rounded-xl animate-pulse" />
        <div className="flex-1 h-12 bg-gray-300 rounded-xl animate-pulse" />
      </div>
    </div>
  );
}
