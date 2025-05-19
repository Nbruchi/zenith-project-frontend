import { useState } from "react";
import RequestCard from "@/components/requests/RequestCard";
import SearchInput from "@/components/SearchInput";
import PaginationControls from "@/components/PaginationControls";
import { Calendar } from "lucide-react";
import { useSlotRequests } from "@/hooks/useSlotRequests";

const Requests = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 10;

  const { requests, pagination, isLoading } = useSlotRequests(page, limit, search);

  const handleSearch = (query: string) => {
    setSearch(query);
    setPage(1);
  };

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Parking Slot Requests</h1>
        <p className="text-muted-foreground">
          View and manage your parking slot requests
        </p>
      </div>

      <div className="mb-6">
        <SearchInput
          placeholder="Search by status or vehicle"
          onSearch={handleSearch}
          defaultValue={search}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <p>Loading requests...</p>
        </div>
      ) : requests.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
            {requests.map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
          <PaginationControls
            currentPage={page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        </>
      ) : (
        <div className="text-center py-12 bg-muted/20 rounded-lg">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No requests found</h3>
          <p className="text-muted-foreground mt-2 mb-4">
            {search
              ? "No results match your search. Try with a different term."
              : "You haven't made any parking slot requests yet."}
          </p>
          {!search && (
            <p>
              Go to your vehicles and click "Request Slot" to request a parking
              slot.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Requests;
