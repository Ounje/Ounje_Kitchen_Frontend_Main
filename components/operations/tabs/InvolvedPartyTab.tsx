import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Star } from "lucide-react";

interface InvolvedPartyTabProps {
  order: any;
  onAssignRider: () => void;
}

export default function InvolvedPartyTab({ order, onAssignRider }: InvolvedPartyTabProps) {
  const { customer, vendor, rider } = order;

  return (
    <div className="space-y-6">
      {/* Customer and Vendor Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Customer Card */}
        <div className="bg-white p-4 rounded-lg shadow-sm space-y-3">
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12 sm:h-14 sm:w-14">
              <AvatarImage src={customer.avatar} alt={customer.name} />
              <AvatarFallback className="bg-[#98ef9b] text-[#1a3f1c] font-bold">
                {customer.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm sm:text-base">{customer.name}</h3>
              <div className="space-y-1 mt-2">
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">{customer.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">{customer.email}</span>
                </div>
                <div className="flex items-start gap-2 text-xs sm:text-sm">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5" />
                  <span className="break-words">{customer.address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vendor Card */}
        <div className="bg-white p-4 rounded-lg shadow-sm space-y-3">
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12 sm:h-14 sm:w-14">
              <AvatarImage src={vendor.avatar} alt={vendor.name} />
              <AvatarFallback className="bg-[#98ef9b] text-[#1a3f1c] font-bold">
                {vendor.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm sm:text-base">{vendor.name}</h3>
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-[#ffca3a] text-[#ffca3a]" />
                <span className="text-xs sm:text-sm">
                  Rating: {vendor.rating} ({vendor.reviews})
                </span>
              </div>
              <div className="space-y-1 mt-2">
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">{vendor.phone}</span>
                </div>
                <div className="flex items-start gap-2 text-xs sm:text-sm">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5" />
                  <span className="break-words">{vendor.address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rider Card or Assign Button */}
      {rider ? (
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12 sm:h-14 sm:w-14">
              <AvatarImage src={rider.avatar} alt={rider.name} />
              <AvatarFallback className="bg-[#98ef9b] text-[#1a3f1c] font-bold">
                {rider.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm sm:text-base">{rider.name}</h3>
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-[#ffca3a] text-[#ffca3a]" />
                <span className="text-xs sm:text-sm">
                  Rating: {rider.rating} ({rider.reviews})
                </span>
              </div>
              <div className="space-y-1 mt-2">
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="truncate">{rider.phone}</span>
                </div>
                <div className="flex items-start gap-2 text-xs sm:text-sm">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5" />
                  <span className="break-words">{rider.zone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center pt-4">
          <Button
            onClick={onAssignRider}
            className="bg-[#1a3f1c] hover:bg-[#164016] text-white px-8 py-6 text-base font-semibold"
          >
            Assign a Rider
          </Button>
        </div>
      )}
    </div>
  );
}
