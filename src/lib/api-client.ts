import axiosInstance from "./axios";
import { AxiosError, AxiosResponse } from "axios";

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

export async function apiGet<T = unknown>(url: string): Promise<T> {
  const response: AxiosResponse<ApiResponse<T>> = await axiosInstance.get(url);
  return response.data.data;
}

export async function apiPost<T = unknown, D = unknown>(
  url: string,
  data?: D
): Promise<T> {
  const response: AxiosResponse<ApiResponse<T>> = await axiosInstance.post(url, data);
  return response.data.data;
}

export async function apiPut<T = unknown, D = unknown>(
  url: string,
  data?: D
): Promise<T> {
  const response: AxiosResponse<ApiResponse<T>> = await axiosInstance.put(url, data);
  return response.data.data;
}

export async function apiPatch<T = unknown, D = unknown>(
  url: string,
  data?: D
): Promise<T> {
  const response: AxiosResponse<ApiResponse<T>> = await axiosInstance.patch(url, data);
  return response.data.data;
}

export async function apiDelete<T = unknown>(url: string): Promise<T> {
  const response: AxiosResponse<ApiResponse<T>> = await axiosInstance.delete(url);
  return response.data.data;
}

export function handleApiError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    return {
      message: error.response?.data?.message || error.message || "An error occurred",
      errors: error.response?.data?.errors,
      statusCode: error.response?.status,
    };
  }
  return {
    message: error instanceof Error ? error.message : "An unknown error occurred",
  };
}

