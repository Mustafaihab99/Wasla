import axios, { AxiosError } from "axios";
import {
  GymProfileData,
  gymServiceData,
  showAllGymData,
} from "../../types/gym/gym-types";
import axiosInstance from "../axios-instance";
import { toast } from "sonner";

export async function getGymProfile(id: string): Promise<GymProfileData> {
  try {
    const response = await axiosInstance.get(`Gym/GymProfile?id=${id}`);
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "Fetched failed";
      toast.error(message);
    } else {
      toast.error("Unexpected error occurred");
    }
    throw error;
  }
}
// edit prof
export async function EditGymProfile(formData: FormData) {
   try {
    const response = await axiosInstance.put(`Gym/UpdateProfile`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    toast.success(response.data.message || "profile Updated successfully!");
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message || "Updated failed";
    toast.error(errorMessage);
    throw error;
  }
}
// service managment

export async function addGymService(formData: FormData) {
  try {
    const response = await axiosInstance.post("Package", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success(response.data.message || "Gym Service Added successfully!");
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message || "Added failed";
    toast.error(errorMessage);
    throw error;
  }
}
export async function editGymService(formData: FormData) {
  try {
    const response = await axiosInstance.put("Package", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success(response.data.message || "Gym Service Updated successfully!");
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message || "Updated Failed";
    toast.error(errorMessage);
    throw error;
  }
}

export async function deleteGymService(ServiceID: number) {
  try {
    const response = await axiosInstance.delete(
      `Package?ServiceID=${ServiceID}`,
    );
    toast.success(response?.data?.message || "deleted successfully");
    return response;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    const errorMessage = axiosError.response?.data?.message || "deleted failed";
    toast.error(errorMessage);
    throw error;
  }
}

export async function getGymServices(id: string): Promise<gymServiceData[]> {
  try {
    const response = await axiosInstance.get(`Package?serviceProviderId=${id}`);
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "Fetched failed";
      toast.error(message);
    } else {
      toast.error("Unexpected error occurred");
    }
    throw error;
  }
}
// al gyms
interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

export async function fetchAllGym(
  pageNumber: number = 1,
  pageSize: number = 6,
): Promise<PaginatedResponse<showAllGymData>> {
  try {
    const response = await axiosInstance.get(
      `Gym/AllGyms?pageNumber=${pageNumber}&pageSize=${pageSize}`,
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
      axiosError.response?.data?.message || "Failed to fetch gyms";
    toast.error(errorMessage);
    throw error;
  }
}
