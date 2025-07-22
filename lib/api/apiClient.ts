import { STORAGE_CONFIG } from "@/config/app";
import { SERVICES_CONFIG } from "@/config/env";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import * as SecureStore from "expo-secure-store";

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
export class ServiceApiClient {
  private instance: AxiosInstance;
  private serviceName: string;
  static authErrorHandler: (() => Promise<void>) | null = null;

  static setAuthErrorHandler(handler: () => Promise<void>) {
    ServiceApiClient.authErrorHandler = handler;
  }

  constructor(serviceName: keyof typeof SERVICES_CONFIG) {
    this.serviceName = serviceName;
    const serviceConfig = SERVICES_CONFIG[serviceName];

    this.instance = axios.create({
      baseURL: serviceConfig.baseURL,
      timeout: serviceConfig.timeout,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.instance.interceptors.request.use(
      async (config) => {
        const token = await tokenManager.getToken();
        // console.log(token, "the token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        config.headers["X-Service"] = this.serviceName;

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle auth errors
    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        // Handle 401/403 errors by calling the auth error handler
        if (
          (error.response?.status === 401 || error.response?.status === 403) &&
          ServiceApiClient.authErrorHandler
        ) {
          await ServiceApiClient.authErrorHandler();
        }

        return Promise.reject(error);
      }
    );
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

export const userApiClient = new ServiceApiClient("user");
export const postsApiClient = new ServiceApiClient("posts");
