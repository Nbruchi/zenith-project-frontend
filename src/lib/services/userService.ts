import axiosInstance from '@/lib/axios';
import { User } from '@/types';

/**
 * User service for interacting with the user endpoints
 */
export const userService = {
  /**
   * Get all users with pagination and search
   * @param page - The page number
   * @param limit - The number of items per page
   * @param search - The search query
   * @returns The paginated users
   */
  getUsers: async (page: number = 1, limit: number = 10, search?: string) => {
    const response = await axiosInstance.get('/user/', {
      params: { page, limit, search },
    });
    return response.data;
  },

  /**
   * Get a user by ID
   * @param id - The user ID
   * @returns The user
   */
  getUserById: async (id: string) => {
    const response = await axiosInstance.get(`/user/${id}`);
    return response.data;
  },

  /**
   * Create a new user
   * @param userData - The user data
   * @returns The created user
   */
  createUser: async (userData: {
    name: string;
    email: string;
    password: string;
  }) => {
    const response = await axiosInstance.post('/user/', userData);
    return response.data;
  },

  /**
   * Update a user
   * @param id - The user ID
   * @param userData - The user data to update
   * @returns The updated user
   */
  updateUser: async (
    id: string,
    userData: {
      name?: string;
      email?: string;
    }
  ) => {
    const response = await axiosInstance.put(`/user/${id}`, userData);
    return response.data;
  },

  /**
   * Delete a user
   * @param id - The user ID
   * @returns The response data
   */
  deleteUser: async (id: string) => {
    const response = await axiosInstance.delete(`/user/${id}`);
    return response.data;
  },
};