import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, LoginFormData, RegisterFormData, User } from "@/types";
import { authService } from "@/lib/services";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";

const initialState: AuthState = {
    user: null,
    token: localStorage.getItem("token"),
    isAuthenticated: !!localStorage.getItem("token"),
    isLoading: false,
    error: null,
};

// authSlice.ts
export const login = createAsyncThunk(
    "auth/login",
    async (credentials: LoginFormData, { rejectWithValue }) => {
        try {
            const response = await authService.login(credentials);
            const { token, user } = response;

            // Store token in localStorage
            localStorage.setItem("token", token);

            // Update axios headers
            delete axiosInstance.defaults.headers.common["Authorization"];
            axiosInstance.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${token}`;

            return { token, user };
        } catch (error: any) {
            // Clear any existing token if login fails
            localStorage.removeItem("token");
            delete axiosInstance.defaults.headers.common["Authorization"];

            // Handle undefined error.response
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data ||
                "Login failed";
            return rejectWithValue(errorMessage);
        }
    }
);

export const register = createAsyncThunk(
    "auth/register",
    async (userData: RegisterFormData, { rejectWithValue }) => {
        try {
            const response = await authService.register(userData);
            const { token, user } = response;
            localStorage.setItem("token", token);
            return { token, user };
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Registration failed"
            );
        }
    }
);

export const logout = createAsyncThunk("auth/logout", async () => {
    localStorage.removeItem("token");
    return null;
});

export const fetchCurrentUser = createAsyncThunk(
    "auth/fetchCurrentUser",
    async (_, { rejectWithValue }) => {
        try {
            const response = await authService.getCurrentUser();
            return response;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch user"
            );
        }
    }
);

// Auth slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Login
        builder.addCase(login.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(
            login.fulfilled,
            (state, action: PayloadAction<{ token: string; user: User }>) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.token = action.payload.token;
                state.user = action.payload.user;
                toast.success("Login successful");
            }
        );
        builder.addCase(login.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
            toast.error(`Login failed: ${action.payload}`);
        });

        // Register
        builder.addCase(register.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(
            register.fulfilled,
            (state, action: PayloadAction<{ token: string; user: User }>) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.token = action.payload.token;
                state.user = action.payload.user;
                toast.success("Registration successful");
            }
        );
        builder.addCase(register.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload as string;
            toast.error(`Registration failed: ${action.payload}`);
        });

        // Logout
        builder.addCase(logout.fulfilled, (state) => {
            state.isAuthenticated = false;
            state.token = null;
            state.user = null;
            toast.info("Logged out successfully");
        });

        // Fetch current user
        builder.addCase(fetchCurrentUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(
            fetchCurrentUser.fulfilled,
            (state, action: PayloadAction<User>) => {
                state.isLoading = false;
                state.user = action.payload;
            }
        );
        builder.addCase(fetchCurrentUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isAuthenticated = false;
            state.token = null;
            state.user = null;
            state.error = action.payload as string;
        });
    },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
