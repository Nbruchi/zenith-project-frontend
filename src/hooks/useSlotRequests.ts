import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/lib/axios';
import { SlotRequest } from '@/types';
import { toast } from 'sonner';

export function useSlotRequests(page = 1, limit = 10, search = "") {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["slot-requests", page, limit, search],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/slot-requests", {
        params: { page, limit, search },
      });
      return data;
    },
  });

  const deleteRequest = useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.delete(`/slot-requests/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slotRequests'] });
      toast.success('Request deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete request');
    }
  });

  const approveRequest = useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.patch(`/slot-requests/${id}/approve`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slotRequests'] });
      toast.success('Request approved successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to approve request');
    }
  });

  const rejectRequest = useMutation({
    mutationFn: async (id: string) => {
      const response = await axiosInstance.patch(`/slot-requests/${id}/reject`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slotRequests'] });
      toast.success('Request rejected successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to reject request');
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
    deleteRequest,
    approveRequest,
    rejectRequest
  };
} 