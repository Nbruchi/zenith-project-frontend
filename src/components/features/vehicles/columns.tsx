"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Vehicle } from "@/types"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"

export const columns: ColumnDef<Vehicle>[] = [
  {
    accessorKey: "plateNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Plate Number
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
    accessorKey: "isParked",
    header: "Status",
    cell: ({ row }) => {
      const isParked = row.getValue("isParked") as boolean
      return (
        <div className={`font-medium ${isParked ? "text-green-600" : "text-red-600"}`}>
          {isParked ? "Parked" : "Not Parked"}
        </div>
      )
    },
  },
  {
    accessorKey: "parkingSlotId",
    header: "Parking Slot",
    cell: ({ row }) => {
      const parkingSlotId = row.getValue("parkingSlotId") as string
      return <div>{parkingSlotId || "Not Assigned"}</div>
    },
  },
]