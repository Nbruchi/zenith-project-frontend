import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/v1";

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor to add the auth token to every request
// Add this to axios configuration
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
                const { token } = response.data;

                // Update storage and headers
                localStorage.setItem("token", token);
                axiosInstance.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${token}`;

                // Retry the original request
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                // If refresh fails, logout
                localStorage.removeItem("token");
                delete axiosInstance.defaults.headers.common["Authorization"];
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// Add a response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const originalRequest = error.config;

        // If the error is due to token expiration (401)
        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry
        ) {
            // Logout the user
            localStorage.removeItem("token");
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
