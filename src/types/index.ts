
// Auth types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Vehicle types
export type VehicleSize = 'small' | 'medium' | 'large';
export type VehicleType = 'car' | 'motorcycle' | 'truck';

export interface Vehicle {
  id: string;
  userId: string;
  plateNumber: string;
  vehicleType: VehicleType;
  size: VehicleSize;
  attributes: {
    color?: string;
    model?: string;
    [key: string]: any;
  };
}

export interface VehiclesState {
  vehicles: Vehicle[];
  isLoading: boolean;
  error: string | null;
  pagination: PaginationState;
}

// Parking slot types
export interface ParkingSlot {
  id: string;
  slotNumber: string;
  size: VehicleSize;
  vehicleType: VehicleType;
  status: 'available' | 'unavailable';
  location: 'north' | 'south' | 'east' | 'west';
}

export interface ParkingSlotsState {
  slots: ParkingSlot[];
  isLoading: boolean;
  error: string | null;
  pagination: PaginationState;
}

// Slot request types
export type RequestStatus = 'pending' | 'approved' | 'rejected';

export interface SlotRequest {
  id: string;
  userId: string;
  vehicleId: string;
  slotId?: string;
  requestStatus: RequestStatus;
  createdAt: string;
  updatedAt: string;
  slotNumber?: string;
  vehicle?: Vehicle;
}

export interface SlotRequestsState {
  requests: SlotRequest[];
  isLoading: boolean;
  error: string | null;
  pagination: PaginationState;
}

// Pagination types
export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  searchQuery: string;
}

// Log types
export interface Log {
  id: string;
  userId: string;
  action: string;
  timestamp: string;
}

export interface LogsState {
  logs: Log[];
  isLoading: boolean;
  error: string | null;
  pagination: PaginationState;
}

// User management types (for admin)
export interface UsersState {
  users: User[];
  isLoading: boolean;
  error: string | null;
  pagination: PaginationState;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface VehicleFormData {
  plateNumber: string;
  vehicleType: VehicleType;
  size: VehicleSize;
  color?: string;
  model?: string;
}

export interface SlotFormData {
  slotNumber: string;
  size: VehicleSize;
  vehicleType: VehicleType;
  location: 'north' | 'south' | 'east' | 'west';
}

export interface SlotRequestFormData {
  vehicleId: string;
}

export interface BulkSlotCreationFormData {
  startNumber: number;
  count: number;
  size: VehicleSize;
  vehicleType: VehicleType;
  location: 'north' | 'south' | 'east' | 'west';
}
