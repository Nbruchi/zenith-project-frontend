import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useSlotRequests } from "@/hooks/useSlotRequests";
import { RequestStatus } from "@/types";
import { toast } from "sonner";
import { SlotRequestsDataTable } from "@/components/features/slot-requests/data-table";
import { createColumns } from "@/components/features/slot-requests/columns";
import { useParkingSlots } from "@/hooks/useParkingSlots";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Requests = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<RequestStatus | "ALL">("ALL");

  const { requests, isLoading, approveSlotRequest, rejectSlotRequest, deleteSlotRequest } = useSlotRequests(
    1,
    100,
    "",
    status === "ALL" ? undefined : status
  );

  const { slots } = useParkingSlots();

  const handleStatusChange = (value: string) => {
    setStatus(value as RequestStatus | "ALL");
  };

  const handleNewRequest = () => {
    navigate("/dashboard/vehicles");
  };

  const handleApprove = async (id: string) => {
    try {
      // Find an available slot
      const availableSlot = slots.find(slot => slot.status === "AVAILABLE");
      
      if (!availableSlot) {
        toast.error("No available slots found");
        return;
      }

      await approveSlotRequest.mutateAsync({ 
        id, 
        slotId: availableSlot.id 
      });
      toast.success("Slot request approved successfully");
    } catch (error) {
      // Error is handled in the mutation
    }
  };

  const handleReject = async (id: string, rejectionReason: string) => {
    try {
      await rejectSlotRequest.mutateAsync({ id, rejectionReason });
      toast.success("Slot request rejected successfully");
    } catch (error) {
      // Error is handled in the mutation
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSlotRequest.mutateAsync(id);
      toast.success("Slot request deleted successfully");
    } catch (error) {
      // Error is handled in the mutation
    }
  };

  const columns = createColumns({
    onApprove: handleApprove,
    onReject: handleReject,
    onDelete: handleDelete,
  });

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Parking Requests</h1>
          <p className="text-muted-foreground">View and manage parking slot requests</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={handleNewRequest}>
            <Plus className="mr-2 h-4 w-4" />
            New Request
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Requests</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <p>Loading requests...</p>
        </div>
      ) : requests.length > 0 ? (
        <SlotRequestsDataTable
          columns={columns}
          data={requests}
        />
      ) : (
        <div className="text-center py-12 bg-muted/20 rounded-lg">
          <Plus className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No requests found</h3>
          <p className="text-muted-foreground mt-2 mb-4">
            {status === "ALL"
              ? "No parking requests have been made yet."
              : `No ${status.toLowerCase()} requests found.`}
          </p>
          {status === "ALL" && (
            <Button onClick={handleNewRequest}>Make a Request</Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Requests;
