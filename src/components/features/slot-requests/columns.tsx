"use client"

import { ColumnDef } from "@tanstack/react-table"
import { SlotRequest } from "@/types"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export const columns: ColumnDef<SlotRequest>[] = [
  {
    accessorKey: "vehicleId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Vehicle ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "requestedSlotId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Requested Slot
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        // ... existing code ...
        <Badge
          variant={
            status === "APPROVED"
              ? "default"
              : status === "PENDING"
              ? "secondary"
              : "destructive"
          }
        >
// ... existing code ...
          {status.toLowerCase()}
        </Badge>
      )
    },
  },
  {
    accessorKey: "requestedAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Requested At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("requestedAt"))
      return <div>{date.toLocaleString()}</div>
    },
  },
  {
    accessorKey: "processedAt",
    header: "Processed At",
    cell: ({ row }) => {
      const date = row.getValue("processedAt")
      return <div>{date ? new Date(date as string).toLocaleString() : "Not processed"}</div>
    },
  },
]