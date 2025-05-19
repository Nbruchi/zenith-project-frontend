
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { SlotRequest, SlotRequestsState, SlotRequestFormData } from '@/types';
import { slotOrderService } from '@/lib/services';
import { toast } from 'sonner';

const initialState: SlotRequestsState = {
  requests: [],
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
export const fetchSlotRequests = createAsyncThunk(
  'slotRequests/fetchSlotRequests',
  async ({ page = 1, limit = 10, search = '' }: { page?: number; limit?: number; search?: string }, { rejectWithValue }) => {
    try {
      const response = await slotOrderService.getSlotOrders(page, limit);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch slot requests');
    }
  }
);

export const createSlotRequest = createAsyncThunk(
  'slotRequests/createSlotRequest',
  async (requestData: SlotRequestFormData, { rejectWithValue }) => {
    try {
      // Get the vehicle plate number from the vehicle ID
      const vehicleResponse = await axiosInstance.get(`/vehicles/${requestData.vehicleId}`);
      const vehiclePlateNumber = vehicleResponse.data.plateNumber;

      const response = await slotOrderService.createSlotOrder({
        slotId: requestData.slotId || '',
        vehiclePlateNumber
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create slot request');
    }
  }
);

export const updateSlotRequest = createAsyncThunk(
  'slotRequests/updateSlotRequest',
  async ({ id, requestData }: { id: string; requestData: { status?: string } }, { rejectWithValue }) => {
    try {
      if (requestData.status) {
        const response = await slotOrderService.updateSlotOrderStatus(id, requestData.status);
        return response;
      }
      return rejectWithValue('Status is required to update a slot request');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update slot request');
    }
  }
);

export const deleteSlotRequest = createAsyncThunk(
  'slotRequests/deleteSlotRequest',
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/slot-requests/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete slot request');
    }
  }
);

export const approveSlotRequest = createAsyncThunk(
  'slotRequests/approveSlotRequest',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/slot-requests/${id}/approve`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to approve slot request');
    }
  }
);

export const rejectSlotRequest = createAsyncThunk(
  'slotRequests/rejectSlotRequest',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/slot-requests/${id}/reject`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reject slot request');
    }
  }
);

// Slot requests slice
const slotRequestsSlice = createSlice({
  name: 'slotRequests',
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
    // Fetch slot requests
    builder.addCase(fetchSlotRequests.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchSlotRequests.fulfilled, (state, action) => {
      state.isLoading = false;
      state.requests = action.payload.items;
      state.pagination = {
        ...state.pagination,
        totalPages: action.payload.totalPages,
        totalItems: action.payload.totalItems,
        currentPage: action.payload.currentPage,
        itemsPerPage: action.payload.itemsPerPage,
      };
    });
    builder.addCase(fetchSlotRequests.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(`Failed to fetch slot requests: ${action.payload}`);
    });

    // Create slot request
    builder.addCase(createSlotRequest.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createSlotRequest.fulfilled, (state) => {
      state.isLoading = false;
      toast.success('Slot request created successfully');
    });
    builder.addCase(createSlotRequest.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(`Failed to create slot request: ${action.payload}`);
    });

    // Update slot request
    builder.addCase(updateSlotRequest.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateSlotRequest.fulfilled, (state, action: PayloadAction<SlotRequest>) => {
      state.isLoading = false;
      const index = state.requests.findIndex((req) => req.id === action.payload.id);
      if (index !== -1) {
        state.requests[index] = action.payload;
      }
      toast.success('Slot request updated successfully');
    });
    builder.addCase(updateSlotRequest.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(`Failed to update slot request: ${action.payload}`);
    });

    // Delete slot request
    builder.addCase(deleteSlotRequest.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteSlotRequest.fulfilled, (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.requests = state.requests.filter((req) => req.id !== action.payload);
      toast.success('Slot request deleted successfully');
    });
    builder.addCase(deleteSlotRequest.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(`Failed to delete slot request: ${action.payload}`);
    });

    // Approve slot request
    builder.addCase(approveSlotRequest.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(approveSlotRequest.fulfilled, (state, action: PayloadAction<SlotRequest>) => {
      state.isLoading = false;
      const index = state.requests.findIndex((req) => req.id === action.payload.id);
      if (index !== -1) {
        state.requests[index] = action.payload;
      }
      toast.success('Slot request approved successfully');
    });
    builder.addCase(approveSlotRequest.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(`Failed to approve slot request: ${action.payload}`);
    });

    // Reject slot request
    builder.addCase(rejectSlotRequest.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(rejectSlotRequest.fulfilled, (state, action: PayloadAction<SlotRequest>) => {
      state.isLoading = false;
      const index = state.requests.findIndex((req) => req.id === action.payload.id);
      if (index !== -1) {
        state.requests[index] = action.payload;
      }
      toast.success('Slot request rejected successfully');
    });
    builder.addCase(rejectSlotRequest.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(`Failed to reject slot request: ${action.payload}`);
    });
  },
});

export const { setSearchQuery, setCurrentPage } = slotRequestsSlice.actions;
export default slotRequestsSlice.reducer;
