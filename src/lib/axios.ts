import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/v1";

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor to add the auth token to every request
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

// Add a response interceptor to handle token expiration and refresh
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If token expired (401 error)
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to get a new token
                const response = await axiosInstance.get("/auth/refresh-token");
                const { token } = response.data.data;

                // Update storage and headers
                localStorage.setItem("token", token);
                axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

                // Retry the original request
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // If refresh fails, logout
                localStorage.removeItem("token");
                delete axiosInstance.defaults.headers.common["Authorization"];
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
