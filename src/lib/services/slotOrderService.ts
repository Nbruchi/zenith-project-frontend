import axiosInstance from '@/lib/axios';

/**
 * Slot Order service for interacting with the slot-orders endpoints
 */
export const slotOrderService = {
  /**
   * Get all slot orders with pagination
   * @param page - The page number
   * @param limit - The number of items per page
   * @returns The paginated slot orders
   */
  getSlotOrders: async (page: number = 1, limit: number = 10) => {
    const response = await axiosInstance.get('/slot-requests/', {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Get slot orders for a specific user
   * @param userId - The user ID
   * @param page - The page number
   * @param limit - The number of items per page
   * @returns The paginated slot orders for the user
   */
  getUserSlotOrders: async (userId: string, page: number = 1, limit: number = 10) => {
    const response = await axiosInstance.get(`/slot-requests/user/${userId}`, {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Get a slot order by ID
   * @param id - The slot order ID
   * @returns The slot order
   */
  getSlotOrderById: async (id: string) => {
    const response = await axiosInstance.get(`/slot-requests/${id}`);
    return response.data;
  },

  /**
   * Create a new slot order
   * @param orderData - The slot order data
   * @returns The created slot order
   */
  createSlotOrder: async (orderData: { vehiclePlateNumber: string; slotId?: string; }) => {
    const response = await axiosInstance.post('/slot-requests/', orderData);
    return response.data;
  },

  /**
   * Update a slot order status
   * @param id - The slot order ID
   * @param status - The new status
   * @returns The updated slot order
   */
  updateSlotOrderStatus: async (id: string, status: string) => {
    const response = await axiosInstance.patch(`/slot-requests/${id}/status`, { status });
    return response.data;
  },
};