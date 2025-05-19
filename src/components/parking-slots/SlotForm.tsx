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
import { ParkingSlot, SlotFormData, Size, VehicleType, Location } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useParkingSlots } from "@/hooks/useParkingSlots";

const formSchema = z.object({
  slotNumber: z.string().min(1, "Slot number is required"),
  size: z.nativeEnum(Size),
  vehicleType: z.nativeEnum(VehicleType),
  location: z.nativeEnum(Location),
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
  const { createParkingSlot, updateParkingSlot } = useParkingSlots();

  const form = useForm<SlotFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      slotNumber: slot?.slotNumber || "",
      size: slot?.size || Size.SMALL,
      vehicleType: slot?.vehicleType || VehicleType.CAR,
      location: slot?.location || Location.NORTH,
    },
  });

  const onSubmit = async (data: SlotFormData) => {
    try {
      if (isEditing && slot) {
        await updateParkingSlot.mutateAsync({ id: slot.id, slotData: data });
      } else {
        await createParkingSlot.mutateAsync(data);
      }
      onClose();
    } catch (error) {
      // Error is handled in the mutation
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
                    <Input {...field} />
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
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={Size.SMALL}>Small</SelectItem>
                      <SelectItem value={Size.MEDIUM}>Medium</SelectItem>
                      <SelectItem value={Size.LARGE}>Large</SelectItem>
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
                      <SelectItem value={VehicleType.CAR}>Car</SelectItem>
                      <SelectItem value={VehicleType.MOTORCYCLE}>Motorcycle</SelectItem>
                      <SelectItem value={VehicleType.TRUCK}>Truck</SelectItem>
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
                      <SelectItem value={Location.NORTH}>North</SelectItem>
                      <SelectItem value={Location.SOUTH}>South</SelectItem>
                      <SelectItem value={Location.EAST}>East</SelectItem>
                      <SelectItem value={Location.WEST}>West</SelectItem>
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
              <Button 
                type="submit" 
                disabled={createParkingSlot.isPending || updateParkingSlot.isPending}
              >
                {createParkingSlot.isPending || updateParkingSlot.isPending
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
