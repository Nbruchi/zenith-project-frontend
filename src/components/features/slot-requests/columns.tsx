"use client"

import { ColumnDef } from "@tanstack/react-table"
import { SlotRequest, RequestStatus } from "@/types"
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
import { format } from "date-fns"

interface ColumnProps {
  onApprove?: (id: string) => Promise<void>
  onReject?: (id: string, reason: string) => Promise<void>
  onDelete?: (id: string) => Promise<void>
}

export const createColumns = ({ onApprove, onReject, onDelete }: ColumnProps): ColumnDef<SlotRequest>[] => [
  {
    accessorKey: "vehicle.vehiclePlate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Vehicle Plate
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "vehicle.vehicleType",
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
      const type = row.getValue("vehicle.vehicleType") as string
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
      const status = row.getValue("status") as RequestStatus
      const getStatusColor = (status: RequestStatus) => {
        switch (status) {
          case "PENDING":
            return "bg-yellow-100 text-yellow-800";
          case "APPROVED":
            return "bg-green-100 text-green-800";
          case "REJECTED":
            return "bg-red-100 text-red-800";
          default:
            return "bg-gray-100 text-gray-800";
        }
      };
      return <Badge className={getStatusColor(status)}>{status}</Badge>
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
      const date = row.getValue("requestedAt") as string
      return <div>{format(new Date(date), "PPpp")}</div>
    },
  },
  {
    accessorKey: "assignedSlot",
    header: "Assigned Slot",
    cell: ({ row }) => {
      const slot = row.getValue("assignedSlot") as { slotNumber: string } | null
      return <div>{slot?.slotNumber || "Not assigned"}</div>
    },
  },
  {
    accessorKey: "rejectionReason",
    header: "Rejection Reason",
    cell: ({ row }) => {
      const reason = row.getValue("rejectionReason") as string | null
      return <div>{reason || "-"}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const request = row.original
      const isPending = request.status === "PENDING"

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
            {isPending && onApprove && (
              <DropdownMenuItem onClick={() => onApprove(request.id)}>
                Approve
              </DropdownMenuItem>
            )}
            {isPending && onReject && (
              <DropdownMenuItem onClick={() => onReject(request.id, "")}>
                Reject
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem onClick={() => onDelete(request.id)}>
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]