import axiosInstance from "@/lib/axios";
import { LoginFormData, RegisterFormData, User } from "@/types";

export const authService = {
    /**
     * Login a user
     * @param credentials - The login credentials
     * @returns The user and token
     */
    login: async (credentials: LoginFormData) => {
        const response = await axiosInstance.post("/auth/login", credentials);
        return response.data;
    },

    /**
     * Register a new user
     * @param userData - The user data
     * @returns The user and token
     */
    register: async (userData: RegisterFormData) => {
        const response = await axiosInstance.post("/auth/register", userData);
        return response.data;
    },

    /**
     * Get the current user
     * @returns The current user
     */
    getCurrentUser: async () => {
        const response = await axiosInstance.get("/user/me");
        return response.data;
    },

    /**
     * Send a password reset email
     * @param email - The email address
     * @returns The response data
     */
    sendResetPasswordEmail: async (email: string) => {
        const response = await axiosInstance.post(
            "/auth/send-reset-password-email",
            { email }
        );
        return response.data;
    },

    /**
     * Reset a password with a token
     * @param token - The reset token
     * @param password - The new password
     * @returns The response data
     */
    resetPassword: async (token: string, password: string) => {
        const response = await axiosInstance.post(
            `/auth/reset-password/${token}`,
            { password }
        );
        return response.data;
    },

    /**
     * Verify an email with a token
     * @param token - The verification token
     * @param email - The email address
     * @returns The response data
     */
    verifyEmail: async (token: string, email: string) => {
        const response = await axiosInstance.post(
            `/auth/verify-email/${token}`,
            { email }
        );
        return response.data;
    },

    /**
     * Send a verification email
     * @param email - The email address
     * @returns The response data
     */
    sendVerificationEmail: async (email: string) => {
        const response = await axiosInstance.post(
            "/auth/send-verification-email",
            { email }
        );
        return response.data;
    },
};
