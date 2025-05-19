
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ParkingSlot } from "@/types";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { deleteParkingSlot } from "@/store/slices/parkingSlotsSlice";
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

interface SlotCardProps {
  slot: ParkingSlot;
  onEdit: (slot: ParkingSlot) => void;
}

const SlotCard = ({ slot, onEdit }: SlotCardProps) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      await dispatch(deleteParkingSlot(slot.id)).unwrap();
      toast.success("Parking slot deleted successfully");
    } catch (error: any) {
      toast.error(error || "Failed to delete parking slot");
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

  const getStatusColor = (status: string) => {
    return status === "available" 
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  const getLocationColor = (location: string) => {
    switch (location) {
      case "north":
        return "bg-indigo-100 text-indigo-800";
      case "south":
        return "bg-orange-100 text-orange-800";
      case "east":
        return "bg-pink-100 text-pink-800";
      case "west":
        return "bg-teal-100 text-teal-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl">Slot {slot.slotNumber}</CardTitle>
            <Badge className={getStatusColor(slot.status)}>{slot.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge className={getSizeColor(slot.size)}>{slot.size}</Badge>
            <Badge className={getTypeColor(slot.vehicleType)}>{slot.vehicleType}</Badge>
            <Badge className={getLocationColor(slot.location)}>{slot.location}</Badge>
          </div>
        </CardContent>
        {isAdmin && (
          <CardFooter className="border-t pt-4">
            <div className="flex w-full justify-between space-x-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(slot)}>
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => setShowDeleteConfirm(true)}>
                Delete
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
