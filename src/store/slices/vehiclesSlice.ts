
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Vehicle, VehiclesState, VehicleFormData } from '@/types';
import { vehicleService } from '@/lib/services';
import { toast } from 'sonner';

const initialState: VehiclesState = {
  vehicles: [],
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 10,
    searchQuery: '',
  },
};

// Async thunks
export const fetchVehicles = createAsyncThunk(
  'vehicles/fetchVehicles',
  async ({ page = 1, limit = 10, search = '' }: { page?: number; limit?: number; search?: string }, { rejectWithValue }) => {
    try {
      const response = await vehicleService.getVehicles(page, limit, search);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch vehicles');
    }
  }
);

export const createVehicle = createAsyncThunk(
  'vehicles/createVehicle',
  async (vehicleData: VehicleFormData, { rejectWithValue }) => {
    try {
      const response = await vehicleService.createVehicle({
        vehiclePlateNumber: vehicleData.plateNumber,
        vehicleType: vehicleData.vehicleType,
        vehicleColor: vehicleData.color || '',
        vehicleBrand: vehicleData.model || '',
        vehicleModel: vehicleData.model || '',
        vehicleYear: ''
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create vehicle');
    }
  }
);

export const updateVehicle = createAsyncThunk(
  'vehicles/updateVehicle',
  async ({ id, vehicleData }: { id: string; vehicleData: Partial<VehicleFormData> }, { rejectWithValue }) => {
    try {
      const updateData: any = {};
      if (vehicleData.plateNumber) updateData.vehiclePlateNumber = vehicleData.plateNumber;
      if (vehicleData.vehicleType) updateData.vehicleType = vehicleData.vehicleType;
      if (vehicleData.color) updateData.vehicleColor = vehicleData.color;
      if (vehicleData.model) {
        updateData.vehicleBrand = vehicleData.model;
        updateData.vehicleModel = vehicleData.model;
      }

      const response = await vehicleService.updateVehicle(id, updateData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update vehicle');
    }
  }
);

export const deleteVehicle = createAsyncThunk(
  'vehicles/deleteVehicle',
  async (id: string, { rejectWithValue }) => {
    try {
      await vehicleService.deleteVehicle(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete vehicle');
    }
  }
);

// Vehicles slice
const vehiclesSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.pagination.searchQuery = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch vehicles
    builder.addCase(fetchVehicles.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchVehicles.fulfilled, (state, action) => {
      state.isLoading = false;
      state.vehicles = action.payload.items;
      state.pagination = {
        ...state.pagination,
        totalPages: action.payload.totalPages,
        totalItems: action.payload.totalItems,
        currentPage: action.payload.currentPage,
        itemsPerPage: action.payload.itemsPerPage,
      };
    });
    builder.addCase(fetchVehicles.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(`Failed to fetch vehicles: ${action.payload}`);
    });

    // Create vehicle
    builder.addCase(createVehicle.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createVehicle.fulfilled, (state, action: PayloadAction<Vehicle>) => {
      state.isLoading = false;
      // Instead of updating state, we'll refetch to get the accurate paginated data
      toast.success('Vehicle created successfully');
    });
    builder.addCase(createVehicle.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(`Failed to create vehicle: ${action.payload}`);
    });

    // Update vehicle
    builder.addCase(updateVehicle.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateVehicle.fulfilled, (state, action: PayloadAction<Vehicle>) => {
      state.isLoading = false;
      const index = state.vehicles.findIndex((v) => v.id === action.payload.id);
      if (index !== -1) {
        state.vehicles[index] = action.payload;
      }
      toast.success('Vehicle updated successfully');
    });
    builder.addCase(updateVehicle.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(`Failed to update vehicle: ${action.payload}`);
    });

    // Delete vehicle
    builder.addCase(deleteVehicle.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteVehicle.fulfilled, (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.vehicles = state.vehicles.filter((v) => v.id !== action.payload);
      toast.success('Vehicle deleted successfully');
    });
    builder.addCase(deleteVehicle.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(`Failed to delete vehicle: ${action.payload}`);
    });
  },
});

export const { setSearchQuery, setCurrentPage } = vehiclesSlice.actions;
export default vehiclesSlice.reducer;
