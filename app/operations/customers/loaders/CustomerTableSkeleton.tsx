// app/operations/customers/loaders/CustomerTableSkeleton.tsx
export function CustomerTableSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-green-600">
              <th className="px-4 py-3 text-left text-white font-medium text-sm">S/N</th>
              <th className="px-4 py-3 text-left text-white font-medium text-sm">Name</th>
              <th className="px-4 py-3 text-left text-white font-medium text-sm">Email</th>
              <th className="px-4 py-3 text-left text-white font-medium text-sm">Account Status</th>
              <th className="px-4 py-3 text-left text-white font-medium text-sm">Orders</th>
              <th className="px-4 py-3 text-left text-white font-medium text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(8)].map((_, index) => (
              <tr
                key={index}
                className="border-b border-gray-200"
                style={{
                  backgroundColor: index % 2 === 0 ? "#D4FFDE" : "white",
                }}
              >
                <td className="px-4 py-4">
                  <div className="h-4 w-8 bg-gray-300 rounded animate-pulse"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
                    <div className="h-4 w-32 bg-gray-300 rounded animate-pulse"></div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="h-4 w-40 bg-gray-300 rounded animate-pulse"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="h-6 w-20 bg-gray-300 rounded-lg animate-pulse"></div>
                </td>
                <td className="px-4 py-4">
                  <div className="h-4 w-8 bg-gray-300 rounded animate-pulse"></div>
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
