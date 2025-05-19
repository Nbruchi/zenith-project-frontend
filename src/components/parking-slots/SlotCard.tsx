import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ParkingSlot } from "@/types";
import { useState } from "react";
import { useParkingSlots } from "@/hooks/useParkingSlots";
import { useAuth } from "@/contexts/AuthContext";
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

interface SlotCardProps {
  slot: ParkingSlot;
  onEdit: (slot: ParkingSlot) => void;
}

const SlotCard = ({ slot, onEdit }: SlotCardProps) => {
  const { user } = useAuth();
  const { deleteParkingSlot } = useParkingSlots();
  const isAdmin = user?.role === "ADMIN";
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteParkingSlot.mutateAsync(slot.id);
    } catch (error) {
      // Error is handled in the mutation
    }
  };

  const getSizeColor = (size: string) => {
    switch (size) {
      case "SMALL":
        return "bg-green-100 text-green-800";
      case "MEDIUM":
        return "bg-blue-100 text-blue-800";
      case "LARGE":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "CAR":
        return "bg-amber-100 text-amber-800";
      case "MOTORCYCLE":
        return "bg-cyan-100 text-cyan-800";
      case "TRUCK":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-100 text-green-800";
      case "OCCUPIED":
        return "bg-red-100 text-red-800";
      case "RESERVED":
        return "bg-yellow-100 text-yellow-800";
      case "MAINTENANCE":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLocationColor = (location: string) => {
    switch (location) {
      case "NORTH":
        return "bg-indigo-100 text-indigo-800";
      case "SOUTH":
        return "bg-orange-100 text-orange-800";
      case "EAST":
        return "bg-pink-100 text-pink-800";
      case "WEST":
        return "bg-teal-100 text-teal-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">Slot {slot.slotNumber}</CardTitle>
            <Badge className={getStatusColor(slot.status)}>{slot.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-1 py-2">
          <div className="flex flex-wrap gap-1.5 mb-2">
            <Badge className={getSizeColor(slot.size)}>{slot.size}</Badge>
            <Badge className={getTypeColor(slot.vehicleType)}>{slot.vehicleType}</Badge>
            <Badge className={getLocationColor(slot.location)}>{slot.location}</Badge>
          </div>
          {slot.assignedTo && (
            <div className="text-sm space-y-1">
              <p className="font-medium">{slot.assignedTo.vehiclePlate}</p>
            </div>
          )}
        </CardContent>
        {isAdmin && (
          <CardFooter className="border-t pt-2">
            <div className="flex w-full justify-between space-x-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(slot)}>
                Edit
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => setShowDeleteConfirm(true)}
                disabled={deleteParkingSlot.isPending}
              >
                {deleteParkingSlot.isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete parking slot {slot.slotNumber}. This
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

export default SlotCard;
