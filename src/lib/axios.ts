import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/v1";

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true
});

// Utility function to handle API response structure
export const handleApiResponse = (response: any) => {
    if (response.data && response.data.data) {
        return response.data.data;
    }
    return response.data;
};

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        // If token expired (401 error)
        if (error.response?.status === 401) {
            const currentPath = window.location.pathname;
            // Only remove token and redirect if we're not in a protected route
            if (!currentPath.startsWith('/dashboard') && !currentPath.includes('/login')) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
