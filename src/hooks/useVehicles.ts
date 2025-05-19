import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance, { handleApiResponse } from '@/lib/axios';
import { Vehicle, VehicleFormData } from '@/types';
import { toast } from 'sonner';

export function useVehicles(page = 1, limit = 10, search = "") {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["vehicles", page, limit, search],
    queryFn: async () => {
      const response = await axiosInstance.get("/vehicles", {
        params: { page, limit, search },
      });
      return handleApiResponse(response);
    },
  });

  const createVehicle = useMutation({
    mutationFn: async (vehicleData: VehicleFormData) => {
      const payload = {
        plateNumber: vehicleData.plateNumber,
        vehicleType: vehicleData.vehicleType,
        size: vehicleData.size,
        attributes: {
          color: vehicleData.color,
          model: vehicleData.model
        }
      };
      const response = await axiosInstance.post('/vehicles', payload);
      return handleApiResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['vehicles'],
        refetchType: 'active'
      });
      toast.success('Vehicle created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create vehicle');
    }
  });

  const updateVehicle = useMutation({
    mutationFn: async ({ id, vehicleData }: { id: string; vehicleData: VehicleFormData }) => {
      const payload = {
        plateNumber: vehicleData.plateNumber,
        vehicleType: vehicleData.vehicleType,
        size: vehicleData.size,
        attributes: {
          color: vehicleData.color,
          model: vehicleData.model
        }
      };
      const response = await axiosInstance.patch(`/vehicles/${id}`, payload);
      return handleApiResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['vehicles'],
        refetchType: 'active'
      });
      toast.success('Vehicle updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update vehicle');
    }
  });

  const deleteVehicle = useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.delete(`/vehicles/${id}`);
      return handleApiResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['vehicles'],
        refetchType: 'active'
      });
      toast.success('Vehicle deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete vehicle');
    }
  });

  const createSlotRequest = useMutation({
    mutationFn: async (vehicleId: string) => {
      const response = await axiosInstance.post('/slot-requests', { vehicleId });
      return handleApiResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slotRequests'] });
      toast.success('Slot request submitted successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to request parking slot');
    }
  });

  return {
    vehicles: data?.items as Vehicle[] || [],
    pagination: {
      total: data?.total || 0,
      page: data?.page || 1,
      limit: data?.limit || 10,
      totalPages: data?.totalPages || 1
    },
    isLoading,
    error,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    createSlotRequest
  };
} 