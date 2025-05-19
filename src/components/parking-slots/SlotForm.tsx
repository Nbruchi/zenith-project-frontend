
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { createParkingSlot, updateParkingSlot, fetchParkingSlots } from "@/store/slices/parkingSlotsSlice";
import { ParkingSlot, SlotFormData, VehicleSize, VehicleType } from "@/types";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const formSchema = z.object({
  slotNumber: z.string().min(1, "Slot number is required"),
  size: z.enum(["small", "medium", "large"] as const),
  vehicleType: z.enum(["car", "motorcycle", "truck"] as const),
  location: z.enum(["north", "south", "east", "west"] as const),
});

interface SlotFormProps {
  isOpen: boolean;
  onClose: () => void;
  slot?: ParkingSlot;
  isEditing?: boolean;
}

const SlotForm = ({
  isOpen,
  onClose,
  slot,
  isEditing = false,
}: SlotFormProps) => {
  const dispatch = useAppDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SlotFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slotNumber: slot?.slotNumber || "",
      size: (slot?.size as VehicleSize) || "small",
      vehicleType: (slot?.vehicleType as VehicleType) || "car",
      location: slot?.location || "north",
    },
  });

  const onSubmit = async (data: SlotFormData) => {
    try {
      setIsSubmitting(true);
      if (isEditing && slot) {
        await dispatch(
          updateParkingSlot({ id: slot.id, slotData: data })
        ).unwrap();
      } else {
        await dispatch(createParkingSlot(data)).unwrap();
        // Refresh the slot list
        dispatch(fetchParkingSlots({ page: 1, limit: 10 }));
      }
      onClose();
    } catch (error: any) {
      toast.error(error || "Failed to save parking slot");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Update Parking Slot" : "Add New Parking Slot"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="slotNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slot Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter slot number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select slot size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vehicleType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select vehicle type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="car">Car</SelectItem>
                      <SelectItem value="motorcycle">Motorcycle</SelectItem>
                      <SelectItem value="truck">Truck</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="north">North</SelectItem>
                      <SelectItem value="south">South</SelectItem>
                      <SelectItem value="east">East</SelectItem>
                      <SelectItem value="west">West</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? isEditing
                    ? "Updating..."
                    : "Creating..."
                  : isEditing
                  ? "Update Slot"
                  : "Add Slot"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SlotForm;
