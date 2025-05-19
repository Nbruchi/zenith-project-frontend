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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BulkSlotCreationFormData, Size, VehicleType, Location } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useParkingSlots } from "@/hooks/useParkingSlots";

const formSchema = z.object({
  startNumber: z.coerce.number().min(1, "Start number must be at least 1"),
  count: z.coerce.number().min(1, "Count must be at least 1").max(500, "Cannot create more than 500 slots at once"),
  prefix: z.string().min(1, "Prefix is required"),
  size: z.nativeEnum(Size),
  vehicleType: z.nativeEnum(VehicleType),
  location: z.nativeEnum(Location),
});

interface BulkSlotFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const BulkSlotForm = ({
  isOpen,
  onClose,
}: BulkSlotFormProps) => {
  const { createBulkSlots } = useParkingSlots();

  const form = useForm<BulkSlotCreationFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startNumber: 1,
      count: 10,
      prefix: "SLOT",
      size: Size.SMALL,
      vehicleType: VehicleType.CAR,
      location: Location.NORTH,
    },
  });

  const onSubmit = async (data: BulkSlotCreationFormData) => {
    try {
      await createBulkSlots.mutateAsync(data);
      onClose();
    } catch (error) {
      // Error is handled in the mutation
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bulk Create Parking Slots</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="prefix"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prefix</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., SLOT" />
                  </FormControl>
                  <FormDescription>
                    This will be used as a prefix for the slot numbers
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Number</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Slots</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} max={500} {...field} />
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
                disabled={createBulkSlots.isPending}
              >
                {createBulkSlots.isPending ? "Creating..." : "Create Slots"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BulkSlotForm;
