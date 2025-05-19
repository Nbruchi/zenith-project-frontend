import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance, { handleApiResponse } from '@/lib/axios';
import { SlotRequest, SlotRequestFormData, RequestStatus } from '@/types';
import { toast } from 'sonner';

export function useSlotRequests(page = 1, limit = 10, search = "", status?: RequestStatus | "") {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["slotRequests", page, limit, search, status],
    queryFn: async () => {
      const response = await axiosInstance.get("/slot-requests", {
        params: { 
          page, 
          limit, 
          search, 
          status,
          include: "vehicle,user" 
        },
      });
      return handleApiResponse(response);
    },
  });

  const createSlotRequest = useMutation({
    mutationFn: async (requestData: SlotRequestFormData) => {
      const response = await axiosInstance.post('/slot-requests', requestData);
      return handleApiResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slotRequests'] });
      toast.success('Slot request submitted successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to submit slot request');
    }
  });

  const updateSlotRequest = useMutation({
    mutationFn: async ({ id, requestData }: { id: string; requestData: Partial<SlotRequest> }) => {
      const response = await axiosInstance.patch(`/slot-requests/${id}`, requestData);
      return handleApiResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slotRequests'] });
      toast.success('Slot request updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update slot request');
    }
  });

  const deleteSlotRequest = useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.delete(`/slot-requests/${id}`);
      return handleApiResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slotRequests'] });
      toast.success('Slot request deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete slot request');
    }
  });

  const approveSlotRequest = useMutation({
    mutationFn: async ({ id, slotId }: { id: string; slotId: string }) => {
      if (!slotId) {
        throw new Error('Slot ID is required for approval');
      }
      const response = await axiosInstance.put(`/slot-requests/${id}/approve`, { slotId });
      return handleApiResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slotRequests'] });
      toast.success('Slot request approved successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to approve slot request');
    }
  });

  const rejectSlotRequest = useMutation({
    mutationFn: async ({ id, rejectionReason }: { id: string; rejectionReason: string }) => {
      const response = await axiosInstance.put(`/slot-requests/${id}/reject`, { rejectionReason });
      return handleApiResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slotRequests'] });
      toast.success('Slot request rejected successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to reject slot request');
    }
  });

  return {
    requests: data?.items as SlotRequest[] || [],
    pagination: {
      total: data?.total || 0,
      page: data?.page || 1,
      limit: data?.limit || 10,
      totalPages: data?.totalPages || 1
    },
    isLoading,
    error,
    createSlotRequest,
    updateSlotRequest,
    deleteSlotRequest,
    approveSlotRequest,
    rejectSlotRequest
  };
} 