import { ColumnDef } from "@tanstack/react-table"
import { ParkingSlot } from "@/types"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"

export const columns: ColumnDef<ParkingSlot>[] = [
  {
    accessorKey: "slotNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Slot Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "size",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Size
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const size = row.getValue("size") as string
      return <div className="capitalize">{size.toLowerCase()}</div>
    },
  },
  {
    accessorKey: "isOccupied",
    header: "Status",
    cell: ({ row }) => {
      const isOccupied = row.getValue("isOccupied") as boolean
      return (
        <div className={`font-medium ${isOccupied ? "text-red-600" : "text-green-600"}`}>
          {isOccupied ? "Occupied" : "Available"}
        </div>
      )
    },
  },
  {
    accessorKey: "currentVehicleId",
    header: "Current Vehicle",
    cell: ({ row }) => {
      const vehicleId = row.getValue("currentVehicleId") as string
      return <div>{vehicleId || "None"}</div>
    },
  },
]