import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

const api = axios.create({
  baseURL: API_BASE_URL,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses by attempting token refresh
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      // If delete-account is unauthorized, just logout without retrying
      if (originalRequest?.url?.includes("/api/auth/delete/")) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.dispatchEvent(new Event("unauthorized"));
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch((err) => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refresh");
      if (refreshToken) {
        return new Promise((resolve, reject) => {
          axios.post(`${API_BASE_URL}/api/auth/refresh/`, {
            refresh: refreshToken,
          }).then((res) => {
            const { access } = res.data;
            localStorage.setItem("access", access);
            api.defaults.headers.common.Authorization = `Bearer ${access}`;
            processQueue(null, access);
            resolve(api(originalRequest));
          }).catch((err) => {
            processQueue(err, null);
            // Clear stored tokens on refresh failure
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            // Dispatch event to trigger logout in App
            window.dispatchEvent(new Event("unauthorized"));
            reject(err);
          }).finally(() => {
            isRefreshing = false;
          });
        });
      } else {
        // No refresh token, logout
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.dispatchEvent(new Event("unauthorized"));
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// ==============================================
// POLICY API
// ==============================================

export interface Policy {
  id: number;
  name: string;
  description: string;
  is_custom: boolean;
  is_active: boolean;
  rules: string[];
  created_at: string;
  updated_at: string;
}

export interface CreatePolicyData {
  name: string;
  description?: string;
  rules: string[];
}

export const policyApi = {
  // Get all policies for the current user
  getAll: () => api.get<Policy[]>("/api/policies/"),
  
  // Get a specific policy by ID
  getById: (id: number) => api.get<Policy>(`/api/policies/${id}/`),
  
  // Create a new policy
  create: (data: CreatePolicyData) => api.post<Policy>("/api/policies/", data),
  
  // Update an existing policy
  update: (id: number, data: Partial<CreatePolicyData>) => 
    api.patch<Policy>(`/api/policies/${id}/`, data),
  
  // Delete a policy
  delete: (id: number) => api.delete(`/api/policies/${id}/`),
  
  // Activate a policy (sets it as the active policy)
  activate: (id: number) => api.post<Policy>(`/api/policies/${id}/activate/`),
  
  // Get the currently active policy
  getActive: () => api.get<Policy>("/api/policies/active/"),
};


// ==============================================
// HISTORY API
// ==============================================

export interface FileHistory {
  id: number;
  file_name: string;
  file_type: string;
  file_size: number;
  file_size_display: string;
  operation: 'analyze' | 'clean' | 'analyze_and_clean';
  mode: 'guest' | 'internal' | 'external' | 'gdpr' | 'forensic';
  status: 'Cleaned' | 'Analyzed' | 'Failed';
  metadata_count: number;
  risk_level: 'Low' | 'Medium' | 'High' | null;
  metadata_details: any;
  policy_name: string;
  created_at: string;
  date: string;
  time: string;
}

export const historyApi = {
  // Get all history for the current user
  getAll: () => api.get<FileHistory[]>("/api/history/"),
  
  // Get a specific history record by ID
  getById: (id: number) => api.get<FileHistory>(`/api/history/${id}/`),
  
  // Clear all history for the current user
  clear: () => api.delete("/api/history/clear/"),
};
