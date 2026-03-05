"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, Star, Phone, MapPin } from "lucide-react";
import { mockRiders } from "@/lib/mock-data/operations";
import ConfirmRiderModal from "@/components/operations/modals/ConfirmRiderModal";
import RiderAssignedSuccessModal from "@/components/operations/modals/RiderAssignedSuccessModal";

interface AssignRiderModalProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
}

export default function AssignRiderModal({
  open,
  onClose,
  orderId,
}: AssignRiderModalProps) {
  const [zone, setZone] = useState("yaba");
  const [status, setStatus] = useState("active");
  const [filteredRiders, setFilteredRiders] = useState(mockRiders);
  const [selectedRider, setSelectedRider] = useState<any>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const handleSearch = () => {
    let filtered = mockRiders;
    
    if (zone !== "all") {
      filtered = filtered.filter((r) => r.zone.toLowerCase().includes(zone.toLowerCase()));
    }
    
    if (status !== "all") {
      filtered = filtered.filter((r) => r.status === status);
    }
    
    setFilteredRiders(filtered);
  };

  const handleAssignClick = (rider: any) => {
    setSelectedRider(rider);
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    setConfirmOpen(false);
    setSuccessOpen(true);
  };

  const handleSuccessClose = () => {
    setSuccessOpen(false);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent 
          className="max-w-[95vw] sm:max-w-2xl max-h-[95vh] overflow-y-auto p-0"
          style={{ backgroundColor: "#e8f7e8" }}
        >
          <button
            onClick={onClose}
            className="absolute right-3 top-3 sm:right-4 sm:top-4 rounded-full p-2 bg-white hover:bg-gray-100 transition-colors z-10"
            aria-label="Close"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <DialogTitle className="text-xl sm:text-2xl font-bold text-center">
              Assign a rider
            </DialogTitle>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block">Zone:</label>
                <Select value={zone} onValueChange={setZone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Zones</SelectItem>
                    <SelectItem value="yaba">Yaba</SelectItem>
                    <SelectItem value="ikeja">Ikeja</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block">Status:</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={handleSearch}
                  className="bg-[#1a3f1c] hover:bg-[#164016] text-white w-full sm:w-auto px-8"
                >
                  Search
                </Button>
              </div>
            </div>

            {/* Riders List */}
            <div>
              <h3 className="font-semibold text-base sm:text-lg mb-3">Riders found</h3>
              <div className="space-y-3">
                {filteredRiders.length > 0 ? (
                  filteredRiders.map((rider) => (
                    <div
                      key={rider.id}
                      className="bg-white p-3 sm:p-4 rounded-lg border border-gray-300 flex items-center gap-3 hover:shadow-md transition-shadow"
                    >
                      <Avatar className="h-12 w-12 sm:h-14 sm:w-14">
                        <AvatarImage src={rider.avatar} alt={rider.name} />
                        <AvatarFallback className="bg-[#98ef9b] text-[#1a3f1c] font-bold">
                          {rider.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm sm:text-base">{rider.name}</h4>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star className="h-3 w-3 fill-[#ffca3a] text-[#ffca3a]" />
                          <span className="text-xs sm:text-sm">
                            Rating: {rider.rating} ({rider.reviews})
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mt-1">
                          <Phone className="h-3 w-3" />
                          <span>{rider.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mt-1">
                          <MapPin className="h-3 w-3" />
                          <span>{rider.zone}</span>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleAssignClick(rider)}
                        className="bg-[#1a3f1c] hover:bg-[#164016] text-white px-4 sm:px-6 h-9 sm:h-10 text-xs sm:text-sm"
                      >
                        Assign Rider
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="bg-[#ffca3a] p-4 rounded text-center text-sm sm:text-base"
                      >
                        No available rider
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal */}
      <ConfirmRiderModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
        riderName={selectedRider?.name}
      />

      {/* Success Modal */}
      <RiderAssignedSuccessModal
        open={successOpen}
        onClose={handleSuccessClose}
      />
    </>
  );
}
