import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SlotRequest } from "@/types";
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
import { useSlotRequests } from "@/hooks/useSlotRequests";
import { useAuth } from "@/contexts/AuthContext";

interface RequestCardProps {
  request: SlotRequest;
}

const RequestCard = ({ request }: RequestCardProps) => {
  const { user } = useAuth();
  const { deleteRequest, approveRequest, rejectRequest } = useSlotRequests();
  const isAdmin = user?.role === "ADMIN";
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const vehicle = request.vehicle;

  const handleDelete = async () => {
    try {
      await deleteRequest.mutateAsync(request.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      // Error is handled in the mutation
    }
  };

  const handleApprove = async () => {
    try {
      await approveRequest.mutateAsync(request.id);
    } catch (error) {
      // Error is handled in the mutation
    }
  };

  const handleReject = async () => {
    try {
      await rejectRequest.mutateAsync(request.id);
    } catch (error) {
      // Error is handled in the mutation
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
                      disabled={approveRequest.isPending}
                    >
                      {approveRequest.isPending ? "Processing..." : "Approve"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={handleReject}
                      disabled={rejectRequest.isPending}
                    >
                      {rejectRequest.isPending ? "Processing..." : "Reject"}
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={deleteRequest.isPending}
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
