import axiosInstance from '@/lib/axios';

/**
 * Vehicle service for interacting with the vehicles endpoints
 */
export const vehicleService = {
  /**
   * Get all vehicles with pagination and filters
   * @param page - The page number
   * @param limit - The number of items per page
   * @param search - The search query
   * @param year - Filter by vehicle year
   * @returns The paginated vehicles
   */
  getVehicles: async (
    page: number = 1,
    limit: number = 10,
    search?: string,
    year?: string
  ) => {
    const response = await axiosInstance.get('/vehicles/', {
      params: { page, limit, search, year },
    });
    return response.data;
  },

  /**
   * Get vehicles for the current user
   * @returns The user's vehicles
   */
  getUserVehicles: async () => {
    const response = await axiosInstance.get('/vehicles/user');
    return response.data;
  },

  /**
   * Get a vehicle by ID
   * @param id - The vehicle ID
   * @returns The vehicle
   */
  getVehicleById: async (id: string) => {
    const response = await axiosInstance.get(`/vehicles/${id}`);
    return response.data;
  },

  /**
   * Get a vehicle by plate number
   * @param plateNumber - The vehicle plate number
   * @returns The vehicle
   */
  getVehicleByPlateNumber: async (plateNumber: string) => {
    const response = await axiosInstance.get(`/vehicles/plate_number/${plateNumber}`);
    return response.data;
  },

  /**
   * Create a new vehicle
   * @param vehicleData - The vehicle data
   * @returns The created vehicle
   */
  createVehicle: async (vehicleData: {
    vehiclePlateNumber: string;
    vehicleType: string;
    vehicleColor: string;
    vehicleBrand: string;
    vehicleModel: string;
    vehicleYear: string;
  }) => {
    const response = await axiosInstance.post('/vehicles/', vehicleData);
    return response.data;
  },

  /**
   * Update a vehicle
   * @param id - The vehicle ID
   * @param vehicleData - The vehicle data to update
   * @returns The updated vehicle
   */
  updateVehicle: async (
    id: string,
    vehicleData: {
      vehiclePlateNumber?: string;
      vehicleType?: string;
      vehicleColor?: string;
      vehicleBrand?: string;
      vehicleModel?: string;
      vehicleYear?: string;
    }
  ) => {
    const response = await axiosInstance.patch(`/vehicles/${id}`, vehicleData);
    return response.data;
  },

  /**
   * Delete a vehicle
   * @param id - The vehicle ID
   * @returns The response data
   */
  deleteVehicle: async (id: string) => {
    const response = await axiosInstance.delete(`/vehicles/${id}`);
    return response.data;
  },
};