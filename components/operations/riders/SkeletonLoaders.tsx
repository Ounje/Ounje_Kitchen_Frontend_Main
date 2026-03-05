// app/operations/riders/components/SkeletonLoaders.tsx
export function TopPerformersSkeleton() {
  return (
    <div className="mb-6">
      <div className="h-8 w-48 bg-gray-300 rounded animate-pulse mb-4"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl p-4 md:p-6 h-32 md:h-40 bg-gray-300 animate-pulse"
          ></div>
        ))}
      </div>
    </div>
  );
}

export function RidersTableSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr style={{ backgroundColor: '#98EF9B' }}>
              <th className="px-4 py-3 text-left font-medium text-sm" style={{ color: '#1A3F1C' }}>S/N</th>
              <th className="px-4 py-3 text-left font-medium text-sm" style={{ color: '#1A3F1C' }}>Name</th>
              <th className="px-4 py-3 text-left font-medium text-sm" style={{ color: '#1A3F1C' }}>Phone Number</th>
              <th className="px-4 py-3 text-left font-medium text-sm" style={{ color: '#1A3F1C' }}>Zones</th>
              <th className="px-4 py-3 text-left font-medium text-sm" style={{ color: '#1A3F1C' }}>Account Status</th>
              <th className="px-4 py-3 text-left font-medium text-sm" style={{ color: '#1A3F1C' }}>Rider Status</th>
              <th className="px-4 py-3 text-left font-medium text-sm" style={{ color: '#1A3F1C' }}>Mode of Delivery</th>
              <th className="px-4 py-3 text-left font-medium text-sm" style={{ color: '#1A3F1C' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(8)].map((_, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="px-4 py-4">
                  <div className="h-4 w-8 bg-gray-300 rounded animate-pulse"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="h-4 w-32 bg-gray-300 rounded animate-pulse"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="h-4 w-32 bg-gray-300 rounded animate-pulse"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="h-6 w-20 bg-gray-300 rounded animate-pulse"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="h-6 w-16 bg-gray-300 rounded animate-pulse"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
                    <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
                    <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function RiderDetailsSkeleton() {
  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="w-full md:w-48 h-48 bg-gray-300 rounded-xl animate-pulse"></div>
        <div className="flex-1 space-y-3">
          <div className="h-6 w-48 bg-gray-300 rounded animate-pulse"></div>
          <div className="h-5 w-40 bg-gray-300 rounded animate-pulse"></div>
          <div className="h-5 w-32 bg-gray-300 rounded animate-pulse"></div>
          <div className="h-5 w-36 bg-gray-300 rounded animate-pulse"></div>
        </div>
        <div className="h-10 w-28 bg-gray-300 rounded-lg animate-pulse"></div>
      </div>

      {/* Metrics */}
      <div className="mb-6">
        <div className="h-8 w-48 bg-gray-300 rounded animate-pulse mb-4"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl h-32 bg-gray-300 animate-pulse"
            ></div>
          ))}
        </div>
      </div>

      {/* Zone */}
      <div className="h-48 bg-gray-300 rounded-xl animate-pulse mb-6"></div>

      {/* Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-12 bg-gray-300 rounded-lg animate-pulse"></div>
        <div className="h-12 bg-gray-300 rounded-lg animate-pulse"></div>
      </div>
    </div>
  );
}