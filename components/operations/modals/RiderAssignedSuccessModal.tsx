import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface RiderAssignedSuccessModalProps {
  open: boolean;
  onClose: () => void;
}

export default function RiderAssignedSuccessModal({
  open,
  onClose,
}: RiderAssignedSuccessModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-sm p-0 overflow-hidden"
        style={{ backgroundColor: "#1a3f1c" }}
      >
        <DialogTitle className="sr-only">Rider Assigned Successfully</DialogTitle>
        
        <div className="p-6 sm:p-8 text-center space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">
            You've Successfully Assigned a Rider!
          </h2>

          <Button
            onClick={onClose}
            className="px-8 py-6 text-base font-semibold"
            style={{ backgroundColor: '#98ef9b', color: '#1a3f1c' }}
          >
            Go Back To Home!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}