// app/operations/vendors/loaders/VendorTableSkeleton.tsx
export function VendorTableSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: '#37A449' }}>
              <th className="px-4 py-3 text-left text-white font-medium text-sm">S/N</th>
              <th className="px-4 py-3 text-left text-white font-medium text-sm">Name</th>
              <th className="px-4 py-3 text-left text-white font-medium text-sm">Phone Number</th>
              <th className="px-4 py-3 text-left text-white font-medium text-sm">Address</th>
              <th className="px-4 py-3 text-left text-white font-medium text-sm">Business Status</th>
              <th className="px-4 py-3 text-left text-white font-medium text-sm">Account Status</th>
              <th className="px-4 py-3 text-left text-white font-medium text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(7)].map((_, index) => (
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
                  <div className="h-4 w-48 bg-gray-300 rounded animate-pulse"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="h-6 w-24 bg-gray-300 rounded animate-pulse"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="h-6 w-20 bg-gray-300 rounded-lg animate-pulse"></div>
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