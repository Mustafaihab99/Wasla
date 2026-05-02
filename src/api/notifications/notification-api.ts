import { AxiosError } from "axios";
import { notificationData } from "../../types/notifications/notification-types";
import axiosInstance from "../axios-instance";
import { toast } from "sonner";

interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

export async function fetchAllNotifications(
  pageNumber: number = 1,
  pageSize: number = 10,
  userId:string,
): Promise<PaginatedResponse<notificationData>> {
  try {
    const response = await axiosInstance.get(
      `Notification/User/${userId}?pageNumber=${pageNumber}&pageSize=${10}`,
    );
    const result = response.data;
    return {
      data: result.data?.data || [],
      totalCount: result.data?.totalCount || 0,
      currentPage: result.data?.pageNumber || pageNumber,
      pageSize: result.data?.pageSize || pageSize,
    };
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage =
      axiosError.response?.data?.message || "Failed to fetch notifications";
    toast.error(errorMessage);
    throw error;
  }
}

export async function marknotifyAsRead(id:number) {
  try {
    const response = await axiosInstance.post(`Notification/${id}/MarkAsSeen`);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message;
    toast.error(errorMessage);
    throw error;
  }
}

export async function deleteNotify(id:number) {
  try {
    const response = await axiosInstance.delete(`Notification/${id}`);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message;
    toast.error(errorMessage);
    throw error;
  }
}
export async function markAllRead(userId:string) {
  try {
    const response = await axiosInstance.post(`Notification/User/${userId}/MarkAllAsSeen`);
    toast.success(response.data.message);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message;
    toast.error(errorMessage);
    throw error;
  }
}