import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmRiderModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  riderName?: string;
}

export default function ConfirmRiderModal({
  open,
  onClose,
  onConfirm,
  riderName,
}: ConfirmRiderModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-sm p-0 overflow-hidden"
        style={{ backgroundColor: "#1a3f1c" }}
      >
        <DialogTitle className="sr-only">Confirm Rider Assignment</DialogTitle>

        <div className="p-6 sm:p-8 text-center space-y-6">
          <h2 className="text-lg sm:text-xl font-bold text-white leading-tight">
            Are you sure, you want to assign this rider?
          </h2>

          <div className="flex gap-3 sm:gap-4 justify-center">
            <Button
              onClick={onClose}
              className="px-8 py-6 text-base font-semibold"
              style={{ backgroundColor: "#ffca3a", color: "#1a3f1c" }}
            >
              No
            </Button>
            <Button
              onClick={onConfirm}
              className="px-8 py-6 text-base font-semibold"
              style={{ backgroundColor: "#98ef9b", color: "#1a3f1c" }}
            >
              Yes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
