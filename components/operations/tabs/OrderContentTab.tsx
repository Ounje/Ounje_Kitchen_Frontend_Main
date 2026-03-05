interface OrderContentTabProps {
  order: any;
}

export default function OrderContentTab({ order }: OrderContentTabProps) {
  return (
    <div className="space-y-4">
      {/* Items Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm sm:text-base">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-2 font-semibold">Item</th>
              <th className="text-left py-2 font-semibold">Price</th>
              <th className="text-right py-2 font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item: any, index: number) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-2">{item.name}</td>
                <td className="py-2">₦{item.price}/{item.name.includes('wrap') ? 'wrap' : item.name.includes('plate') ? 'plate' : 'piece'}</td>
                <td className="text-right py-2">₦{item.total.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="space-y-2 pt-4 border-t-2 border-gray-300">
        <div className="flex justify-between text-sm sm:text-base">
          <span className="font-semibold">Total Meal Cost</span>
          <span>₦{order.mealCost.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm sm:text-base border-b border-gray-200 pb-2">
          <span className="font-semibold">Service fee</span>
          <span>₦{order.serviceFee.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm sm:text-base border-b border-gray-200 pb-2">
          <span className="font-semibold">Delivery fee</span>
          <span>₦{order.deliveryFee.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-base sm:text-lg font-bold pt-2">
          <span>Total Fee</span>
          <span>₦{order.totalFee.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}