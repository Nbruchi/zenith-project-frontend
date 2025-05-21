import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SlotForm from "@/components/parking-slots/SlotForm";
import BulkSlotForm from "@/components/parking-slots/BulkSlotForm";
import { Button } from "@/components/ui/button";
import { ParkingSlot } from "@/types";
import { Settings, Plus } from "lucide-react";
import { useParkingSlots } from "@/hooks/useParkingSlots";
import { useAuth } from "@/contexts/AuthContext";
import { ParkingSlotsDataTable } from "@/components/features/parking-slots/data-table";
import { createColumns } from "@/components/features/parking-slots/columns";
import { toast } from "sonner";

const ManageSlots = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isBulkFormOpen, setIsBulkFormOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<ParkingSlot | undefined>(undefined);

  const { slots, isLoading, deleteParkingSlot } = useParkingSlots();

  useEffect(() => {
    if (!isAdmin) {
      navigate("/dashboard");
    }
  }, [isAdmin, navigate]);

  const handleAddSlot = () => {
    setEditingSlot(undefined);
    setIsFormOpen(true);
  };

  const handleAddBulkSlots = () => {
    setIsBulkFormOpen(true);
  };

  const handleEditSlot = (slot: ParkingSlot) => {
    setEditingSlot(slot);
    setIsFormOpen(true);
  };

  const handleDeleteSlot = async (id: string) => {
    try {
      await deleteParkingSlot.mutateAsync(id);
      toast.success("Parking slot deleted successfully");
    } catch (error) {
      // Error is handled in the mutation
    }
  };

  const columns = createColumns({
    onEdit: handleEditSlot,
    onDelete: handleDeleteSlot,
  });

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manage Parking Slots</h1>
          <p className="text-muted-foreground">Add, edit, and delete parking slots</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={handleAddBulkSlots}>
            <Plus className="mr-2 h-4 w-4" />
            Bulk Create Slots
          </Button>
          <Button variant="outline" onClick={handleAddSlot}>
            <Settings className="mr-2 h-4 w-4" />
            Add Single Slot
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <p>Loading slots...</p>
        </div>
      ) : slots.length > 0 ? (
        <ParkingSlotsDataTable
          columns={columns}
          data={slots}
        />
      ) : (
        <div className="text-center py-12 bg-muted/20 rounded-lg">
          <Settings className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No parking slots found</h3>
          <p className="text-muted-foreground mt-2 mb-4">
            No parking slots have been added yet.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button onClick={handleAddBulkSlots}>Bulk Create Slots</Button>
            <Button variant="outline" onClick={handleAddSlot}>
              Add Single Slot
            </Button>
          </div>
        </div>
      )}

      <SlotForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        slot={editingSlot}
        isEditing={!!editingSlot}
      />

      <BulkSlotForm
        isOpen={isBulkFormOpen}
        onClose={() => setIsBulkFormOpen(false)}
      />
    </div>
  );
};

export default ManageSlots;
