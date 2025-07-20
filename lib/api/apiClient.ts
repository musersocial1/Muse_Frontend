import { API_CONFIG, STORAGE_CONFIG } from "@/config/app";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import * as SecureStore from "expo-secure-store";

// Storage utility to handle  SecureStore
const storage = {
  async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error("SecureStore get error:", error);
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error("SecureStore set error:", error);
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error("SecureStore remove error:", error);
    }
  },
};

// Token manager
export const tokenManager = {
  async getToken(): Promise<string | null> {
    return await storage.getItem(STORAGE_CONFIG.keys.AUTH_TOKEN);
  },

  async setToken(token: string): Promise<void> {
    await storage.setItem(STORAGE_CONFIG.keys.AUTH_TOKEN, token);
  },

  async getRefreshToken(): Promise<string | null> {
    return await storage.getItem(STORAGE_CONFIG.keys.REFRESH_TOKEN);
  },

  async setRefreshToken(token: string): Promise<void> {
    await storage.setItem(STORAGE_CONFIG.keys.REFRESH_TOKEN, token);
  },

  async removeTokens(): Promise<void> {
    await Promise.all([
      storage.removeItem(STORAGE_CONFIG.keys.AUTH_TOKEN),
      storage.removeItem(STORAGE_CONFIG.keys.REFRESH_TOKEN),
    ]);
  },
};

// API Client class
export class ApiClient {
  private instance: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];
  static authErrorHandler: (() => Promise<void>) | null = null;

  static setAuthErrorHandler(handler: () => Promise<void>) {
    ApiClient.authErrorHandler = handler;
  }

  constructor() {
    this.instance = axios.create({
      baseURL: API_CONFIG.baseURL,
      timeout: API_CONFIG.timeout,
      headers: API_CONFIG.headers,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.instance.interceptors.request.use(
      async (config) => {
        const token = await tokenManager.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve) => {
              this.refreshSubscribers.push((token: string) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(this.instance(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = await tokenManager.getRefreshToken();
            if (refreshToken) {
              const response = await this.refreshTokenRequest(refreshToken);
              const newToken = response.data.token;

              await tokenManager.setToken(newToken);
              if (response.data.refreshToken) {
                await tokenManager.setRefreshToken(response.data.refreshToken);
              }

              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              this.refreshSubscribers.forEach((cb) => cb(newToken));
              this.refreshSubscribers = [];

              return this.instance(originalRequest);
            }
          } catch (refreshError) {
            await tokenManager.removeTokens();

            if (ApiClient.authErrorHandler) {
              await ApiClient.authErrorHandler();
            }

            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        if (
          (error.response?.status === 401 || error.response?.status === 403) &&
          !originalRequest._retry
        ) {
          if (ApiClient.authErrorHandler) {
            await ApiClient.authErrorHandler();
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private async refreshTokenRequest(refreshToken: string) {
    return axios.post(`${API_CONFIG.baseURL}/auth/refresh`, {
      refreshToken,
    });
  }

  // Generic request methods
  async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.get<T>(url, config);
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.post<T>(url, data, config);
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.put<T>(url, data, config);
  }

  async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.delete<T>(url, config);
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.patch<T>(url, data, config);
  }

  getAxiosInstance(): AxiosInstance {
    return this.instance;
  }
}

export const apiClient = new ApiClient();
export default apiClient;
