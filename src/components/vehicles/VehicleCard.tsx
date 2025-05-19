
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Vehicle } from "@/types";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { deleteVehicle } from "@/store/slices/vehiclesSlice";
import { createSlotRequest } from "@/store/slices/slotRequestsSlice";
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

interface VehicleCardProps {
  vehicle: Vehicle;
  onEdit: (vehicle: Vehicle) => void;
}

const VehicleCard = ({ vehicle, onEdit }: VehicleCardProps) => {
  const dispatch = useAppDispatch();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isRequestingSlot, setIsRequestingSlot] = useState(false);

  const handleDelete = async () => {
    try {
      await dispatch(deleteVehicle(vehicle.id)).unwrap();
      toast.success("Vehicle deleted successfully");
    } catch (error: any) {
      toast.error(error || "Failed to delete vehicle");
    }
  };

  const handleRequestSlot = async () => {
    try {
      setIsRequestingSlot(true);
      await dispatch(createSlotRequest({ vehicleId: vehicle.id })).unwrap();
      toast.success("Slot request submitted successfully");
    } catch (error: any) {
      toast.error(error || "Failed to request parking slot");
    } finally {
      setIsRequestingSlot(false);
    }
  };

  const getSizeColor = (size: string) => {
    switch (size) {
      case "small":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "large":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "car":
        return "bg-amber-100 text-amber-800";
      case "motorcycle":
        return "bg-cyan-100 text-cyan-800";
      case "truck":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl">{vehicle.plateNumber}</CardTitle>
            <div className="flex space-x-1">
              <Badge className={getSizeColor(vehicle.size)}>{vehicle.size}</Badge>
              <Badge className={getTypeColor(vehicle.vehicleType)}>{vehicle.vehicleType}</Badge>
            </div>
          </div>
          <CardDescription>Vehicle Details</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="space-y-2">
            {vehicle.attributes?.color && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Color:</span>
                <span>{vehicle.attributes.color}</span>
              </div>
            )}
            {vehicle.attributes?.model && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Model:</span>
                <span>{vehicle.attributes.model}</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(vehicle)}>
              Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={() => setShowDeleteConfirm(true)}>
              Delete
            </Button>
          </div>
          <Button size="sm" onClick={handleRequestSlot} disabled={isRequestingSlot}>
            {isRequestingSlot ? "Requesting..." : "Request Slot"}
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the vehicle with plate number{" "}
              <span className="font-semibold">{vehicle.plateNumber}</span>. This
              action cannot be undone.
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

export default VehicleCard;
