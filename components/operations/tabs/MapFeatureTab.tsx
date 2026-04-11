interface MapFeatureTabProps {
  order: any;
}

export default function MapFeatureTab({ order }: MapFeatureTabProps) {
  return (
    <div className="space-y-4">
      {/* Addresses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-muted/50 rounded-xl border border-border shadow-sm">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-[#1a3f1c]/50 mb-1">Pickup From</h3>
          <p className="font-bold text-[#1a3f1c] text-sm leading-snug">{order.vendor.address || "—"}</p>
        </div>
        <div className="p-4 bg-secondary rounded-xl border border-primary/10 shadow-sm">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-1">Deliver To</h3>
          <p className="font-bold text-primary text-sm leading-snug">{order.customer.address || "—"}</p>
        </div>
      </div>

      {/* Map Illustration — Premium Brand Styled */}
      <div className="relative w-full h-[320px] sm:h-[400px] bg-[#1a3f1c] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/5">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[length:24px_24px]" />
        
        <svg
          viewBox="0 0 600 400"
          className="w-full h-full relative z-10"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Grid / Infrastructure */}
          <g opacity="0.15">
            <path d="M 0 100 L 600 100" stroke="#fff" strokeWidth="1" />
            <path d="M 0 200 L 600 200" stroke="#fff" strokeWidth="1" />
            <path d="M 0 300 L 600 300" stroke="#fff" strokeWidth="1" />
            <path d="M 120 0 L 120 400" stroke="#fff" strokeWidth="1" />
            <path d="M 240 0 L 240 400" stroke="#fff" strokeWidth="1" />
            <path d="M 360 0 L 360 400" stroke="#fff" strokeWidth="1" />
            <path d="M 480 0 L 480 400" stroke="#fff" strokeWidth="1" />
          </g>

          {/* Major Roadways */}
          <g opacity="0.4">
            <path d="M 0 150 L 600 250" stroke="#fff" strokeWidth="8" strokeOpacity="0.2" />
            <path d="M 200 0 L 400 400" stroke="#fff" strokeWidth="8" strokeOpacity="0.2" />
          </g>
          
          {/* Route Connection — The main delivery path */}
          <path
            d="M 150 250 C 250 200, 350 300, 450 150"
            stroke="#ffca3a"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeDasharray="8 8"
            className="animate-dash"
          />
          
          {/* Pickup Point (Vendor) */}
          <g transform="translate(150, 250)">
            <circle r="20" fill="#98ef9b" opacity="0.15" className="animate-pulse" />
            <circle r="6" fill="#98ef9b" stroke="#fff" strokeWidth="2" />
            <text x="0" y="22" textAnchor="middle" fill="#98ef9b" fontSize="10" fontWeight="bold" className="uppercase tracking-tighter">Vendor</text>
          </g>

          {/* Delivery Point (Customer) */}
          <g transform="translate(450, 150)">
            <circle r="20" fill="#ffca3a" opacity="0.15" className="animate-pulse-slow" />
            <path
              d="M 0 0 C -8 -8, -8 -16, 0 -24 C 8 -16, 8 -8, 0 0 Z"
              fill="#ffca3a"
              stroke="#fff"
              strokeWidth="2"
            />
            <circle cx="0" cy="-16" r="4" fill="#fff" />
            <text x="0" y="22" textAnchor="middle" fill="#ffca3a" fontSize="10" fontWeight="bold" className="uppercase tracking-tighter">Customer</text>
          </g>

          {/* Live Rider Icon (Moving along path simplified) */}
          <g transform="translate(320, 230)" className="animate-float">
            <rect width="24" height="24" x="-12" y="-12" rx="6" fill="#fff" className="shadow-lg" />
            <path d="M -5 -5 L 5 5 M 5 -5 L -5 5" stroke="#1a3f1c" strokeWidth="2" />
          </g>
        </svg>

        {/* Floating Status Overlay */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg border border-white/50 z-20">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-[#1a3f1c]">Live Tracking</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes dash {
          to { stroke-dashoffset: -100; }
        }
        .animate-dash {
          animation: dash 3s linear infinite;
        }
        @keyframes custom-pulse {
          0% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 0.2; }
          100% { transform: scale(0.8); opacity: 0.5; }
        }
        .animate-pulse {
          animation: custom-pulse 2s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: custom-pulse 3s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translate(320px, 230px) translateY(0); }
          50% { transform: translate(320px, 230px) translateY(-5px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

  );
}