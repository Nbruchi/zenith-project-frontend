import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import VehicleForm from "@/components/vehicles/VehicleForm"
import { VehiclesDataTable } from "@/components/features/vehicles/data-table"
import { columns } from "@/components/features/vehicles/columns"
import { useVehicles } from "@/hooks/useVehicles"
import { useQueryClient } from "@tanstack/react-query"

export default function Vehicles() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const limit = 10
  const queryClient = useQueryClient()

  const { vehicles, pagination, isLoading } = useVehicles(page, limit, search)

  const handleFormClose = () => {
    setIsFormOpen(false)
    // Force refetch vehicles data
    queryClient.invalidateQueries({ queryKey: ['vehicles'] })
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vehicles</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Vehicle
        </Button>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Search vehicles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <VehiclesDataTable 
        columns={columns} 
        data={vehicles} 
        isLoading={isLoading}
        pageCount={pagination.totalPages}
        onPageChange={setPage}
      />

      <VehicleForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
      />
    </div>
  )
}