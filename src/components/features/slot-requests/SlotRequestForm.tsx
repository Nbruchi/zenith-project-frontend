import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSlotRequests } from "@/hooks/useSlotRequests";
import { Location } from "@/types";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const formSchema = z.object({
  preferredLocation: z.nativeEnum(Location, {
    required_error: "Please select a preferred location",
  }),
  startTime: z.string().optional().refine((val) => {
    if (!val) return true;
    return !isNaN(Date.parse(`2000-01-01T${val}`));
  }, "Invalid time format"),
  endTime: z.string().optional().refine((val) => {
    if (!val) return true;
    return !isNaN(Date.parse(`2000-01-01T${val}`));
  }, "Invalid time format"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface SlotRequestFormProps {
  vehicleId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const PARKING_RATE_PER_30MIN = 500; // 500 RWF per 30 minutes

function calculateParkingCost(startTime: string, endTime: string): { duration: string; cost: number } {
  if (!startTime || !endTime) return { duration: "0h 0m", cost: 0 };
  
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);
  const diffInMinutes = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60));
  const halfHourBlocks = Math.ceil(diffInMinutes / 30);
  const cost = halfHourBlocks * PARKING_RATE_PER_30MIN;
  
  const hours = Math.floor(diffInMinutes / 60);
  const minutes = diffInMinutes % 60;
  const duration = `${hours}h ${minutes}m`;
  
  return { duration, cost };
}

export function SlotRequestForm({ vehicleId, onSuccess, onCancel }: SlotRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [parkingCost, setParkingCost] = useState<{ duration: string; cost: number }>({ duration: "0h 0m", cost: 0 });
  const { createSlotRequest } = useSlotRequests();
  const { user } = useAuth();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      preferredLocation: undefined,
      startTime: "",
      endTime: "",
      notes: "",
    },
  });

  // Add effect to calculate cost when times change
  useEffect(() => {
    const startTime = form.watch("startTime");
    const endTime = form.watch("endTime");
    setParkingCost(calculateParkingCost(startTime || "", endTime || ""));
  }, [form.watch("startTime"), form.watch("endTime")]);

  const onSubmit = async (data: FormData) => {
    if (!user?.id) {
      toast.error("User not authenticated");
      return;
    }

    try {
      setIsSubmitting(true);
      // Convert empty strings to undefined for dates
      const formattedData = {
        ...data,
        startTime: data.startTime || undefined,
        endTime: data.endTime || undefined,
      };
      
      await createSlotRequest.mutateAsync({
        vehicleId,
        userId: user.id,
        ...formattedData,
      });
      toast.success("Slot request submitted successfully");
      onSuccess?.();
    } catch (error) {
      // Error is handled in the mutation
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="preferredLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Location</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(Location).map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time (Optional)</FormLabel>
                <FormControl>
                  <input
                    type="time"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time (Optional)</FormLabel>
                <FormControl>
                  <input
                    type="time"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {(form.watch("startTime") || form.watch("endTime")) && (
          <div className="rounded-lg border p-4 bg-muted/50">
            <p className="text-sm font-medium">Estimated Parking Details:</p>
            <p className="text-sm">Duration: {parkingCost.duration}</p>
            <p className="text-sm font-semibold">Cost: {parkingCost.cost} RWF</p>
            <p className="text-xs text-muted-foreground mt-1">Rate: 500 RWF per 30 minutes</p>
          </div>
        )}

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any special requirements or preferences..."
                  className="resize-none"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </div>
      </form>
    </Form>
  );
} 