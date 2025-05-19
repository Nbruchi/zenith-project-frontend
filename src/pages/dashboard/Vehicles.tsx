
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { fetchVehicles, setSearchQuery, setCurrentPage } from "@/store/slices/vehiclesSlice";
import VehicleCard from "@/components/vehicles/VehicleCard";
import VehicleForm from "@/components/vehicles/VehicleForm";
import SearchInput from "@/components/SearchInput";
import PaginationControls from "@/components/PaginationControls";
import { Button } from "@/components/ui/button";
import { Vehicle } from "@/types";
import { Car } from "lucide-react";

const Vehicles = () => {
  const dispatch = useAppDispatch();
  const { vehicles, isLoading, pagination } = useAppSelector((state) => state.vehicles);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | undefined>(undefined);

  useEffect(() => {
    dispatch(
      fetchVehicles({
        page: pagination.currentPage,
        limit: pagination.itemsPerPage,
        search: pagination.searchQuery,
      })
    );
  }, [dispatch, pagination.currentPage, pagination.searchQuery]);

  const handleSearch = (query: string) => {
    dispatch(setSearchQuery(query));
    dispatch(setCurrentPage(1));
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const handleAddVehicle = () => {
    setEditingVehicle(undefined);
    setIsFormOpen(true);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsFormOpen(true);
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Vehicles</h1>
          <p className="text-muted-foreground">Manage your vehicles and request parking slots</p>
        </div>
        <Button onClick={handleAddVehicle}>
          <Car className="mr-2 h-4 w-4" />
          Add Vehicle
        </Button>
      </div>

      <div className="mb-6">
        <SearchInput
          placeholder="Search by plate number or vehicle type"
          onSearch={handleSearch}
          defaultValue={pagination.searchQuery}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <p>Loading vehicles...</p>
        </div>
      ) : vehicles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onEdit={handleEditVehicle}
              />
            ))}
          </div>
          <PaginationControls
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <div className="text-center py-12 bg-muted/20 rounded-lg">
          <Car className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No vehicles found</h3>
          <p className="text-muted-foreground mt-2 mb-4">
            {pagination.searchQuery
              ? "No results match your search. Try with a different term."
              : "You haven't added any vehicles yet."}
          </p>
          {!pagination.searchQuery && (
            <Button onClick={handleAddVehicle}>Add Your First Vehicle</Button>
          )}
        </div>
      )}

      <VehicleForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        vehicle={editingVehicle}
        isEditing={!!editingVehicle}
      />
    </div>
  );
};

export default Vehicles;
