import axios from "axios";

const API_BASE_URL = "http://localhost:8282/api"; // local URL

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add token to requests if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// API methods
export const apiService = {
    // Save auth data
    saveAuthData: (token, roles) => {
        localStorage.setItem("token", token);
        localStorage.setItem("roles", JSON.stringify(roles));
    },

    // Logout
    logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("roles");
    },

    // Check role
    hasRole(role) {
        const roles = localStorage.getItem("roles");
        return roles ? JSON.parse(roles).includes(role) : false;
    },

    isAuthenticated: () => localStorage.getItem("token") !== null,

    isAdmin() {
        return this.hasRole("ADMIN");
    },

    isCustomer() {
        return this.hasRole("CUSTOMER");
    },

    isAuditor() {
        return this.hasRole("AUDITOR");
    },

    // Auth API
    login: (body) => api.post("/auth/login", body),

    register: (body) => api.post("/auth/register", body),

    forgetPassword: (body) => api.post("/auth/forgot-password", body),

    resetPassword: (body) => api.post("/auth/reset-password", body),

    // User API
    getMyProfile: () => api.get("/users/me"),

    updatePassword: (oldPassword, newPassword) =>
        api.put("/users/update-password", {
            oldPassword,
            newPassword,
        }),

    uploadProfilePicture: (file) => {
        const formData = new FormData();
        formData.append("file", file);

        return api.put("/users/profile-picture", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },

    // Account API
    getMyAccounts: () => api.get("/accounts/me"),

    makeTransfer: (transferData) => api.post("/transactions", transferData),

    makeDeposit: (depositData) => api.post("/transactions", depositData),

    // Transactions API
    getTransactions: (accountNumber, page = 0, size = 10) =>
        api.get(`/transactions/${accountNumber}?page=${page}&size=${size}`),

    // Auditor API
    getSystemTotals: () => api.get("/audit/totals"),

    findUserByEmail: (email) => api.get(`/audit/users?email=${email}`),

    findAccountByAccountNumber: (accountNumber) =>
        api.get(`/audit/accounts?accountNumber=${accountNumber}`),

    getTransactionsByAccountNumber: (accountNumber) =>
        api.get(`/audit/transactions/by-account?accountNumber=${accountNumber}`),

    getTransactionById: (id) =>
        api.get(`/audit/transactions/by-id?id=${id}`),
};

export default api;
