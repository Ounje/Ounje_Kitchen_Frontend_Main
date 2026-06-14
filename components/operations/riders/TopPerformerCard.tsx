import { MapPin, CheckCircle, Award } from "lucide-react";
import { TopPerformer } from "@/lib/api/services/rider.service";

interface TopPerformerCardProps {
  performer: TopPerformer;
}

export function TopPerformerCard({ performer }: TopPerformerCardProps) {
  const getRankConfig = (rank: 1 | 2 | 3) =>
    ({
      1: { gradient: "linear-gradient(135deg,#FF8C00 0%,#FFA500 100%)", label: "1st" },
      2: { gradient: "linear-gradient(135deg,#A9A9A9 0%,#C0C0C0 100%)", label: "2nd" },
      3: { gradient: "linear-gradient(135deg,#CD7F32 0%,#D2691E 100%)", label: "3rd" },
    })[rank];

  const config = getRankConfig(performer.rank);

  return (
    <div
      className="rounded-xl p-4 sm:p-6 relative overflow-hidden"
      style={{ background: config.gradient }}
    >
      {/* Rank Badge */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-2xl font-bold bg-white/30 text-white">
          {config.label}
        </div>
      </div>

      {/* Content */}
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Photo — fallback to initial when src is empty/missing */}
        {performer.photo ? (
          <img
            src={performer.photo}
            alt={performer.name}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-white flex-shrink-0"
          />
        ) : (
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-white flex-shrink-0 bg-white/30 flex items-center justify-center text-white text-xl font-bold">
            {performer.name?.charAt(0).toUpperCase() ?? "?"}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base sm:text-lg mb-0.5 text-white truncate">
            {performer.name}
          </h3>
          <p className="text-xs sm:text-sm mb-1 text-white truncate">{performer.phone}</p>
          <div className="flex items-center gap-1 mb-1.5">
            <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white flex-shrink-0" />
            <p className="text-xs text-white truncate">{performer.location}</p>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white flex-shrink-0" />
            <p className="text-xs sm:text-sm font-semibold text-white">
              {performer.completedOrders} Completed
            </p>
          </div>
        </div>
      </div>

      {/* Decorative Award */}
      <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 opacity-10">
        <Award className="w-16 h-16 sm:w-20 sm:h-20 text-white" />
      </div>
    </div>
  );
}

export function TopPerformersSection({ performers }: { performers: TopPerformer[] }) {
  return (
    <div className="mb-6 w-full">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-[#1a3f1c]">
        Rider <span className="text-gray-500 font-normal">| Top Chart</span>
      </h2>
      {/* 1 col → 2 col sm → 3 col lg */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {performers.map((performer) => (
          <TopPerformerCard key={performer.id} performer={performer} />
        ))}
      </div>
    </div>
  );
}
