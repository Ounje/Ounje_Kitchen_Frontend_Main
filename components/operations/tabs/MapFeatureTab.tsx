interface MapFeatureTabProps {
  order: any;
}

export default function MapFeatureTab({ order }: MapFeatureTabProps) {
  return (
    <div className="space-y-4">
      {/* Addresses */}
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-sm sm:text-base mb-1">Vendor Address</h3>
          <p className="text-xs sm:text-sm text-gray-700">{order.vendor.address}</p>
        </div>
        <div>
          <h3 className="font-semibold text-sm sm:text-base mb-1">Customer Address</h3>
          <p className="text-xs sm:text-sm text-gray-700">{order.customer.address}</p>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="relative w-full h-64 sm:h-80 bg-gray-200 rounded-lg overflow-hidden">
        <svg
          viewBox="0 0 600 400"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background */}
          <rect width="600" height="400" fill="#e5e7eb" />
          
          {/* Streets */}
          <path d="M 0 150 L 600 150" stroke="#cbd5e1" strokeWidth="20" />
          <path d="M 0 250 L 600 250" stroke="#cbd5e1" strokeWidth="20" />
          <path d="M 200 0 L 200 400" stroke="#cbd5e1" strokeWidth="20" />
          <path d="M 400 0 L 400 400" stroke="#cbd5e1" strokeWidth="20" />
          
          {/* Route Path */}
          <path
            d="M 150 200 Q 250 100, 350 150 T 450 200"
            stroke="#3b82f6"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          
          {/* Location Pin */}
          <g transform="translate(450, 180)">
            <path
              d="M 0 0 C -10 -10, -10 -20, 0 -30 C 10 -20, 10 -10, 0 0 Z"
              fill="#ef4444"
              stroke="#fff"
              strokeWidth="2"
            />
            <circle cx="0" cy="-20" r="6" fill="#fff" />
          </g>
        </svg>
      </div>
    </div>
  );
}