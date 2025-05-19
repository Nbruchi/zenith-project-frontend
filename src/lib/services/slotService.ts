import axiosInstance from '@/lib/axios';
import { VehicleSize } from '@/types';

/**
 * Slot service for interacting with the slots endpoints
 */
export const slotService = {
  /**
   * Get all slots with pagination and filters
   * @param page - The page number
   * @param limit - The number of items per page
   * @param search - The search query
   * @param slotSize - Filter by slot size
   * @param slotStatus - Filter by slot status
   * @returns The paginated slots
   */
  getSlots: async (
    page: number = 1,
    limit: number = 10,
    search?: string,
    slotSize?: string,
    slotStatus?: string
  ) => {
    const params: Record<string, string> = { page: String(page), limit: String(limit) };
    if (search) params.search = search;
    if (slotSize) params.slotSize = slotSize;
    if (slotStatus) params.status = slotStatus;
    const response = await axiosInstance.get('/parking-slots/', { params });
    return response.data;
  },

  /**
   * Get a slot by ID
   * @param id - The slot ID
   * @returns The slot
   */
  getSlotById: async (id: string) => {
    const response = await axiosInstance.get(`/parking-slots/${id}`);
    return response.data;
  },

  /**
   * Create a new slot
   * @param slotData - The slot data
   * @returns The created slot
   */
  createSlot: async (slotData: { slotSize: string }) => {
    const response = await axiosInstance.post('/parking-slots/', slotData);
    return response.data;
  },

  /**
   * Create multiple slots
   * @param slotData - The slot data
   * @returns The created slots
   */
  createManySlots: async (slotData: { numberOfSlots: number; slotSize: string }) => {
    const response = await axiosInstance.post('/parking-slots/many', slotData);
    return response.data;
  },

  /**
   * Update a slot
   * @param id - The slot ID
   * @param slotData - The slot data to update
   * @returns The updated slot
   */
  updateSlot: async (
    id: string,
    slotData: {
      slotSize?: string;
      slotStatus?: string;
    }
  ) => {
    const response = await axiosInstance.patch(`/parking-slots/${id}`, slotData);
    return response.data;
  },

  /**
   * Delete a slot
   * @param id - The slot ID
   * @returns The response data
   */
  deleteSlot: async (id: string) => {
    const response = await axiosInstance.delete(`/parking-slots/${id}`);
    return response.data;
  },
};