import { useState } from "react";
import {RequestCard} from "@/components/requests/RequestCard";
import SearchInput from "@/components/SearchInput";
import PaginationControls from "@/components/PaginationControls";
import { Calendar } from "lucide-react";
import { useSlotRequests } from "@/hooks/useSlotRequests";
import { RequestStatus } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useParkingSlots } from "@/hooks/useParkingSlots";

const Requests = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<RequestStatus | "ALL">("ALL");
  const limit = 10;
  const navigate = useNavigate();

  const { requests, pagination, isLoading, approveSlotRequest, rejectSlotRequest } = useSlotRequests(
    page,
    limit,
    search,
    status === "ALL" ? undefined : status
  );

  const { slots } = useParkingSlots();

  const handleSearch = (query: string) => {
    setSearch(query);
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value as RequestStatus | "ALL");
    setPage(1);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Parking Slot Requests</h1>
        <p className="text-muted-foreground">
          View and manage your parking slot requests
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchInput
            placeholder="Search by status or vehicle"
            onSearch={handleSearch}
            defaultValue={search}
          />
        </div>
        <div className="w-full sm:w-[200px]">
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              {Object.values(RequestStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {status.toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleNewRequest} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          New Request
        </Button>
      </div>

      {requests.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
            {requests.map((request) => (
              <RequestCard 
                key={request.id} 
                request={request} 
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </div>
          {pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, pagination.total)} of {pagination.total} requests
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    />
                  </PaginationItem>
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => setPage(pageNum)}
                          isActive={page === pageNum}
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setPage((p) => Math.min(pagination.totalPages, p + 1))
                      }
                      disabled={page === pagination.totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-muted/20 rounded-lg">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No requests found</h3>
          <p className="text-muted-foreground mt-2 mb-4">
            {search || status
              ? "No results match your search. Try with different filters."
              : "You haven't made any parking slot requests yet."}
          </p>
          {!search && !status && (
            <Button onClick={handleNewRequest}>
              <Plus className="mr-2 h-4 w-4" />
              Make Your First Request
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Requests;
