export function TopPerformersSkeleton() {
  return (
    <div className="mb-6 w-full">
      <div className="h-7 w-48 bg-gray-300 rounded animate-pulse mb-4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl h-36 sm:h-44 bg-gray-300 animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export function RidersTableSkeleton() {
  const thCls = 'px-4 py-3 text-left font-medium text-sm whitespace-nowrap';
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-200 w-full">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {['S/N', 'Name', 'Phone Number', 'Zones', 'Account Status', 'Rider Status', 'Mode of Delivery', 'Actions'].map((h) => (
                <th key={h} className={`${thCls} text-[#1a3f1c]`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(8)].map((_, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="px-4 py-4"><div className="h-4 w-6 bg-gray-200 rounded animate-pulse" /></td>
                <td className="px-4 py-4"><div className="h-4 w-32 bg-gray-200 rounded animate-pulse" /></td>
                <td className="px-4 py-4"><div className="h-4 w-28 bg-gray-200 rounded animate-pulse" /></td>
                <td className="px-4 py-4"><div className="h-4 w-24 bg-gray-200 rounded animate-pulse" /></td>
                <td className="px-4 py-4"><div className="h-6 w-16 bg-gray-200 rounded animate-pulse" /></td>
                <td className="px-4 py-4"><div className="h-6 w-14 bg-gray-200 rounded animate-pulse" /></td>
                <td className="px-4 py-4"><div className="h-4 w-24 bg-gray-200 rounded animate-pulse" /></td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                    ))}
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
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-14 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 w-48 bg-gray-300 rounded animate-pulse" />
        <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse" />
      </div>

      {/* Info Card */}
      <div className="bg-white rounded-xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="w-40 h-40 sm:w-48 sm:h-48 bg-gray-300 rounded-xl animate-pulse flex-shrink-0" />
          <div className="flex-1 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
            ))}
          </div>
          <div className="h-9 w-24 bg-gray-300 rounded-lg animate-pulse flex-shrink-0" />
        </div>
      </div>

      {/* Metrics */}
      <div className="mb-6">
        <div className="h-7 w-44 bg-gray-300 rounded animate-pulse mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-xl h-28 bg-gray-300 animate-pulse" />
          ))}
        </div>
      </div>

      {/* Zone */}
      <div className="h-44 bg-gray-300 rounded-xl animate-pulse mb-6" />

      {/* Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="h-12 bg-gray-300 rounded-lg animate-pulse" />
        <div className="h-12 bg-gray-300 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}