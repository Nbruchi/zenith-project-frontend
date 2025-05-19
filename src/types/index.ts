// Auth types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Vehicle types
export interface Vehicle {
  id: string;
  userId: string;
  plateNumber: string;
  vehicleType: VehicleType;
  size: Size;
  isParked: boolean;
  parkingSlotId?: string;
  attributes?: {
    color?: string;
    model?: string;
    [key: string]: any;
  };
  User?: User;
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
  size: Size;
  vehicleType: VehicleType;
  location: Location;
  status: SlotStatus;
  createdAt: string;
  updatedAt: string;
  assignedTo?: {
    userId: string;
    vehicleId: string;
    vehiclePlate: string;
  };
}

export interface ParkingSlotsState {
  slots: ParkingSlot[];
  isLoading: boolean;
  error: string | null;
  pagination: PaginationState;
}

// Slot request types
export interface SlotRequest {
  id: string;
  userId: string;
  userName: string;
  vehicleId: string;
  vehiclePlate: string;
  vehicleType: string;
  preferredLocation?: Location;
  startDate?: string;
  endDate?: string;
  status: RequestStatus;
  notes?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  assignedSlot?: {
    id: string;
    slotNumber: string;
  };
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

export interface UpdateProfileDto {
  name: string;
  email: string;
}

export interface UpdatePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface VehicleFormData {
  plateNumber: string;
  vehicleType: VehicleType;
  size: Size;
  color: string;
  model: string;
}

export interface SlotFormData {
  slotNumber: string;
  size: Size;
  vehicleType: VehicleType;
  location: Location;
}

export interface SlotRequestFormData {
  vehicleId: string;
  userId: string;
  preferredLocation?: Location;
  startDate?: string;
  endDate?: string;
  notes?: string;
}

export interface BulkSlotCreationFormData {
  startNumber: number;
  count: number;
  prefix: string;
  size: Size;
  vehicleType: VehicleType;
  location: Location;
}

export enum VehicleType {
  CAR = 'CAR',
  MOTORCYCLE = 'MOTORCYCLE',
  TRUCK = 'TRUCK'
}

export enum Size {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE'
}

export enum SlotStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  RESERVED = 'RESERVED',
  MAINTENANCE = 'MAINTENANCE'
}

export enum RequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum Location {
  NORTH = 'NORTH',
  SOUTH = 'SOUTH',
  EAST = 'EAST',
  WEST = 'WEST'
}
