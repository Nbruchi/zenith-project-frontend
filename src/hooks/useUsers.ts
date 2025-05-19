import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance, { handleApiResponse } from '@/lib/axios';
import { User, UpdateProfileDto, UpdatePasswordDto } from '@/types';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export function useUsers(page = 1, limit = 10, search = "") {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["users", page, limit, search],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/users", {
          params: { page, limit, search },
        });
        return handleApiResponse(response);
      } catch (error: any) {
        if (error.response?.status === 401) {
          // Don't throw the error, just return empty data
          return { items: [], total: 0, page: 1, limit: 10, totalPages: 1 };
        }
        throw error;
      }
    },
    enabled: user?.role === 'ADMIN',
    retry: false,
  });

  const updateProfile = useMutation({
    mutationFn: async (profileData: UpdateProfileDto) => {
      const response = await axiosInstance.put('/users/profile', profileData);
      return handleApiResponse(response);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['currentUser'], data);
      toast.success('Profile updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update profile');
    }
  });

  const updatePassword = useMutation({
    mutationFn: async (passwordData: UpdatePasswordDto) => {
      const response = await axiosInstance.put('/users/password', passwordData);
      return handleApiResponse(response);
    },
    onSuccess: () => {
      toast.success('Password updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update password');
    }
  });

  return {
    users: data?.items as User[] || [],
    pagination: {
      total: data?.total || 0,
      page: data?.page || 1,
      limit: data?.limit || 10,
      totalPages: data?.totalPages || 1
    },
    isLoading,
    error,
    updateProfile,
    updatePassword
  };
} 