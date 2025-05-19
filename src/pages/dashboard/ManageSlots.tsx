import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SlotCard from "@/components/parking-slots/SlotCard";
import SlotForm from "@/components/parking-slots/SlotForm";
import BulkSlotForm from "@/components/parking-slots/BulkSlotForm";
import SearchInput from "@/components/SearchInput";
import PaginationControls from "@/components/PaginationControls";
import { Button } from "@/components/ui/button";
import { ParkingSlot } from "@/types";
import { Settings, Plus } from "lucide-react";
import { useParkingSlots } from "@/hooks/useParkingSlots";
import { useAuth } from "@/contexts/AuthContext";

const ManageSlots = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isBulkFormOpen, setIsBulkFormOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<ParkingSlot | undefined>(undefined);
  const limit = 10;

  const { slots, pagination, isLoading } = useParkingSlots(page, limit, search);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/dashboard");
    }
  }, [isAdmin, navigate]);

  const handleSearch = (query: string) => {
    setSearch(query);
    setPage(1);
  };

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

      <div className="mb-6">
        <SearchInput
          placeholder="Search by slot number, size, or vehicle type"
          onSearch={handleSearch}
          defaultValue={search}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <p>Loading slots...</p>
        </div>
      ) : slots.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-4">
            {slots.map((slot) => (
              <SlotCard key={slot.id} slot={slot} onEdit={handleEditSlot} />
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t">
            <p className="text-sm text-muted-foreground">
              Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, pagination.total)} of {pagination.total} slots
            </p>
            <PaginationControls
              currentPage={page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          </div>
        </>
      ) : (
        <div className="text-center py-12 bg-muted/20 rounded-lg">
          <Settings className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No parking slots found</h3>
          <p className="text-muted-foreground mt-2 mb-4">
            {search
              ? "No results match your search. Try with a different term."
              : "No parking slots have been added yet."}
          </p>
          {!search && (
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button onClick={handleAddBulkSlots}>Bulk Create Slots</Button>
              <Button variant="outline" onClick={handleAddSlot}>
                Add Single Slot
              </Button>
            </div>
          )}
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
