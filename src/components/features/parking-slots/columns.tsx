import { ColumnDef } from "@tanstack/react-table"
import { ParkingSlot, SlotStatus } from "@/types"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ColumnProps {
  onEdit?: (slot: ParkingSlot) => void
  onDelete?: (id: string) => Promise<void>
}

export const createColumns = ({ onEdit, onDelete }: ColumnProps): ColumnDef<ParkingSlot>[] => [
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
      return <Badge className={getSizeColor(size)}>{size}</Badge>
    },
  },
  {
    accessorKey: "vehicleType",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Vehicle Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const type = row.getValue("vehicleType") as string
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
      return <Badge className={getTypeColor(type)}>{type}</Badge>
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as SlotStatus
      const getStatusColor = (status: SlotStatus) => {
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
      return <Badge className={getStatusColor(status)}>{status}</Badge>
    },
  },
  {
    accessorKey: "location",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Location
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const location = row.getValue("location") as string
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
      return <Badge className={getLocationColor(location)}>{location}</Badge>
    },
  },
  {
    accessorKey: "assignedTo",
    header: "Assigned Vehicle",
    cell: ({ row }) => {
      const assignedTo = row.getValue("assignedTo") as { vehiclePlate: string } | null
      return <div>{assignedTo?.vehiclePlate || "None"}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const slot = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {onEdit && (
              <DropdownMenuItem onClick={() => onEdit(slot)}>
                Edit
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem onClick={() => onDelete(slot.id)}>
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]