// app/operations/riders/components/TopPerformerCard.tsx
import { MapPin, CheckCircle, Award } from 'lucide-react';
import { TopPerformer } from '@/lib/api/services/rider.service';

interface TopPerformerCardProps {
  performer: TopPerformer;
}

export function TopPerformerCard({ performer }: TopPerformerCardProps) {
  const getRankConfig = (rank: 1 | 2 | 3) => {
    const configs = {
      1: {
        gradient: 'linear-gradient(135deg, #FF8C00 0%, #FFA500 100%)',
        textColor: 'white',
        label: '1st',
        badgeColor: '#FF8C00'
      },
      2: {
        gradient: 'linear-gradient(135deg, #A9A9A9 0%, #C0C0C0 100%)',
        textColor: 'white',
        label: '2nd',
        badgeColor: '#A9A9A9'
      },
      3: {
        gradient: 'linear-gradient(135deg, #CD7F32 0%, #D2691E 100%)',
        textColor: 'white',
        label: '3rd',
        badgeColor: '#CD7F32'
      }
    };
    return configs[rank];
  };

  const config = getRankConfig(performer.rank);

  return (
    <div
      className="rounded-xl p-4 md:p-6 relative overflow-hidden flex-1 min-w-0"
      style={{
        background: config.gradient
      }}
    >
      {/* Rank Badge */}
      <div className="absolute top-3 md:top-4 right-3 md:right-4">
        <div
          className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-lg md:text-2xl font-bold"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            color: config.textColor
          }}
        >
          {config.label}
        </div>
      </div>

      {/* Content */}
      <div className="flex items-start gap-3 md:gap-4">
        <img
          src={performer.photo}
          alt={performer.name}
          className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-white flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3
            className="font-bold text-base md:text-lg mb-0.5 md:mb-1 truncate"
            style={{ color: config.textColor }}
          >
            {performer.name}
          </h3>
          <p
            className="text-xs md:text-sm mb-1 truncate"
            style={{ color: config.textColor }}
          >
            {performer.phone}
          </p>
          <div className="flex items-center gap-1 mb-1.5 md:mb-2">
            <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0" style={{ color: config.textColor }} />
            <p
              className="text-xs md:text-xs truncate"
              style={{ color: config.textColor }}
            >
              {performer.location}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 md:w-4 md:h-4 flex-shrink-0" style={{ color: config.textColor }} />
            <p
              className="text-xs md:text-sm font-semibold"
              style={{ color: config.textColor }}
            >
              {performer.completedOrders} Completed
            </p>
          </div>
        </div>
      </div>

      {/* Award Icon Background */}
      <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 opacity-10">
        <Award
          className="w-16 h-16 md:w-20 md:h-20"
          style={{ color: config.textColor }}
        />
      </div>
    </div>
  );
}

/**
 * Container for top performer cards with responsive grid
 */
export function TopPerformersSection({ performers }: { performers: TopPerformer[] }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl md:text-2xl font-bold mb-4" style={{ color: '#1A3F1C' }}>
        Rider <span className="text-gray-600">| Top Chart</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {performers.map((performer) => (
          <TopPerformerCard key={performer.id} performer={performer} />
        ))}
      </div>
    </div>
  );
}