import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance, { handleApiResponse } from '@/lib/axios';
import { ParkingSlot, SlotFormData, BulkSlotCreationFormData } from '@/types';
import { toast } from 'sonner';

export function useParkingSlots(page = 1, limit = 10, search = "") {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["parkingSlots", page, limit, search],
    queryFn: async () => {
      const response = await axiosInstance.get("/parking-slots", {
        params: { page, limit, search, include: "vehicle" },
      });
      return handleApiResponse(response);
    },
  });

  const createParkingSlot = useMutation({
    mutationFn: async (slotData: Partial<ParkingSlot>) => {
      const response = await axiosInstance.post('/parking-slots', slotData);
      return handleApiResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parkingSlots'] });
      toast.success('Parking slot created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create parking slot');
    }
  });

  const createBulkSlots = useMutation({
    mutationFn: async (data: BulkSlotCreationFormData) => {
      const response = await axiosInstance.post('/parking-slots/bulk', {
        ...data,
        vehicleType: data.vehicleType.toUpperCase(),
        size: data.size.toUpperCase(),
        location: data.location.toUpperCase()
      });
      return handleApiResponse(response);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['parkingSlots'] });
      toast.success(`Successfully created ${variables.count} parking slots`);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create bulk parking slots');
    }
  });

  const updateParkingSlot = useMutation({
    mutationFn: async ({ id, slotData }: { id: string; slotData: Partial<ParkingSlot> }) => {
      const response = await axiosInstance.put(`/parking-slots/${id}`, slotData);
      return handleApiResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parkingSlots'] });
      toast.success('Parking slot updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update parking slot');
    }
  });

  const deleteParkingSlot = useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.delete(`/parking-slots/${id}`);
      return handleApiResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parkingSlots'] });
      toast.success('Parking slot deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete parking slot');
    }
  });

  return {
    slots: data?.items as ParkingSlot[] || [],
    pagination: {
      total: data?.total || 0,
      page: data?.page || 1,
      limit: data?.limit || 10,
      totalPages: data?.totalPages || 1
    },
    isLoading,
    error,
    createParkingSlot,
    createBulkSlots,
    updateParkingSlot,
    deleteParkingSlot
  };
} 