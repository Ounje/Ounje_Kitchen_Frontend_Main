export function VendorTableSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-200 w-full">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead>
            <tr className="bg-green-600">
              {['S/N','Name','Phone Number','Address','Business Status','Account Status','Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-white font-medium text-sm">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(7)].map((_, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="px-4 py-4"><div className="h-4 w-8 bg-gray-200 rounded animate-pulse" /></td>
                <td className="px-4 py-4"><div className="h-4 w-36 bg-gray-200 rounded animate-pulse" /></td>
                <td className="px-4 py-4"><div className="h-4 w-28 bg-gray-200 rounded animate-pulse" /></td>
                <td className="px-4 py-4"><div className="h-4 w-48 bg-gray-200 rounded animate-pulse" /></td>
                <td className="px-4 py-4"><div className="h-6 w-24 bg-gray-200 rounded animate-pulse" /></td>
                <td className="px-4 py-4"><div className="h-6 w-20 bg-gray-200 rounded-lg animate-pulse" /></td>
                <td className="px-4 py-4">
                  <div className="flex gap-2">
                    {[1,2,3].map(j => <div key={j} className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />)}
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