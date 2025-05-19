
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SlotRequest } from "@/types";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { deleteSlotRequest, approveSlotRequest, rejectSlotRequest } from "@/store/slices/slotRequestsSlice";
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

interface RequestCardProps {
  request: SlotRequest;
}

const RequestCard = ({ request }: RequestCardProps) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const vehicle = request.vehicle;

  const handleDelete = async () => {
    try {
      await dispatch(deleteSlotRequest(request.id)).unwrap();
      toast.success("Request deleted successfully");
    } catch (error: any) {
      toast.error(error || "Failed to delete request");
    }
  };

  const handleApprove = async () => {
    try {
      setIsProcessing(true);
      await dispatch(approveSlotRequest(request.id)).unwrap();
      toast.success("Request approved successfully");
    } catch (error: any) {
      toast.error(error || "Failed to approve request");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    try {
      setIsProcessing(true);
      await dispatch(rejectSlotRequest(request.id)).unwrap();
      toast.success("Request rejected successfully");
    } catch (error: any) {
      toast.error(error || "Failed to reject request");
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">Request #{request.id.slice(0, 8)}</CardTitle>
            <Badge className={getStatusColor(request.requestStatus)}>
              {request.requestStatus}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Vehicle Info</p>
              <p className="font-medium">{vehicle?.plateNumber || "N/A"}</p>
              <div className="flex gap-1 mt-1">
                {vehicle?.vehicleType && (
                  <Badge variant="outline">{vehicle.vehicleType}</Badge>
                )}
                {vehicle?.size && (
                  <Badge variant="outline">{vehicle.size}</Badge>
                )}
              </div>
            </div>

            {request.slotNumber && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Assigned Slot</p>
                <p className="font-medium">{request.slotNumber}</p>
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
        <CardFooter className="border-t pt-4">
          <div className="flex w-full justify-between">
            {request.requestStatus === "pending" && (
              <>
                {isAdmin ? (
                  <div className="flex gap-2 w-full">
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full"
                      onClick={handleApprove}
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Processing..." : "Approve"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={handleReject}
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Processing..." : "Reject"}
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    Cancel Request
                  </Button>
                )}
              </>
            )}
            {!isAdmin && request.requestStatus !== "pending" && (
              <p className="text-sm text-muted-foreground italic">
                Request {request.requestStatus} on {formatDate(request.updatedAt)}
              </p>
            )}
          </div>
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
    </>
  );
};

export default RequestCard;
