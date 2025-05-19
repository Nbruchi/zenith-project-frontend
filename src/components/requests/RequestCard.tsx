import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SlotRequest, RequestStatus } from "@/types";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useSlotRequests } from "@/hooks/useSlotRequests";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { User, Car, ParkingSquare } from "lucide-react";

interface RequestCardProps {
  request: SlotRequest;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string, reason: string) => void;
}

export function RequestCard({ request, onApprove, onReject }: RequestCardProps) {
  const { user } = useAuth();
  const { deleteSlotRequest } = useSlotRequests();
  const isAdmin = user?.role === "ADMIN";
  const normalizedStatus = request.status.toUpperCase() as RequestStatus;
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleDelete = async () => {
    try {
      await deleteSlotRequest.mutateAsync(request.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      // Error is handled in the mutation
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    
    }

    onReject(request.id, rejectionReason.trim());
    setShowRejectDialog(false);
    setRejectionReason("");
  };

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "APPROVED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "PPpp");
  };

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">Request #{request.id.slice(0, 8)}</CardTitle>
            <Badge className={getStatusColor(normalizedStatus)}>
              {normalizedStatus}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {request.userName}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {request.vehiclePlate} ({request.vehicleType})
              </span>
            </div>
            {request.assignedSlot && (
              <div className="flex items-center gap-2">
                <ParkingSquare className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Assigned to Slot {request.assignedSlot.slotNumber}
                </span>
              </div>
            )}

            {request.preferredLocation && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Preferred Location</p>
                <p className="font-medium">{request.preferredLocation}</p>
              </div>
            )}

            {request.startDate && request.endDate && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Duration</p>
                <div className="space-y-1">
                  <p className="font-medium">
                    {format(new Date(request.startDate), "MMM d, yyyy")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    to {format(new Date(request.endDate), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
            )}

            {request.notes && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Notes</p>
                <p className="text-sm">{request.notes}</p>
              </div>
            )}

            {request.rejectionReason && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rejection Reason</p>
                <p className="text-sm text-red-600">{request.rejectionReason}</p>
              </div>
            )}

            <div>
              <p className="text-sm font-medium text-muted-foreground">Date Requested</p>
              <p>{formatDate(request.createdAt)}</p>
            </div>

            {request.updatedAt !== request.createdAt && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                <p>{formatDate(request.updatedAt)}</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap justify-end gap-2 pt-4">
          {isAdmin && normalizedStatus === "PENDING" && (
            <>
              <Button
                variant="outline"
                onClick={() => setShowRejectDialog(true)}
                disabled={deleteSlotRequest.isPending}
                className="flex-1 sm:flex-none"
              >
                Reject
              </Button>
              <Button
                onClick={() => onApprove(request.id)}
                disabled={deleteSlotRequest.isPending}
                className="flex-1 sm:flex-none"
              >
                Approve
              </Button>
            </>
          )}
          {(!isAdmin || normalizedStatus === "PENDING") && (
            <Button
              variant="destructive"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={deleteSlotRequest.isPending}
              className="flex-1 sm:flex-none"
            >
              Delete
            </Button>
          )}
        </CardFooter>
      </Card>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this slot request. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Slot Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this slot request.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleReject} disabled={!rejectionReason.trim()}>
              Reject Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
