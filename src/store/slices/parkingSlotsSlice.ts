
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ParkingSlot, ParkingSlotsState, SlotFormData, BulkSlotCreationFormData } from '@/types';
import { slotService } from '@/lib/services';
import { toast } from 'sonner';

const initialState: ParkingSlotsState = {
  slots: [],
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
export const fetchParkingSlots = createAsyncThunk(
  'parkingSlots/fetchParkingSlots',
  async ({ page = 1, limit = 10, search = '' }: { page?: number; limit?: number; search?: string }, { rejectWithValue }) => {
    try {
      const response = await slotService.getSlots(page, limit, search);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch parking slots');
    }
  }
);

export const createParkingSlot = createAsyncThunk(
  'parkingSlots/createParkingSlot',
  async (slotData: SlotFormData, { rejectWithValue }) => {
    try {
      const response = await slotService.createSlot({ slotSize: slotData.size });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create parking slot');
    }
  }
);

export const updateParkingSlot = createAsyncThunk(
  'parkingSlots/updateParkingSlot',
  async ({ id, slotData }: { id: string; slotData: Partial<SlotFormData> }, { rejectWithValue }) => {
    try {
      const updateData: any = {};
      if (slotData.size) updateData.slotSize = slotData.size;
      if (slotData.status) updateData.slotStatus = slotData.status;

      const response = await slotService.updateSlot(id, updateData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update parking slot');
    }
  }
);

export const deleteParkingSlot = createAsyncThunk(
  'parkingSlots/deleteParkingSlot',
  async (id: string, { rejectWithValue }) => {
    try {
      await slotService.deleteSlot(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete parking slot');
    }
  }
);

export const createBulkParkingSlots = createAsyncThunk(
  'parkingSlots/createBulkParkingSlots',
  async (bulkSlotData: BulkSlotCreationFormData, { rejectWithValue }) => {
    try {
      const response = await slotService.createManySlots({
        numberOfSlots: bulkSlotData.count,
        slotSize: bulkSlotData.size
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create bulk parking slots');
    }
  }
);

// Parking slots slice
const parkingSlotsSlice = createSlice({
  name: 'parkingSlots',
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
    // Fetch parking slots
    builder.addCase(fetchParkingSlots.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchParkingSlots.fulfilled, (state, action) => {
      state.isLoading = false;
      state.slots = action.payload.items;
      state.pagination = {
        ...state.pagination,
        totalPages: action.payload.totalPages,
        totalItems: action.payload.totalItems,
        currentPage: action.payload.currentPage,
        itemsPerPage: action.payload.itemsPerPage,
      };
    });
    builder.addCase(fetchParkingSlots.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(`Failed to fetch parking slots: ${action.payload}`);
    });

    // Create parking slot
    builder.addCase(createParkingSlot.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createParkingSlot.fulfilled, (state) => {
      state.isLoading = false;
      toast.success('Parking slot created successfully');
    });
    builder.addCase(createParkingSlot.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(`Failed to create parking slot: ${action.payload}`);
    });

    // Update parking slot
    builder.addCase(updateParkingSlot.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateParkingSlot.fulfilled, (state, action: PayloadAction<ParkingSlot>) => {
      state.isLoading = false;
      const index = state.slots.findIndex((slot) => slot.id === action.payload.id);
      if (index !== -1) {
        state.slots[index] = action.payload;
      }
      toast.success('Parking slot updated successfully');
    });
    builder.addCase(updateParkingSlot.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(`Failed to update parking slot: ${action.payload}`);
    });

    // Delete parking slot
    builder.addCase(deleteParkingSlot.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteParkingSlot.fulfilled, (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.slots = state.slots.filter((slot) => slot.id !== action.payload);
      toast.success('Parking slot deleted successfully');
    });
    builder.addCase(deleteParkingSlot.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(`Failed to delete parking slot: ${action.payload}`);
    });

    // Create bulk parking slots
    builder.addCase(createBulkParkingSlots.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createBulkParkingSlots.fulfilled, (state) => {
      state.isLoading = false;
      toast.success('Bulk parking slots created successfully');
    });
    builder.addCase(createBulkParkingSlots.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
      toast.error(`Failed to create bulk parking slots: ${action.payload}`);
    });
  },
});

export const { setSearchQuery, setCurrentPage } = parkingSlotsSlice.actions;
export default parkingSlotsSlice.reducer;
