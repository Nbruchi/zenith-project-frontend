"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Vehicle } from "@/types"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, ParkingCircle } from "lucide-react"
import { useVehicles } from "@/hooks/useVehicles"
import { useState } from "react"
import { SlotRequestForm } from "@/components/features/slot-requests/SlotRequestForm"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

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
  {
    id: "actions",
    cell: ({ row }) => {
      const vehicle = row.original
      const [showRequestForm, setShowRequestForm] = useState(false)

      return (
        <>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRequestForm(true)}
            disabled={vehicle.isParked}
          >
            <ParkingCircle className="mr-2 h-4 w-4" />
            Request Slot
          </Button>

          <Dialog open={showRequestForm} onOpenChange={setShowRequestForm}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Request Parking Slot</DialogTitle>
              </DialogHeader>
              <SlotRequestForm
                vehicleId={vehicle.id}
                onSuccess={() => setShowRequestForm(false)}
                onCancel={() => setShowRequestForm(false)}
              />
            </DialogContent>
          </Dialog>
        </>
      )
    },
  },
]