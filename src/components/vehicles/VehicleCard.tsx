import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Vehicle, VehicleSize, VehicleType } from "@/types";
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
import { Edit, Trash2 } from "lucide-react";
import { useVehicles } from "@/hooks/useVehicles";

interface VehicleCardProps {
  vehicle: Vehicle;
  onEdit: (vehicle: Vehicle) => void;
}

const VehicleCard = ({ vehicle, onEdit }: VehicleCardProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isRequestingSlot, setIsRequestingSlot] = useState(false);
  const { deleteVehicle, createSlotRequest } = useVehicles();

  const handleDelete = async () => {
    try {
      await deleteVehicle.mutateAsync(vehicle.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      // Error is handled in the mutation
    }
  };

  const handleRequestSlot = async () => {
    try {
      setIsRequestingSlot(true);
      await createSlotRequest.mutateAsync(vehicle.id);
    } catch (error) {
      // Error is handled in the mutation
    } finally {
      setIsRequestingSlot(false);
    }
  };

  const getSizeColor = (size: VehicleSize) => {
    switch (size) {
      case 'SMALL':
        return 'bg-blue-100 text-blue-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LARGE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: VehicleType) => {
    switch (type) {
      case 'CAR':
        return 'bg-green-100 text-green-800';
      case 'MOTORCYCLE':
        return 'bg-purple-100 text-purple-800';
      case 'TRUCK':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl">{vehicle.plateNumber}</CardTitle>
            <div className="flex space-x-2">
              <Badge className={getSizeColor(vehicle.size)}>
                {vehicle.size.charAt(0) + vehicle.size.slice(1).toLowerCase()}
              </Badge>
              <Badge className={getTypeColor(vehicle.vehicleType)}>
                {vehicle.vehicleType.charAt(0) + vehicle.vehicleType.slice(1).toLowerCase()}
              </Badge>
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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(vehicle)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={deleteVehicle.isPending}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <Button 
            size="sm" 
            onClick={handleRequestSlot} 
            disabled={isRequestingSlot || createSlotRequest.isPending}
          >
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
